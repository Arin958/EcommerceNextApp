// components/DetailRow.tsx
interface DetailRowProps {
  label: string;
  value: number;
  strong?: boolean;
  large?: boolean;
  negative?: boolean;
  success?: boolean;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  strong,
  large,
  negative,
  success,
}) => {
  const amountColor = negative ? "text-red-500" : success ? "text-green-500" : "text-foreground";
  
  return (
    <div
      className={`flex justify-between items-center ${
        strong ? "font-semibold" : "font-normal"
      } ${large ? "text-base sm:text-lg" : "text-sm sm:text-base"} ${
        strong ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`${strong ? "text-lg sm:text-xl font-bold" : ""} ${amountColor} whitespace-nowrap flex-shrink-0 ml-2`}>
        {negative ? "-" : ""}${value.toFixed(2)}
      </span>
    </div>
  );
};