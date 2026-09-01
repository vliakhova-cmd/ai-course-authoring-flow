import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faXmark,
  faCirclePlus,
  faMicrophone,
  faChevronDown,
  faPlus,
  faGlobe,
  faFolderOpen,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { LessonType } from './types';
import { LANGUAGES } from './mockData';
import { LessonTypeTags } from './LessonTypeTags';
import { AuthoringButton } from './AuthoringButton';

// Same "escape the clip, close on outside click" pattern as CreateCourseMenu
// and MoreActionsMenu — this button sits inside a scrollable modal body, so
// the dropdown is positioned `fixed` from the trigger's live coordinates.
function AttachMenu({ onSelectFromLibrary, onUploadNew }: { onSelectFromLibrary: () => void; onUploadNew: () => void }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 5, left: rect.left });
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        aria-label="Attach"
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3.5px', display: 'flex' }}
      >
        <FontAwesomeIcon icon={faCirclePlus} style={{ width: 15, height: 15, color: '#1f6aac' }} />
      </button>

      {open && menuPos && (
        <div
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0px 1px 3px rgba(0,0,0,0.22)',
            padding: 5,
            minWidth: 200,
            zIndex: 50,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSelectFromLibrary();
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
            <FontAwesomeIcon icon={faFolderOpen} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            <span style={{ fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>Select from Library</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onUploadNew();
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
            <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            <span style={{ fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>Upload New</span>
          </button>
        </div>
      )}
    </div>
  );
}

// "Buttons/Action button" style — same hover treatment as ToolbarAction in
// ContentLibraryLauncher.tsx: transparent at rest, solid #053c80 + white
// icon/text on hover.
function AddObjectiveButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 5,
        padding: 1,
        borderRadius: 4,
        backgroundColor: hover ? '#053c80' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 100ms',
      }}
    >
      <FontAwesomeIcon icon={faPlus} style={{ width: 13, height: 13, color: hover ? 'white' : '#1f6aac' }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: hover ? 'white' : '#1f6aac' }}>Add</span>
    </button>
  );
}

export interface ComposeStepProps {
  sourceDoc: string | null;
  onRemoveSource: () => void;
  description: string;
  onChangeDescription: (value: string) => void;
  lessonType: LessonType;
  onChangeLessonType: (type: LessonType) => void;
  language: string;
  onChangeLanguage: (value: string) => void;
  objectives: string[];
  onChangeObjective: (index: number, value: string) => void;
  onAddObjective: () => void;
  onCancel: () => void;
  onGenerate: () => void;
}

export function ComposeStep({
  sourceDoc,
  onRemoveSource,
  description,
  onChangeDescription,
  lessonType,
  onChangeLessonType,
  language,
  onChangeLanguage,
  objectives,
  onChangeObjective,
  onAddObjective,
  onCancel,
  onGenerate,
}: ComposeStepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: '1 1 auto', minHeight: 0, fontFamily: "'Open Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px 14px 30px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#100040', lineHeight: '30px' }}>
          AI Course Authoring
        </h2>
        <button onClick={onCancel} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <FontAwesomeIcon icon={faXmark} style={{ width: 18, height: 18, color: '#1f6aac' }} />
        </button>
      </div>
      <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%' }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, padding: 30, width: '100%', flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
        {/* Prompt box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
            padding: 15,
            width: '100%',
            backgroundColor: '#fafafa',
            border: '1px solid #ededed',
            borderRadius: 10,
          }}
        >
          {sourceDoc && (
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                alignItems: 'center',
                gap: 5,
                height: 25,
                padding: '2px 5px 3px 5px',
                backgroundColor: '#edf5fb',
                border: '1px solid #d2e5f6',
                borderRadius: 4,
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} style={{ width: 13, height: 13, color: '#d23c2d' }} />
              <span style={{ fontSize: 14, color: '#100040' }}>{sourceDoc}</span>
              <button onClick={onRemoveSource} aria-label="Remove source" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <FontAwesomeIcon icon={faXmark} style={{ width: 9, height: 9, color: '#576581' }} />
              </button>
            </div>
          )}

          <textarea
            value={description}
            onChange={e => onChangeDescription(e.target.value)}
            placeholder="Describe your lesson, audience and goals..."
            rows={3}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              lineHeight: '20px',
              color: '#0b1528',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <AttachMenu onSelectFromLibrary={() => {}} onUploadNew={() => {}} />
            <button
              type="button"
              aria-label="Voice input"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3.5px', display: 'flex' }}
            >
              <FontAwesomeIcon icon={faMicrophone} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            </button>
          </div>
        </div>

        <LessonTypeTags selected={lessonType} onSelect={onChangeLessonType} />

        {/* Language dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 190 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Language</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: 5,
              width: '100%',
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: 4,
            }}
          >
            <FontAwesomeIcon icon={faGlobe} style={{ width: 15, height: 15, color: '#1f6aac', flexShrink: 0 }} />
            <select
              value={language}
              onChange={e => onChangeLanguage(e.target.value)}
              style={{
                flex: '1 0 0',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                appearance: 'none',
                fontSize: 14,
                color: '#100040',
                fontFamily: "'Open Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} style={{ width: 11, height: 11, color: '#576581', flexShrink: 0 }} />
          </div>
        </div>

        {/* Objectives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Objectives</span>
            <p style={{ margin: 0, fontSize: 12, color: '#5d6982', lineHeight: '15px' }}>
              Clear objectives help us structure the course content in the most effective way.
            </p>
          </div>

          {objectives.length > 0 && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: 4,
                padding: 5,
              }}
            >
              <ol style={{ margin: 0, paddingLeft: 21, listStyleType: 'decimal', fontSize: 14, lineHeight: '20px', color: '#5d6982', fontFamily: "'Open Sans', sans-serif" }}>
                {objectives.map((obj, i) => (
                  <li key={i} style={{ marginBottom: i === objectives.length - 1 ? 0 : 8 }}>
                    <input
                      autoFocus={i === objectives.length - 1 && obj === ''}
                      value={obj}
                      onChange={e => onChangeObjective(i, e.target.value)}
                      placeholder="Type an objective..."
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#100040',
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}

          <AddObjectiveButton onClick={onAddObjective} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #ededed', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            gap: 15,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px 0',
            backgroundColor: '#fafafa',
          }}
        >
          <AuthoringButton variant="outline" onClick={onCancel}>Cancel</AuthoringButton>
          <AuthoringButton variant="primary" onClick={onGenerate}>
            Generate Preview
          </AuthoringButton>
        </div>
      </div>
    </div>
  );
}

export default ComposeStep;
