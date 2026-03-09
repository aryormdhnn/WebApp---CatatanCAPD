import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  id: string;
  label: string;
  placeholder?: string;
  suffix?: string;
  step?: number;
  min?: number;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function NumberInput({
  id,
  label,
  placeholder,
  suffix,
  step = 1,
  min = 0,
  value,
  onChange,
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === "" ? null : Number(nextValue));
          }}
          className={suffix ? "pr-14" : undefined}
        />
        {suffix ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span> : null}
      </div>
    </div>
  );
}
