// components/InfoGrid.tsx
import { InfoItem } from "./InfoItem";

interface InfoGridProps {
  items: { label: string; value: React.ReactNode }[];
}

export const InfoGrid: React.FC<InfoGridProps> = ({ items }) => (
  <div className="grid gap-3 sm:gap-4">
    {items.map((item, index) => (
      <InfoItem key={index} label={item.label} value={item.value} />
    ))}
  </div>
);