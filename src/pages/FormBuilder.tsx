import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<FormField[]>([
    {
      label: 'Name',
      field_type: 'text',
      placeholder: 'Your Name',
      is_required: true,
      validation_rules: {},
      order_index: 0,
    },
    {
      label: 'Email',
      field_type: 'email',
      placeholder: 'Your Email',
      is_required: true,
      validation_rules: {},
      order_index: 1,
    }
  ]);
  const [draggedField, setDraggedField] = useState<number | null>(null);

  useEffect(() => {
    const fetchFormFields = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('form_fields')
        .select('label,field_type,options,placeholder,is_required,validation_rules,order_index')
        .eq('event_id', eventId)
        .order('order_index');

      if (error) {
        console.error('Error fetching form fields:', error);
        setIsLoading(false);
        return;
      }

      const fetchedFields = data || [];

      const nameField = fetchedFields.find(f => f.order_index === 0);
      const emailField = fetchedFields.find(f => f.order_index === 1);

      const updatedFields = nameField && emailField
        ? [
          nameField,
          emailField,
          ...fetchedFields.filter(f => f.order_index >= 2)
        ]
        : [
          {
            label: 'Name',
            field_type: 'text',
            placeholder: 'Your Name',
            is_required: true,
            validation_rules: {},
            order_index: 0,
          },
          {
            label: 'Email',
            field_type: 'email',
            placeholder: 'Your Email',
            is_required: true,
            validation_rules: {},
            order_index: 1,
          },
          ...fetchedFields.filter(f => f.order_index >= 2)
        ];

      setIsLoading(false);
      setFields(updatedFields);
    };

    fetchFormFields();
  }, []);

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

    setFields([...fields.slice(0, 2), ...fields.slice(2), newField]);
  };

  const removeField = (index: number) => {
    if (index < 2) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      ...updates,
      // is_required: true
    };
    setFields(updatedFields);
  };

  const handleDragStart = (index: number) => {
    if (index < 2) return;
    setDraggedField(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (index < 2 || draggedField === null || draggedField === index || draggedField < 2) return;

    e.preventDefault();
    const updatedFields = [...fields];
    const [draggedItem] = updatedFields.splice(draggedField, 1);
    updatedFields.splice(index, 0, draggedItem);

    // Recalculate order_index for draggable fields
    updatedFields.forEach((field, i) => {
      field.order_index = i >= 2 ? i : field.order_index;
    });

    setFields(updatedFields);
    setDraggedField(index);
  };

  const saveForm = async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      await supabase
        .from('form_fields')
        .delete()
        .eq('event_id', eventId);

      const { error } = await supabase
        .from('form_fields')
        .insert(
          fields.map(field => ({
            ...field,
            event_id: eventId,
          }))
        );

      if (error) throw error;
      setIsLoading(false);
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error saving form:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div id="loading">Loading&#8230;</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>
        <button
          onClick={saveForm}
          disabled={isLoading}
          className="flex items-center px-6 py-3 bg-[#6B46C1] text-white rounded-lg hover:bg-[#5A3F9E] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Form
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-[#6B46C1] p-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Registration Form Builder
          </h3>
          <p className="text-sm sm:text-base text-purple-100 text-center mt-2">
            Design your event registration form by adding and arranging fields.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {['text', 'select', 'number', 'date', 'email'].map((type) => (
              <button
                key={type}
                onClick={() => addField(type as FormField['field_type'])}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {type.charAt(0).toUpperCase() + type.slice(1)} Field
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={index}
                draggable={index >= 2}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className={`bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300 ${
                  index < 2 ? 'cursor-default' : 'cursor-move hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center w-full">
                    {index >= 2 && <Grip className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" />}
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        className={`w-full text-sm font-medium text-gray-900 border-0 border-b border-transparent bg-transparent focus:border-purple-600 focus:ring-0 ${
                          index < 2 ? 'cursor-default' : ''
                        }`}
                        placeholder="Field Label"
                      />
                      <span className="text-xs text-gray-500">
                        {`${field.field_type.charAt(0).toUpperCase() + field.field_type.slice(1)} Field`}
                        {index < 2 && ' (Required)'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                    {index >= 2 && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={field.is_required}
                          onChange={() => updateField(index, { is_required: !field.is_required })}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label 
                          htmlFor={`required-${index}`} 
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Required
                        </label>
                      </div>
                    )}
                    {index >= 2 && (
                      <button
                        onClick={() => removeField(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <input
                    type={field.field_type === 'select' ? 'text' : field.field_type}
                    value={field.placeholder}
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    className={`w-full text-sm text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                      index < 2 ? 'cursor-default' : ''
                    }`}
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
                          className="flex-grow text-sm text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={() => {
                            const newOptions = field.options?.filter((_, i) => i !== optionIndex);
                            updateField(index, { options: newOptions });
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
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
                      className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
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