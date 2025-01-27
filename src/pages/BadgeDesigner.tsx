import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, QrCodeIcon, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode.react';

interface BadgeTemplate {
  id: string;
  name: string;
  aspectRatio: '16:9' | '9:16' | '3:4';
  elements: BadgeElement[];
}

interface BadgeElement {
  id: string;
  type: 'text' | 'email' | 'date' | 'select' | 'number' | 'qr' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  field?: string;
  isCustom: boolean;
}

function BadgeDesigner() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState<any[]>([]);
  const [elements, setElements] = useState<BadgeElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<BadgeElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // states for orientation and paper size
  const [orientation, setOrientation] = useState<'Landscape' | 'Portrait'>('Landscape');
  const [paperSize, setPaperSize] = useState<string>('16/9');
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const [aspectWidth, setAspectWidth] = useState('100%');
  const [aspectHeight, setAspectHeight] = useState('56.25%');

  // Define paper size options based on orientation
  // const paperSizeOptions = {
  //   Landscape: [
  //     { width: '100%', height: '98.44%', label: 'Landscape Standard (16:9)', value: '16:9' },
  //     { width: '25%', height: '28.125%', label: 'Classic Landscape (4:3)', value: '4:3' },
  //     { width: '18.75%', height: '12.5%', label: '3:2', value: '3:2' },
  //     { width: '25%', height: '37.5%', label: 'Photo Standard (4:6)', value: '4:6' },
  //     { width: '15%', height: '15%', label: 'Square Variant (2.4:2.4)', value: '2.4:2.4' },
  //     { width: '6.875%', height: '6.875%', label: 'Perfect Square (1.1:1.1)', value: '1.1:1.1' }
  //   ],
  //   Portrait: [
  //     { width: '56.25%', height: '100%', label: 'Portrait Standard (9:16)', value: '9:16' },
  //     { width: '18.75%', height: '25%', label: 'Classic Portrait (3:4)', value: '3:4' },
  //     { width: '12.5%', height: '18.75%', label: '2:3', value: '2:3' },
  //     { width: '6.25%', height: '9.375%', label: 'Square Portrait (2.4:2.4)', value: '2.4:2.4' },
  //     { width: '51.875%', height: '73.125%', label: 'Tall Cards (1:1.5)', value: '1:1.5' }
  //   ]
  // };

  const paperSizeOptions = {
    Landscape: [
      { 
        width: 1000, 
        height: 562, 
        label: 'Landscape Standard (16:9)', 
        value: '16:9',
        aspectRatio: 16/9,
        recommendedSize: { width: 1600, height: 900 }
      },
      { 
        width: 750, 
        height: 562, 
        label: 'Classic Landscape (4:3)', 
        value: '4:3',
        aspectRatio: 4/3,
        recommendedSize: { width: 1200, height: 900 }
      },
      { 
        width: 750, 
        height: 500, 
        label: '3:2 Landscape', 
        value: '3:2',
        aspectRatio: 3/2,
        recommendedSize: { width: 1200, height: 800 }
      },
      { 
        width: 375, 
        height: 562, 
        label: 'Photo Standard (4:6)', 
        value: '4:6',
        aspectRatio: 4/6,
        recommendedSize: { width: 600, height: 900 }
      },
      { 
        width: 500, 
        height: 500, 
        label: 'Square Variant (1:1)', 
        value: '1:1',
        aspectRatio: 1,
        recommendedSize: { width: 800, height: 800 }
      }
    ],
    Portrait: [
      { 
        width: 562, 
        height: 1000, 
        label: 'Portrait Standard (9:16)', 
        value: '9:16',
        aspectRatio: 9/16,
        recommendedSize: { width: 900, height: 1600 }
      },
      { 
        width: 562, 
        height: 750, 
        label: 'Classic Portrait (3:4)', 
        value: '3:4',
        aspectRatio: 3/4,
        recommendedSize: { width: 900, height: 1200 }
      },
      { 
        width: 375, 
        height: 562, 
        label: 'Business Card (2:3)', 
        value: '2:3',
        aspectRatio: 2/3,
        recommendedSize: { width: 600, height: 900 }
      },
      { 
        width: 500, 
        height: 500, 
        label: 'Square Portrait (1:1)', 
        value: '1:1',
        aspectRatio: 1,
        recommendedSize: { width: 800, height: 800 }
      }
    ]
  };

  const findPaperSizeOption = (orient: 'Landscape' | 'Portrait', ratio: string) => {
    return paperSizeOptions[orient].find(option => option.value === ratio);
  };

  useEffect(() => {
    const selectedOption = findPaperSizeOption(orientation, paperSize);
    if (selectedOption) {
      setAspectRatio(selectedOption.value);
      setAspectWidth(selectedOption.width);
      setAspectHeight(selectedOption.height);
    }
  }, [orientation, paperSize]);

  const URLInputModal = ({
    isOpen,
    onClose,
    type,
    onSubmit
  }: {
    isOpen: boolean;
    onClose: () => void;
    type: 'image' | 'qr';
    onSubmit: (url: string) => void;
  }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(url)) {
        setError('Please enter a valid URL');
        return;
      }
      setError('');
      onSubmit(url);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">
            {type === 'image' ? 'Add Image URL' : 'Generate QR Code'}
          </h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={type === 'image' ? 'Enter image URL' : 'Enter URL to encode'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [urlModalType, setUrlModalType] = useState<'image' | 'qr' | null>(null);

  const handleAddElementWithURL = (url: string) => {
    switch (urlModalType) {
      case 'image':
        addElement(url, 'image');
        break;
      case 'qr':
        addElement(url, 'qr');
        break;
    }
    setUrlModalType(null);
  };

  useEffect(() => {
    if (!eventId) return;

    setIsLoading(true);
    const fetchFormFields = async () => {
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index');
      if (error) {
        console.error('Error fetching form fields:', error);
        setIsLoading(false)
        return;
      }
      setIsLoading(false)
      setFormFields(data || []);
    };
    fetchFormFields();
  }, [eventId]);

  const addElement = (content: BadgeElement['content'], type: BadgeElement['type'], isCustom: boolean = true) => {
    const newElement: BadgeElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      x: 50,
      y: 50,
      width: type === 'qr' ? 100 : (type === 'image' ? 200 : 200),
      height: type === 'qr' ? 100 : (type === 'image' ? 150 : 50),
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      isCustom
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
    setElements(prevElements =>
      prevElements.map(el =>
        el.id === id
          ? { ...el, ...updates }
          : el
      )
    );

    setSelectedElement(prevSelected =>
      prevSelected?.id === id
        ? { ...prevSelected, ...updates }
        : prevSelected
    );
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const generateBadgePDF = async () => {
    alert('Badge PDF generation would be implemented here');
  };

  if (isLoading) {
    return <div id="loading">Loading&#8230;</div>;
  }

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
          <button
            onClick={generateBadgePDF}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Badge
          </button>
        </div>
      </div>

      <div className="col-span-9 p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6">

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Page Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => {
                    const newOrientation = e.target.value as 'Landscape' | 'Portrait';
                    setOrientation(newOrientation);
                    const firstOptionValue = paperSizeOptions[newOrientation][0].value;
                    setPaperSize(firstOptionValue);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                >
                  <option value="Landscape">Landscape</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Paper Size</label>
                <select
                  value={paperSize}
                  onChange={(e) => {
                    const newPaperSize = e.target.value;
                    setPaperSize(newPaperSize);

                    // Find and set the corresponding width and height
                    const selectedOption = findPaperSizeOption(orientation, newPaperSize);
                    if (selectedOption) {
                      setAspectWidth(selectedOption.width);
                      setAspectHeight(selectedOption.height);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                >
                  {paperSizeOptions[orientation].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedElement && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-800">Element Properties</h3>
                    {(selectedElement && ["email", "image", "number", "qr", "date", "select", "text"].includes(selectedElement.type)) && (

                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Content"
                          value={selectedElement.content}
                          onChange={(e) =>
                            selectedElement.isCustom
                              ? updateElement(selectedElement.id, { content: e.target.value })
                              : null
                          }
                          disabled={!selectedElement.isCustom}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out outline-none
                    ${!selectedElement.isCustom ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600">Font Size</label>
                            <input
                              type="number"
                              placeholder="Font Size"
                              value={selectedElement.fontSize}
                              onChange={(e) =>
                                updateElement(selectedElement.id, { fontSize: Number(e.target.value) })
                              }
                              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out outline-none"
                            />
                          </div>
                          <div className="relative">
                            <label className="block text-xs text-gray-600">Color</label>
                            <input
                              type="color"
                              value={selectedElement.color}
                              onChange={(e) =>
                                updateElement(selectedElement.id, { color: e.target.value })
                              }
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="mt-2 w-full h-10 border border-gray-300 rounded-md shadow-sm"
                              style={{ backgroundColor: selectedElement.color }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-800">Size and Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs text-gray-600">Width</label>
                        <input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { width: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out outline-none"
                          placeholder="Width"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs text-gray-600">Height</label>
                        <input
                          type="number"
                          value={selectedElement.height}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { height: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out outline-none"
                          placeholder="Height"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeElement(selectedElement.id)}
                      className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Remove Element
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Elements</h3>
          </div>
          <div className="p-4 space-y-4">
            <button
              onClick={() => addElement('Demo text', 'text')}
              className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Add Text
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUrlModalType('qr')}
                className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
              >
                <QrCodeIcon className="mr-2 h-5 w-5" />
                Add QR Code
              </button>
              <button
                onClick={() => setUrlModalType('image')}
                className="w-full flex items-center justify-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Add Image
              </button>
            </div>

            <URLInputModal
              isOpen={urlModalType !== null}
              onClose={() => setUrlModalType(null)}
              type={urlModalType || 'image'}
              onSubmit={handleAddElementWithURL}
            />

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Available Fields</h4>
              <div className="space-y-2">
                {formFields.map((field) => (
                  <div
                    key={field.id}
                    className="text-sm text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => addElement(field.label, field.field_type, false)}
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-9'>
          <div
            id="badge-container"
            className="bg-white rounded-lg shadow p-4"
            style={{
              width: aspectWidth,
              height: aspectHeight,
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
                {element.type === 'qr' ? (
                  <QRCode
                    value={element.content}
                    size={Math.min(element.width, element.height)}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : element.type === 'image' ? (
                  <img
                    src={element.content}
                    alt="Badge Element"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  element.content
                )}
              </div>
            ))}
          </div>
        </div>
      </div> */}

        {/* Main content grid - use responsive grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    {/* Elements Sidebar - full width on mobile, 1/4 on larger screens */}
    <div className="lg:col-span-3 bg-white rounded-lg shadow order-2 lg:order-1">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Elements</h3>
      </div>
      <div className="p-4">
        <button
          onClick={() => addElement('Demo text', 'text')}
          className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Text
        </button>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => setUrlModalType('qr')}
            className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
          >
            <QrCodeIcon className="mr-2 h-5 w-5" />
            Add QR
          </button>
          <button
            onClick={() => setUrlModalType('image')}
            className="w-full flex items-center justify-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors"
          >
            <ImageIcon className="mr-2 h-5 w-5" />
            Add Image
          </button>
        </div>

        <URLInputModal
          isOpen={urlModalType !== null}
          onClose={() => setUrlModalType(null)}
          type={urlModalType || 'image'}
          onSubmit={handleAddElementWithURL}
        />

        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Available Fields</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {formFields.map((field) => (
              <div
                key={field.id}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => addElement(field.label, field.field_type, false)}
              >
                {field.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Badge Container - full width on mobile, 3/4 on larger screens */}
    <div className='lg:col-span-9 order-1 lg:order-2'>
      <div
        id="badge-container"
        className="bg-white rounded-lg shadow p-4 aspect-video"
        style={{
          width: aspectWidth,
          height: aspectHeight,
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
            {element.type === 'qr' ? (
              <QRCode
                value={element.content}
                size={Math.min(element.width, element.height)}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : element.type === 'image' ? (
              <img
                src={element.content}
                alt="Badge Element"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              element.content
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
    </div>
  );
}

export default BadgeDesigner;