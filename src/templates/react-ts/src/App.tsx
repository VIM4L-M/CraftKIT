import { useEffect, useState } from "react";

import Home from "./pages/Home";
import { getHealth } from "./services/api";

export default function App() {
  const [status, setStatus] = useState("checking backend...");

  useEffect(() => {
    void getHealth()
      .then((response) => {
        setStatus(response.status);
      })
      .catch(() => {
        setStatus("backend unavailable");
      });
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <Home />

        <div className="status-card">
          <span>API status</span>
          <strong>{status}</strong>
        </div>
      </section>
    </main>
  );
}
