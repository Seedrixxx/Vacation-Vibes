"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicStringListProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DynamicStringList({
  value,
  onChange,
  placeholder = "Add item…",
  label,
  className,
}: DynamicStringListProps) {
  const add = () => onChange([...value, ""]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const update = (i: number, v: string) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-charcoal">{label}</label>
      )}
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => remove(i)}
            className="shrink-0 px-2"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
