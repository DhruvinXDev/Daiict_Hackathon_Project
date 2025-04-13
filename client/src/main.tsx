import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// App.tsx now includes all providers to avoid circular dependencies
createRoot(document.getElementById("root")!).render(
  <App />
);
