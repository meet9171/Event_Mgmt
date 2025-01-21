import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grip, Plus, X, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const fieldSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  field_type: z.enum(['text', 'select', 'number', 'date', 'email']),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  is_required: z.boolean(),
  validation_rules: z.any(),
  order_index: z.number(),
});

type FormField = z.infer<typeof fieldSchema>;

function FormBuilder() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormField[]>([]);
  const [draggedField, setDraggedField] = useState<number | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchFormFields = async () => {
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index');

      if (error) {
        console.error('Error fetching form fields:', error);
        return;
      }

      setFields(data || []);
    };

    fetchFormFields();
  }, [eventId]);

  const addField = (type: FormField['field_type']) => {
    const newField: FormField = {
      label: `New ${type} field`,
      field_type: type,
      placeholder: '',
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
      is_required: false,
      validation_rules: {},
      order_index: fields.length,
    };

    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const handleDragStart = (index: number) => {
    setDraggedField(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedField === null || draggedField === index) return;

    const updatedFields = [...fields];
    const [draggedItem] = updatedFields.splice(draggedField, 1);
    updatedFields.splice(index, 0, draggedItem);

    updatedFields.forEach((field, i) => {
      field.order_index = i;
    });

    setFields(updatedFields);
    setDraggedField(index);
  };

  const saveForm = async () => {
    if (!eventId) return;

    try {
      // Delete existing fields
      await supabase
        .from('form_fields')
        .delete()
        .eq('event_id', eventId);

      // Insert new fields
      const { error } = await supabase
        .from('form_fields')
        .insert(
          fields.map(field => ({
            ...field,
            event_id: eventId,
          }))
        );

      if (error) throw error;

      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>
        <button
          onClick={saveForm}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Form
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Registration Form Builder
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Design your event registration form by adding and arranging fields.
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => addField('text')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Text Field
            </button>
            <button
              onClick={() => addField('select')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dropdown
            </button>
            <button
              onClick={() => addField('number')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Number
            </button>
            <button
              onClick={() => addField('date')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Date
            </button>
            <button
              onClick={() => addField('email')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Email
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-move"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Grip className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        className="block w-full text-sm font-medium text-gray-900 border-0 border-b border-transparent bg-transparent focus:border-indigo-600 focus:ring-0"
                        placeholder="Field Label"
                      />
                      <span className="text-xs text-gray-500">{field.field_type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.is_required}
                        onChange={(e) => updateField(index, { is_required: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Required</span>
                    </label>
                    <button
                      onClick={() => removeField(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    className="block w-full text-sm text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Placeholder text"
                  />
                </div>

                {field.field_type === 'select' && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Options</div>
                    {field.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            updateField(index, { options: newOptions });
                          }}
                          className="block w-full text-sm text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => {
                            const newOptions = field.options?.filter((_, i) => i !== optionIndex);
                            updateField(index, { options: newOptions });
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(field.options || []), 'New Option'];
                        updateField(index, { options: newOptions });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormBuilder;