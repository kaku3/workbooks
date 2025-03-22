'use client';

import styles from '../../TableView.module.css';

interface HandleCellProps {
  onEnableDrag: (enable: boolean) => void;
}

export default function HandleCell({
  onEnableDrag,
}: HandleCellProps): JSX.Element {
  const handleMouseDown = () => {
    onEnableDrag(true);
  };

  const handleMouseUp = () => {
    onEnableDrag(false);
  };

  const handleMouseLeave = () => {
    onEnableDrag(false);
  };

  return (
    <div 
      className={styles.handleCell}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 5h8M4 8h8M4 11h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
