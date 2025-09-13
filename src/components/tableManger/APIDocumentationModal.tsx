import { motion, AnimatePresence } from 'framer-motion'
import { Close } from '@mui/icons-material'
import { type Schema } from '../../services/schemaService'

interface APIDocumentationModalProps {
    isVisible: boolean;
    schema: Schema | null;
    onClose: () => void;
    onCopyDocumentation: (message: string) => void;
}

const APIDocumentationModal = ({
    isVisible,
    schema,
    onClose,
    onCopyDocumentation
}: APIDocumentationModalProps) => {
    const generateExampleData = () => {
        const example: any = {}
        schema?.fields.forEach(field => {
            if (field.name && field.name !== 'id') {
                switch (field.type) {
                    case 'string':
                        example[field.name] = `"example_${field.name}"`
                        break
                    case 'number':
                        example[field.name] = 123
                        break
                    case 'boolean':
                        example[field.name] = true
                        break
                    case 'array':
                        example[field.name] = `["item1", "item2"]`
                        break
                    case 'object':
                        example[field.name] = `{ "key": "value" }`
                        break
                    case 'date':
                        example[field.name] = `"${new Date().toISOString()}"`
                        break
                    default:
                        example[field.name] = `"example_${field.name}"`
                }
            }
        })
        return JSON.stringify(example, null, 2)
    }

    const handleCopyDocumentation = () => {
        if (!schema) return

        const docText = `API Documentation for ${schema.collection_name}

Base URL: https://your-api-domain.com/api/${schema.collection_name}

Endpoints:
- GET /api/${schema.collection_name}
- POST /api/${schema.collection_name}
- PUT /api/${schema.collection_name}/:id
- DELETE /api/${schema.collection_name}/:id`

        navigator.clipboard.writeText(docText)
        onCopyDocumentation('API documentation copied to clipboard')
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
                    className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
                >
                    <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">API Documentation</h2>
                            <p className="text-gray-600 text-sm">Complete API guide for {schema.collection_name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 text-gray-400 hover:text-white hover:bg-black rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
                        >
                            <Close className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto max-h-[75vh] bg-white space-y-8">
                        {/* Base URL Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Base URL</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <code className="text-blue-800 font-mono text-lg">
                                    https://your-api-domain.com/api/{schema.collection_name}
                                </code>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                                Replace <code className="bg-gray-100 px-2 py-1 rounded">your-api-domain.com</code> with your actual API domain
                            </p>
                        </div>

                        {/* Endpoints Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-black rounded-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Available Endpoints</h3>
                            </div>

                            {/* GET Endpoint */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">GET</span>
                                    <h4 className="text-lg font-semibold text-gray-900">Retrieve Records</h4>
                                    {schema.endpoint_protection?.get && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                                            🔒 <span>Protected</span>
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Endpoint</h5>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <code className="text-green-400 font-mono">GET /api/{schema.collection_name}</code>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">JavaScript Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {`const response = await fetch('/api/${schema.collection_name}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'${schema.endpoint_protection?.get ? ',\n    \'Authorization\': \'Bearer YOUR_JWT_TOKEN\'' : ''}
  }
});
const data = await response.json();`}
                                            </pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">cURL Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {`curl -X GET "https://your-api-domain.com/api/${schema.collection_name}" \\
  -H "Content-Type: application/json"${schema.endpoint_protection?.get ? ' \\\n  -H "Authorization: Bearer YOUR_JWT_TOKEN"' : ''}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* POST Endpoint */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">POST</span>
                                    <h4 className="text-lg font-semibold text-gray-900">Create Record</h4>
                                    {schema.endpoint_protection?.post && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                                            🔒 <span>Protected</span>
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Endpoint</h5>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <code className="text-green-400 font-mono">POST /api/{schema.collection_name}</code>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Request Body Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {generateExampleData()}
                                            </pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">JavaScript Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {`const response = await fetch('/api/${schema.collection_name}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'${schema.endpoint_protection?.post ? ',\n    \'Authorization\': \'Bearer YOUR_JWT_TOKEN\'' : ''}
  },
  body: JSON.stringify(${generateExampleData().replace(/\n/g, '\n  ')})
});
const data = await response.json();`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PUT Endpoint */}
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-bold">PUT</span>
                                    <h4 className="text-lg font-semibold text-gray-900">Update Record</h4>
                                    {schema.endpoint_protection?.put && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                                            🔒 <span>Protected</span>
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Endpoint</h5>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <code className="text-green-400 font-mono">PUT /api/{schema.collection_name}/:id</code>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">JavaScript Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {`const response = await fetch('/api/${schema.collection_name}/RECORD_ID', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'${schema.endpoint_protection?.put ? ',\n    \'Authorization\': \'Bearer YOUR_JWT_TOKEN\'' : ''}
  },
  body: JSON.stringify(${generateExampleData().replace(/\n/g, '\n  ')})
});
const data = await response.json();`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DELETE Endpoint */}
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">DELETE</span>
                                    <h4 className="text-lg font-semibold text-gray-900">Delete Record</h4>
                                    {schema.endpoint_protection?.delete && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                                            🔒 <span>Protected</span>
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Endpoint</h5>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <code className="text-green-400 font-mono">DELETE /api/{schema.collection_name}/:id</code>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">JavaScript Example</h5>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre className="text-green-400 font-mono text-sm">
                                                {`const response = await fetch('/api/${schema.collection_name}/RECORD_ID', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'${schema.endpoint_protection?.delete ? ',\n    \'Authorization\': \'Bearer YOUR_JWT_TOKEN\'' : ''}
  }
});
const data = await response.json();`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Authentication Section */}
                        {(schema.endpoint_protection?.get ||
                            schema.endpoint_protection?.post ||
                            schema.endpoint_protection?.put ||
                            schema.endpoint_protection?.delete) && (
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 bg-amber-600 rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Authentication Required</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-gray-700">
                                            Some endpoints in this API require authentication. Include your JWT token in the Authorization header:
                                        </p>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <code className="text-green-400 font-mono">Authorization: Bearer YOUR_JWT_TOKEN</code>
                                        </div>
                                        <div className="bg-amber-100 rounded-lg p-4">
                                            <p className="text-amber-800 text-sm">
                                                <strong>Note:</strong> To obtain a JWT token, you'll need to authenticate through your configured authentication system first.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Response Format Section */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Response Format</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-700">All responses are returned in JSON format with the following structure:</p>
                                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-green-400 font-mono text-sm">
                                        {`// Success Response
{
  "success": true,
  "data": {
    // Your record data here
  }
}

// Error Response
{
  "success": false,
  "error": "Error message description"
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleCopyDocumentation}
                            className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Documentation</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default APIDocumentationModal
