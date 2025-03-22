interface EstimateCellProps {
  value: number;
}

export default function EstimateCell({
  value
}: EstimateCellProps): JSX.Element {
  if (value >= 8) {
    return <span>{(value / 8).toFixed(1)}d</span>;
  }
  return <span>{value}h</span>;
}
