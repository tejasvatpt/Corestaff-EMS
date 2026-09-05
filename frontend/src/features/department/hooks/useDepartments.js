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

      setDepartments(data);
    } catch (err) {
      console.error("Department API error:", err);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    getDepartments()
      .then((data) => {
        if (isCurrent) {
          setDepartments(data);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          console.error("Department API error:", err);
          setError("Failed to load departments.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: loadDepartments,
  };
}
