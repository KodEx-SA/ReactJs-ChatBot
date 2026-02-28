# AI Assistant Chatbot

A fullscreen AI chat interface built with React and Vite, powered by the Groq API using the `llama-3.3-70b-versatile` model. Features real-time streaming responses, built-in markdown rendering, and a refined dark UI.

---

## Tech Stack

- **React 19** — UI framework
- **Vite 7** — build tool and dev server
- **Groq SDK** — API client for LLM inference
- **Model** — `llama-3.3-70b-versatile` via Groq
- **Fonts** — Cormorant Garamond, Lexend, Fira Code (Google Fonts)

---

## Features

- **Streaming responses** — output streams in real time as the model generates it
- **Markdown rendering** — custom built-in parser with no external dependencies, supporting headings, bold, italic, inline code, fenced code blocks with language labels, ordered and unordered lists, blockquotes, and horizontal rules
- **Code block copy buttons** — one-click copy on every code snippet with a visual confirmation state
- **Message copy button** — appears on hover beneath any bot reply
- **Multi-line textarea input** — auto-grows as you type up to five lines; Enter sends, Shift+Enter creates a new line
- **Clear chat** — resets the conversation from the header
- **Fullscreen layout** — fixed header and footer with a scrollable message area that fills the viewport
- **Error handling** — failed API calls display a styled error message without crashing the UI

---

## Project Structure

```
src/
├── App.jsx                        # Root component, state management, API calls
├── main.jsx                       # React entry point
├── index.css                      # All global styles and design tokens
└── components/
    ├── ChatBotIcon.jsx             # Bot avatar SVG icon
    ├── ChatForm.jsx                # Textarea input and send button
    ├── ChatMessage.jsx             # Individual message bubble with copy button
    └── MarkdownRenderer.jsx        # Custom markdown-to-JSX parser
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Groq API key — get one free at [console.groq.com](https://console.groq.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/chatbot-reactjs.git
cd chatbot-reactjs
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GROQ_API_KEY` | Yes | Your Groq API key |

> **Note:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the app for production into the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Configuration

The following constants in `src/App.jsx` control the model behaviour:

| Constant | Default | Description |
|---|---|---|
| `MODEL_NAME` | `llama-3.3-70b-versatile` | Groq model to use |
| `TEMPERATURE` | `0.7` | Response creativity (0 = focused, 1 = creative) |
| `MAX_TOKENS` | `3000` | Maximum tokens per response |

---

## Supported Markdown

The built-in `MarkdownRenderer` component parses the following syntax:

| Element | Syntax |
|---|---|
| Heading 1 | `# Heading` |
| Heading 2 | `## Heading` |
| Heading 3 | `### Heading` |
| Bold | `**text**` |
| Italic | `*text*` |
| Bold + Italic | `***text***` |
| Inline code | `` `code` `` |
| Fenced code block | ```` ```language ```` |
| Unordered list | `- item` or `* item` |
| Ordered list | `1. item` |
| Blockquote | `> text` |
| Horizontal rule | `---` |

---

## Deployment

### Build for Production

```bash
npm run build
```

The output is placed in the `dist/` folder and can be served by any static hosting provider.

### Recommended Hosting Platforms

- **Vercel** — connect your GitHub repo and it deploys automatically
- **Netlify** — drag and drop the `dist/` folder or connect via Git
- **Cloudflare Pages** — fast global CDN with a generous free tier

When deploying, add `VITE_GROQ_API_KEY` as an environment variable in your hosting platform's dashboard.

> **Security note:** This project calls the Groq API directly from the browser using `dangerouslyAllowBrowser: true`. This is acceptable for personal projects and demos, but for production use with real users it is recommended to route API calls through a backend server to keep your API key private.

---

## Customisation

### Changing the accent colour

All colours are defined as CSS variables at the top of `src/index.css`. Update `--accent` to change the primary orange throughout the entire UI:

```css
:root {
  --accent: #f88203;       /* Main accent colour */
  --accent-dim: rgba(248, 130, 3, 0.15);
  --accent-glow: rgba(248, 130, 3, 0.25);
}
```

### Changing the AI persona

Update the `INITIAL_MESSAGE` text in `src/App.jsx` to change the greeting. You can also add a system prompt to the `messages` array in `handleGenerateBotResponse` to give the assistant a specific personality or set of instructions.

---

## License

This project is open source and available under the [MIT License](LICENSE).