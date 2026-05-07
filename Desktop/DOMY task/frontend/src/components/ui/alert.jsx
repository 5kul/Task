import React from 'react';

export function Alert({ className = '', children, variant = 'default' }) {
  const variantClass = variant === 'destructive' ? 'alert alert-destructive' : 'alert';
  return <div className={`${variantClass} ${className}`.trim()}>{children}</div>;
}
