// import React from 'react';

// interface UserBadgeProps {
//   userData: UserBadgeData;
// }

// export const UserBadge: React.FC<UserBadgeProps> = ({ userData }) => {
//     console.log(userData.DATA);

//   return (
//     <div className="badge-container bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
//       <h2 className="text-3xl font-bold mb-4 text-center">Event Badge</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <strong>data:</strong>
//           {/* <p>{userData.DATA}</p> */}
//         </div>
//         <div>
//           <strong>Email:</strong>
//           <p>{userData.EMAIL}</p>
//         </div>
//         {userData.AGE && (
//           <div>
//             <strong>Age:</strong>
//             <p>{userData.AGE}</p>
//           </div>
//         )}
//         {/* Add more fields as needed */}
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateElementPosition, prepareCanvasElements  } from '../utils/badgeUtils';

import {
  supabase, UserBadgeData,
  BadgeTemplate,
  BadgeTemplateElement,
  querySupabase
} from '../supabaseClient';

// // Define interfaces to match your badge template structure
// interface BadgeTemplateElement {
//     x: number;
//     y: number;
//     id: string;
//     type: 'text' | 'email' | 'number' | 'select' | 'image';
//     color: string;
//     width: number;
//     height: number;
//     content: string;
//     fontSize: number;
//     isCustom: boolean;
//     fontFamily: string;
// }

// interface BadgeTemplate {
//     id: number;
//     event_id: string;
//     name: string;
//     aspectHeight: number;
//     aspectWidth: number;
//     aspectRatio: number;
//     orientation: string;
//     paperSize: string;
//     elements: BadgeTemplateElement[];
// }

interface UserBadgeProps {
  userData: UserBadgeData;
}

interface CanvasElement extends BadgeTemplateElement {
  imageObj?: HTMLImageElement;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  userData

}) => {
  const [badgeTemplate, setBadgeTemplate] = useState<BadgeTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1
  });

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1
  });

  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // const renderCanvasBadge = useCallback((elements: CanvasElement[]) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext('2d');
  
  //   if (!canvas || !ctx || !badgeTemplate) return;
  
  //   // Clear and set background
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.fillStyle = 'white';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  //   const renderConfig = {
  //     containerWidth: canvas.width,
  //     containerHeight: canvas.height,
  //     templateWidth: badgeTemplate.aspectWidth,
  //     templateHeight: badgeTemplate.aspectHeight
  //   };
  
  //   elements.forEach(element => {
  //     ctx.save();
  
  //     const { x, y, width, height, fontSize } = calculateElementPosition(
  //       element, 
  //       renderConfig
  //     );
  
  //     if (element.type === 'image' && element.imageObj) {
  //       if (element.imageObj.complete) {
  //         ctx.drawImage(element.imageObj, x, y, width, height);
  //       } else {
  //         element.imageObj.onload = () => {
  //           ctx.drawImage(element.imageObj!, x, y, width, height);
  //         };
  //       }
  //     } else if (element.type !== 'image') {
  //       ctx.font = `${fontSize}px ${element.fontFamily || 'Arial'}`;
  //       ctx.fillStyle = element.color || '#000000';
  //       ctx.textAlign = 'center';
  //       ctx.textBaseline = 'middle';
        
  //       ctx.fillText(
  //         element.content, 
  //         x + width / 2, 
  //         y + height / 2
  //       );
  //     }
  
  //     ctx.restore();
  //   });
  // }, [badgeTemplate]);


  const renderCanvasBadge = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
  
    if (!canvas || !ctx || !badgeTemplate) return;
  
    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    const renderConfig = {
      containerWidth: canvas.width,
      containerHeight: canvas.height,
      templateWidth: badgeTemplate.aspectWidth,
      templateHeight: badgeTemplate.aspectHeight
    };
  
    // Prepare elements
    const elements = prepareCanvasElements(badgeTemplate, userData);
  
    elements.forEach(element => {
      ctx.save();
  
      const { x, y, width, height, fontSize } = calculateElementPosition(
        element, 
        renderConfig
      );
  
      if (element.type === 'image' && element.imageObj) {
        if (element.imageObj.complete) {
          ctx.drawImage(element.imageObj, x, y, width, height);
        } else {
          element.imageObj.onload = () => {
            ctx.drawImage(element.imageObj!, x, y, width, height);
          };
        }
      } else if (element.type !== 'image') {
        ctx.font = `${fontSize}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.color || '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(
          element.content, 
          x + width / 2, 
          y + height / 2
        );
      }
  
      ctx.restore();
    });
  }, [badgeTemplate, userData]);

  useEffect(() => {
    // Comprehensive validation of userData
    if (!userData) {
      setError('No user data provided');
      return;
    }

    if (!userData.DATA) {
      setError('Invalid user data structure');
      return;
    }

    if (!Array.isArray(userData.DATA.otherField) || userData.DATA.otherField.length === 0) {
      setError('No additional user fields found');
      return;
    }

    // Safe access to registration_id
    const registrationId = userData.DATA.otherField[0]?.registration_id;
    if (!registrationId) {
      setError('No registration ID found in user data');
      return;
    }

    // Set event ID safely
    setEventId(registrationId);
  }, [userData]);

  // Responsive badge container calculation
  useEffect(() => {
    const calculateResponsiveDimensions = () => {
      if (badgeContainerRef.current && badgeTemplate) {
        const containerElement = badgeContainerRef.current;
        const parentContainer = containerElement.parentElement;

        if (!parentContainer) return;


        const availableWidth = parentContainer.clientWidth;
        const availableHeight = parentContainer.clientHeight;

        // const availableWidth = parentContainer.clientWidth;
        console.log("availableWidth", availableWidth);
        if (!badgeTemplate) {
          <div className="loading-container text-center p-4">
            <p>Loading badge...</p>
            <div className="animate-spin">🔄</div>
          </div>
        }
        const MIN_WIDTH = 300;
        const MAX_WIDTH = Math.min(930, availableWidth); // 90% of parent width or 1200px


        const clampedWidth = Math.max(MIN_WIDTH, Math.min(availableWidth, MAX_WIDTH));

        const scaleFactor = clampedWidth / badgeTemplate.aspectWidth;
        const scaledHeight = (badgeTemplate.aspectHeight * scaleFactor);

        setContainerDimensions({
          width: clampedWidth,
          height: scaledHeight,
          scale: scaleFactor
        });
        console.log("availableWidth", availableWidth);

        // // Calculate precise scaling
        // const scaleX = MAX_WIDTH / badgeTemplate.aspectWidth;
        // const scaleY = (availableHeight) / badgeTemplate.aspectHeight;

        // // Use minimum scale to maintain aspect ratio
        // const scale = Math.min(scaleX, scaleY);

        // const clampedWidth = badgeTemplate.aspectWidth;
        // const clampedHeight = badgeTemplate.aspectHeight;

        // setContainerDimensions({
        //   width: clampedWidth,
        //   height: clampedHeight,
        //   scale: scale
        // });

        console.log("containerDimensions", containerDimensions);

      }
    };

    calculateResponsiveDimensions();

    window.addEventListener('resize', calculateResponsiveDimensions);

    return () => window.removeEventListener('resize', calculateResponsiveDimensions);
  }, [badgeTemplate]);


  // useEffect(() => {
  //     const fetchBadgeTemplate = async () => {
  //         // If no eventId is provided, try to get it from the last registration
  //         if (!eventId) {
  //             try {
  //                 const { data: registrationData, error: registrationError } = await supabase
  //                     .from('registrations')
  //                     .select('event_id')
  //                     .order('created_at', { ascending: false })
  //                     .limit(1)
  //                     .single();

  //                 if (registrationError) throw registrationError;

  //                 eventId = registrationData?.event_id;
  //             } catch (err) {
  //                 console.error('Error fetching event ID:', err);
  //                 setError('Could not determine event ID');
  //                 return;
  //             }
  //         }

  //         try {
  //             // Fetch badge template for the specific event
  //             const { data, error } = await supabase
  //                 .from('badge_templates')
  //                 .select('*')
  //                 .eq('event_id', eventId)
  //                 .single();

  //             if (error) throw error;

  //             if (data) {
  //                 setBadgeTemplate(data);
  //             } else {
  //                 setError('No badge template found for this event');
  //             }
  //         } catch (err) {
  //             console.error('Error fetching badge template:', err);
  //             setError('Failed to load badge template');
  //         }
  //     };

  //     fetchBadgeTemplate();
  // }, [eventId]);

  // console.log("eventID",eventId);

    // Prepare elements with resolved content
    const prepareCanvasElements = useCallback(() => {
      if (!badgeTemplate || !userData) return [];
  
      return badgeTemplate.elements.map(element => {
        const preparedElement: CanvasElement = { ...element };
  
        // Resolve display value
        switch (element.type) {
          case 'text':
          case 'number':
          case 'select':
            const formFieldResponse = userData.DATA.otherField.find(
              response => response.form_fields?.label?.toLowerCase() === element.content.toLowerCase()
            );
  
            if (element.content?.toLowerCase() === 'username') {
              preparedElement.content = userData?.DATA?.name ||
                formFieldResponse?.response_value ||
                element.content ||
                'N/A';
            } else {
              preparedElement.content = formFieldResponse
                ? formFieldResponse.response_value
                : (userData[element.content.toUpperCase()] as string) || element.content;
            }
            break;
  
          case 'email':
            preparedElement.content = userData['EMAIL'] as string || element.content;
            break;
  
          case 'image':
            const img = new Image();
            img.src = element.content;
            preparedElement.imageObj = img;
            break;
        }
  
        return preparedElement;
      });
    }, [badgeTemplate, userData]);
  
    // Render elements on canvas
    // const renderCanvasBadge = useCallback((elements: CanvasElement[]) => {
    //   const canvas = canvasRef.current;
    //   const ctx = canvas?.getContext('2d');
  
    //   if (!canvas || !ctx || !badgeTemplate) return;
  
    //   // Clear canvas
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    //   // Set background color
    //   ctx.fillStyle = 'white';
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    //   // Calculate scale
    //   const scaleX = canvas.width / badgeTemplate.aspectWidth;
    //   const scaleY = canvas.height / badgeTemplate.aspectHeight;
    //   const scale = Math.min(scaleX, scaleY);
    //   console.log("canvas width",canvas.width);
    //   console.log("canvas height",canvas.height);
    //   console.log("badgeTemplate.aspectWidth",badgeTemplate.aspectWidth);
    //   console.log("badgeTemplate.aspectHeight",badgeTemplate.aspectHeight);
    //   console.log("scale",scale);
     
    //   // Render each element
    //   elements.forEach(element => {
    //     ctx.save();
  
    //     // Position and scale
    //     const x = element.x * scale;
    //     const y = element.y * scale;
    //     const width = element.width * scale;
    //     const height = element.height * scale;
  
    //     if (element.type === 'image' && element.imageObj) {
    //       // Wait for image to load before drawing
    //       if (element.imageObj.complete) {
    //         ctx.drawImage(element.imageObj, x, y, width, height);
    //       } else {
    //         element.imageObj.onload = () => {
    //           ctx.drawImage(element.imageObj!, x, y, width, height);
    //         };
    //       }
    //     } else if (element.type !== 'image') {
    //       // Text rendering
    //       ctx.font = `${(element.fontSize || 16) * scale}px ${element.fontFamily || 'Arial'}`;
    //       ctx.fillStyle = element.color || '#000000';
    //       ctx.textAlign = 'center';
    //       ctx.textBaseline = 'middle';
          
    //       ctx.fillText(
    //         element.content, 
    //         x + width / 2, 
    //         y + height / 2
    //       );
    //     }
  
    //     ctx.restore();
    //   });
    // }, [badgeTemplate]);

  console.log("userdata", userData);

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;

      if (!canvas || !container || !badgeTemplate) return;

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;

      const scaleX = availableWidth / badgeTemplate.aspectWidth;
      const scaleY = availableHeight / badgeTemplate.aspectHeight;
      const scale = Math.min(scaleX, scaleY);

      const width = badgeTemplate.aspectWidth * scale;
      const height = badgeTemplate.aspectHeight * scale;

      canvas.width = width;
      canvas.height = height;

      console.log("availableWidth",availableWidth);
      console.log("availableHeight",availableHeight);
      console.log("scaleX",scaleX);
      console.log("scaleY",scaleY);
      console.log("scale",scale);
      console.log("width",width);
      console.log("height",height);
      renderCanvasBadge();


      // setCanvasDimensions({ width, height, scale });

      // // Render elements after sizing
      // const elements = prepareCanvasElements();
      // renderCanvasBadge(elements);
    };

    // Initial and resize handling
    // updateCanvasSize();
    // window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);

    // return () => window.removeEventListener('resize', updateCanvasSize);
  }, [badgeTemplate, renderCanvasBadge]);


  useEffect(() => {
    console.log("eventid setted");
    setEventId(userData.DATA.otherField[0].registration_id)
  }, [userData])

  useEffect(() => {
    const fetchBadgeTemplate = async () => {
      try {

        const registrationId = userData.DATA.otherField[0]?.registration_id;
        if (!registrationId) {
          setError('No registration ID found');
          return;
        }
        // Fetch the event ID for this registration
        const { data: registrationData, error: registrationError } = await supabase
          .from('registrations')
          .select('event_id')
          .eq('id', registrationId)
          .single();

        if (registrationError || !registrationData) {
          setError('Could not fetch event ID');
          console.error('Registration fetch error:', registrationError);
          return;
        }

        console.log("Fetched registrationData:", registrationData);
        const eventId = registrationData.event_id;
        if (!eventId) {
          setError('No event ID found for this registration');
          return;
        }
        console.log("Fetched Event ID:", eventId);

        const { data: badgeTemplates, error: badgeTemplateError } = await supabase
          .from('badge_templates')
          .select('*')
          .eq('event_id', eventId)
          .single();

        console.log("BadgeTemplates", badgeTemplates);

        if (badgeTemplateError) {
          setError('Could not fetch badge template');
          console.error('Badge template fetch error:', badgeTemplateError);
          return;
        }

        if (!badgeTemplates || !badgeTemplates.elements || badgeTemplates.elements.length === 0) {
          setError('Invalid or empty badge template');
          return;
        }

        setBadgeTemplate(badgeTemplates);
        console.log("saved state", badgeTemplate);


      } catch (error) {
        console.error('Error fetching badge template:', error);
        setError('An unexpected error occurred while fetching badge template');

        // setError('Failed to load badge template');
      }
    };
    if (eventId) {
      fetchBadgeTemplate();
    }

    // fetchBadgeTemplate();
  }, [eventId, userData]);

  if (error) {
    return (
      <div className="error-container text-red-500 p-4 text-center">
        <p>Error: {error}</p>
        <p>Please contact support or try again later.</p>
      </div>
    );
  }

  // Calculate relative positioning function
  const calculateRelativePosition = (
    element: BadgeTemplateElement,
    containerWidth: number,
    containerHeight: number,
    templateWidth: number,
    templateHeight: number
  ) => {
    // Calculate scaling factors
    const scaleX = containerWidth / templateWidth;
    const scaleY = containerHeight / templateHeight;

    const scale = Math.min(scaleX, scaleY);

    const offsetX = (containerWidth - (templateWidth * scale)) / 2;
    const offsetY = (containerHeight - (templateHeight * scale)) / 2;

    // Calculate precise positioning
    const relativeX = (element.x * scale) + offsetX;
    const relativeY = (element.y * scale) + offsetY;

    // Calculate scaled dimensions
    const relativeWidth = element.width * scale;
    const relativeHeight = element.height * scale;

    const relativeFontSize = (element.fontSize || 16) * scale;


    // // Calculate new positions and dimensions
    // const relativeX = element.x * scaleX;
    // const relativeY = element.y * scaleY;
    // const relativeWidth = element.width * scaleX;
    // const relativeHeight = element.height * scaleY;

    // // Ensure element stays within container bounds
    // const boundedX = Math.max(0, Math.min(relativeX, containerWidth - relativeWidth));
    // const boundedY = Math.max(0, Math.min(relativeY, containerHeight - relativeHeight));

    return {
      x: relativeX,
      y: relativeY,
      width: relativeWidth,
      height: relativeHeight,
      fontSize: relativeFontSize,
      scale: scale
    };
  };

  // Add print functionality
  const handlePrintBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '', 'width=800,height=1100');
    if (!printWindow) return;
    // Create a new window for printing
    // const printWindow = window.open('', '', 'width=800,height=1100');

    // if (!printWindow || !badgeContainerRef.current) return;

    // // Clone the badge container
    // const badgeContent = badgeContainerRef.current.cloneNode(true) as HTMLDivElement;

    // Prepare print styles
    const printStyles = `
    <style>
      @media print {
      //  html, body {
      //     width: 100%;
      //     height: 100%;
      //     margin: 0;
      //     padding: 0;
      //     overflow: hidden;
      //   }
        body * {
          visibility: hidden;
        }
        // #printable-badge, 
        // #printable-badge * {
        //   visibility: visible;
        // }
        // #printable-badge-container {
        //   position: absolute;
        //   left: 0;
        //   top: 0;
        //   width: 100%;
        //   height: 100%;
        //   display: flex;
        //   justify-content: center;
        //   align-items: center;
        //   padding: 20mm;
        //   box-sizing: border-box;
        // }
        // #printable-badge {
        //   width: 100%;
        //   max-width: 210mm; /* A4 width */
        //   max-height: 297mm; /* A4 height */
        //   aspect-ratio: 1 / 1.414; /* Standard aspect ratio */
        //   object-fit: contain;
        //   margin: 0 auto;
        // }
         #printable-badge { 
            visibility: visible; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: 100%; 
          }
         @page {
          // size: A4;
          margin: 0;
        }
      }
    </style>
  `;

    // // Wrap badge content in a container
    // const printContainer = printWindow.document.createElement('div');
    // printContainer.id = 'printable-badge-container';


    // // Set ID for print targeting
    // badgeContent.id = 'printable-badge';
    // printContainer.appendChild(badgeContent);

    // Construct print content
    printWindow.document.write('<html><head><title>Print Badge</title>');
    printWindow.document.write(printStyles);
    printWindow.document.write('</head><body>');
    // printWindow.document.body.appendChild(printContainer);
    printWindow.document.write(`<canvas id="printable-badge" width="${canvas.width}" height="${canvas.height}"></canvas>`);

    printWindow.document.write('</body></html>');

       // Copy canvas content
       const printCanvas = printWindow.document.getElementById('printable-badge') as HTMLCanvasElement;
       const printCtx = printCanvas.getContext('2d');
       
       if (printCtx) {
         printCtx.drawImage(canvas, 0, 0);
       }

    printWindow.document.close();

    // Trigger print
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  // Render dynamic badge based on template
  return (
    <div className='p-6 relative'>

      {/* Print Button */}
      <div className="absolute top-50 right-2 z-10">
        <button
          onClick={handlePrintBadge}
          className="
          bg-blue-500 
          hover:bg-blue-600 
          text-white 
          font-bold 
          py-2 
          px-4 
          rounded 
          flex 
          items-center 
          space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          Print Badge
        </button>
      </div>

      <div
        // className="badge-container relative bg-red-300"
        className="w-[235px] h-[378px] bg-red-500 rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center"
        // ref={badgeContainerRef}

        // style={{
        //   width: `${badgeTemplate.aspectWidth}px`,
        //   height: `${badgeTemplate.aspectHeight}px`,
        //   position: 'relative',
        //   margin: 'auto',
        //   overflow: 'hidden'
        // }}
        style={{
          width:  `235px`,
          height:  `378px`,
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center'
        }}
      >

        <canvas
          ref={canvasRef}
          style={{
            width: '235px',
            height: '378px',
            backgroundColor: 'white'
          }}
        />



        {/* <div
          // style={{
          //   width: `${badgeTemplate.aspectWidth}px`,
          //   height: `${badgeTemplate.aspectHeight}px`,
          //   position: 'relative',
          //   backgroundColor: 'white',
          // }}
          style={{
            //  position: 'absolute',
            // left: '50%',
            // top: '50%',
            // transform: 'translate(-50%, -50%)',
            width: containerDimensions.width,
            height: containerDimensions.height,
            position: 'relative',
            // transform: `scale(${containerDimensions.scale})`,
            // transformOrigin: 'top center',
            backgroundColor: 'white',
          }}
        > */}
        {/* 
          {badgeTemplate?.elements.map((element) => {
            // Calculate relative positioning
            const { x, y, width, height, fontSize, scale } = calculateRelativePosition(
              element,
              containerDimensions.width,
              containerDimensions.height,
              badgeTemplate.aspectWidth,
              badgeTemplate.aspectHeight
            );

            if (!element || !element.type) {
              console.warn('Invalid badge element:', element);
              return null;
            }
            // Handle different element types
            let displayValue = 'N/A';

            const formFieldResponse = userData.DATA.otherField.find(
              response => response.form_fields?.label?.toLowerCase() === element.content.toLowerCase()
            );
            try {
              switch (element.type) {
                case 'text':
                case 'number':
                case 'select':
                  // if (element.content.toLowerCase() === 'username') {
                  //   displayValue = userData['DATA'].name ||
                  //     formFieldResponse?.response_value ||
                  //     element.content;
                  if (element.content?.toLowerCase() === 'username') {
                    displayValue = userData?.DATA?.name ||
                      formFieldResponse?.response_value ||
                      element.content ||
                      'N/A';
                  } else {
                    displayValue = formFieldResponse
                      ? formFieldResponse.response_value
                      : (userData[element.content.toUpperCase()] as string) || element.content;
                  }
                  break;
                case 'email':
                  displayValue = userData['EMAIL'] as string || element.content;
                  break;
                case 'image':
                  return element.content ? (
                    <img
                      key={element.id}
                      src={element.content}
                      alt="Badge Background"
                      // style={{
                      //   position: 'absolute',
                      //   left: `${element.x}px`,
                      //   top: `${element.y}px`,
                      //   width: `${element.width}px`,
                      //   height: `${element.height}px`,
                      //   objectFit: 'cover'
                      // }}
                      style={{
                        position: 'absolute',
                        left: `${x}px`,
                        top: `${y}px`,
                        // transform: `translate(${element.x}px, ${element.y}px)`,
                        width: `${width}px`,
                        height: `${height}px`,
                        objectFit: 'cover',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                    />
                  ) : null;

              }
            } catch (err) {
              console.error('Error processing badge element:', err);
              displayValue = 'Error';
            }

            return (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  // color: element.color,
                  // fontSize: `${fontSize}px`,
                  // fontFamily: element.fontFamily,
                  // display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  // textAlign: 'center',
                  // overflow: 'hidden', // Prevent content from spilling
                  // wordBreak: 'break-word' // Ensure long text breaks
                  color: element.color,
                  fontSize: `${fontSize}px`,
                  fontFamily: element.fontFamily,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  border: '1px solid red' // Optional: helps with debugging
                }}
              >
                {displayValue}
              </div>
            );
          })} */}

        {/* Error Handling */}
        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}
        {/* </div> */}




      </div>
    </div>
  );
};