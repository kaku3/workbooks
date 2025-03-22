'use client';

import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { getUserColor, getTextColor } from '@/lib/utils/colors';
import styles from './TicketForm.module.css';

interface TicketFormProps {
  mode: 'new' | 'edit';
  ticketId?: string;
  onClose: () => void;
}

interface TicketData {
  templateId: string;
  title: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignees: string[]; // メールアドレスを保存
  status: string;
  startDate: string;
  dueDate: string;
  estimate: number;
  content: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Status {
  id: string;
  name: string;
  color: string;
}

// TODO: 実際のログインユーザー情報を使用
const defaultCreator: User = {
  id: 'admin',
  name: '管理者',
  email: 'admin@example.com',
  role: 'admin'
};

export default function TicketForm({ mode, ticketId, onClose }: TicketFormProps) {
  const searchRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<TicketData>({
    templateId: '',
    title: '',
    creator: defaultCreator,
    assignees: [],
    status: 'open',
    startDate: '',
    dueDate: '',
    estimate: 0,
    content: ''
  });

  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
          // 選択済みユーザーの更新
          const selected = data.users.filter((user: User) => 
            formData.assignees.includes(user.email)
          );
          setSelectedUsers(selected);
        }
      } catch (error) {
        console.error('ユーザーデータの取得に失敗:', error);
      }
    };

    fetchUsers();
  }, [formData.assignees]);

  // テンプレートデータの取得
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        if (data.templates) {
          setTemplates(data.templates);
        }
      } catch (error) {
        console.error('テンプレートの取得に失敗:', error);
      }
    };
    fetchTemplates();
  }, []);

  // チケットデータの取得
  useEffect(() => {
    const fetchTicket = async () => {
      if (mode === 'edit' && ticketId) {
        try {
          const response = await fetch(`/api/tickets/${ticketId}`);
          const data = await response.json();
          if (data.success && data.ticket) {
            setFormData(data.ticket);
            setSelectedUsers(users.filter(user => 
              data.ticket.assignees.includes(user.email)
            ));
          }
        } catch (error) {
          console.error('チケットの取得に失敗:', error);
        }
      }
    };
    fetchTicket();
  }, [mode, ticketId]);

  // ステータスデータの取得
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/statuses');
        const data = await response.json();
        if (data.statuses) {
          setStatuses(data.statuses);
        }
      } catch (error) {
        setStatuses([
          { id: 'open', name: 'Open', color: '#3b82f6' },
          { id: 'in-progress', name: 'In Progress', color: '#8b5cf6' },
          { id: 'in-review', name: 'In Review', color: '#10b981' },
          { id: 'completed', name: 'Completed', color: '#059669' },
          { id: 'close', name: 'Close', color: '#6b7280' },
          { id: 'blocked', name: 'Blocked', color: '#ef4444' },
          { id: 'waiting', name: 'Waiting', color: '#f59e0b' }
        ]);
        console.warn('ステータスデータの取得に失敗:', error);
      }
    };
    fetchStatuses();
  }, []);

  // ユーザー検索
  useEffect(() => {
    const searchLower = searchText.toLowerCase();
    const filtered = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);
      return !selectedUsers.some(selected => selected.email === user.email) && 
             (nameMatch || emailMatch);
    });
    setFilteredUsers(filtered);
    setShowSearch(searchText !== '');
  }, [searchText, users, selectedUsers]);

  // 検索結果の外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // テンプレート選択時の処理
  const onTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        templateId,
        content: selectedTemplate.content
      }));
    }
  };

  // 担当者の追加
  const onUserSelect = (user: User) => {
    if (!selectedUsers.some(selected => selected.email === user.email)) {
      setSelectedUsers([...selectedUsers, user]);
      setFormData({
        ...formData,
        assignees: [...formData.assignees, user.email]
      });
    }
    setSearchText('');
    setShowSearch(false);
  };

  // 担当者の削除
  const onUserRemove = (email: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.email !== email));
    setFormData({
      ...formData,
      assignees: formData.assignees.filter(e => e !== email)
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'edit' && ticketId) {
        // チケットの更新
        const response = await fetch(`/api/tickets/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            ticketId,
          }),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'チケットの更新に失敗しました');
        }
      } else {
        // 新規チケットの作成
        const response = await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'チケットの作成に失敗しました');
        }
      }
      onClose();
      // Optionally refresh the table data
    } catch (error) {
      console.error('保存に失敗:', error);
    }
  };

  const onCancel = () => {
    onClose();
  };

  // 現在選択中のステータスの色を取得
  const currentStatus = statuses.find(s => s.id === formData.status);
  const statusColor = currentStatus?.color || '#3b82f6';
  const statusTextColor = getTextColor(statusColor);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        {/* タイトル */}
        <div className={styles.field}>
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* テンプレート選択（内容の直前に配置） */}
        <div className={styles.templateField}>
          <label htmlFor="template">チケット種類</label>
          <select
            id="template"
            className={styles.select}
            value={formData.templateId}
            onChange={(e) => onTemplateChange(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* 内容 */}
        <div className={styles.field}>
          <label htmlFor="content">内容</label>
          <div data-color-mode="light">
            <MDEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value || '' })}
              height={400}
              preview="edit"
            />
          </div>
        </div>

        {/* メタ情報（5列） */}
        <div className={styles.rowFields}>

          {/* ステータス */}
          <div className={styles.rowField}>
            <label htmlFor="status">ステータス</label>
            <select
              id="status"
              className={styles.select}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              style={{ 
                backgroundColor: statusColor,
                color: statusTextColor,
                borderColor: statusColor
              }}
            >
              {statuses.map(status => (
                <option 
                  key={status.id} 
                  value={status.id}
                  style={{
                    backgroundColor: status.color,
                    color: getTextColor(status.color)
                  }}
                >
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* 開始日 */}
          <div className={styles.rowField}>
            <label htmlFor="startDate">開始日</label>
            <input
              id="startDate"
              type="date"
              className={styles.input}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          {/* 期限 */}
          <div className={styles.rowField}>
            <label htmlFor="dueDate">期限</label>
            <input
              id="dueDate"
              type="date"
              className={styles.input}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* 見積 */}
          <div className={styles.rowFieldEstimate}>
            <label htmlFor="estimate">見積</label>
            <input
              id="estimate"
              type="number"
              className={styles.input}
              min="0"
              step="0.5"
              value={formData.estimate}
              onChange={(e) => setFormData({ ...formData, estimate: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className={styles.rowUserFields}>
          {/* 起票者（読み取り専用） */}
          <div className={`${styles.rowField} ${styles.creatorField}`}>
            <label htmlFor="creator">起票者</label>
            <input
              id="creator"
              type="text"
              className={styles.input}
              value={formData.creator.name}
              readOnly
              disabled
            />
          </div>

          {/* 担当者（横並び） */}
          <div className={styles.assigneeContainer}>
            <label className={styles.assigneeLabel} htmlFor="assignees">担当者</label>
            <div className={styles.assigneeField} ref={searchRef}>
              <div className={styles.assigneeWrapper}>
                <div className={styles.assigneeList}>
                  {selectedUsers.map(user => {
                    const backgroundColor = getUserColor(user.id);
                    const color = getTextColor(backgroundColor);
                    return (
                      <span 
                        key={user.email} 
                        className={styles.assigneeTag}
                        style={{ backgroundColor, color }}
                      >
                        <span className={styles.assigneeName} title={user.email}>
                          {user.name}
                        </span>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => onUserRemove(user.email)}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
                <input
                  type="text"
                  className={styles.searchInput}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowSearch(true);
                  }}
                  onFocus={() => setShowSearch(true)}
                  placeholder="担当者を検索..."
                />
              </div>
              {showSearch && filteredUsers.length > 0 && (
                <div className={styles.searchResults}>
                  {filteredUsers.map(user => (
                    <div
                      key={user.email}
                      className={styles.searchItem}
                      onClick={() => onUserSelect(user)}
                    >
                      <span className={styles.searchItemName}>{user.name}</span>
                      <span className={styles.searchItemEmail}>{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className={styles.buttons}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            キャンセル
          </button>
          <button type="submit" className={styles.submitButton}>
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
