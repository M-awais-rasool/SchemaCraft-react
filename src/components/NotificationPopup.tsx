import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Error, Close } from '@mui/icons-material'

interface NotificationPopupProps {
  isVisible: boolean
  type: 'success' | 'error'
  title: string
  message: string
  onClose: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

const NotificationPopup = ({
  isVisible,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}: NotificationPopupProps) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose])

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
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl border-2 border-black p-6 max-w-md w-full"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
            >
              <Close className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="p-3 rounded-full bg-black">
                {type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Error className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold mb-1 text-black">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Progress bar for auto-close */}
            {autoClose && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoCloseDelay / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-black rounded-bl-2xl"
              />
            )}

            {/* Action button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-black text-white hover:bg-gray-800"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NotificationPopup
