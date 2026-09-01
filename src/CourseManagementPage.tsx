import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPen,
  faEye,
  faBook,
  faUserPlus,
  faCaretDown,
  faTrash,
  faPlus,
  faCube,
  faCircleQuestion,
  faEllipsis,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { AuthoringButton } from './AuthoringButton';
import { SAVED_COURSE, CourseActivity } from './savedCourseData';
import courseThumbnail from './assets/course-thumbnail.jpg';

// Figma "Design Library | PROD | 1.0" — Course Management (added activities),
// node 20750:9881. LeftIconNav + TopHeaderBar (with these crumbs) are
// rendered by the parent (ContentLibraryLauncher); this component is just
// the page content to their right.

export interface CourseManagementPageProps {
  onBack: () => void;
  onOpenActivity: (activity: CourseActivity) => void;
}

function ActionLink({ icon, label, onClick, color = '#1f6aac' }: { icon: typeof faPen; label: string; onClick?: () => void; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 1, background: 'none', border: 'none', cursor: 'pointer' }}
    >
      <FontAwesomeIcon icon={icon} style={{ width: 15, height: 15, color }} />
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 37,
        height: 20,
        borderRadius: 10,
        border: 'none',
        padding: 2,
        display: 'flex',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        backgroundColor: checked ? '#25861e' : '#d9d9df',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background-color 150ms',
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'white', boxShadow: '0px 1px 2px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

function ActivityRow({
  name,
  subtitle,
  icon,
  required,
  onToggle,
  onOpen,
}: {
  name: string;
  subtitle?: string;
  icon: 'document' | 'quiz' | 'pdf';
  required: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const iconColor = icon === 'pdf' ? '#d23c2d' : '#1f6aac';
  const activityIcon = icon === 'quiz' ? faCircleQuestion : icon === 'pdf' ? faFilePdf : faCube;
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 5, gap: 15 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(c => !c)}
        style={{ width: 15, height: 15, accentColor: '#1f6aac', cursor: 'pointer', flexShrink: 0 }}
      />
      <button
        type="button"
        aria-label="More actions"
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
      <button
        type="button"
        onClick={onOpen}
        style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '1 0 0', minWidth: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FontAwesomeIcon icon={activityIcon} style={{ width: 15, height: 15, color: iconColor, flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#100040' }}>{name}</span>
        </div>
        {subtitle && <span style={{ fontSize: 12, color: '#5d6982', paddingLeft: 20 }}>{subtitle}</span>}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexShrink: 0 }}>
        <span style={{ fontSize: 14, color: '#100040' }}>Required</span>
        <Toggle checked={required} onChange={onToggle} />
      </div>
    </div>
  );
}

export function CourseManagementPage({ onBack, onOpenActivity }: CourseManagementPageProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const [activities, setActivities] = useState(SAVED_COURSE.activities);
  const course = SAVED_COURSE;

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(a => (a.id === id ? { ...a, required: !a.required } : a)));
  };

  return (
    <div style={{ flex: '1 0 0', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", overflowY: 'auto' }}>
      {/* Course header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: '#fafafa', padding: '15px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Content Library"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                backgroundColor: '#edf5fb',
                border: '1px solid #1f6aac',
                borderRadius: 4,
                cursor: 'pointer',
                boxShadow: '0px 1px 1.5px rgba(35,80,155,0.4)',
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            </button>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 400, lineHeight: '40px', color: '#100040' }}>{course.title}</h1>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 15,
                padding: '2px 7px 3px',
                borderRadius: 5,
                backgroundColor: '#d8d8d8',
                fontSize: 11,
                fontWeight: 600,
                color: '#100040',
                textTransform: 'uppercase',
              }}
            >
              {course.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 15, paddingLeft: 45 }}>
            <img
              src={courseThumbnail}
              alt=""
              style={{
                width: 152,
                height: 110,
                borderRadius: 4,
                flexShrink: 0,
                objectFit: 'cover',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 30, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Course Type</span>
                    <FontAwesomeIcon icon={faBook} style={{ width: 15, height: 15, color: '#5d6982' }} />
                    <span style={{ fontSize: 14, color: '#100040' }}>{course.courseType}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Version</span>
                    <span style={{ fontSize: 14, color: '#100040' }}>{course.version}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Catalog</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 20,
                        minWidth: 20,
                        padding: '2px 8px',
                        borderRadius: 12.5,
                        backgroundColor: '#edf5fb',
                        border: '1px solid #d2e5f6',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1f6aac',
                      }}
                    >
                      {course.catalogCount}
                    </span>
                  </div>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: 12, color: '#100040', lineHeight: '15px', maxWidth: 500, display: descExpanded ? 'block' : '-webkit-box', WebkitLineClamp: descExpanded ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: descExpanded ? 'visible' : 'hidden' }}>
                    {course.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDescExpanded(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1f6aac' }}>{descExpanded ? 'Show less' : 'Show more'}</span>
                    <FontAwesomeIcon icon={faCaretDown} style={{ width: 11, height: 11, color: '#1f6aac', transform: descExpanded ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1f6aac' }}>{course.userCount}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1f6aac' }}>Users</span>
                </div>
                <ActionLink icon={faUserPlus} label="Enroll Users & Groups" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 15, alignItems: 'center', flexShrink: 0 }}>
          <ActionLink icon={faPen} label="Edit Details" />
          <ActionLink icon={faEye} label="Preview" />
          <AuthoringButton variant="primary">Publish</AuthoringButton>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#edf5fb', padding: '10px 30px' }}>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <ActionLink icon={faTrash} label="Cancel" color="#d23c2d" />
          <ActionLink icon={faPlus} label="Add Topic" />
        </div>
      </div>

      {/* Activities */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30 }}>
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            backgroundColor: 'white',
            // Figma "1st section" (node 20750:9886) exact drop shadow.
            boxShadow: '2px 5px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Topic header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 15px 10px 15px' }}>
            <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
              <div style={{ paddingTop: 7 }}>
                <FontAwesomeIcon icon={faCaretDown} style={{ width: 13, height: 13, color: '#1f6aac' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#100040' }}>Step 1</span>
                <span style={{ fontSize: 12, color: '#5d6982' }}>{activities.length} Activities</span>
              </div>
            </div>
            <ActionLink icon={faPen} label="Edit Topic" />
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%' }} />

          {/* Toolbar/Default */}
          <div style={{ display: 'flex', alignItems: 'center', height: 40, backgroundColor: '#edf5fb', padding: '10px 15px' }}>
            <ActionLink icon={faPlus} label="Add Activity" />
          </div>

          {/* Activity list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, padding: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activities.map(activity => (
                <ActivityRow
                  key={activity.id}
                  name={activity.name}
                  subtitle={activity.subtitle}
                  icon={activity.icon}
                  required={activity.required}
                  onToggle={() => toggleActivity(activity.id)}
                  onOpen={() => onOpenActivity(activity)}
                />
              ))}
            </div>
            <AuthoringButton variant="secondary" style={{ alignSelf: 'flex-start', display: 'flex', gap: 5 }}>
              <FontAwesomeIcon icon={faPlus} style={{ width: 13, height: 13 }} />
              Add Activity
            </AuthoringButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseManagementPage;
