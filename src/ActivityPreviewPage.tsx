import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCaretRight, faSitemap, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { DOC_PAGES, PageBlock } from './GeneratedSlideContent';
import { AuthoringButton } from './AuthoringButton';
import { SAVED_COURSE } from './savedCourseData';

// Figma "Design Library | PROD | 1.0" — RA - Activity Page - Document
// (node 20753:12764), extended toward an actual SCORM-style player: the
// whole document scrolls continuously (like the rest of this flow), while a
// completion progress bar tracks how far the learner has scrolled — the
// content itself is still the same generated pages used everywhere else in
// this flow (GeneratedSlideContent), not placeholder pages.

export interface ActivityPreviewPageProps {
  activityId: string;
  onBack: () => void;
  onNavigate: (activityId: string) => void;
}

// Decorative collapsed "Activities" rail to the left of the document — same
// Resting-state pill/rail pattern as SplitterBar.tsx, relabeled for this
// screen per the Figma spec ("OPEN" pill + vertical "Activities" label).
function ActivitiesRail() {
  return (
    <div style={{ width: 15, flexShrink: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
      <div
        style={{
          backgroundColor: '#1f6aac',
          borderTopRightRadius: 15,
          height: 75,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}
      >
        <FontAwesomeIcon icon={faCaretRight} style={{ width: 11, height: 11, color: 'white' }} />
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12, color: 'white', fontFamily: "'Open Sans', sans-serif" }}>
          OPEN
        </span>
      </div>
      <div style={{ flex: '1 0 0', backgroundColor: '#d2e5f6', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <FontAwesomeIcon icon={faSitemap} style={{ width: 11, height: 11, color: '#1f6aac' }} />
          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12, color: '#1f6aac', fontFamily: "'Open Sans', sans-serif" }}>
            Activities
          </span>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 2 }}>
          <div style={{ width: 1, height: 50, borderRadius: 0.5, backgroundColor: '#1f6aac' }} />
          <div style={{ width: 1, height: 50, borderRadius: 0.5, backgroundColor: '#1f6aac' }} />
        </div>
      </div>
    </div>
  );
}

export function ActivityPreviewPage({ activityId, onBack, onNavigate }: ActivityPreviewPageProps) {
  const activities = SAVED_COURSE.activities;
  const index = activities.findIndex(a => a.id === activityId);
  const activity = activities[index] ?? activities[0];
  const previousActivity = index > 0 ? activities[index - 1] : null;
  const nextActivity = index >= 0 && index < activities.length - 1 ? activities[index + 1] : null;
  const showOriginalPdf = activity.icon === 'pdf';

  // SCORM-style completion tracking on a continuously scrolling document:
  // which page is currently in view, and the furthest one reached so far
  // (progress only ever moves forward, like a real SCORM completion
  // tracker — scrolling back up to review doesn't lose it).
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Switching activities restarts scroll position and progress for this one.
  useEffect(() => {
    setCurrentPageIndex(0);
    setFurthestIndex(0);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [activityId]);

  useEffect(() => {
    if (showOriginalPdf) return;
    const root = scrollContainerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const id = topMost.target.getAttribute('data-page-id');
        const pageIdx = DOC_PAGES.findIndex(p => p.id === id);
        if (pageIdx >= 0) {
          setCurrentPageIndex(pageIdx);
          setFurthestIndex(f => Math.max(f, pageIdx));
        }
      },
      { root, rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );
    Object.values(pageRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activityId, showOriginalPdf]);

  const progressPct = Math.round(((furthestIndex + 1) / DOC_PAGES.length) * 100);
  const isComplete = furthestIndex === DOC_PAGES.length - 1;

  return (
    <div style={{ flex: '1 0 0', minWidth: 0, minHeight: 0, display: 'flex', fontFamily: "'Open Sans', sans-serif" }}>
      <ActivitiesRail />

      <div style={{ flex: '1 0 0', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa', padding: '15px 30px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, minWidth: 0 }}>
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to course"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                flexShrink: 0,
                backgroundColor: '#edf5fb',
                border: '1px solid #1f6aac',
                borderRadius: 4,
                cursor: 'pointer',
                boxShadow: '0px 1px 1.5px rgba(35,80,155,0.4)',
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ width: 15, height: 15, color: '#1f6aac' }} />
            </button>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 400,
                lineHeight: '40px',
                color: '#100040',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activity.name}
            </h1>
          </div>

          {!showOriginalPdf && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: '#5d6982', whiteSpace: 'nowrap' }}>
                Page {currentPageIndex + 1} of {DOC_PAGES.length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {isComplete && <FontAwesomeIcon icon={faCircleCheck} style={{ width: 15, height: 15, color: '#25861e' }} />}
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982', whiteSpace: 'nowrap' }}>
                  {isComplete ? 'Completed' : `${progressPct}% complete`}
                </span>
              </div>
            </div>
          )}
        </div>
        <div style={{ height: 1, backgroundColor: '#d2e5f6', width: '100%', flexShrink: 0 }} />

        {/* SCORM-style completion progress bar — fills as the furthest page
            scrolled into view advances, like a course player's tracked
            progress. */}
        {!showOriginalPdf && (
          <div style={{ height: 4, width: '100%', backgroundColor: '#e5e5e5', flexShrink: 0 }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                backgroundColor: isComplete ? '#25861e' : '#1f6aac',
                transition: 'width 200ms ease',
              }}
            />
          </div>
        )}

        {/* Document viewer */}
        {showOriginalPdf ? (
          // The actual uploaded source file, in a native PDF viewer — not a
          // recreation, the real thing (public/ascend-ra-protocol.pdf).
          <div style={{ flex: '1 0 0', minHeight: 0, backgroundColor: 'rgba(122,122,122,0.7)', padding: 30, display: 'flex', justifyContent: 'center' }}>
            <iframe
              title="ASCEND-RA Clinical Study Protocol — source PDF"
              src={`${import.meta.env.BASE_URL}ascend-ra-protocol.pdf`}
              style={{ width: '100%', maxWidth: 900, height: '100%', border: 'none', backgroundColor: 'white' }}
            />
          </div>
        ) : (
          // The full document, scrolling continuously — same generated
          // pages as the authoring preview, same content, same names.
          <div
            ref={scrollContainerRef}
            style={{
              flex: '1 0 0',
              minHeight: 0,
              overflowY: 'auto',
              backgroundColor: 'rgba(122,122,122,0.7)',
              padding: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ width: '100%', maxWidth: 900, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {DOC_PAGES.map(page => (
                <div key={page.id} ref={el => (pageRefs.current[page.id] = el)} data-page-id={page.id}>
                  <PageBlock page={page} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer — navigates between this course's activities */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 15, padding: 15, backgroundColor: '#fafafa', borderTop: '1px solid #ededed', flexShrink: 0 }}>
          <AuthoringButton
            variant="secondary"
            disabled={!previousActivity}
            onClick={previousActivity ? () => onNavigate(previousActivity.id) : undefined}
          >
            Previous Activity
          </AuthoringButton>
          <AuthoringButton
            variant="primary"
            disabled={!nextActivity}
            onClick={nextActivity ? () => onNavigate(nextActivity.id) : undefined}
          >
            Next Activity
          </AuthoringButton>
        </div>
      </div>
    </div>
  );
}

export default ActivityPreviewPage;
