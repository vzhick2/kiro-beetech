import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ValidationError {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'success';
}

interface FieldValidationProps {
  error?: ValidationError;
  className?: string;
  showIcon?: boolean;
}

export function FieldValidation({
  error,
  className,
  showIcon = true,
}: FieldValidationProps) {
  if (!error) return null;

  const { type = 'error', message } = error;

  const iconMap = {
    error: AlertCircle,
    warning: AlertCircle,
    success: CheckCircle,
  };

  const colorMap = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    success: 'text-green-600',
  };

  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs mt-1',
        colorMap[type],
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

// Validation utilities
export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: 'email', message: 'Email is required', type: 'error' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Invalid email format', type: 'error' };
  }

  return null;
}

export function validatePhone(phone: string): ValidationError | null {
  if (!phone) return null; // Phone is optional

  const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { field: 'phone', message: 'Invalid phone format', type: 'warning' };
  }

  return null;
}

export function validateRequired(
  value: string,
  fieldName: string
): ValidationError | null {
  if (!value || value.trim() === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      type: 'error',
    };
  }
  return null;
}

export function validateUrl(url: string): ValidationError | null {
  if (!url) return null; // URL is optional

  try {
    new URL(url);
    return null;
  } catch {
    return { field: 'url', message: 'Invalid URL format', type: 'warning' };
  }
}
