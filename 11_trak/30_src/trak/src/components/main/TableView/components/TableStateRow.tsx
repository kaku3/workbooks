import styles from '../styles/TableView.module.css';

interface TableStateRowProps {
  colSpan: number;
  type: 'loading' | 'error' | 'empty';
  message?: string;
}

export default function TableStateRow({
  colSpan,
  type,
  message
}: TableStateRowProps): JSX.Element {
  const getContent = () => {
    switch (type) {
      case 'loading':
        return '読み込み中...';
      case 'error':
        return message || 'エラーが発生しました';
      case 'empty':
        return 'チケットがありません';
      default:
        return '';
    }
  };

  const getClassName = () => {
    switch (type) {
      case 'error':
        return styles.error;
      default:
        return styles.center;
    }
  };

  return (
    <tr>
      <td colSpan={colSpan} className={getClassName()}>
        {getContent()}
      </td>
    </tr>
  );
}
