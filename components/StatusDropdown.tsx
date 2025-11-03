// components/StatusDropdown.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface StatusDropdownProps {
  currentStatus: string;
  options: string[];
  onStatusChange: (status: string) => void;
  disabled?: boolean;
  type: 'order' | 'payment';
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  options,
  onStatusChange,
  disabled,
  type,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const availableOptions = options.filter(option => option !== currentStatus);

  if (availableOptions.length === 0) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-primary/10"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Edit className="h-3 w-3" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[120px]">
          {availableOptions.map((option) => (
            <button
              key={option}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted capitalize first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                onStatusChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};