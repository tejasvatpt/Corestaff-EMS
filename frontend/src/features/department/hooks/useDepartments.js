import { useCallback, useEffect, useState } from "react";
import { getDepartments } from "../services/departmentApi";

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDepartments();

      console.log("Departments received:", data);

      setDepartments(data);
    } catch (err) {
      console.error("Department API error:", err);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  return {
    departments,
    loading,
    error,
    refetch: loadDepartments,
  };
}