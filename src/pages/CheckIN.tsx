// import { Navbar } from "../components/Navbar";

// export default function CheckIN() {
//     return (
//         <>
//             <Navbar></Navbar>

//             <div className="mt-32">
//                 Hare Krishna
//             </div>
//         </>
//     )
// }


import React, { useState } from 'react';
import { Navbar } from "../components/Navbar";
import { QRScanner } from "../pages/QRScanner";
import { UserBadge } from "../pages/UserBadge";

export default function CheckIN() {
  const [userData, setUserData] = useState<UserBadgeData | null>(null);

  const handleScanSuccess = (scannedData: UserBadgeData) => {
    setUserData(scannedData);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-32 p-4">
        {!userData ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4">Scan Your QR Code..</h2>
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>
        ) : (
          <UserBadge userData={userData} />
        )}
      </div>
    </>
  );
}