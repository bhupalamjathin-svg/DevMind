import { useState, useEffect, useRef } from "react";
import axios from "axios";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#00D4FF",
    primaryTextColor: "#E0F7FF",
    primaryBorderColor: "#00D4FF",
    lineColor: "#00D4FF",
    secondaryColor: "#0D2A3A",
    tertiaryColor: "#0A1A28",
    background: "#0D1B2A",
    mainBkg: "#0D2A3A",
    nodeBorder: "#00D4FF",
    clusterBkg: "#0A1A28",
    titleColor: "#00D4FF",
    edgeLabelBackground: "#0D1B2A",
    fontFamily: "JetBrains Mono, monospace",
  },
  flowchart: { curve: "basis", htmlLabels: true },
});

const PULSE_MESSAGES = [
  "Analyzing requirements...",
  "Consulting AWS service catalog...",
  "Designing architecture patterns...",
  "Calculating cost estimates...",
  "Generating Mermaid diagram...",
  "Compiling implementation steps...",
  "Evaluating alternatives...",
];

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!chart) return;
    const id = "mermaid-" + Math.random().toString(36).slice(2, 9);
    const cleanChart = chart.replace(/\\n/g, "\n").trim();
    setTimeout(async () => {
      try {
        const { svg: s } = await mermaid.render(id, cleanChart);
        setSvg(s);
        setErr(false);
      } catch (e) {
        setErr(true);
      }
    }, 200);
  }, [chart]);

  if (err)
    return (
      <div className="mermaid-error">
        <span>⚠ Diagram rendering failed — raw source below</span>
        <pre>{chart}</pre>
      </div>
    );
  if (!svg) return null;
  return (
    <div
      className="mermaid-wrap"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function ServiceCard({ service, purpose, estimated_monthly_cost, idx }) {
  return (
    <div className="service-card" style={{ animationDelay: `${idx * 80}ms` }}>
      <div className="service-left">
        <div className="service-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="#00D4FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className="service-name">{service}</div>
          <div className="service-purpose">{purpose}</div>
        </div>
      </div>
      <div className="service-cost">
        <div className="cost-label">EST. / MONTH</div>
        <div className="cost-value">{estimated_monthly_cost}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulseMsg, setPulseMsg] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const pulseRef = useRef(null);
  const resultRef = useRef(null);

  const handleInput = (e) => {
    setRequirement(e.target.value);
    setCharCount(e.target.value.length);
  };

  const generate = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    setPulseMsg(0);
    pulseRef.current = setInterval(() => {
      setPulseMsg((p) => (p + 1) % PULSE_MESSAGES.length);
    }, 900);

    try {
      const res = await axios.post("https://rational-nico-subliminal.ngrok-free.app/generate", {
        requirement: requirement.trim(),
      }, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json"
        }
      });
      setResult(res.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
          e?.message ||
          "Failed to reach the backend. Is it running on port 8000?"
      );
    } finally {
      clearInterval(pulseRef.current);
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
  };

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00D4FF" strokeWidth="1.5" fill="none" />
              <polygon points="14,7 21,11 21,18 14,22 7,18 7,11" fill="#00D4FF" opacity="0.15" stroke="#00D4FF" strokeWidth="1" />
              <circle cx="14" cy="14" r="3" fill="#00D4FF" />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-dev">Dev</span>
            <span className="logo-mind">Mind</span>
          </div>
        </div>
        <div className="header-tag">Solution Architect Agent</div>
        <div className="header-status">
          <span className={`status-dot ${loading ? "pulse" : "idle"}`} />
          <span className="status-label">{loading ? "Processing" : "Ready"}</span>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-eyebrow">AWS Architecture Generator</div>
          <h1 className="hero-title">
            Describe your system.<br />
            <span className="hero-accent">We architect it.</span>
          </h1>
          <p className="hero-sub">
            Paste your project requirement in plain English. DevMind's Architect Agent will
            generate a complete AWS architecture with cost estimates, a live diagram,
            and step-by-step implementation guide.
          </p>
        </section>

        <section className="input-section">
          <div className="input-card">
            <div className="input-header">
              <span className="input-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                  <path d="M12 20h9" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Your Requirement
              </span>
              <span className="char-count">{charCount} chars</span>
            </div>
            <textarea
              className="req-textarea"
              placeholder={`e.g. "Build a scalable real-time chat application supporting 100k concurrent users, with message persistence, user auth, and media uploads."`}
              value={requirement}
              onChange={handleInput}
              onKeyDown={handleKey}
              rows={5}
              disabled={loading}
            />
            <div className="input-footer">
              <span className="hint-text">⌘ + Enter to generate</span>
              <button
                className={`generate-btn ${loading ? "loading" : ""}`}
                onClick={generate}
                disabled={loading || !requirement.trim()}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    Architecting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Generate Architecture
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {loading && (
          <section className="loading-section">
            <div className="loading-card">
              <div className="loading-rings">
                <div className="ring r1" />
                <div className="ring r2" />
                <div className="ring r3" />
                <div className="ring-center">
                  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00D4FF" strokeWidth="1.5" fill="none" />
                    <circle cx="14" cy="14" r="3" fill="#00D4FF" />
                  </svg>
                </div>
              </div>
              <div className="loading-msg">{PULSE_MESSAGES[pulseMsg]}</div>
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            </div>
          </section>
        )}

        {error && (
          <div className="error-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FF4D6D" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className="results" ref={resultRef}>
            <div className="result-hero">
              <div className="result-eyebrow">Architecture Generated</div>
              <h2 className="arch-name">
                <TypewriterText text={result.architecture_name} speed={30} />
              </h2>
              <p className="arch-overview">{result.overview}</p>
            </div>

            <div className="results-grid">
              <section className="panel services-panel">
                <div className="panel-header">
                  <div className="panel-icon aws">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6.5 20a4.5 4.5 0 01-.43-8.98A7 7 0 1117.5 20H6.5z" stroke="#FF9900" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>AWS Services</span>
                  <span className="panel-count">{result.aws_services?.length}</span>
                </div>
                <div className="services-list">
                  {result.aws_services?.map((s, i) => (
                    <ServiceCard key={i} {...s} idx={i} />
                  ))}
                </div>
              </section>

              <section className="panel diagram-panel">
                <div className="panel-header">
                  <div className="panel-icon diag">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="6" height="6" rx="1" stroke="#00D4FF" strokeWidth="2" />
                      <rect x="15" y="3" width="6" height="6" rx="1" stroke="#00D4FF" strokeWidth="2" />
                      <rect x="9" y="15" width="6" height="6" rx="1" stroke="#00D4FF" strokeWidth="2" />
                      <path d="M6 9v3a3 3 0 003 3h6a3 3 0 003-3V9" stroke="#00D4FF" strokeWidth="2" />
                    </svg>
                  </div>
                  <span>Architecture Diagram</span>
                </div>
                <div className="diagram-container">
                  {result.mermaid_diagram ? (
                    <MermaidDiagram chart={result.mermaid_diagram} />
                  ) : (
                    <p className="no-diagram">No diagram provided.</p>
                  )}
                </div>
              </section>

              <section className="panel steps-panel">
                <div className="panel-header">
                  <div className="panel-icon steps">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3L22 4" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>Implementation Steps</span>
                </div>
                <ol className="steps-list">
                  {result.implementation_steps?.map((step, i) => (
                    <li key={i} className="step-item" style={{ animationDelay: `${i * 60}ms` }}>
                      <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="step-text">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="panel alt-panel">
                <div className="panel-header">
                  <div className="panel-icon alt">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <polyline points="17 1 21 5 17 9" stroke="#BD93F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 11V9a4 4 0 014-4h14" stroke="#BD93F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="7 23 3 19 7 15" stroke="#BD93F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 13v2a4 4 0 01-4 4H3" stroke="#BD93F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>Alternative Architectures</span>
                </div>
                <div className="alt-list">
                  {result.alternative_architectures?.map((alt, i) => (
                    <div key={i} className="alt-item" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="alt-num">ALT {String.fromCharCode(65 + i)}</span>
                      <span className="alt-text">{typeof alt === "string" ? alt : JSON.stringify(alt)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>DevMind</span>
        <span className="footer-sep">·</span>
        <span>HACK'A'WAR 2025</span>
        <span className="footer-sep">·</span>
        <span>Solution Architect Agent</span>
      </footer>
    </div>
  );
}

