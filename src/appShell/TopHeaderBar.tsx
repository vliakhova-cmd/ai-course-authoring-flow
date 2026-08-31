import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCellsLarge, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '../useMediaQuery';

export function TopHeaderBar() {
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
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
        <div style={{ width: 60, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={faTableCellsLarge} style={{ width: 18, height: 18, color: '#1f6aac' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1f6aac', marginRight: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Company Dashboard
        </span>
        <span style={{ color: '#d2e5f6', marginRight: 10, flexShrink: 0 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#100040', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Manage Site Roles
        </span>
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
