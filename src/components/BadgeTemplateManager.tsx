import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BadgeTemplate } from '../types/badge';

interface BadgeTemplateManagerProps {
  eventId: string;
  onLoadTemplate: (template: BadgeTemplate) => void;
  onSaveTemplate: (template: BadgeTemplate) => void;
}

export function BadgeTemplateManager({ eventId, onLoadTemplate, onSaveTemplate }: BadgeTemplateManagerProps) {
  const [templates, setTemplates] = useState<BadgeTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [eventId]);

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('badge_templates')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error loading templates:', error);
      return;
    }

    setTemplates(data || []);
  };

  const handleSaveTemplate = async (name: string) => {
    const template = {
      name,
      event_id: eventId,
      // Add other template data here
    };

    const { error } = await supabase
      .from('badge_templates')
      .insert([template]);

    if (error) {
      console.error('Error saving template:', error);
      return;
    }

    setShowSaveDialog(false);
    loadTemplates();
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('badge_templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      console.error('Error deleting template:', error);
      return;
    }

    loadTemplates();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Templates</h3>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </button>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <span className="text-sm font-medium text-gray-900">{template.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => onLoadTemplate(template)}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Load
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="text-sm text-red-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Template</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Template name"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveTemplate(newTemplateName)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}