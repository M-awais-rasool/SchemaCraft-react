import { motion } from 'framer-motion'
import { TableChart, Edit, Code, Delete } from '@mui/icons-material'
import { type Schema } from '../../services/schemaService'

interface SchemaCardProps {
  schema: Schema;
  index: number;
  onEdit: (schema: Schema) => void;
  onShowCode: (schema: Schema) => void;
  onDelete: (schemaId: string) => void;
}

const SchemaCard = ({ schema, index, onEdit, onShowCode, onDelete }: SchemaCardProps) => {
  return (
    <motion.div
      key={schema.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-black">
            <TableChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{schema.collection_name}</h3>
            <p className="text-xs text-gray-500">
              Created {new Date(schema.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Fields ({schema.fields.length})
          </h4>
          <div className="space-y-1">
            {schema.fields.slice(0, 3).map((field, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600">{field.name}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">{field.type}</span>
                  {field.required && (
                    <span className="text-black">*</span>
                  )}
                </div>
              </div>
            ))}
            {schema.fields.length > 3 && (
              <p className="text-xs text-gray-500">+{schema.fields.length - 3} more</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">API Endpoints</h4>
          <div className="space-y-1">
            <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
              GET /api/{schema.collection_name}
            </div>
            <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
              POST /api/{schema.collection_name}
            </div>
            <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
              PUT /api/{schema.collection_name}/:id
            </div>
            <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
              DELETE /api/{schema.collection_name}/:id
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(schema)}
            className="p-1 text-gray-400 hover:text-black transition-colors"
            title="Edit Schema"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onShowCode(schema)}
            className="p-1 text-gray-400 hover:text-black transition-colors"
            title="View API Documentation"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => onDelete(schema.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete Schema"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default SchemaCard
