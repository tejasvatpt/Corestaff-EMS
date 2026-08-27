import { useCallback, useEffect, useState } from "react";
import { getEmployees } from "../services/employeeApi";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: loadEmployees,
  };
}