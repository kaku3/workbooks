import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const lineCount = value.split('\n').length;

  return (
    <div className="code-editor-container">
      {/* 行番号 */}
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="line-number">
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* エディタ本体 */}
      <div className="editor-wrapper">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
          padding={10}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            minHeight: '100%',
            background: 'var(--editor-bg)',
            lineHeight: '1.5',
          }}
          textareaClassName="code-editor-textarea"
        />
      </div>
    </div>
  );
}
