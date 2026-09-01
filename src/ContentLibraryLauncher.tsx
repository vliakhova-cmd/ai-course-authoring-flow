import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { CreateCourseMenu } from './CreateCourseMenu';
import { AICourseAuthoringFlow } from './AICourseAuthoringFlow';
import { CONTENT_ROWS, ContentKind, ContentStatus } from './contentLibraryData';
import { SAVED_COURSE } from './savedCourseData';
import { CourseManagementPage } from './CourseManagementPage';
import { ActivityPreviewPage } from './ActivityPreviewPage';
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
        flexShrink: 0,
        whiteSpace: 'nowrap',
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
        flexShrink: 0,
        whiteSpace: 'nowrap',
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

interface OverflowAction {
  key: string;
  icon: typeof faDownload;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const OVERFLOW_CANDIDATES: OverflowAction[] = [
  { key: 'download', icon: faDownload, label: 'Download' },
  { key: 'edit', icon: faPen, label: 'Edit' },
  { key: 'delete', icon: faTrash, label: 'Delete' },
];

const ACTION_GAP = 15;

// Always-visible trigger; when actions from the left group don't fit on
// one line, LeftActionBar hands the overflow here instead of wrapping.
function MoreActionsMenu({ items }: { items: OverflowAction[] }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
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

  // The action group clips overflow (so a too-narrow row never collides
  // with Search/Filters), so the dropdown is positioned `fixed` from the
  // trigger's live coordinates instead of `absolute` — that lets it escape
  // the clip instead of being cut off by it.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 5, left: rect.left });
  }, [open]);

  const active = hover || open;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        ref={btnRef}
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
          backgroundColor: active ? '#053c80' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background-color 100ms',
        }}
      >
        <FontAwesomeIcon icon={faEllipsis} style={{ width: 13, height: 13, color: active ? 'white' : '#1f6aac' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: active ? 'white' : '#1f6aac', fontFamily: "'Open Sans', sans-serif" }}>More</span>
        <FontAwesomeIcon icon={faChevronDown} style={{ width: 11, height: 11, color: active ? 'white' : '#1f6aac' }} />
      </button>

      {open && items.length > 0 && menuPos && (
        <div
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0px 1px 3px rgba(0,0,0,0.22)',
            padding: 5,
            minWidth: 180,
            zIndex: 50,
          }}
        >
          {items.map(item => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                width: '100%',
                padding: 5,
                background: 'none',
                border: 'none',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.4 : 1,
                borderRadius: 2,
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!item.disabled) e.currentTarget.style.backgroundColor = '#f7f7f7';
              }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: 15, height: 15, color: '#1f6aac' }} />
              <span style={{ fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Upload and Create Course are the primary actions and always stay on the
// line; Download/Edit/Delete collapse into the More menu, left to right, as
// soon as they stop fitting — so the action row never wraps onto a second line.
function LeftActionBar({
  onSelectAICourseAuthoring,
  onSelectBlankCourse,
  hasSelection,
}: {
  onSelectAICourseAuthoring: () => void;
  onSelectBlankCourse: () => void;
  hasSelection: boolean;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const uploadMeasureRef = useRef<HTMLDivElement>(null);
  const createCourseMeasureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLDivElement>(null);
  const candidateMeasureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [visibleCount, setVisibleCount] = useState(OVERFLOW_CANDIDATES.length);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const recalc = () => {
      const available = group.offsetWidth;
      const uploadWidth = uploadMeasureRef.current?.offsetWidth ?? 0;
      const createCourseWidth = createCourseMeasureRef.current?.offsetWidth ?? 0;
      const moreWidth = moreMeasureRef.current?.offsetWidth ?? 0;

      let used = uploadWidth + ACTION_GAP + createCourseWidth + ACTION_GAP + moreWidth;
      let count = 0;
      for (let i = 0; i < OVERFLOW_CANDIDATES.length; i++) {
        const w = (candidateMeasureRefs.current[i]?.offsetWidth ?? 0) + ACTION_GAP;
        if (used + w > available) break;
        used += w;
        count++;
      }
      setVisibleCount(count);
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  // Download/Edit/Delete only make sense once something is selected.
  const candidates = OVERFLOW_CANDIDATES.map(action => ({ ...action, disabled: !hasSelection }));
  const visibleActions = candidates.slice(0, visibleCount);
  const overflowActions = candidates.slice(visibleCount);

  return (
    <>
      <div
        ref={groupRef}
        style={{ display: 'flex', alignItems: 'center', gap: ACTION_GAP, flex: '1 1 auto', minWidth: 0, flexWrap: 'nowrap', overflow: 'hidden' }}
      >
        <UploadButton />
        <CreateCourseMenu onSelectAICourseAuthoring={onSelectAICourseAuthoring} onSelectBlankCourse={onSelectBlankCourse} itemsDisabled={!hasSelection} />
        {visibleActions.map(action => (
          <ToolbarAction key={action.key} icon={action.icon} label={action.label} onClick={action.onClick} disabled={action.disabled} />
        ))}
        {overflowActions.length > 0 && <MoreActionsMenu items={overflowActions} />}
      </div>

      {/* Off-screen clones used only to measure natural widths for the overflow calc above */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', top: -9999, left: -9999, display: 'flex', gap: ACTION_GAP, whiteSpace: 'nowrap', pointerEvents: 'none' }}
      >
        <div ref={uploadMeasureRef}>
          <UploadButton />
        </div>
        <div ref={createCourseMeasureRef}>
          <CreateCourseMenu onSelectAICourseAuthoring={() => {}} onSelectBlankCourse={() => {}} />
        </div>
        {OVERFLOW_CANDIDATES.map((action, i) => (
          <div key={action.key} ref={el => (candidateMeasureRefs.current[i] = el)}>
            <ToolbarAction icon={action.icon} label={action.label} />
          </div>
        ))}
        <div ref={moreMeasureRef}>
          <MoreActionsMenu items={[]} />
        </div>
      </div>
    </>
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

function TableHeaderCell({ width, sorted, children }: { width?: number; sorted?: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        width,
        flex: width ? undefined : '1 0 0',
        padding: '10px 15px',
        fontSize: 12,
        fontWeight: 700,
        color: sorted ? '#1f6aac' : '#5d6982',
      }}
    >
      {children}
      {sorted && <FontAwesomeIcon icon={faArrowDown} style={{ width: 10, height: 10, color: '#1f6aac' }} />}
    </div>
  );
}

const TABLE_MIN_WIDTH = COL.select + COL.status + COL.version + COL.contentDate + COL.effectiveDate + COL.type + COL.assigned + 260;

export function ContentLibraryLauncher() {
  const [showFlow, setShowFlow] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [page, setPage] = useState<'library' | 'course' | 'activity'>('library');
  const [openActivityId, setOpenActivityId] = useState<string | null>(null);

  // Table is sorted by Content Date (most recent first), matching the
  // "Sort By: Content Date" control and the arrow on that column header.
  const sortedRows = [...CONTENT_ROWS].sort(
    (a, b) => new Date(b.contentDate).getTime() - new Date(a.contentDate).getTime()
  );

  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <TopHeaderBar
        crumbs={
          page === 'course'
            ? [{ label: 'Course Management', color: '#1f6aac' }, { label: SAVED_COURSE.title, color: '#100040' }]
            : page === 'activity'
            ? [
                { label: 'Course Management', color: '#1f6aac' },
                { label: SAVED_COURSE.title, color: '#1f6aac', icon: faGraduationCap, onClick: () => setPage('course') },
                { label: SAVED_COURSE.activities.find(a => a.id === openActivityId)?.name ?? '', color: '#100040' },
              ]
            : undefined
        }
      />

      <div style={{ display: 'flex', height: 'calc(100vh - 62px)', position: 'relative' }}>
        <LeftIconNav />
        {page === 'activity' ? (
          <ActivityPreviewPage
            activityId={openActivityId ?? SAVED_COURSE.activities[0].id}
            onNavigate={setOpenActivityId}
            onBack={() => setPage('course')}
          />
        ) : page === 'course' ? (
          <CourseManagementPage
            onBack={() => setPage('library')}
            onOpenActivity={activity => {
              setOpenActivityId(activity.id);
              setPage('activity');
            }}
          />
        ) : (
        <>
        <ResizableTree />

        <div style={{ flex: '1 0 0', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Page header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa',
              padding: '15px 30px 14px 30px',
              flexShrink: 0,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 400, lineHeight: '40px', color: '#100040', fontFamily: "'Open Sans', sans-serif" }}>
              Content Library
            </h1>
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%', flexShrink: 0 }} />

          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
              height: 40,
              flexShrink: 0,
              backgroundColor: '#edf5fb',
              padding: '0 30px',
            }}
          >
            <LeftActionBar
              onSelectAICourseAuthoring={() => setShowFlow(true)}
              onSelectBlankCourse={() => {}}
              hasSelection={selectedIds.size > 0}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'nowrap', flexShrink: 0 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', color: '#100040' }}>20 Files</span>
              {selectedIds.size > 0 && (
                <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '15px', color: '#5d6982' }}>{selectedIds.size} Selected</span>
              )}
            </div>
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
          <div style={{ flex: '1 0 0', minHeight: 0, padding: '0 30px', overflowX: 'auto', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: TABLE_MIN_WIDTH }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 40, flexShrink: 0, borderBottom: '1px solid #e5e5e5' }}>
              <TableHeaderCell width={COL.select}> </TableHeaderCell>
              <TableHeaderCell>Content Name</TableHeaderCell>
              <TableHeaderCell width={COL.status}>Status</TableHeaderCell>
              <TableHeaderCell width={COL.version}>Version</TableHeaderCell>
              <TableHeaderCell width={COL.contentDate} sorted>Content Date</TableHeaderCell>
              <TableHeaderCell width={COL.effectiveDate}>Effective Date</TableHeaderCell>
              <TableHeaderCell width={COL.type}>Type</TableHeaderCell>
              <TableHeaderCell width={COL.assigned}>Assigned Courses</TableHeaderCell>
            </div>
            {sortedRows.map((row, i) => {
              const kind = KIND_ICON[row.kind];
              const status = STATUS_STYLE[row.status];
              const isSelected = selectedIds.has(row.id);
              const isHovered = hoveredRowId === row.id;
              // Figma "Row Behavior" spec: Resting alternates white/#fafafa,
              // Hover overlays #edf5fb (Primary Colors/Color 4), Selected
              // (stronger #d2e5f6) takes priority over a simultaneous hover.
              const bg = isSelected ? '#d2e5f6' : isHovered ? '#edf5fb' : i % 2 === 0 ? 'white' : '#fafafa';
              return (
                <div
                  key={row.id}
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(prev => (prev === row.id ? null : prev))}
                  style={{ display: 'flex', alignItems: 'center', height: 50, flexShrink: 0, backgroundColor: bg }}
                >
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 15, padding: '15px 30px', flexShrink: 0, borderTop: '1px solid #e5e5e5' }}>
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
        </>
        )}
      </div>

      {showFlow && (
        <AICourseAuthoringFlow
          onClose={() => setShowFlow(false)}
          onCourseSaved={() => {
            setShowFlow(false);
            setPage('course');
          }}
        />
      )}
    </div>
  );
}

export default ContentLibraryLauncher;
