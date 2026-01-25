export type EditorProps = {
  value: string
  onChange: (value: string) => void
  radius?: string
}

export default function Editor({ value, onChange, radius }: EditorProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Markdown 输入</h2>
        <span className="text-xs text-slate-500">粘贴或输入</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="在此粘贴 Markdown…"
        className="min-h-[520px] w-full flex-1 resize-none border border-slate-200 bg-white/90 p-4 font-mono text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-400"
        style={radius ? { borderRadius: radius } : undefined}
      />
    </div>
  )
}
