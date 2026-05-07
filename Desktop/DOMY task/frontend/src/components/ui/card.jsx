import React from 'react';

export function Card({ className = '', ...props }) {
  return <div className={`card shell ${className}`.trim()} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`card-header ${className}`.trim()} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`card-title ${className}`.trim()} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`card-description ${className}`.trim()} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`card-content ${className}`.trim()} {...props} />;
}
