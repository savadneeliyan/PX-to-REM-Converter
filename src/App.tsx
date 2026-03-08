import { useState, useCallback, useEffect } from "react";
import "./App.css";

type CopiedField = "px" | "rem" | "base" | null;
type ActiveField = "px" | "rem" | null;

function App() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [baseInput, setBaseInput] = useState("16");
  const [pxValue, setPxValue] = useState("");
  const [remValue, setRemValue] = useState("");
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  const round = (n: number, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

  const handlePxChange = useCallback(
    (val: string) => {
      setPxValue(val);
      setActiveField("px");
      const n = parseFloat(val);
      setRemValue(
        !isNaN(n) && baseFontSize > 0 ? String(round(n / baseFontSize)) : ""
      );
    },
    [baseFontSize]
  );

  const handleRemChange = useCallback(
    (val: string) => {
      setRemValue(val);
      setActiveField("rem");
      const n = parseFloat(val);
      setPxValue(
        !isNaN(n) && baseFontSize > 0 ? String(round(n * baseFontSize)) : ""
      );
    },
    [baseFontSize]
  );

  const handleBaseChange = (val: string) => {
    setBaseInput(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setBaseFontSize(n);
      if (activeField === "px") {
        const px = parseFloat(pxValue);
        if (!isNaN(px)) setRemValue(String(round(px / n)));
      } else if (activeField === "rem") {
        const rem = parseFloat(remValue);
        if (!isNaN(rem)) setPxValue(String(round(rem * n)));
      }
    }
  };

  const handleSwap = () => {
    const nextSwapped = !swapped;

    const leftValue = swapped ? remValue : pxValue;
    const n = parseFloat(leftValue);
    if (!isNaN(n) && baseFontSize > 0) {
      if (nextSwapped) {
        setRemValue(leftValue);
        setPxValue(String(round(n * baseFontSize)));
        setActiveField("rem");
      } else {
        setPxValue(leftValue);
        setRemValue(String(round(n / baseFontSize)));
        setActiveField("px");
      }
    }
    setSwapped(nextSwapped);
  };

  const copy = async (value: string, field: CopiedField) => {
    if (!value || !field) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const pxSteps = [
    4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96,
    112, 128,
  ];

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <h1>{swapped ? "REM → PX" : "PX → REM"}</h1>
          <p className="subtitle">
            {swapped
              ? "Converting rem to pixel units"
              : "Converting pixels to rem units"}
          </p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setIsDark((d) => !d)}
          aria-label="Toggle colour scheme"
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </header>

      <hr className="rule" />

      <section className="base-row" aria-label="Base font size">
        <span className="eyebrow">Base font size</span>
        <div className="base-controls">
          <input
            id="base"
            type="number"
            className="base-input"
            value={baseInput}
            min={1}
            step={1}
            aria-label="Base font size in pixels"
            onChange={(e) => handleBaseChange(e.target.value)}
          />
          <span className="unit-label">px</span>
          <button
            className={`copy-btn${copiedField === "base" ? " is-copied" : ""}`}
            onClick={() => copy(baseInput, "base")}
          >
            {copiedField === "base" ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      <hr className="rule" />

      <section className="converter" aria-label="Converter">
        <div className="field">
          <label className="eyebrow" htmlFor="left-input">
            {swapped ? "REM" : "Pixels"}
          </label>
          <input
            id="left-input"
            type="number"
            className="value-input"
            placeholder="0"
            autoFocus
            value={swapped ? remValue : pxValue}
            onChange={(e) =>
              swapped
                ? handleRemChange(e.target.value)
                : handlePxChange(e.target.value)
            }
          />
          <div className="field-meta">
            <span className="unit-label">{swapped ? "rem" : "px"}</span>
            <button
              className={`copy-btn${
                copiedField === (swapped ? "rem" : "px") ? " is-copied" : ""
              }`}
              disabled={swapped ? !remValue : !pxValue}
              onClick={() =>
                copy(swapped ? remValue : pxValue, swapped ? "rem" : "px")
              }
            >
              {copiedField === (swapped ? "rem" : "px") ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <button
          className={`swap-btn${swapped ? " is-swapped" : ""}`}
          onClick={handleSwap}
          aria-label="Swap fields"
          title="Swap fields"
        >
          ↔
        </button>

        <div className="field">
          <label className="eyebrow" htmlFor="right-input">
            {swapped ? "Pixels" : "REM"}
          </label>
          <input
            id="right-input"
            type="number"
            className="value-input"
            placeholder="0"
            value={swapped ? pxValue : remValue}
            onChange={(e) =>
              swapped
                ? handlePxChange(e.target.value)
                : handleRemChange(e.target.value)
            }
          />
          <div className="field-meta">
            <span className="unit-label">{swapped ? "px" : "rem"}</span>
            <button
              className={`copy-btn${
                copiedField === (swapped ? "px" : "rem") ? " is-copied" : ""
              }`}
              disabled={swapped ? !pxValue : !remValue}
              onClick={() =>
                copy(swapped ? pxValue : remValue, swapped ? "px" : "rem")
              }
            >
              {copiedField === (swapped ? "px" : "rem") ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="facts-row" aria-label="Quick reference">
        <div className="fact">
          <span className="fact-value">÷ {baseFontSize}</span>
          <span className="fact-label">px → rem formula</span>
        </div>
        <div className="fact">
          <span className="fact-value">× {baseFontSize}</span>
          <span className="fact-label">rem → px formula</span>
        </div>
        <div className="fact">
          <span className="fact-value">1rem</span>
          <span className="fact-label">= {baseFontSize}px base</span>
        </div>
      </section>

      <details className="accordion">
        <summary className="accordion-summary">
          <h2>Conversion table</h2>
          <div className="accordion-meta">
            <span className="eyebrow">1rem = {baseFontSize}px</span>
            <span className="accordion-icon" aria-hidden="true">
              ↓
            </span>
          </div>
        </summary>
        <div className="accordion-body">
          <table className="conv-table">
            <thead>
              <tr>
                <th scope="col">{swapped ? "REM" : "PX"}</th>
                <th scope="col">{swapped ? "PX" : "REM"}</th>
              </tr>
            </thead>
            <tbody>
              {pxSteps.map((px) => {
                const rem = round(px / baseFontSize);
                const isActive = swapped
                  ? parseFloat(remValue) === rem
                  : parseFloat(pxValue) === px;
                const handleRowClick = () =>
                  swapped
                    ? handleRemChange(String(rem))
                    : handlePxChange(String(px));
                return (
                  <tr
                    key={px}
                    className={isActive ? "is-active" : undefined}
                    onClick={handleRowClick}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleRowClick()}
                    aria-label={
                      swapped ? `${rem}rem = ${px}px` : `${px}px = ${rem}rem`
                    }
                  >
                    <td>{swapped ? `${rem}rem` : `${px}px`}</td>
                    <td>{swapped ? `${px}px` : `${rem}rem`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      <details className="accordion">
        <summary className="accordion-summary">
          <h2>Frequently asked questions</h2>
          <span className="accordion-icon" aria-hidden="true">
            ↓
          </span>
        </summary>
        <div className="accordion-body">
          <dl className="faq-list">
            <div className="faq-item">
              <dt>How many px is 1rem?</dt>
              <dd>
                By default, 1rem equals <strong>16px</strong> — the standard
                browser root font size. You can change the base above to match
                your project (e.g. 10px makes the math easier:
                1rem&nbsp;=&nbsp;10px).
              </dd>
            </div>
            <div className="faq-item">
              <dt>How do I convert px to rem?</dt>
              <dd>
                Divide the pixel value by the base font size.{" "}
                <strong>rem = px ÷ base</strong>. For example: 24px ÷ 16 =
                1.5rem. Type any pixel value in the field above for an instant
                result.
              </dd>
            </div>
            <div className="faq-item">
              <dt>Why use rem instead of px in CSS?</dt>
              <dd>
                REM units scale with the user's browser font-size preference,
                making layouts more <strong>accessible</strong> and easier to
                maintain. Changing one root value resizes your entire design
                proportionally — impossible with fixed pixels.
              </dd>
            </div>
            <div className="faq-item">
              <dt>What is the difference between rem and em?</dt>
              <dd>
                <strong>em</strong> is relative to the <em>parent</em> element's
                font size and can compound unpredictably. <strong>rem</strong>{" "}
                always refers to the <em>root</em> (html) font size, making it
                predictable and consistent across nested elements.
              </dd>
            </div>
            <div className="faq-item">
              <dt>What base font size should I use?</dt>
              <dd>
                Most browsers default to <strong>16px</strong>. Some developers
                set{" "}
                <code>
                  html {"{"} font-size: 62.5% {"}"}
                </code>{" "}
                (= 10px) so that 1rem = 10px for simpler mental math. Set
                whatever your project uses in the base field above.
              </dd>
            </div>
          </dl>
        </div>
      </details>
    </main>
  );
}

export default App;
