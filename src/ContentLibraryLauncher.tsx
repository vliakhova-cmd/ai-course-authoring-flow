import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpFromBracket,
  faDownload,
  faPen,
  faTrash,
  faEllipsis,
  faChevronDown,
  faMagnifyingGlass,
  faFilter,
  faFileLines,
  faVideo,
  faListCheck,
  faGraduationCap,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { CreateCourseMenu } from './CreateCourseMenu';
import { AICourseAuthoringFlow } from './AICourseAuthoringFlow';
import { CONTENT_ROWS, ContentKind, ContentStatus } from './contentLibraryData';
import { TopHeaderBar } from './appShell/TopHeaderBar';
import { LeftIconNav } from './appShell/LeftIconNav';
import { ResizableTree } from './appShell/ResizableTree';

const KIND_ICON: Record<ContentKind, { icon: typeof faFileLines; color: string }> = {
  document: { icon: faFileLines, color: '#d23c2d' },
  video: { icon: faVideo, color: '#1972aa' },
  assessment: { icon: faListCheck, color: '#1972aa' },
};

const STATUS_STYLE: Record<ContentStatus, { bg: string; label: string }> = {
  approved: { bg: '#bedbbb', label: 'Approved' },
  draft: { bg: '#d8d8d8', label: 'Draft' },
};

// Matches Figma "Buttons/Primary Button" exactly: Resting/Pressed share a
// 0px 1px 1.5px shadow, Hover switches to a bigger 0px 4px 4px shadow (both
// tinted rgba(35,80,155,...)), and Disabled drops the shadow entirely.
function UploadButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        minWidth: 75,
        padding: '5px 15px',
        backgroundColor: hover ? '#053c80' : '#1f6aac',
        border: 'none',
        borderRadius: 4,
        boxShadow: hover ? '0px 4px 4px rgba(35,80,155,0.4)' : '0px 1px 1.5px rgba(35,80,155,0.4)',
        cursor: 'pointer',
        transition: 'background-color 100ms',
      }}
    >
      <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ width: 13, height: 13, color: 'white' }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: "'Open Sans', sans-serif" }}>Upload</span>
    </button>
  );
}

// Matches Figma "Buttons/Action button" (Icon btn=false, View=Default) exactly:
// Resting = no bg, #1f6aac text/icon. Hover = solid #053c80 bg, white text/icon.
// Disabled = opacity-40 on the resting look, no hover.
function ToolbarAction({
  icon,
  label,
  rightIcon,
  onClick,
  disabled = false,
}: {
  icon: typeof faDownload;
  label: string;
  rightIcon?: typeof faChevronDown;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const active = hover && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: 1,
        borderRadius: 4,
        backgroundColor: active ? '#053c80' : 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 100ms',
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ width: 13, height: 13, color: active ? 'white' : '#1f6aac' }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: active ? 'white' : '#1f6aac', fontFamily: "'Open Sans', sans-serif" }}>{label}</span>
      {rightIcon && (
        <FontAwesomeIcon icon={rightIcon} style={{ width: 11, height: 11, color: active ? 'white' : '#1f6aac' }} />
      )}
    </button>
  );
}

const COL = {
  select: 65,
  status: 96,
  version: 61,
  contentDate: 117,
  effectiveDate: 109,
  type: 123,
  assigned: 95,
};

function TableHeaderCell({ width, children }: { width?: number; children: React.ReactNode }) {
  return (
    <div style={{ width, flex: width ? undefined : '1 0 0', padding: '10px 15px', fontSize: 12, fontWeight: 700, color: '#5d6982' }}>
      {children}
    </div>
  );
}

const TABLE_MIN_WIDTH = COL.select + COL.status + COL.version + COL.contentDate + COL.effectiveDate + COL.type + COL.assigned + 260;

export function ContentLibraryLauncher() {
  const [showFlow, setShowFlow] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set([CONTENT_ROWS[0].id]));

  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', width: '100%', minHeight: '100vh' }}>
      <TopHeaderBar />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 62px)', position: 'relative' }}>
        <LeftIconNav />
        <ResizableTree />

        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Page header */}
          <div style={{ padding: '20px 30px 15px 30px' }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#100040' }}>Content Library</h1>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              rowGap: 10,
              backgroundColor: '#edf5fb',
              padding: '7.5px 30px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap', rowGap: 8 }}>
              <UploadButton />

              <CreateCourseMenu
                onSelectAICourseAuthoring={() => setShowFlow(true)}
                onSelectBlankCourse={() => {}}
              />

              <ToolbarAction icon={faDownload} label="Download" />
              <ToolbarAction icon={faPen} label="Edit" />
              <ToolbarAction icon={faTrash} label="Delete" />
              <ToolbarAction icon={faEllipsis} label="More" rightIcon={faChevronDown} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap', rowGap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  width: 200,
                  maxWidth: '100%',
                  height: 30,
                  padding: '0 5px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: 4,
                }}
              >
                <span style={{ flex: 1, fontSize: 14, color: '#5d6982' }}>Search</span>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 13, height: 13, color: '#5d6982' }} />
              </div>
              <ToolbarAction icon={faFilter} label="Filters" />
            </div>
          </div>

          {/* File count + sort */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, padding: '8px 30px' }}>
            <span style={{ fontSize: 14, color: '#100040' }}>
              20 Files{selectedIds.size > 0 && <> <strong>{selectedIds.size} Selected</strong></>}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: 5,
                border: '1px solid #d2e5f6',
                borderRadius: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: '#5d6982' }}>Sort By</span>
              <span style={{ fontSize: 14, color: '#1f6aac' }}>Content Date</span>
              <FontAwesomeIcon icon={faChevronDown} style={{ width: 10, height: 10, color: '#1f6aac' }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ flex: '1 0 0', padding: '0 30px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: TABLE_MIN_WIDTH }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5' }}>
              <TableHeaderCell width={COL.select}> </TableHeaderCell>
              <TableHeaderCell>Content Name</TableHeaderCell>
              <TableHeaderCell width={COL.status}>Status</TableHeaderCell>
              <TableHeaderCell width={COL.version}>Version</TableHeaderCell>
              <TableHeaderCell width={COL.contentDate}>Content Date</TableHeaderCell>
              <TableHeaderCell width={COL.effectiveDate}>Effective Date</TableHeaderCell>
              <TableHeaderCell width={COL.type}>Type</TableHeaderCell>
              <TableHeaderCell width={COL.assigned}>Assigned Courses</TableHeaderCell>
            </div>
            {CONTENT_ROWS.map((row, i) => {
              const kind = KIND_ICON[row.kind];
              const status = STATUS_STYLE[row.status];
              const isSelected = selectedIds.has(row.id);
              const bg = isSelected ? '#d2e5f6' : i % 2 === 0 ? 'white' : '#fafafa';
              return (
                <div key={row.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: bg }}>
                  <div style={{ width: COL.select, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 10px 15px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.id)}
                      style={{ width: 15, height: 15, accentColor: '#1f6aac', cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 25,
                        height: 25,
                        border: '1px solid #1f6aac',
                        borderRadius: 4,
                        background: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <FontAwesomeIcon icon={faEllipsis} style={{ width: 12, height: 12, color: '#1f6aac' }} />
                    </button>
                  </div>
                  <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '10px 15px' }}>
                    <FontAwesomeIcon icon={kind.icon} style={{ width: 14, height: 14, color: kind.color, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 14,
                        color: '#1f6aac',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.name}
                    </span>
                  </div>
                  <div style={{ width: COL.status, padding: '10px 15px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: 15,
                        padding: '2px 7px 3px 7px',
                        borderRadius: 5,
                        backgroundColor: status.bg,
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#100040',
                        textTransform: 'uppercase',
                      }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div style={{ width: COL.version, padding: '10px 15px', fontSize: 14, color: '#100040' }}>{row.version}</div>
                  <div style={{ width: COL.contentDate, padding: '10px 15px', fontSize: 14, color: '#100040' }}>{row.contentDate}</div>
                  <div style={{ width: COL.effectiveDate, padding: '10px 15px', fontSize: 14, color: '#100040' }}>{row.effectiveDate}</div>
                  <div
                    style={{
                      width: COL.type,
                      padding: '10px 15px',
                      fontSize: 14,
                      color: '#100040',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.type}
                  </div>
                  <div style={{ width: COL.assigned, padding: '8px 15px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: 35,
                        padding: '2px 5px 3px 5px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #d2e5f6',
                        borderRadius: 12.5,
                      }}
                    >
                      <FontAwesomeIcon icon={faGraduationCap} style={{ width: 13, height: 13, color: '#1f6aac' }} />
                      <span style={{ fontSize: 14, color: '#1f6aac' }}>{row.assignedCourses}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 15, padding: '15px 30px' }}>
            <button
              type="button"
              disabled
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', opacity: 0.4, cursor: 'not-allowed' }}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: 11, height: 11, color: '#1f6aac' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f6aac' }}>Previous</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  border: '1px solid #e5e5e5',
                  borderRadius: 4,
                  fontSize: 14,
                  color: '#100040',
                }}
              >
                1
              </span>
              <span style={{ fontSize: 14, color: '#5d6982' }}>of</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#100040' }}>4</span>
            </div>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f6aac' }}>Next</span>
              <FontAwesomeIcon icon={faChevronRight} style={{ width: 11, height: 11, color: '#1f6aac' }} />
            </button>
          </div>
        </div>
      </div>

      {showFlow && <AICourseAuthoringFlow onClose={() => setShowFlow(false)} />}
    </div>
  );
}

export default ContentLibraryLauncher;
