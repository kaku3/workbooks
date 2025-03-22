import styles from '../TableView.module.css';
import { useRouter } from 'next/navigation';

interface IdCellProps {
  id: string;
}

export default function IdCell({
  id
}: IdCellProps): JSX.Element {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/tickets/${id}/edit`);
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
