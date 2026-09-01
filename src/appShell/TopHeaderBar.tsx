import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCellsLarge, faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '../useMediaQuery';

// Figma "Breadcrumbs/Elements/Crumbs" divider: a slanted 10×59 line (not a
// plain "/"), stroke #e5e5e5 — used between the apps icon and each crumb.
function CrumbDivider() {
  return (
    <svg width="10" height="59" viewBox="0 0 10 59" fill="none" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M0.999032 59.5L8.47465 30.59L0.999827 0" stroke="#e5e5e5" />
    </svg>
  );
}

function Crumb({ label, color, icon, onClick }: { label: string; color: string; icon?: IconDefinition; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 14,
        fontWeight: 700,
        color,
        padding: '7px 5px 7px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: 'none',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        font: 'inherit',
      }}
    >
      {icon && <FontAwesomeIcon icon={icon} style={{ width: 15, height: 15, color, flexShrink: 0 }} />}
      {label}
    </Tag>
  );
}

export interface Crumb {
  label: string;
  color?: string;
  icon?: IconDefinition;
  onClick?: () => void;
}

export interface TopHeaderBarProps {
  /** Defaults to "Company Dashboard / Manage Site Roles" (Content Library screen). */
  crumbs?: Crumb[];
}

const DEFAULT_CRUMBS: Crumb[] = [
  { label: 'Company Dashboard', color: '#1f6aac' },
  { label: 'Manage Site Roles', color: '#100040' },
];

export function TopHeaderBar({ crumbs = DEFAULT_CRUMBS }: TopHeaderBarProps) {
  const showLanguageSelector = useMediaQuery('(min-width: 640px)');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 62,
        backgroundColor: 'white',
        boxShadow: '0px 2px 3.5px rgba(0,0,0,0.15)',
        padding: '0 15px 0 0',
        fontFamily: "'Open Sans', sans-serif",
        position: 'relative',
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ width: 60, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={faTableCellsLarge} style={{ width: 20, height: 20, color: '#1f6aac' }} />
        </div>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <CrumbDivider />
            <Crumb label={crumb.label} color={crumb.color ?? '#100040'} icon={crumb.icon} onClick={crumb.onClick} />
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexShrink: 0 }}>
        {showLanguageSelector && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              width: 170,
              padding: 5,
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: 4,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>🇺🇸</span>
            <span style={{ flex: 1, fontSize: 14, color: '#100040' }}>English (EN)</span>
            <FontAwesomeIcon icon={faChevronDown} style={{ width: 11, height: 11, color: '#576581' }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#7349aa',
              border: '1px solid #edf5fb',
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            SL
          </div>
          <FontAwesomeIcon icon={faChevronDown} style={{ width: 10, height: 10, color: '#100040' }} />
        </div>
      </div>
    </div>
  );
}

export default TopHeaderBar;
