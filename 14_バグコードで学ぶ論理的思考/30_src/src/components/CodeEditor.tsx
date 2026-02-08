import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="code-editor-container">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
        padding={15}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 16,
          minHeight: '100%',
          background: 'var(--bg-primary)',
        }}
        textareaClassName="code-editor-textarea"
      />
    </div>
  );
}
