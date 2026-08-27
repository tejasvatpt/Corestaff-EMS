import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getInitialForm = (department) => ({
  name: department?.name || "",
});

export default function DepartmentForm({
  department,
  saving,
  onSubmit,
}) {
  const [form, setForm] = useState(() => getInitialForm(department));
  const isEditing = Boolean(department?.id);

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      return;
    }

    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="department_name">Department Name</Label>
        <Input
          id="department_name"
          name="name"
          value={form.name}
          onChange={(event) => {
            setForm({
              ...form,
              name: event.target.value,
            });
          }}
          placeholder="Engineering"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={saving || !form.name.trim()}
      >
        {isEditing ? "Update Department" : "Create Department"}
      </Button>
    </form>
  );
}
