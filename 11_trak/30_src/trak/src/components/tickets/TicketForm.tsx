'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Autocomplete, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import styles from './TicketForm.module.css';

interface TicketFormProps {
  mode: 'new' | 'edit';
  ticketId?: string;
}

interface TicketData {
  templateId: string;
  title: string;
  assignees: string[];
  status: string;
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
}

export default function TicketForm({ mode, ticketId }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketData>({
    templateId: '',
    title: '',
    assignees: [],
    status: 'open',
    dueDate: '',
    estimate: 0,
    content: ''
  });

  // チケットデータの取得
  useEffect(() => {
    const fetchTicket = async () => {
      if (mode === 'edit' && ticketId) {
        try {
          // TODO: APIからチケットデータを取得
          console.log('チケットID:', ticketId);
          // const response = await fetch(`/api/tickets/${ticketId}`);
          // const data = await response.json();
          // setFormData(data);
        } catch (error) {
          console.error('チケットの取得に失敗:', error);
        }
      }
    };

    fetchTicket();
  }, [mode, ticketId]);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // テンプレートデータの取得
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        setTemplates(data.templates);
      } catch (error) {
        // APIが実装されるまでの仮データ
        setTemplates([
          { 
            id: '000',
            name: 'タスク',
            content: `# [チケットタイトル]

## 概要
[概要を記載してください]

## 詳細
[詳細な内容を記載してください]

## 参考情報
- [参考リンクや関連情報があれば記載してください]`
          },
          {
            id: '001',
            name: '障害票',
            content: `# [チケットタイトル]

## 事象
[起票者記載]

## 再現手順
[起票者記載]

## 原因
[対応者記載]

## 対応内容
[対応者記載]`
          }
        ]);
        console.warn('テンプレートデータの取得に失敗:', error);
      }
    };

    fetchTemplates();
  }, []);

  const [statuses, setStatuses] = useState<{ id: string; name: string }[]>([]);

  // ステータスデータの取得
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/statuses');
        const data = await response.json();
        setStatuses(data.statuses.map((status: { id: string; name: string }) => ({
          id: status.id,
          name: status.name
        })));
      } catch (error) {
        // APIが実装されるまでの仮データ
        setStatuses([
          { id: 'open', name: 'Open' },
          { id: 'in-progress', name: 'In Progress' },
          { id: 'in-review', name: 'In Review' },
          { id: 'completed', name: 'Completed' },
          { id: 'close', name: 'Close' },
          { id: 'blocked', name: 'Blocked' },
          { id: 'waiting', name: 'Waiting' }
        ]);
        console.warn('ステータスデータの取得に失敗:', error);
      }
    };

    fetchStatuses();
  }, []);

  const [users, setUsers] = useState<User[]>([]);

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        const userList = data.users.map((user: { id: string; name: string }) => ({
          id: user.id,
          name: user.name
        }));
        setUsers(userList);
        // 初期選択ユーザーの設定
        setSelectedUsers(
          userList.filter((user: User) => formData.assignees.includes(user.id))
        );
      } catch (error) {
        // APIが実装されるまでの仮データ
        const userList = [
          { id: 'admin', name: '管理者' },
          { id: 'user1', name: '一般ユーザー' }
        ];
        setUsers(userList);
        setSelectedUsers(
          userList.filter((user: User) => formData.assignees.includes(user.id))
        );
        console.warn('ユーザーデータの取得に失敗:', error);
      }
    };

    fetchUsers();
  }, [formData.assignees]);

  // テンプレート選択時の処理
  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        templateId,
        content: selectedTemplate.content
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: APIを呼び出してチケットを保存
      if (mode === 'edit' && ticketId) {
        // 編集モード
        console.log('チケット更新:', ticketId, formData);
        // await fetch(`/api/tickets/${ticketId}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(formData),
        // });
      } else {
        // 新規作成モード
        console.log('チケット作成:', formData);
        // await fetch('/api/tickets', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        // });
      }
    } catch (error) {
      console.error('保存に失敗:', error);
    }
  };

  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {mode === 'new' ? 'チケット作成' : 'チケット編集'}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* タイトル */}
        <div className={styles.field}>
          <TextField
            label="タイトル"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />
        </div>

        {/* 担当者、ステータス、期限、見積を横一列に */}
        <div className={styles.rowFields}>
          {/* 担当者 */}
          <div className={styles.rowField}>
            <Autocomplete
              multiple
              options={users}
              value={selectedUsers}
              onChange={(_, newValue) => {
                setSelectedUsers(newValue);
                setFormData({
                  ...formData,
                  assignees: newValue.map(user => user.id)
                });
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="担当者"
                  required
                />
              )}
            />
          </div>

          {/* ステータス */}
          <div className={styles.rowField}>
            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={formData.status}
                label="ステータス"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                {statuses.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* 期限 */}
          <div className={styles.rowField}>
            <TextField
              label="期限"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </div>

          {/* 見積 */}
          <div className={styles.rowField}>
            <TextField
              label="見積"
              type="number"
              value={formData.estimate}
              onChange={(e) => setFormData({ ...formData, estimate: Number(e.target.value) })}
              InputProps={{ inputProps: { min: 0, step: 0.5 } }}
              fullWidth
            />
          </div>
        </div>

        {/* テンプレート選択（内容の直前に配置） */}
        <div className={styles.templateField}>
          <FormControl fullWidth>
            <InputLabel>テンプレート</InputLabel>
            <Select
              value={formData.templateId}
              label="テンプレート"
              onChange={(e) => handleTemplateChange(e.target.value)}
              required
            >
              <MenuItem value="">選択してください</MenuItem>
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name.split('_').pop()?.split('.')[0] || template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* 内容 */}
        <div className={styles.field}>
          <InputLabel>内容</InputLabel>
          <div data-color-mode="light">
            <MDEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value || '' })}
              height={400}
              preview="edit"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className={styles.buttons}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
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
