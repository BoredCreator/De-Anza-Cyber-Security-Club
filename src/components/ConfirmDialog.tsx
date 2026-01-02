import { ReactNode } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  error?: string
  variant?: 'danger' | 'warning'
  icon?: ReactNode
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  loading = false,
  error,
  variant = 'danger',
  icon
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      iconBg: 'bg-hack-red/20 border-hack-red/50',
      iconColor: 'text-hack-red',
      buttonBg: 'bg-hack-red/20 border-hack-red/50 text-hack-red hover:bg-hack-red/30',
      titleColor: 'text-hack-red',
      headerColor: 'text-hack-red'
    },
    warning: {
      iconBg: 'bg-hack-yellow/20 border-hack-yellow/50',
      iconColor: 'text-hack-yellow',
      buttonBg: 'bg-hack-yellow/20 border-hack-yellow/50 text-hack-yellow hover:bg-hack-yellow/30',
      titleColor: 'text-hack-yellow',
      headerColor: 'text-hack-yellow'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative terminal-window max-w-md w-full">
        <div className="terminal-header">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          <span className={`ml-4 text-xs font-terminal ${styles.headerColor}`}>confirm.sh</span>
        </div>
        <div className="terminal-body">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full border flex items-center justify-center ${styles.iconBg}`}>
              {icon || (
                <svg className={`w-8 h-8 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <h3 className={`font-bold text-lg mb-2 ${styles.titleColor}`}>{title}</h3>
            <p className="text-gray-500 text-sm">{message}</p>
          </div>

          {error && (
            <div className="text-hack-red text-sm font-terminal mb-4 text-center">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-hack rounded-lg flex-1 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-terminal text-sm disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonBg}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  PROCESSING...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
