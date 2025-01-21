import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Download, Layout } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BadgeTemplate {
  id: string;
  name: string;
  aspectRatio: '16:9' | '9:16' | '3:4';
  elements: BadgeElement[];
}

interface BadgeElement {
  id: string;
  type: 'text' | 'qr' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  field?: string;
}

function BadgeDesigner() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BadgeTemplate | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '3:4'>('16:9');
  const [elements, setElements] = useState<BadgeElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<BadgeElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

      setFormFields(data || []);
    };

    fetchFormFields();
  }, [eventId]);

  const addElement = (type: BadgeElement['type']) => {
    const newElement: BadgeElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'New Text' : '',
      x: 50,
      y: 50,
      width: type === 'qr' ? 100 : 200,
      height: type === 'qr' ? 100 : 50,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  const handleMouseDown = (e: React.MouseEvent, element: BadgeElement) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setIsDragging(true);
    setSelectedElement(element);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const container = document.getElementById('badge-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const updatedElements = elements.map(el =>
      el.id === selectedElement.id
        ? { ...el, x: Math.max(0, Math.min(x, rect.width - el.width)), y: Math.max(0, Math.min(y, rect.height - el.height)) }
        : el
    );

    setElements(updatedElements);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateElement = (id: string, updates: Partial<BadgeElement>) => {
    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(updatedElements);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const generateBadgePDF = async () => {
    // In a real implementation, this would generate a PDF using a library like jsPDF
    // For now, we'll just show an alert
    alert('Badge PDF generation would be implemented here');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>
        <div className="flex items-center space-x-4">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as any)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="16:9">Landscape (16:9)</option>
            <option value="9:16">Portrait (9:16)</option>
            <option value="3:4">Portrait (3:4)</option>
          </select>
          <button
            onClick={generateBadgePDF}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Badge
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Elements</h3>
          </div>
          <div className="p-4 space-y-4">
            <button
              onClick={() => addElement('text')}
              className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Add Text
            </button>
            <button
              onClick={() => addElement('qr')}
              className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Add QR Code
            </button>
            <button
              onClick={() => addElement('image')}
              className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Add Image
            </button>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Available Fields</h4>
              <div className="space-y-2">
                {formFields.map((field) => (
                  <div
                    key={field.id}
                    className="text-sm text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => addElement('text')}
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div
            id="badge-container"
            className="bg-white rounded-lg shadow p-4"
            style={{
              aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '3/4',
              position: 'relative',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  border: selectedElement?.id === element.id ? '2px solid #4f46e5' : '1px dashed #e5e7eb',
                  cursor: 'move',
                  backgroundColor: element.type === 'qr' ? '#f3f4f6' : 'transparent',
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  color: element.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseDown={(e) => handleMouseDown(e, element)}
              >
                {element.type === 'text' && element.content}
                {element.type === 'qr' && <div className="text-xs text-gray-500">QR Code</div>}
                {element.type === 'image' && <div className="text-xs text-gray-500">Image Placeholder</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Properties</h3>
          </div>
          <div className="p-4">
            {selectedElement && (
              <div className="space-y-4">
                {selectedElement.type === 'text' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Font Size</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Color</label>
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="mt-1 block w-full h-8"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Height"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeElement(selectedElement.id)}
                  className="w-full mt-4 px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  Remove Element
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeDesigner;