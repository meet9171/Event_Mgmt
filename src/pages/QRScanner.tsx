// // import React, { useState } from 'react';
// // import { Html5QrcodeScanner } from 'html5-qrcode';

// // interface UserBadgeData {
// //   name: string;
// //   email: string;
// //   age: number;
// //   // Add other relevant fields
// // }

// // interface QRScannerProps {
// //   onScanSuccess: (data: UserBadgeData) => void;
// // }

// // export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
// //   const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

// //   React.useEffect(() => {

// //     const html5QrcodeScanner = new Html5QrcodeScanner(
// //       'reader', 
// //       { 
// //         fps: 10, 
// //         qrbox: 250 
// //       },
// //       /* verbose= */ false
// //     );

// //     html5QrcodeScanner.render(
// //       (decodedText) => {

// //         html5QrcodeScanner.clear();

// //         try {
// //           const userData: UserBadgeData = JSON.parse(decodedText);
          
// //           if (!userData.name || !userData.email) {
// //             throw new Error('Invalid QR code data');
// //           }
// //           onScanSuccess(userData);
          
// //         } catch (error) {
// //           console.error('Error parsing QR code:', error);
// //           alert('Invalid QR code. Please try again.');
// //         }
// //       },
// //       (errorMessage) => {
// //         // handle scan failure
// //         console.warn(`QR Code scanning error: ${errorMessage}`);
// //       }
// //     );

// //     setScanner(html5QrcodeScanner);

// //     // Cleanup function
// //     return () => {
// //       if (scanner) {
// //         scanner.clear();
// //       }
// //     };
// //   }, [onScanSuccess]);

// //   return (
// //     <div className="qr-scanner-container">
// //       <div id="reader" style={{ width: '100%' }}></div>
// //     </div>
// //   );
// // };

// // import React, { useState, useEffect } from 'react';
// // import { Html5Qrcode } from 'html5-qrcode';

// // interface UserBadgeData {
// //   name: string;
// //   email: string;
// //   age?: number;
// //   // Add other relevant fields
// // }

// // interface QRScannerProps {
// //   onScanSuccess: (data: UserBadgeData) => void;
// // }

// // export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
// //   const [isScanning, setIsScanning] = useState(false);

// //   useEffect(() => {
// //     // Ensure the scanning container exists
// //     const scannerElement = document.getElementById('reader');
// //     if (!scannerElement) return;

// //     // Create an instance of Html5Qrcode
// //     const html5QrCode = new Html5Qrcode('reader');

// //     // Configuration for QR code scanning
// //     const config = { 
// //       fps: 10,    // 10 frames per second
// //       qrbox: 250  // Size of the scanning box
// //     };

// //     // Start scanning
// //     const startScanning = async () => {
// //       try {
// //         // Request camera permissions and start scanning
// //         await html5QrCode.start(
// //           { facingMode: "environment" }, // Use back camera if available
// //           config,
// //           (decodedText) => {
// //             try {
// //               // Parse the QR code content
// //               const userData: UserBadgeData = JSON.parse(decodedText);
              
// //               // Validate the data
// //               if (!userData.name || !userData.email) {
// //                 throw new Error('Invalid QR code data');
// //               }

// //               // Stop scanning and call success callback
// //               html5QrCode.stop();
// //               setIsScanning(false);
// //               onScanSuccess(userData);
// //             } catch (error) {
// //               console.error('Error parsing QR code:', error);
// //               alert('Invalid QR code. Please try again.');
// //             }
// //           },
// //           (errorMessage) => {
// //             // This is an error callback, but we'll handle errors in the main try-catch
// //             console.warn(`QR Code scanning error: ${errorMessage}`);
// //           }
// //         );
// //         setIsScanning(true);
// //       } catch (err) {
// //         console.error('Error starting QR code scanner:', err);
// //         alert('Could not start QR code scanner. Please check camera permissions.');
// //       }
// //     };

// //     // Start scanning when component mounts
// //     startScanning();

// //     // Cleanup function
// //     return () => {
// //       if (isScanning) {
// //         html5QrCode.stop().catch(err => console.error('Error stopping scanner:', err));
// //       }
// //     };
// //   }, [onScanSuccess]);

// //   return (
// //     <div className="qr-scanner-container">
// //       <div id="reader" style={{ width: '100%', minHeight: '250px' }}></div>
// //       {!isScanning && (
// //         <p className="text-center text-gray-600 mt-4">
// //           Please allow camera access and point it at a QR code
// //         </p>
// //       )}
// //     </div>
// //   );
// // };




// import React, { useState, useEffect, useRef } from 'react';
// import { Html5Qrcode, Html5QrcodeScannerConfig, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

// export interface UserBadgeData {
//   name: string;
//   email: string;
//   age?: number;
//   // Add other relevant fields
// }

// interface QRScannerProps {
//   onScanSuccess: (data: UserBadgeData) => void;
// }

// export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [cameraMode, setCameraMode] = useState<'back' | 'front'>('back');
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const scannerRef = useRef<Html5Qrcode | null>(null);

//   // Function to handle QR code scan success
//   const handleScanSuccess = (decodedText: string) => {
//     try {
//       // Parse the QR code content
//       const userData: UserBadgeData = JSON.parse(decodedText);
      
//       // Validate the data
//       if (!userData.name || !userData.email) {
//         throw new Error('Invalid QR code data');
//       }

//       // Stop scanning and call success callback
//       stopScanning();
//       setScanResult(decodedText);
//       onScanSuccess(userData);
//     } catch (error) {
//       console.error('Error parsing QR code:', error);
//       alert('Invalid QR code. Please try again.');
//     }
//   };

//   const startScanning = async () => {
//     const scannerElement = document.getElementById('reader');
//     if (!scannerElement) return;

//     const html5QrCode = new Html5Qrcode('reader');
//     scannerRef.current = html5QrCode;

//     const config: Html5QrcodeCameraScanConfig = { 
//       fps: 10,    // 10 frames per second
//       qrbox: 250  // Size of the scanning box
//     };

    
//       // Determine camera facing mode
//       const cameraFacingMode = cameraMode === 'back' 
//         ? { facingMode: { exact: "environment" } } 
//         : { facingMode: "user" };

//       // Start scanning
//       await html5QrCode.start(
//         cameraFacingMode, 
//         config,
//         handleScanSuccess,
//         (errorMessage) => {
//           console.warn(`QR Code scanning error: ${errorMessage}`);
//         }
//       );
//       setIsScanning(true);
  
//   };

//   const stopScanning = () => {
//     if (scannerRef.current) {
//       scannerRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
//       setIsScanning(false);
//     }
//   };

//   const toggleCameraMode = () => {
//     stopScanning();
//     setCameraMode(prev => prev === 'back' ? 'front' : 'back');
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const html5QrCode = new Html5Qrcode('reader');
      
//       html5QrCode.scanFile(file, true)
//         .then(decodedText => {
//           handleScanSuccess(decodedText);
//         })
//         .catch(err => {
//           console.error('Error scanning uploaded file:', err);
//           alert('Could not scan the uploaded image. Please try a different image.');
//         });
//     }
//   };

//   useEffect(() => {
//     if (isScanning) {
//       stopScanning();
//     }
//     startScanning();

//     return () => {
//       stopScanning();
//     };
//   }, [cameraMode]);

//   return (
//     <div className="qr-scanner-container">
//       <div id="reader" style={{ width: '100%', minHeight: '250px' }}></div>
      
//       {!isScanning && (
//         <p className="text-center text-gray-600 mt-4">
//           Please allow camera access and point it at a QR code
//         </p>
//       )}

//       <div className="flex justify-center items-center space-x-4 mt-4">
//         <button 
//           onClick={toggleCameraMode} 
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Switch to {cameraMode === 'back' ? 'Front' : 'Back'} Camera
//         </button>

//         <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
//           Upload QR Code Image
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleFileUpload} 
//             className="hidden" 
//           />
//         </label>
//       </div>

//       {scanResult && (
//         <div className="mt-4 p-4 bg-green-100 rounded">
//           <p>Scanned Result:</p>
//           <pre className="text-sm">{scanResult}</pre>
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useState, useEffect, useRef } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';

// export const QRScanner: React.FC = () => {
//   const [cameraMode, setCameraMode] = useState<'front' | 'back'>('front');
//   const scannerRef = useRef<Html5Qrcode | null>(null);

//   // Detect mobile device
//   const isMobileDevice = () => {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//   };

//   const startScanning = async () => {
//     const scannerElement = document.getElementById('reader');
//     if (!scannerElement) return;

//     const html5QrCode = new Html5Qrcode('reader');
//     // scannerRef.current = html5QrCode;
// console.log("html5QrCode",html5QrCode);

//     try {    
//       // Camera mode only for mobile devices
//       const cameraFacingMode = isMobileDevice()
//         ? (cameraMode === 'back' 
//             ? { facingMode: { exact: "environment" } } 
//             : { facingMode: "user" })
//         : { facingMode: "user" };

//       await html5QrCode.start(
//         cameraFacingMode, 
//         { fps: 10, qrbox: 250 },
//         () => {}, // Placeholder success callback
//         (errorMessage) => {
//           console.warn(`Camera error: ${errorMessage}`);
//         }
//       );

//     } catch (err) {
//       console.error('Camera start error:', err);
//       alert('Could not access camera.');
//     }
//   };

//   const stopScanning = () => {
//     if (scannerRef.current) {
//       scannerRef.current.stop().catch(console.error);
//     }
//   };

//   const toggleCameraMode = () => {
//     if (isMobileDevice()) {
//       stopScanning();
//       setCameraMode(prev => prev === 'back' ? 'front' : 'back');
//     }
//   };

//   useEffect(() => {
//     startScanning();
//     return () => stopScanning();
//   }, [cameraMode]);

//   return (
//     <div className="camera-container">
//       <div id="reader" style={{ width: '100%', minHeight: '250px' }}></div>
      
//       {isMobileDevice() && (
//         <div className="camera-controls mt-4 text-center">
//           <button 
//             onClick={toggleCameraMode} 
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Switch Camera
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr'; 

export interface UserBadgeData {
  name: string;
  email: string;
  age?: number;
}

interface QRScannerProps {
  onScanSuccess: (data: UserBadgeData) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraMode, setCameraMode] = useState<'front' | 'back'>('front');
  const [error, setError] = useState<string | null>(null);

  // Detect mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const startCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      // Determine camera facing mode
      const constraints: MediaStreamConstraints = {
        video: isMobileDevice()
          ? { 
              facingMode: cameraMode === 'back' 
                ? { exact: 'environment' } 
                : 'user' 
            }
          : { facingMode: 'user' }
      };

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start QR code scanning
      requestAnimationFrame(tick);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const tick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Check if video is ready
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Set canvas size to match video
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      // Draw current video frame on canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Attempt to read QR code
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        // Handle QR code result
        if (code) {
            console.log("code",code);
            
          try {
            console.log("entered");
            const userData: UserBadgeData = JSON.parse(code.data);
            console.log("userData",userData);
            
            stopCamera();
            onScanSuccess(userData);
          } catch (error) {
            console.error('Error parsing QR code:', error);
          }
        }
      }
    }

    // Continue scanning
    requestAnimationFrame(tick);
  };

  const toggleCameraMode = () => {
    if (isMobileDevice()) {
      stopCamera();
      setCameraMode(prev => prev === 'back' ? 'front' : 'back');
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [cameraMode]);

  return (
    <div className="qr-scanner-container">
      <video 
        ref={videoRef} 
        style={{ width: '100%', display: 'none' }} 
        playsInline 
        muted 
      />
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', display: 'block' }} 
      />

      {error && (
        <div className="error-message text-red-500 mt-4">
          {error}
        </div>
      )}

      {isMobileDevice() && (
        <div className="camera-controls mt-4 text-center">
          <button 
            onClick={toggleCameraMode} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Switch Camera
          </button>
        </div>
      )}
    </div>
  );
};