import { motion, AnimatePresence } from 'framer-motion'
import { Warning, Close } from '@mui/icons-material'

interface ConfirmationPopupProps {
  isVisible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

const ConfirmationPopup = ({
  isVisible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmationPopupProps) => {
  const variantStyles = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-200'
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      border: 'border-yellow-200'
    },
    info: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-200'
    }
  }

  const styles = variantStyles[variant]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md bg-white/10"
            onClick={onCancel}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative bg-white rounded-2xl shadow-2xl border-2 p-6 max-w-md w-full ${styles.border}`}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Close className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`p-3 rounded-full ${styles.iconBg} flex-shrink-0`}>
                <Warning className={`w-6 h-6 ${styles.iconColor}`} />
              </div>

              {/* Text content */}
              <div className="flex-1 pt-1 pr-8">
                <h3 className={`text-lg font-bold mb-2 ${styles.titleColor}`}>
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {message}
                </p>

                {/* Action buttons */}
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl ${styles.confirmBtn}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationPopup
