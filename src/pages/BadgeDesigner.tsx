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
  isCustom: boolean; // New flag to distinguish custom vs predefined fields
}

function BadgeDesigner() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BadgeTemplate | null>(null);
  const [elements, setElements] = useState<BadgeElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<BadgeElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Add new state for orientation and paper size
  const [orientation, setOrientation] = useState<'Landscape' | 'Portrait'>('Landscape');
  const [paperSize, setPaperSize] = useState<string>('16/9');
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const [aspectWidth, setAspectWidth] = useState('100%');
  const [aspectHeight, setAspectHeight] = useState('56.25%');

   // Define paper size options based on orientation
   const paperSizeOptions = {
    Landscape: [
      { width: '100%', height: '98.44%', label: 'Landscape Standard (16:9)', value: '16:9' },
      { width: '25%', height: '28.125%', label: 'Classic Landscape (4:3)', value: '4:3' },
      { width: '18.75%', height: '12.5%', label: '3:2', value: '3:2' },
      { width: '25%', height: '37.5%', label: 'Photo Standard (4:6)', value: '4:6' },
      { width: '15%', height: '15%', label: 'Square Variant (2.4:2.4)', value: '2.4:2.4' },
      { width: '6.875%', height: '6.875%', label: 'Perfect Square (1.1:1.1)', value: '1.1:1.1' }
    ],
    Portrait: [
      { width: '56.25%', height: '100%', label: 'Portrait Standard (9:16)', value: '9:16' },
      { width: '18.75%', height: '25%', label: 'Classic Portrait (3:4)', value: '3:4' },
      { width: '12.5%', height: '18.75%', label: '2:3', value: '2:3' },
      { width: '6.25%', height: '9.375%', label: 'Square Portrait (2.4:2.4)', value: '2.4:2.4' },
      { width: '51.875%', height: '73.125%', label: 'Tall Cards (1:1.5)', value: '1:1.5' }
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
      width: type === 'qr' ? 100 : 200,
      height: type === 'qr' ? 100 : 50,
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
    // In a real implementation, this would generate a PDF using a library like jsPDF
    // For now, we'll just show an alert
    alert('Badge PDF generation would be implemented here');
  };

  console.log("aspectRatio", aspectRatio);

  if(isLoading){
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
          <select
            value={orientation}
            // onChange={(e) => setOrientation(e.target.value as any)}
            onChange={(e) => {
              const newOrientation = e.target.value as 'Landscape' | 'Portrait';
              setOrientation(newOrientation);
              // Reset paper size to the first option of the new orientation
              const firstOptionValue = paperSizeOptions[newOrientation][0].value;
              setPaperSize(firstOptionValue);
            }}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Landscape">Landscape</option>
            <option value="Portrait">Portrait</option>
          </select>


          <select
            value={paperSize}
            // onChange={(e) => setPaperSize(e.target.value)}
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
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {paperSizeOptions[orientation].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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


      <div className="grid grid-cols-12 gap-4">
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
            <button
              onClick={() => addElement('Demo QR', 'qr')}
              className="w-full flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Add QR Code
            </button>
            <button
              onClick={() => addElement('Demi Image', 'image')}
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
                    onClick={() => addElement(field.label, field.field_type, false)}
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-9">
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
                {element.content}
              </div>
            ))}
          </div>
        </div>

      {/*  <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Properties</h3>
          </div>
          <div className="p-4">

            <div>
              <p>Page Orientation:</p>
              <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as any)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-red-500"
          >
            <option value="Landscape">Landscape</option>
            <option value="Portrait">Portrait</option>
          </select>
            </div>
         

         <div className='my-3'>
          <p>Paper Size:</p>
             <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md  bg-yellow-500"
          >
            {paperSizeOptions[orientation].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
         </div>

         
            {selectedElement && (
              <div className="space-y-4">
                {(selectedElement && ["email", "image", "number", "qr", "date", "select", "text"].includes(selectedElement.type)) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(e) =>
                          selectedElement.isCustom
                            ? updateElement(selectedElement.id, { content: e.target.value })
                            : null
                        }
                        disabled={!selectedElement.isCustom}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  ${!selectedElement.isCustom ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                      {!selectedElement.isCustom && (
                        <p className="text-xs text-gray-500 mt-1">
                          This field cannot be edited as it was added from available fields.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Font Size</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) =>
                          // selectedElement.isCustom
                             updateElement(selectedElement.id, { fontSize: Number(e.target.value) })
                            // : null
                        }
                        // disabled={!selectedElement.isCustom}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
                          `}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Color</label>
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) =>
                          // selectedElement.isCustom
                             updateElement(selectedElement.id, { color: e.target.value })
                            // : null
                        }
                        // disabled={!selectedElement.isCustom}
                        className={`mt-1 block w-full h-8 
                          `}
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
        //               onChange={(e) => 
        //                 // selectedElement.isCustom
        //                    updateElement(selectedElement.id, { width: Number(e.target.value) })
        //                   // : null
        //               }
        //               // disabled={!selectedElement.isCustom}
        //               className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
        //                 `}
        //               placeholder="Width"
        //             />
        //             <input
        //               type="number"
        //               value={selectedElement.height}
        //               onChange={(e) =>
        //                 // selectedElement.isCustom
        //                   updateElement(selectedElement.id, { height: Number(e.target.value) })
        //                   // : null
        //               }
        //               // disabled={!selectedElement.isCustom}
        //               className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
        //                 `}
        //               placeholder="Height"
        //             />
        //           </div>
        //         </div>

        //         <button
        //           onClick={() => removeElement(selectedElement.id)}
        //           disabled={!selectedElement.isCustom}
        //           className={`w-full mt-4 px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md 
        //             ${selectedElement.isCustom
        //               ? 'text-red-700 bg-white hover:bg-red-50'
        //               : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
        //         >
        //           {selectedElement.isCustom ? 'Remove Element' : 'Cannot Remove'}
        //         </button>
        //       </div>
        //     )}
        //   </div>
        // </div>*/}
      </div>
    </div>
  );
}

export default BadgeDesigner;