import { useState } from 'react';

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{lang || 'code'}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
};

const parseInline = (text) => {
  const parts = [];
  // Handle bold+italic, bold, italic, inline code
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) parts.push(<strong key={match.index}><em>{match[2]}</em></strong>);
    else if (match[3]) parts.push(<strong key={match.index}>{match[3]}</strong>);
    else if (match[4]) parts.push(<em key={match.index}>{match[4]}</em>);
    else if (match[5]) parts.push(<code key={match.index} className="inline-code">{match[5]}</code>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? [text] : parts;
};

const MarkdownRenderer = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      const lang = codeMatch[1];
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<CodeBlock key={i} code={codeLines.join('\n')} lang={lang} />);
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1) { elements.push(<h1 key={i} className="md-h1">{parseInline(h1[1])}</h1>); i++; continue; }
    if (h2) { elements.push(<h2 key={i} className="md-h2">{parseInline(h2[1])}</h2>); i++; continue; }
    if (h3) { elements.push(<h3 key={i} className="md-h3">{parseInline(h3[1])}</h3>); i++; continue; }

    // Unordered lists
    if (line.match(/^[-*+] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*+] /)) {
        items.push(<li key={i}>{parseInline(lines[i].replace(/^[-*+] /, ''))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="md-ul">{items}</ul>);
      continue;
    }

    // Ordered lists
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(<li key={i}>{parseInline(lines[i].replace(/^\d+\. /, ''))}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} className="md-ol">{items}</ol>);
      continue;
    }

    // Blockquote
    if (line.match(/^> /)) {
      elements.push(
        <blockquote key={i} className="md-blockquote">
          {parseInline(line.replace(/^> /, ''))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^(---|\*\*\*|___)$/)) {
      elements.push(<hr key={i} className="md-hr" />);
      i++;
      continue;
    }

    // Empty line → spacing
    if (line.trim() === '') {
      elements.push(<div key={i} className="md-spacer" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(<p key={i} className="md-p">{parseInline(line)}</p>);
    i++;
  }

  return <div className="markdown">{elements}</div>;
};

export default MarkdownRenderer;
