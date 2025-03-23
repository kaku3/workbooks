'use client';

import styles from '../../styles/TableView.module.css';

interface DeleteCellProps {
  onDelete: () => void;
}

export default function DeleteCell({ onDelete }: DeleteCellProps): JSX.Element {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <button
      onClick={handleClick}
      className={styles.deleteButton}
      title="チケットを削除"
      aria-label="チケットを削除"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
