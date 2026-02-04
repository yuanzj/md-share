import type { Theme } from '../themes'

export type EditorProps = {
  value: string
  onChange: (value: string) => void
  theme: Theme
}

export default function Editor({ value, onChange, theme }: EditorProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${theme.isDark ? 'text-slate-100' : 'text-slate-900'}`}>Markdown 输入</h2>
        <span className={`text-xs ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>粘贴或输入</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="在此粘贴 Markdown…"
        className={`min-h-[520px] w-full flex-1 resize-none border p-4 font-mono text-sm shadow-sm outline-none transition focus:border-slate-400 backdrop-blur-md ${
          theme.isDark
            ? 'bg-slate-800/90 text-slate-100 placeholder:text-slate-500 border-slate-700'
            : 'bg-white/90 text-slate-800 placeholder:text-slate-400 border-slate-200'
        }`}
        style={{
          borderRadius: theme.radius,
          borderColor: 'var(--ui-border)',
        }}
      />
    </div>
  )
}
