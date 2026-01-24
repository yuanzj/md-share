import type { Theme } from '../themes'

export type ToolbarProps = {
  themes: Theme[]
  themeId: string
  onThemeChange: (id: string) => void
  onCopyWechat: () => void
  onCopyMarkdown: () => void
  onCopyImage: () => void
  showWatermark: boolean
  onToggleWatermark: () => void
  watermarkText: string
  defaultWatermarkText: string
  onWatermarkTextChange: (value: string) => void
}

export default function Toolbar({
  themes,
  themeId,
  onThemeChange,
  onCopyWechat,
  onCopyMarkdown,
  onCopyImage,
  showWatermark,
  onToggleWatermark,
  watermarkText,
  defaultWatermarkText,
  onWatermarkTextChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">主题</span>
          <select
            value={themeId}
            onChange={(event) => onThemeChange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm shadow-sm outline-none transition focus:border-slate-400"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">水印</span>
          <button
            type="button"
            onClick={onToggleWatermark}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              showWatermark
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showWatermark ? '开' : '关'}
          </button>
          <input
            value={watermarkText}
            onChange={(event) => onWatermarkTextChange(event.target.value)}
            onBlur={() => {
              if (watermarkText.trim() === '') {
                onWatermarkTextChange(defaultWatermarkText)
              }
            }}
            placeholder="自定义水印"
            disabled={!showWatermark}
            className={`w-44 rounded-lg border px-2 py-1 text-xs shadow-sm outline-none transition ${
              showWatermark
                ? 'border-slate-200 bg-white text-slate-700 focus:border-slate-400'
                : 'border-slate-200/70 bg-slate-100 text-slate-400'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onCopyImage}
          className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          复制图片
        </button>
        <button
          type="button"
          onClick={onCopyWechat}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          复制微信文本
        </button>
        <button
          type="button"
          onClick={onCopyMarkdown}
          className="rounded-lg border border-slate-200/70 bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
        >
          复制 Markdown
        </button>
      </div>
    </div>
  )
}
