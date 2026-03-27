import { createElement } from 'react';

export function Logo() {
  return createElement(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 4px',
      },
    },
    createElement(
      'span',
      {
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#3783A3',
          letterSpacing: '-0.3px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      },
      'Jewmanity',
    ),
    createElement(
      'span',
      {
        style: {
          fontSize: '11px',
          color: '#6B7280',
          fontWeight: 400,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      },
      'CMS',
    ),
  );
}
