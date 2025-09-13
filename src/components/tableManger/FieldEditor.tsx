import { motion } from 'framer-motion'
import { Add, Delete } from '@mui/icons-material'
import { type SchemaField } from '../../services/schemaService'
import { type FieldType } from '../../pages/user/components/types'

interface FieldEditorProps {
  fields: SchemaField[];
  onFieldsChange: (fields: SchemaField[]) => void;
  className?: string;
}

const FieldEditor = ({ fields, onFieldsChange, className = '' }: FieldEditorProps) => {
  const fieldTypes: FieldType[] = ['string', 'number', 'boolean', 'array', 'object', 'date']

  const addField = () => {
    const newFields = [...fields, { name: '', type: 'string', visibility: 'public', required: false }]
    onFieldsChange(newFields)
  }

  const updateField = (index: number, field: Partial<SchemaField>) => {
    const updatedFields = [...fields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    onFieldsChange(updatedFields)
  }

  const removeField = (index: number) => {
    if (fields.length > 1) {
      const updatedFields = fields.filter((_, i) => i !== index)
      onFieldsChange(updatedFields)
    }
  }

  return (
    <div className={`group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Table Fields ({fields.length})
          </label>
          <p className="text-xs text-gray-600">Define the structure of your data</p>
        </div>
        <button
          onClick={addField}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Add className="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group/field bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Field Name
                </label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                  placeholder="field_name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200 text-sm font-mono"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Data Type
                </label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200 text-sm bg-white"
                >
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  value={field.visibility}
                  onChange={(e) => updateField(index, { visibility: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200 text-sm bg-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="lg:col-span-1 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="text-xs font-semibold text-gray-700">Required</span>
                  </label>
                </div>
                {fields.length > 1 && (
                  <button
                    onClick={() => removeField(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover/field:opacity-100"
                    title="Remove field"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FieldEditor
