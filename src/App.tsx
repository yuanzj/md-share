import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { renderMarkdown } from './lib/markdown'
import { mdToWechatText } from './lib/wechat'
import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import PreviewCard from './components/PreviewCard'
import Toast from './components/Toast'
import { themes } from './themes'

const THEME_KEY = 'mdcard_themeId'
const WATERMARK_KEY = 'mdcard_watermark'
const WATERMARK_TEXT_KEY = 'mdcard_watermark_text'
const DEFAULT_WATERMARK_TEXT = '由 Jayden.Dev 制作'
const EXPORT_PIXEL_RATIO: 2 = 2

const sampleMarkdown = `# 旅行备忘录\n\n## 行前准备\n- 护照/证件\n- 充电器与转换头\n- 轻装小包\n\n### 行程提示\n> 慢一点，会发现更多细节。\n\n\`\`\`bash\n# 复制文件\ncp source.md target.md\n\`\`\`\n\n访问 [官方网站](https://example.com) 获取最新信息。\n\n![海边](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200)\n`

function getInitialThemeId() {
  if (typeof window === 'undefined') return themes[0].id
  return localStorage.getItem(THEME_KEY) ?? themes[0].id
}

export default function App() {
  const [markdown, setMarkdown] = useState(sampleMarkdown)
  const [themeId, setThemeId] = useState(getInitialThemeId)
  const [showWatermark, setShowWatermark] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem(WATERMARK_KEY)
    return stored ? stored === 'true' : true
  })
  const [watermarkText, setWatermarkText] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_WATERMARK_TEXT
    return localStorage.getItem(WATERMARK_TEXT_KEY) ?? DEFAULT_WATERMARK_TEXT
  })
  const [toastMessage, setToastMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const toastTimer = useRef<number | null>(null)
  const exportRef = useRef<HTMLDivElement | null>(null)

  const theme = useMemo(() => themes.find((item) => item.id === themeId) ?? themes[0], [themeId])
  const html = useMemo(() => renderMarkdown(markdown), [markdown])

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastOpen(true)
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current)
    }
    toastTimer.current = window.setTimeout(() => {
      setToastOpen(false)
    }, 1800)
  }

  const handleThemeChange = (id: string) => {
    setThemeId(id)
    localStorage.setItem(THEME_KEY, id)
  }
  const handleToggleWatermark = () => {
    setShowWatermark((prev) => {
      const next = !prev
      localStorage.setItem(WATERMARK_KEY, String(next))
      return next
    })
  }
  const handleWatermarkTextChange = (value: string) => {
    setWatermarkText(value)
    localStorage.setItem(WATERMARK_TEXT_KEY, value)
  }

  const handleCopyWechat = async () => {
    const text = mdToWechatText(markdown)
    try {
      await navigator.clipboard.writeText(text)
      showToast('已复制微信纯文本')
    } catch {
      showToast('复制失败，请检查浏览器权限')
    }
  }

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      showToast('已复制 Markdown')
    } catch {
      showToast('复制失败，请检查浏览器权限')
    }
  }

  const handleCopyImage = async () => {
    if (!exportRef.current) return
    const node = exportRef.current
    const width = Math.ceil(node.scrollWidth)
    const height = Math.ceil(node.scrollHeight)

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: EXPORT_PIXEL_RATIO,
        cacheBust: true,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        },
      })

      const blob = await (await fetch(dataUrl)).blob()
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
      showToast('图片已复制到剪贴板')
    } catch (error) {
      console.error(error)
      try {
        const fallbackUrl = await toPng(node, { pixelRatio: EXPORT_PIXEL_RATIO })
        const link = document.createElement('a')
        link.download = `md-card-${Date.now()}@${EXPORT_PIXEL_RATIO}x.png`
        link.href = fallbackUrl
        link.click()
        showToast('复制失败，已改为下载 PNG')
      } catch (fallbackError) {
        console.error(fallbackError)
        showToast('复制失败，请检查浏览器权限')
      }
    }
  }

  const watermarkDisplayText =
    watermarkText.trim() === '' ? DEFAULT_WATERMARK_TEXT : watermarkText

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-[-120px] h-96 w-96 rounded-full bg-gradient-to-br from-sky-200/60 via-emerald-100/40 to-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-[-80px] h-96 w-96 rounded-full bg-gradient-to-br from-rose-200/50 via-orange-100/40 to-lime-100/40 blur-3xl" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
          <header className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                Jayden.Dev
              </span>
              <span className="text-xs font-medium tracking-[0.22em] text-slate-500/80">
                AI 灵感分发 · 格式净化 · 隐私安全
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              消除 Markdown 干扰，重塑 AI 对话的阅读体验
            </h1>
            <p className="max-w-2xl text-sm text-slate-500">
              粘贴 AI 内容即刻渲染，支持微信排版优化与高保真卡片导出。
            </p>
          </header>

          <Toolbar
            themes={themes}
            themeId={themeId}
            onThemeChange={handleThemeChange}
            onCopyWechat={handleCopyWechat}
            onCopyMarkdown={handleCopyMarkdown}
            onCopyImage={handleCopyImage}
            showWatermark={showWatermark}
            onToggleWatermark={handleToggleWatermark}
            watermarkText={watermarkText}
            defaultWatermarkText={DEFAULT_WATERMARK_TEXT}
            onWatermarkTextChange={handleWatermarkTextChange}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Editor value={markdown} onChange={setMarkdown} />
            <PreviewCard
              ref={exportRef}
              html={html}
              theme={theme}
              showWatermark={showWatermark}
              watermarkText={watermarkDisplayText}
            />
          </div>
        </div>
      </div>

      <Toast message={toastMessage} open={toastOpen} />
    </div>
  )
}
