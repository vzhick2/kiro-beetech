'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { displaySettings, type DensityMode } from '@/config/app-config';

interface SmartCellProps {
  value?: string | null | undefined;
  type: 'text' | 'email' | 'phone' | 'website' | 'multiline';
  densityMode: DensityMode;
  maxLength?: number;
  className?: string;
}

export const SmartCell = ({ 
  value, 
  type, 
  densityMode, 
  maxLength, 
  className = '' 
}: SmartCellProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!value || value.trim() === '') {
    return (
      <span className={`text-gray-400 italic ${className}`}>
        {type === 'email' ? 'No email' : 
         type === 'phone' ? 'No phone' : 
         type === 'website' ? 'No website' : 
         type === 'multiline' ? 'No notes' : 
         'No data'}
      </span>
    );
  }

  // Calculate truncation based on density mode
  const getTruncationLength = () => {
    if (maxLength) return maxLength;
    
    const config = displaySettings.densityModes[densityMode];
    return type === 'multiline' 
      ? config.characterLimits.long 
      : config.characterLimits.short;
  };

  const truncateLength = getTruncationLength();
  const shouldTruncate = value.length > truncateLength;
  const displayValue = shouldTruncate ? value.substring(0, truncateLength) + '...' : value;

  // Get number of lines to show based on density mode
  const getMaxLines = () => {
    if (type !== 'multiline') return 1;
    
    return displaySettings.densityModes[densityMode].maxLines;
  };

  const maxLines = getMaxLines();

  const renderContent = () => {
    switch (type) {
      case 'email':
        return (
          <a
            href={`mailto:${value}`}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {displayValue}
          </a>
        );

      case 'phone':
        const cleanPhone = value.replace(/\D/g, '');
        const phoneHref = cleanPhone.length >= 10 ? `tel:+1${cleanPhone}` : `tel:${value}`;
        
        return (
          <a
            href={phoneHref}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {displayValue}
          </a>
        );

      case 'website':
        const websiteUrl = value.startsWith('http') ? value : `https://${value}`;
        const displayUrl = value.replace(/^https?:\/\//, '');
        const truncatedUrl = displayUrl.length > truncateLength 
          ? displayUrl.substring(0, truncateLength) + '...' 
          : displayUrl;

        return (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {truncatedUrl}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        );

      case 'multiline':
        return (
          <div 
            className={`whitespace-pre-wrap break-words ${className}`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: displaySettings.densityModes[densityMode].lineHeight,
            }}
            title={shouldTruncate ? value : undefined}
          >
            {shouldTruncate ? displayValue : value}
          </div>
        );

      default:
        return (
          <span 
            className={className}
            title={shouldTruncate ? value : undefined}
          >
            {displayValue}
          </span>
        );
    }
  };

  return <div>{renderContent()}</div>;
};
