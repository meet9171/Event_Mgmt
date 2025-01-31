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
import React, { useState, useEffect } from 'react';

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
    eventId?: string;
  }

export const UserBadge: React.FC<UserBadgeProps> = ({
    userData,
    eventId
}) => {
    const [badgeTemplate, setBadgeTemplate] = useState<BadgeTemplate | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    console.log(userData);
    
    // useEffect(() => {
    //     const fetchBadgeTemplate = async () => {
    //       // If no eventId is provided, try to get it from the last registration
    //       if (!eventId) {
    //         try {
    //           const registrationData = await querySupabase<{ event_id: string }[]>(
    //             'registrations', 
    //             'select', 
    //             {
    //               order: 'created_at',
    //               limit: 1
    //             }
    //           );
    
    //           eventId = registrationData[0]?.event_id;
    //         } catch (err) {
    //           console.error('Error fetching event ID:', err);
    //           setError('Could not determine event ID');
    //           return;
    //         }
    //       }
    
    //       try {
    //         const badgeTemplates = await querySupabase<BadgeTemplate[]>(
    //           'badge_templates', 
    //           'select', 
    //           { event_id: eventId }
    //         );
    
    //         const template = badgeTemplates[0];
    //         if (template) {
    //           setBadgeTemplate(template);
    //         } else {
    //           setError('No badge template found for this event');
    //         }
    //       } catch (err) {
    //         console.error('Error fetching badge template:', err);
    //         setError('Failed to load badge template');
    //       }
    //     };
    
    //     fetchBadgeTemplate();
    //   }, [eventId]);

    if (error) {
        return (
            <div className="error-container text-red-500 p-4">
                {error}
            </div>
        );
    }

    if (!badgeTemplate) {
        return <div>Loading badge...</div>;
    }

    // Render dynamic badge based on template
    return (
        <div
            className="badge-container relative"
            style={{
                width: `${badgeTemplate.aspectWidth}px`,
                height: `${badgeTemplate.aspectHeight}px`,
                position: 'relative',
                margin: 'auto',
                overflow: 'hidden'
            }}
        >

          <p>{userData.EMAIL}</p>
            {/* {badgeTemplate.elements.map((element) => {
                // Handle different element types
                let displayValue = 'N/A';
                switch (element.type) {
                    case 'text':
                        displayValue = userData[element.content.toUpperCase()] as string || element.content;
                        break;
                    case 'email':
                        displayValue = userData['EMAIL'] as string || element.content;
                        break;
                    case 'number':
                        displayValue = userData[element.content.toUpperCase()] as string || element.content;
                        break;
                    case 'select':
                        displayValue = userData[element.content.toUpperCase()] as string || element.content;
                        break;
                    case 'image':
                        return (
                            <img
                                key={element.id}
                                src={element.content}
                                alt="Badge Background"
                                style={{
                                    position: 'absolute',
                                    left: `${element.x}px`,
                                    top: `${element.y}px`,
                                    width: `${element.width}px`,
                                    height: `${element.height}px`,
                                    objectFit: 'cover'
                                }}
                            />
                        );
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
            })} */}


{badgeTemplate.elements.map((element) => {
        // Handle different element types
        let displayValue = 'N/A';
        switch (element.type) {
          case 'text':
          case 'number':
          case 'select':
            displayValue = userData[element.content.toUpperCase()] as string || element.content;
            break;
          case 'email':
            displayValue = userData['EMAIL'] as string || element.content;
            break;
          case 'image':
            return (
              <img
                key={element.id}
                src={element.content}
                alt="Badge Background"
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  objectFit: 'cover'
                }}
              />
            );
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
    );
};