interface ExecutionLogProps {
  output: string;
}

export function ExecutionLog({ output }: ExecutionLogProps) {
  return (
    <>
      <h3 className="execution-log-title">📝 実行ログ（console.logの出力）</h3>
      {output ? (
        <pre className="execution-log">
          {output}
        </pre>
      ) : (
        <div className="execution-log-empty">
          💡 デバッグのヒント: コード内に <code className="code-inline">console.log()</code> を追加すると、ここに出力されます。<br />
          例: <code className="code-inline">console.log('変数x:', x);</code>
        </div>
      )}
    </>
  );
}
