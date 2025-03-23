import styles from '../../styles/TableView.module.css';

interface IdCellProps {
  id: string;
  onClick: () => void;
}

export default function IdCell({
  id,
  onClick
}: IdCellProps): JSX.Element {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={styles.idLink}
    >
      {id}
    </a>
  );
}
