interface DateCellProps {
  value: string;
}

export default function DateCell({
  value
}: DateCellProps): JSX.Element {
  if (!value) return <></>;
  return <>{new Date(value).toLocaleDateString()}</>;
}
