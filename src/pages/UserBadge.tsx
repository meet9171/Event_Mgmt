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
import React, { useState, useEffect, useRef } from 'react';

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

export const UserBadge: React.FC<UserBadgeProps> = ({
  userData

}) => {
  const [badgeTemplate, setBadgeTemplate] = useState<BadgeTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1
  });

  
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Validate userData before processing
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
      if (badgeContainerRef.current) {
        const containerElement = badgeContainerRef.current;
        const parentContainer = containerElement.parentElement;

        if (!parentContainer) return;

        const availableWidth = parentContainer.clientWidth;

        const MIN_WIDTH = 300;
        const MAX_WIDTH = Math.min(1200, availableWidth * 0.9); // 90% of parent width or 1200px

        const aspectWidth = badgeTemplate?.aspectWidth;
        const aspectHeight = badgeTemplate?.aspectHeight;

        const clampedWidth = Math.max(MIN_WIDTH, Math.min(availableWidth, MAX_WIDTH));

        const scaleFactor = clampedWidth / aspectWidth;
        const scaledHeight = (aspectHeight * scaleFactor);

        setContainerDimensions({
          width: clampedWidth,
          height: scaledHeight,
          scale: scaleFactor
        });

        console.log("containerDimensions",containerDimensions);

      }
    };

    calculateResponsiveDimensions();

    window.addEventListener('resize', calculateResponsiveDimensions);

    return () => window.removeEventListener('resize', calculateResponsiveDimensions);
  }, [badgeTemplate?.aspectWidth, badgeTemplate?.aspectHeight]);


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

  console.log("userdata", userData);

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

  if (!badgeTemplate) {
    <div className="loading-container text-center p-4">
      <p>Loading badge...</p>
      <div className="animate-spin">🔄</div>
    </div>
  }

  // Render dynamic badge based on template
  return (
    <div className='p-6'>
      <div
        // className="badge-container relative bg-red-300"
        className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden"
        ref={badgeContainerRef}

        // style={{
        //   width: `${badgeTemplate.aspectWidth}px`,
        //   height: `${badgeTemplate.aspectHeight}px`,
        //   position: 'relative',
        //   margin: 'auto',
        //   overflow: 'hidden'
        // }}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          // style={{
          //   width: `${badgeTemplate.aspectWidth}px`,
          //   height: `${badgeTemplate.aspectHeight}px`,
          //   position: 'relative',
          //   backgroundColor: 'white',
          // }}
          style={{
            //      position: 'absolute',
            // left: '50%',
            // top: '50%',
            // transform: 'translate(-50%, -50%)',
            width: containerDimensions.width,
            height: containerDimensions.height,
            position: 'relative',
            // transform: `scale(1)`,
            transformOrigin: 'top center',
            backgroundColor: 'white',
          }}
        >

          {badgeTemplate?.elements.map((element) => {

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
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        // transform: `translate(${element.x}px, ${element.y}px)`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
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
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  color: element.color,
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                {displayValue}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};