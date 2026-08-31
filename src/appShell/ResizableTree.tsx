import React, { useEffect, useRef, useState } from 'react';
import { ContentTree } from './ContentTree';
import { SplitterBar } from './SplitterBar';
import { useMediaQuery } from '../useMediaQuery';

// Panel width is user-resizable by dragging the SplitterBar (Figma "Dividers/
// Splitter Bar NEW" — Min & Max Width behaviour).
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 300;

export function ResizableTree() {
  const isWide = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 639px)');
  // No real hover on touch devices — keep the splitter's Resting look always
  // shown there instead of gating it behind a hover that will never fire,
  // so the tree stays reachable at every viewport width.
  const canHover = useMediaQuery('(hover: hover)');
  const [open, setOpen] = useState(isWide);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; width: number } | null>(null);

  // Follow the breakpoint's default open/closed state, but the user can
  // always override it via the splitter regardless of viewport.
  useEffect(() => {
    setOpen(isWide);
  }, [isWide]);

  useEffect(() => {
    if (!dragging) return;
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStart.current.width + (e.clientX - dragStart.current.x)));
      setWidth(next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
    };
  }, [dragging]);

  if (!open) {
    return <SplitterBar type="Open" onToggle={() => setOpen(true)} alwaysVisible={!canHover} />;
  }

  const panel = (
    <div style={{ position: 'relative', display: 'flex', flexShrink: 0, alignSelf: 'stretch' }}>
      <div style={{ width, flexShrink: 0, overflow: 'hidden', backgroundColor: '#fafafa' }}>
        <ContentTree />
      </div>
      <SplitterBar
        type="Close"
        onToggle={() => setOpen(false)}
        alwaysVisible={!canHover}
        onDragStart={e => {
          dragStart.current = { x: e.clientX, width };
          setDragging(true);
        }}
      />
    </div>
  );

  // ─── Narrow viewports: the tree overlays the content instead of pushing
  // it to near-zero width, with a backdrop that closes it on click-away.
  if (isMobile) {
    return (
      <>
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 60, right: 0, backgroundColor: 'rgba(11,21,40,0.3)', zIndex: 20 }}
        />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 60, zIndex: 21, boxShadow: '4px 0px 12px rgba(0,0,0,0.15)' }}>
          {panel}
        </div>
      </>
    );
  }

  return panel;
}

export default ResizableTree;
