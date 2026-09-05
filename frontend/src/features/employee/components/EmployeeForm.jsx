import { useState } from "react";
import { onboardEmployee, updateEmployee } from "../services/employeeApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import {
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

const emptyForm = {
  full_name: "",
  email: "",
  department_id: "",
  designation: "",
  phone: "",
  joining_date: new Date().toISOString().split("T")[0],
};

const getInitialForm = (employee) => {
  if (!employee) {
    return emptyForm;
  }

  return {
    full_name: employee.full_name || "",
    email: employee.email || "",
    department_id: employee.department_id
      ? String(employee.department_id)
      : "",
    designation: employee.designation || "",
    phone: employee.phone || "",
    joining_date: employee.joining_date || "",
  };
};

export default function EmployeeForm({ employee, onSuccess }) {
  const [form, setForm] = useState(() => getInitialForm(employee));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [onboardedResult, setOnboardedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const { departments, loading: departmentsLoading } = useDepartments();
  const isEditing = Boolean(employee?.id);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleCopyPassword = () => {
    if (!onboardedResult?.temp_password) return;
    navigator.clipboard.writeText(onboardedResult.temp_password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        const updateData = {
          full_name: form.full_name,
          department_id: form.department_id ? Number(form.department_id) : null,
          designation: form.designation || null,
          phone: form.phone || null,
          joining_date: form.joining_date || null,
        };
        await updateEmployee(employee.id, updateData);
        if (onSuccess) onSuccess();
      } else {
        const onboardData = {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          department_id: form.department_id ? Number(form.department_id) : null,
          designation: form.designation?.trim() || null,
          phone: form.phone?.trim() || null,
          joining_date: form.joining_date || null,
        };
        const result = await onboardEmployee(onboardData);
        // Show success credentials view
        setOnboardedResult(result);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to save employee. Please verify details.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // If newly onboarded, show one-time temporary password reveal screen
  if (onboardedResult) {
    return (
      <div className="space-y-6 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Employee Onboarded!
            </h3>
            <p className="text-xs text-[#86868B]">
              User account created and profile activated.
            </p>
          </div>
        </div>

        {/* Credentials Display Card */}
        <div className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl p-5 space-y-3.5 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-[#E5E5EA]">
            <span className="text-[#86868B]">Full Name</span>
            <span className="font-semibold text-[#1D1D1F]">
              {onboardedResult.full_name}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#E5E5EA]">
            <span className="text-[#86868B]">Email (Login ID)</span>
            <span className="font-mono font-medium text-[#1D1D1F]">
              {onboardedResult.email}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#E5E5EA]">
            <span className="text-[#86868B]">Username</span>
            <span className="font-mono text-[#1D1D1F]">
              {onboardedResult.username}
            </span>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[#86868B] font-medium flex items-center gap-1.5">
                <KeyRound size={14} className="text-[#1D1D1F]" />
                Temporary Password:
              </span>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:text-[#424245] bg-white border border-[#D2D2D7] px-2.5 py-1 rounded-lg transition-all"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Password</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-white border border-[#D2D2D7] rounded-xl font-mono text-sm text-[#1D1D1F] tracking-wider font-semibold text-center select-all">
              {onboardedResult.temp_password}
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs text-amber-800">
          <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Important:</strong> Share these credentials securely with the employee. This temporary password will only be displayed once.
          </span>
        </div>

        <Button
          type="button"
          onClick={() => {
            if (onSuccess) onSuccess();
          }}
          className="w-full bg-[#1D1D1F] hover:bg-[#424245] text-white rounded-full py-2.5 transition-all"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <Label htmlFor="full_name" className="text-xs text-[#6E6E73]">
          Full Name *
        </Label>
        <Input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="e.g. Sarah Jenkins"
          required
          className="mt-1 rounded-xl border-[#D2D2D7] focus-visible:ring-1 focus-visible:ring-[#1D1D1F]"
        />
      </div>

      {!isEditing && (
        <div>
          <Label htmlFor="email" className="text-xs text-[#6E6E73]">
            Corporate Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="s.jenkins@company.com"
            required
            className="mt-1 rounded-xl border-[#D2D2D7] focus-visible:ring-1 focus-visible:ring-[#1D1D1F]"
          />
          <p className="text-[11px] text-[#86868B] mt-1">
            An employee user account and temporary password will be automatically generated.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="department_id" className="text-xs text-[#6E6E73]">
          Department
        </Label>
        <select
          id="department_id"
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          disabled={departmentsLoading}
          className="w-full mt-1 h-10 rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#424245]"
        >
          <option value="">
            {departmentsLoading ? "Loading departments..." : "Select Department (Optional)"}
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="designation" className="text-xs text-[#6E6E73]">
          Designation / Role
        </Label>
        <Input
          id="designation"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="e.g. Product Designer, Software Engineer"
          className="mt-1 rounded-xl border-[#D2D2D7] focus-visible:ring-1 focus-visible:ring-[#1D1D1F]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="text-xs text-[#6E6E73]">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 019-2834"
            className="mt-1 rounded-xl border-[#D2D2D7] focus-visible:ring-1 focus-visible:ring-[#1D1D1F]"
          />
        </div>

        <div>
          <Label htmlFor="joining_date" className="text-xs text-[#6E6E73]">
            Joining Date
          </Label>
          <Input
            id="joining_date"
            name="joining_date"
            type="date"
            value={form.joining_date}
            onChange={handleChange}
            className="mt-1 rounded-xl border-[#D2D2D7] focus-visible:ring-1 focus-visible:ring-[#1D1D1F]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1D1D1F] hover:bg-[#424245] text-white rounded-full py-2.5 mt-2 transition-all"
      >
        {submitting
          ? "Processing..."
          : isEditing
          ? "Update Profile"
          : "Onboard Employee & Generate Credentials"}
      </Button>
    </form>
  );
}
