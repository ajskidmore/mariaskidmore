import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Bold, Italic, List, Link as LinkIcon, Heading } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write your content here...',
  minHeight = '300px',
}: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkup = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[data-rich-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading, label: 'Heading', action: () => insertMarkup('<h2>', '</h2>') },
    { icon: Bold, label: 'Bold', action: () => insertMarkup('<strong>', '</strong>') },
    { icon: Italic, label: 'Italic', action: () => insertMarkup('<em>', '</em>') },
    { icon: List, label: 'List', action: () => insertMarkup('<ul>\n  <li>', '</li>\n</ul>') },
    { icon: LinkIcon, label: 'Link', action: () => insertMarkup('<a href="URL">', '</a>') },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-dark-text-primary">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-700">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 hover:bg-gray-700 rounded transition-colors group"
            title={button.label}
          >
            <button.icon className="w-4 h-4 text-gray-400 group-hover:text-primary-400" />
          </button>
        ))}
        <div className="ml-auto text-xs text-gray-500">
          HTML supported
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
        {/* Editor */}
        <div>
          <textarea
            data-rich-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-field font-mono text-sm resize-none"
            style={{ minHeight }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700 overflow-auto"
            style={{ minHeight }}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {value ? (
                <div dangerouslySetInnerHTML={{ __html: value }} />
              ) : (
                <p className="text-gray-500 italic">Preview will appear here...</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        You can use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, etc.
      </p>
    </div>
  );
};

export default RichTextEditor;
