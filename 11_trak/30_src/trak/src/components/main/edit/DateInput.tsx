import styles from '../TableView.module.css';

interface DateInputProps {
  value: string;
  onUpdate: (value: string) => void;
  onClose: () => void;
}

export default function DateInput({
  value,
  onUpdate,
  onClose
}: DateInputProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onUpdate(newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onUpdate(newValue);
    onClose();
  };

  return (
    <input
      type="date"
      value={value}
      className={styles.editInput}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
    />
  );
}
