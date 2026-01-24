export type ToastProps = {
  message: string
  open: boolean
}

export default function Toast({ message, open }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className={`toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg ${
        open ? 'toast-visible' : 'toast-hidden'
      }`}
    >
      {message}
    </div>
  )
}
