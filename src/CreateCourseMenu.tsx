import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faWandMagicSparkles, faFileLines } from '@fortawesome/free-solid-svg-icons';

export interface CreateCourseMenuProps {
  onSelectAICourseAuthoring: () => void;
  onSelectBlankCourse: () => void;
}

export function CreateCourseMenu({ onSelectAICourseAuthoring, onSelectBlankCourse }: CreateCourseMenuProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: 1,
          borderRadius: 4,
          backgroundColor: hover || open ? '#053c80' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Open Sans', sans-serif",
          transition: 'background-color 100ms',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: hover || open ? 'white' : '#1f6aac' }}>Create Course</span>
        <FontAwesomeIcon icon={faChevronDown} style={{ width: 13, height: 13, color: hover || open ? 'white' : '#1f6aac' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 5,
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0px 1px 3px rgba(0,0,0,0.22)',
            padding: 5,
            minWidth: 210,
            zIndex: 50,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSelectAICourseAuthoring();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              width: '100%',
              padding: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 2,
              textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} style={{ width: 15, height: 15, color: '#7349aa' }} />
            <span style={{ fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>AI Course Authoring</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSelectBlankCourse();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              width: '100%',
              padding: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 2,
              textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FontAwesomeIcon icon={faFileLines} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            <span style={{ fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>Blank Course</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateCourseMenu;
