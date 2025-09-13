import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Code, Close, Save } from '@mui/icons-material'
import { type Schema, type SchemaField, SchemaService } from '../../services/schemaService'
import { type EndpointProtection } from '../../pages/user/components/types'
import FieldEditor from './FieldEditor'

interface EditSchemaModalProps {
  isVisible: boolean;
  schema: Schema | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

const EditSchemaModal = ({ 
  isVisible, 
  schema, 
  onClose, 
  onSuccess, 
  onError 
}: EditSchemaModalProps) => {
  const [tableName, setTableName] = useState('')
  const [fields, setFields] = useState<SchemaField[]>([
    { name: 'id', type: 'string', visibility: 'public', required: true }
  ])
  const [endpointProtection, setEndpointProtection] = useState<EndpointProtection>({
    get: false,
    post: false,
    put: false,
    delete: false
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (schema && isVisible) {
      setTableName(schema.collection_name)
      setFields(schema.fields)
      setEndpointProtection(schema.endpoint_protection || {
        get: false,
        post: false,
        put: false,
        delete: false
      })
    }
  }, [schema, isVisible])

  const generateSchema = () => {
    const schemaObj: any = {}
    fields.forEach(field => {
      if (field.name) {
        schemaObj[field.name] = {
          type: field.type,
          required: field.required,
          visibility: field.visibility
        }
      }
    })
    return JSON.stringify(schemaObj, null, 2)
  }

  const handleUpdateSchema = async () => {
    if (!schema || !tableName || !fields.every(f => f.name)) {
      onError('Please provide table name and ensure all fields have names')
      return
    }

    try {
      setUpdating(true)

      await SchemaService.updateSchema(schema.id, {
        collection_name: tableName,
        fields: fields,
        endpoint_protection: endpointProtection
      })

      onSuccess(`Schema "${tableName}" has been updated successfully.`)
      handleClose()
    } catch (err: any) {
      console.error('Failed to update schema:', err)
      onError(err.response?.data?.error || 'Failed to update schema')
    } finally {
      setUpdating(false)
    }
  }

  const handleClose = () => {
    setTableName('')
    setFields([{ name: 'id', type: 'string', visibility: 'public', required: true }])
    setEndpointProtection({ get: false, post: false, put: false, delete: false })
    onClose()
  }

  if (!isVisible || !schema) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-white/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
        >
          <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Schema</h2>
              <p className="text-gray-600 text-sm">Modify {schema.collection_name} schema structure</p>
            </div>
            <button
              onClick={handleClose}
              className="p-3 text-gray-400 hover:text-white hover:bg-black rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto max-h-[70vh] bg-white">
            <div className="space-y-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Schema Builder */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-black rounded-xl">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Edit Schema</h3>
                      <p className="text-gray-600 text-sm">Modify your table structure</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Table Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={tableName}
                          onChange={(e) => setTableName(e.target.value)}
                          placeholder="e.g., users, products, orders"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-black/10 focus:border-black transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
                        />
                      </div>
                    </div>

                    <FieldEditor 
                      fields={fields} 
                      onFieldsChange={setFields} 
                    />
                  </div>
                </div>

                {/* Schema Preview */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-black rounded-xl">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Schema Preview</h3>
                      <p className="text-gray-600 text-sm">Live preview of your changes</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <span>JSON Schema</span>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      </h4>
                      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 overflow-x-auto shadow-xl border border-gray-700">
                        <pre className="text-green-400 text-sm font-mono leading-relaxed">
                          {generateSchema()}
                        </pre>
                      </div>
                    </div>

                    <div className="group">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Generated Endpoints</h4>
                      <div className="space-y-3">
                        {tableName ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="font-bold text-green-600">GET</span>
                              <code className="font-mono text-gray-800">/api/{tableName}</code>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Read</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                              <span className="font-bold text-blue-600">POST</span>
                              <code className="font-mono text-gray-800">/api/{tableName}</code>
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Create</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                              <span className="font-bold text-yellow-600">PUT</span>
                              <code className="font-mono text-gray-800">/api/{tableName}/:id</code>
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Update</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                              <span className="font-bold text-red-600">DELETE</span>
                              <code className="font-mono text-gray-800">/api/{tableName}/:id</code>
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Remove</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm text-center py-8">
                            Enter a table name to see generated endpoints
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint Protection Configuration */}
              <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Endpoint Protection</h3>
                    <p className="text-gray-600 text-sm">Modify API endpoint security</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(endpointProtection).map(([method, isProtected]) => (
                    <label 
                      key={method}
                      className="group/check flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isProtected}
                          onChange={(e) => setEndpointProtection(prev => ({ ...prev, [method]: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${isProtected
                            ? 'bg-black border-black'
                            : 'border-gray-300 group-hover/check:border-blue-400'
                          }`}>
                          {isProtected && (
                            <svg className="w-3 h-3 text-white absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900">{method.toUpperCase()}</span>
                        <p className="text-xs text-gray-600">
                          {method === 'get' && 'Read data'}
                          {method === 'post' && 'Create data'}
                          {method === 'put' && 'Update data'}
                          {method === 'delete' && 'Remove data'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <button
              onClick={handleClose}
              disabled={updating}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSchema}
              disabled={updating || !tableName || !fields.every(f => f.name)}
              className="flex items-center space-x-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              <span>{updating ? 'Updating Schema...' : 'Update Schema'}</span>
              {updating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EditSchemaModal
