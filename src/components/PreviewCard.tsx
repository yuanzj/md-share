import { forwardRef, type CSSProperties } from 'react'
import type { Theme } from '../themes'

export type PreviewCardProps = {
  html: string
  theme: Theme
  showWatermark: boolean
  watermarkText: string
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ html, theme, showWatermark, watermarkText }, ref) => {
    const cardStyle: CSSProperties = {
      background: theme.background,
      borderRadius: theme.radius,
      boxShadow: theme.shadow,
      border: theme.border,
      backdropFilter: theme.blur,
      opacity: theme.opacity,
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      lineHeight: theme.lineHeight,
      '--card-text': theme.textColor,
      '--accent': theme.accent,
      '--muted': theme.muted,
      '--code-bg': theme.codeBg,
      '--code-color': theme.codeColor,
    } as React.CSSProperties

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">预览</h2>
          <span className="text-xs text-slate-500">自动渲染</span>
        </div>
        <div
          ref={ref}
          className="relative overflow-visible px-6 py-6"
          style={cardStyle}
        >
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
          {showWatermark && watermarkText.trim() !== '' && (
            <div
              className="mt-8 text-xs uppercase tracking-widest"
              style={{ color: theme.textColor, opacity: 0.55 }}
            >
              {watermarkText}
            </div>
          )}
        </div>
      </div>
    )
  },
)

PreviewCard.displayName = 'PreviewCard'

export default PreviewCard
