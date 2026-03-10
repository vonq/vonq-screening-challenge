"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLOYERS, useEmployer } from "@/lib/employer-context";

export function EmployerSwitcher() {
  const { employerId, setEmployer } = useEmployer();

  return (
    <Select
      value={employerId ?? undefined}
      onValueChange={(value) => {
        const emp = EMPLOYERS.find((e) => e.id === value);
        if (emp) setEmployer(emp.id, emp.name);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select employer" />
      </SelectTrigger>
      <SelectContent>
        {EMPLOYERS.map((emp) => (
          <SelectItem key={emp.id} value={emp.id}>
            {emp.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
