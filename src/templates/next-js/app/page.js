"use client";

import { useEffect, useState } from "react";

import { getHealth } from "../lib/api";

export default function Page() {
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
        <div className="hero-copy">
          <p className="eyebrow">starter page</p>
          <h1>Next.js + JavaScript</h1>
          <p className="lede">
            A clean starter for building product-focused interfaces that talk to the Go backend.
          </p>
        </div>

        <div className="status-card">
          <span>API status</span>
          <strong>{status}</strong>
        </div>
      </section>
    </main>
  );
}