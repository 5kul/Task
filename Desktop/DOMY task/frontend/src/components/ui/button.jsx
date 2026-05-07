import React from 'react';

export function Button({ className = '', variant = 'default', ...props }) {
  const variantClass = variant === 'outline' ? 'btn btn-outline' : 'btn';
  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}
