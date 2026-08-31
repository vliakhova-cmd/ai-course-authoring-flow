import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faVideo, faMagnifyingGlass, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { LessonType } from './types';
import { LESSON_TYPES } from './mockData';

const ICONS: Record<LessonType, typeof faFileLines> = {
  document: faFileLines,
  video: faVideo,
  analysis: faMagnifyingGlass,
  assessment: faListCheck,
};

export interface LessonTypeTagsProps {
  selected: LessonType[];
  onToggle: (type: LessonType) => void;
}

export function LessonTypeTags({ selected, onToggle }: LessonTypeTagsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start', width: '100%' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982', fontFamily: "'Open Sans', sans-serif" }}>
        Lesson Type
      </span>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {LESSON_TYPES.map(lt => {
          const isOn = selected.includes(lt.id);
          return (
            <button
              key={lt.id}
              type="button"
              onClick={() => onToggle(lt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 100,
                cursor: 'pointer',
                border: `1px solid ${isOn ? lt.border : '#e5e5e5'}`,
                backgroundColor: isOn ? lt.bg : '#fafafa',
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              <FontAwesomeIcon
                icon={ICONS[lt.id]}
                style={{ width: 13, height: 13, color: isOn ? lt.color : '#949daf' }}
              />
              <span style={{ fontSize: 14, color: isOn ? '#100040' : '#576581' }}>{lt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LessonTypeTags;
