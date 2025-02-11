import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, QrCodeIcon, ImageIcon, ListIcon, TextIcon, PlusCircleIcon } from 'lucide-react';
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
  const [paperSize, setPaperSize] = useState<string>('16:9');
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const [aspectWidth, setAspectWidth] = useState(1000);
  const [aspectHeight, setAspectHeight] = useState(562);

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
        aspectRatio: 16 / 9,
        recommendedSize: { width: 1600, height: 900 }
      },
      {
        width: 750,
        height: 562,
        label: 'Classic Landscape (4:3)',
        value: '4:3',
        aspectRatio: 4 / 3,
        recommendedSize: { width: 1200, height: 900 }
      },
      {
        width: 750,
        height: 500,
        label: '3:2 Landscape',
        value: '3:2',
        aspectRatio: 3 / 2,
        recommendedSize: { width: 1200, height: 800 }
      },
      {
        width: 375,
        height: 562,
        label: 'Photo Standard (4:6)',
        value: '4:6',
        aspectRatio: 4 / 6,
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
        height: 850,
        label: 'Portrait Standard (9:16)',
        value: '9:16',
        aspectRatio: 9 / 16,
        recommendedSize: { width: 900, height: 1600 }
      },
      {
        width: 562,
        height: 700,
        label: 'Classic Portrait (3:4)',
        value: '3:4',
        aspectRatio: 3 / 4,
        recommendedSize: { width: 900, height: 1200 }
      },
      {
        width: 375,
        height: 562,
        label: 'Business Card (2:3)',
        value: '2:3',
        aspectRatio: 2 / 3,
        recommendedSize: { width: 600, height: 900 }
      },
      {
        width: 400,
        height: 400,
        label: 'Square Portrait (1:1)',
        value: '1:1',
        aspectRatio: 1,
        recommendedSize: { width: 800, height: 800 }
      }
    ]
  };

  // Responsive badge container state
  // const [containerDimensions, setContainerDimensions] = useState({
  //   width: 0,
  //   height: 0,
  //   scale: 1
  // });
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Advanced responsive scaling effect
  // useEffect(() => {
  //   const calculateResponsiveDimensions = () => {
  //     if (badgeContainerRef.current) {
  //       const containerElement = badgeContainerRef.current;
  //       console.log("containerElement",containerElement);
        
  //       // const containerWidth = containerElement.clientWidth;

  //       const parentContainer = containerElement.parentElement;
        
  //       if (!parentContainer) return;

  //       const availableWidth = parentContainer.clientWidth;
  //       console.log("availableWidth",availableWidth);

  //       const MIN_WIDTH = 300; 
  //       // const MAX_WIDTH = Math.min(1200, availableWidth * 0.9); // 90% of parent width or 1200px
  //       const MAX_WIDTH = Math.min(1200, availableWidth); // 90% of parent width or 1200px
  //       console.log("MAX_WIDTH",MAX_WIDTH);

  //       const clampedWidth = Math.max(MIN_WIDTH, availableWidth);
  //       console.log("clampedWidth",clampedWidth);

  //       const scaleFactor = clampedWidth / aspectWidth;
  //       console.log("scaleFactor",scaleFactor);
  //       console.log("clampedWidth",clampedWidth);
  //       console.log("aspectWidth",aspectWidth);

  //       const scaledHeight = (aspectHeight * scaleFactor);
  //       console.log("scaledHeight",scaledHeight);

  //       setContainerDimensions({
  //         width: clampedWidth,
  //         height: aspectHeight,
  //         scale: scaleFactor
  //       });
  //     }
  //   };

  //   calculateResponsiveDimensions();

  //   window.addEventListener('resize', calculateResponsiveDimensions);

  //   return () => window.removeEventListener('resize', calculateResponsiveDimensions);
  // }, [aspectWidth, aspectHeight]);

  const findPaperSizeOption = (orient: 'Landscape' | 'Portrait', ratio: string) => {
    return paperSizeOptions[orient].find(option => option.value === ratio);
  };

  // useEffect(() => {
  //   const selectedOption = findPaperSizeOption(orientation, paperSize);
  //   if (selectedOption) {
  //     setAspectRatio(selectedOption.value);
  //     setAspectWidth(selectedOption.width);
  //     setAspectHeight(selectedOption.height);
  //   }
  // }, [orientation, paperSize]);

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

    console.log('x:', x, 'y:', y);

    const updatedElements = elements.map(el =>
      el.id === selectedElement.id
        ? { ...el, x: Math.max(0, Math.min(x, rect.width - el.width)), y: Math.max(0, Math.min(y, rect.height - el.height)) }
        : el
    );

    console.log("updatedElements", updatedElements);
    
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

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('You must be logged in to save a badge template');
      return;
    }

    if (!eventId) {
      alert('No event ID found');
      return;
    }

    setIsLoading(true);
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('user_id')
        .eq('id', eventId)
        .single();

      if (eventError || !eventData) {
        throw new Error('Event not found');
      }

      if (eventData.user_id !== session.user.id) {
        throw new Error('You do not have permission to modify this event');
      }

      const { data: existingTemplate, error: fetchError } = await supabase
        .from('badge_templates')
        .select('*')
        .eq('event_id', eventId)
        .single();

      // Prepare the template data
      const templateData = {
        event_id: eventId,
        name: `Badge Template for Event ${eventId}`,
        aspectRatio: aspectRatio,
        elements: elements,
        orientation: orientation,
        paperSize: paperSize,
        aspectWidth: aspectWidth,
        aspectHeight: aspectHeight
      };

      if (existingTemplate) {
        const { error: updateError } = await supabase
          .from('badge_templates')
          .update(templateData)
          .eq('id', existingTemplate.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('badge_templates')
          .insert(templateData);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving badge template:', error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      } else {
        alert('Failed to save badge template');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div id="loading">Loading&#8230;</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={generateBadgePDF}
            disabled={isLoading}
            className="flex items-center px-6 py-3 bg-[#6B46C1] text-white rounded-lg hover:bg-[#5A3F9E] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            <Download className="h-5 w-5 mr-2" />
            {isLoading ? 'Saving...' : 'Save Badge Template'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-[#6B46C1] p-6">
            <h3 className="text-2xl font-bold text-white text-center">
              Badge Configuration
            </h3>
            <p className="text-sm text-purple-100 text-center mt-2">
              Customize your badge design and layout
            </p>
          </div>

          <div className="p-6 space-y-6">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
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

                  const selectedOption = findPaperSizeOption(orientation, newPaperSize);
                  if (selectedOption) {
                    setAspectWidth(selectedOption.width);
                    setAspectHeight(selectedOption.height);
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
              >
                {paperSizeOptions[orientation].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedElement && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Element Properties</h3>
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
                      className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out
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
                          className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
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
                          className="mt-2 w-full h-10 border border-gray-300 rounded-lg shadow-sm"
                          style={{ backgroundColor: selectedElement.color }}
                        />
                      </div>
                    </div>
                  </div>
                )}
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

              
            )}
          </div>
        </div>

        {/* Badge Design Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-[#6B46C1] p-6">
              <h3 className="text-2xl font-bold text-white text-center">
                Badge Design
              </h3>
              <p className="text-sm text-purple-100 text-center mt-2">
                Drag and customize your badge elements
              </p>
            </div>

            <div className="p-6">
              <div
                ref={badgeContainerRef}
                id="badge-container"
                className="w-[235px] h-[378px] bg-red-500 relative overflow-hidden mx-auto"
                // style={{
                //   maxWidth: '100%',
                //   height: 'auto',
                //   display: 'flex',
                //   justifyContent: 'center',
                //   alignItems: 'center'
                // }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* <div
                  style={{
                    width: '235px',
                    height: '151px',
                    position: 'relative',
                    // transform: `scale(${containerDimensions.scale})`,
                    // transformOrigin: 'top left',
                    backgroundColor: 'white',
                    // border: '1px solid #e5e7eb'
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                > */}
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
                        // alignItems: 'center',
                        // justifyContent: 'center',
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
                {/* </div> */}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-[#6B46C1] p-6">
              <h3 className="text-2xl font-bold text-white text-center">
                Add Elements
              </h3>
              <p className="text-sm text-purple-100 text-center mt-2">
                Choose elements to add to your badge
              </p>
            </div>

           <div className="p-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { 
                   label: 'Text', 
                   icon: TextIcon, 
                   onClick: () => addElement('Demo text', 'text'),
                   color: 'gray'
                 },
                 { 
                   label: 'QR Code', 
                   icon: QrCodeIcon, 
                   onClick: () => setUrlModalType('qr'),
                   color: 'blue'
                 },
                 { 
                   label: 'Image', 
                   icon: ImageIcon, 
                   onClick: () => setUrlModalType('image'),
                   color: 'green'
                 },
                 { 
                   label: 'More', 
                   icon: PlusCircleIcon, 
                   onClick: () => {/* Future expansion */},
                   color: 'purple'
                 }
               ].map(({ label, icon: Icon, onClick, color }) => (
                 <div key={label} className="group">
                   <button
                     onClick={onClick}
                     className={`
                       w-full flex flex-col items-center justify-center 
                       px-4 py-4 border border-${color}-300 
                       rounded-xl 
                       text-${color}-700 
                       hover:bg-${color}-50 
                       transition-all duration-300 
                       group-hover:shadow-md
                       group-hover:scale-105
                     `}
                   >
                     <Icon className={`
                       h-6 w-6 mb-2 
                       text-${color}-500 
                       group-hover:text-${color}-600 
                       transition-colors
                     `} />
                     <span className="text-sm font-medium group-hover:text-${color}-800">
                       {label}
                     </span>
                   </button>
                 </div>
               ))}
             </div>
           
             {/* Available Fields Section */}
             <div className="mt-8 bg-gray-50 rounded-xl p-4">
               <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                 <ListIcon className="h-5 w-5 mr-2 text-purple-500" />
                 Available Form Fields
               </h4>
               <div className="space-y-2 max-h-64 overflow-y-auto">
                 {formFields.length === 0 ? (
                   <div className="text-center text-gray-500 italic">
                     No form fields available
                   </div>
                 ) : (
                   formFields.map((field) => (
                     <div
                       key={field.id}
                       onClick={() => addElement(field.label, field.field_type, false)}
                       className="
                         flex items-center justify-between
                         text-sm text-gray-700 
                         p-3 bg-white 
                         rounded-lg 
                         shadow-sm 
                         cursor-pointer 
                         hover:bg-purple-50 
                         hover:shadow-md 
                         transition-all 
                         duration-300
                       "
                     >
                       <span>{field.label}</span>
                       <span className="
                         text-xs 
                         bg-purple-100 
                         text-purple-700 
                         px-2 py-1 
                         rounded-full
                       ">
                         {field.field_type}
                       </span>
                     </div>
                   ))
                 )}
               </div>
             </div>
           </div>
          </div>
        </div>
      </div>

      {/* URL Input Modal (Existing Implementation) */}
      <URLInputModal
        isOpen={urlModalType !== null}
        onClose={() => setUrlModalType(null)}
        type={urlModalType || 'image'}
        onSubmit={handleAddElementWithURL}
      />
    </div>
  );
}

export default BadgeDesigner;