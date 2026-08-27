import { createContext } from "react";

// Kept in its own module so the provider file exports only a component
// (react-refresh/only-export-components) and the hook can import it without
// a circular dependency.
export const AuthContext = createContext(null);
