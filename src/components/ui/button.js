
import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button {...props} className="p-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
}