import styles from './TableView.module.css';

interface TitleInputProps {
  value: string;
  onUpdate: (value: string) => void;
  onClose: () => void;
}

export default function TitleInput({
  value,
  onUpdate,
  onClose
}: TitleInputProps): JSX.Element {
  return (
    <input
      type="text"
      value={value}
      className={styles.editInput}
      onChange={(e) => {
        onUpdate(e.target.value);
      }}
      onBlur={(e) => {
        onUpdate(e.target.value);
        onClose();
      }}
      autoFocus
    />
  );
}
