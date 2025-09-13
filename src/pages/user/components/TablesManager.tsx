import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Add, TableChart, Warning } from '@mui/icons-material'
import { SchemaService, type Schema } from '../../../services/schemaService'
import { useAuth } from '../../../contexts/AuthContext'
import NotificationPopup from '../../../components/NotificationPopup'
import ConfirmationPopup from '../../../components/ConfirmationPopup'
import CreateTableModal from '../../../components/tableManger/CreateTableModal'
import EditSchemaModal from '../../../components/tableManger/EditSchemaModal'
import APIDocumentationModal from '../../../components/tableManger/APIDocumentationModal'
import SchemaCard from '../../../components/tableManger/SchemaCard'
import { type NotificationConfig } from './types'

const TablesManager = () => {
  const { user } = useAuth()
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null)

  // Notification popup state
  const [showNotification, setShowNotification] = useState(false)
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    type: 'success',
    title: '',
    message: ''
  })

  // Confirmation popup state
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  // Check if user has MongoDB connection configured
  const hasMongoConnection = user?.mongodb_uri && user?.database_name

  // Helper function to show notifications
  const showNotificationPopup = (type: 'success' | 'error', title: string, message: string) => {
    setNotificationConfig({ type, title, message })
    setShowNotification(true)
  }

  useEffect(() => {
    fetchSchemas()
  }, [])

  const fetchSchemas = async () => {
    try {
      setLoading(true)
      const data = await SchemaService.getSchemas()
      setSchemas(data)
    } catch (err: any) {
      console.error('Failed to fetch schemas:', err)
      setError(err.response?.data?.error || 'Failed to load schemas')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = async (message: string) => {
    await fetchSchemas()
    showNotificationPopup('success', 'Table Created!', message)
  }

  const handleUpdateSuccess = async (message: string) => {
    await fetchSchemas()
    showNotificationPopup('success', 'Schema Updated!', message)
    setSelectedSchema(null)
  }

  const handleError = (error: string) => {
    setError(error)
  }

  const handleDeleteSchema = (schemaId: string) => {
    setPendingDeleteId(schemaId)
    setShowConfirmation(true)
  }

  const confirmDeleteSchema = async () => {
    if (!pendingDeleteId) return

    try {
      await SchemaService.deleteSchema(pendingDeleteId)
      await fetchSchemas()
      showNotificationPopup('success', 'Schema Deleted!', 'The schema and all its associated data have been permanently removed.')
    } catch (err: any) {
      console.error('Failed to delete schema:', err)
      showNotificationPopup('error', 'Deletion Failed', err.response?.data?.error || 'Failed to delete schema. Please try again.')
    } finally {
      setShowConfirmation(false)
      setPendingDeleteId(null)
    }
  }

  const cancelDeleteSchema = () => {
    setShowConfirmation(false)
    setPendingDeleteId(null)
  }

  const handleEditSchema = (schema: Schema) => {
    setSelectedSchema(schema)
    setShowEditModal(true)
  }

  const handleShowCode = (schema: Schema) => {
    setSelectedSchema(schema)
    setShowCodeModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your database tables and API endpoints</p>
        </div>
        <button
          onClick={() => hasMongoConnection ? setShowCreateModal(true) : setError('Please first add a MongoDB connection')}
          disabled={!hasMongoConnection}
          className={`mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${hasMongoConnection
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          <Add className="w-4 h-4" />
          <span>Create New Table</span>
        </button>
      </motion.div>

      {/* MongoDB Connection Warning */}
      {!hasMongoConnection && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <Warning className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-600">
              Please configure your MongoDB connection first before creating tables.
              Go to the MongoDB Connection tab to set up your database.
            </span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <Warning className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {schemas.length > 0 ? schemas.map((schema, index) => (
          <SchemaCard
            key={schema.id}
            schema={schema}
            index={index}
            onEdit={handleEditSchema}
            onShowCode={handleShowCode}
            onDelete={handleDeleteSchema}
          />
        )) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <TableChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tables Yet</h3>
            <p className="text-gray-600 mb-6">Create your first table to start building APIs</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mx-auto"
            >
              <Add className="w-4 h-4" />
              <span>Create Your First Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTableModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        onError={handleError}
        hasMongoConnection={!!hasMongoConnection}
      />

      <EditSchemaModal
        isVisible={showEditModal}
        schema={selectedSchema}
        onClose={() => {
          setShowEditModal(false)
          setSelectedSchema(null)
        }}
        onSuccess={handleUpdateSuccess}
        onError={handleError}
      />

      <APIDocumentationModal
        isVisible={showCodeModal}
        schema={selectedSchema}
        onClose={() => {
          setShowCodeModal(false)
          setSelectedSchema(null)
        }}
        onCopyDocumentation={(message: string) => {
          showNotificationPopup('success', 'Copied!', message)
        }}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isVisible={showConfirmation}
        title="Delete Schema"
        message="Are you sure you want to delete this schema? This action cannot be undone and will permanently remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteSchema}
        onCancel={cancelDeleteSchema}
        variant="danger"
      />

      {/* Notification Popup */}
      <NotificationPopup
        isVisible={showNotification}
        type={notificationConfig.type}
        title={notificationConfig.title}
        message={notificationConfig.message}
        onClose={() => setShowNotification(false)}
      />
    </div>
  )
}

export default TablesManager
