// components/InfoItem.tsx
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="font-medium text-foreground text-sm sm:text-base truncate">{value}</p>
  </div>
);