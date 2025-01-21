import React from 'react';
import { BadgeElement } from '../types/badge';

interface BadgePreviewProps {
  elements: BadgeElement[];
  aspectRatio: string;
  registrationData?: any;
  showGuides?: boolean;
}

const BLEED_MARGIN = 3; // 3mm bleed area
const SAFE_MARGIN = 5; // 5mm safe area

export function BadgePreview({ elements, aspectRatio, registrationData, showGuides = false }: BadgePreviewProps) {
  const containerStyle = {
    aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '3/4',
    position: 'relative' as const,
    backgroundColor: 'white',
    overflow: 'hidden',
  };

  return (
    <div className="relative">
      <div className="absolute inset-0" style={containerStyle}>
        {showGuides && (
          <>
            {/* Bleed area */}
            <div className="absolute inset-0 border-2 border-red-300 border-dashed pointer-events-none" 
                 style={{ margin: `-${BLEED_MARGIN}mm` }} />
            
            {/* Safe area */}
            <div className="absolute inset-0 border-2 border-green-300 border-dashed pointer-events-none" 
                 style={{ margin: `${SAFE_MARGIN}mm` }} />
          </>
        )}

        {elements.map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              color: element.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {element.type === 'text' && (
              <span>
                {registrationData 
                  ? element.content.replace(/\${([^}]+)}/g, (_, field) => registrationData[field] || '')
                  : element.content}
              </span>
            )}
            {element.type === 'qr' && (
              <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs text-gray-500">
                QR Code
              </div>
            )}
            {element.type === 'image' && (
              <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs text-gray-500">
                Image
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}