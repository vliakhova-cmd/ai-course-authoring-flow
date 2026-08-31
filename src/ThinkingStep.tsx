import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export interface ThinkingStepProps {
  onCancel: () => void;
}

export function ThinkingStep({ onCancel }: ThinkingStepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: "'Open Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px 14px 30px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#100040', lineHeight: '30px' }}>
          AI Course Authoring
        </h2>
        <button onClick={onCancel} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <FontAwesomeIcon icon={faXmark} style={{ width: 18, height: 18, color: '#1f6aac' }} />
        </button>
      </div>
      <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', justifyContent: 'center', height: 450, padding: 30 }}>
        <div
          style={{
            width: 26,
            height: 26,
            backgroundColor: '#1f6aac',
            transform: 'rotate(45deg)',
            borderRadius: 4,
            animation: 'ai-course-authoring-pulse 1.1s ease-in-out infinite',
          }}
        />
        <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'black' }}>Thinking...</p>
      </div>

      <style>{`
        @keyframes ai-course-authoring-pulse {
          0%, 100% { transform: rotate(45deg) scale(1); opacity: 1; }
          50% { transform: rotate(45deg) scale(0.7); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default ThinkingStep;
