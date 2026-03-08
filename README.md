# PX to REM Converter

A fast, clean, and SEO-friendly CSS unit converter built with React + TypeScript. Convert pixels to rem and rem to pixels instantly, with a customisable base font size.

🌐 **Live site:** [px-to-rem-converter](https://px-to-rem-converter-livid.vercel.app/)

---

## Features

- **Bidirectional conversion** — type in either the PX or REM field and the other updates instantly
- **Swap fields** — click the ↔ button to flip the direction (PX → REM or REM → PX); the heading, labels, and conversion table all update accordingly
- **Editable base font size** — defaults to 16px, change it to match your project (e.g. 10px for easier mental math)
- **Copy to clipboard** — copy any value with a single click
- **Conversion table** — collapsible quick-reference table covering common sizes (4px–128px)
- **FAQ section** — collapsible answers to common CSS unit questions
- **Dark / Light mode** — auto-detects system preference, toggle manually anytime
- **SEO optimised** — meta tags, Open Graph, Twitter Card, JSON-LD structured data (WebApplication + FAQPage), sitemap.xml, robots.txt
- **Fully responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

| Tool       | Version |
| ---------- | ------- |
| React      | 19      |
| TypeScript | 5.9     |
| Vite       | 7       |

No UI libraries, no Tailwind — plain CSS with custom properties for theming.

## Project Structure

```
px-to-rem-converter/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.tsx        # Main component — all logic and UI
│   ├── App.css        # Styles with CSS custom properties for theming
│   └── main.tsx       # React entry point
├── index.html         # SEO meta tags, JSON-LD structured data
└── vite.config.ts
```

---

## How the Conversion Works

| Direction | Formula                     |
| --------- | --------------------------- |
| PX → REM  | `rem = px ÷ base font size` |
| REM → PX  | `px = rem × base font size` |

The default base font size is **16px** — the standard browser default. Change it in the input to match your project's `html { font-size: ... }`.

---

## Contact

Have an issue or a feature suggestion? Reach out at [savadn632@gmail.com](mailto:savadn632@gmail.com)

---

## License

MIT
