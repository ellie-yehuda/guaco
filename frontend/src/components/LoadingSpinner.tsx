import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'green-500',
  text,
  fullScreen = false,
}) => {
  const sizeClass = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const spinnerClasses = `animate-spin rounded-full border-b-2 border-${color} ${sizeClass[size]}`;

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={spinnerClasses}></div>
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner; 