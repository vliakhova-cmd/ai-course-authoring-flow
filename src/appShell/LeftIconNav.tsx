import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faGraduationCap,
  faChalkboardUser,
  faFileLines,
  faCertificate,
  faGear,
  faChartBar,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import tiLogo from '../assets/ti-logo.svg';

interface NavIconProps {
  icon: typeof faGaugeHigh;
  active?: boolean;
}

function NavIcon({ icon, active = false }: NavIconProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%',
        backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ width: 18, height: 18, color: 'white' }} />
    </div>
  );
}

export function LeftIconNav() {
  return (
    <div
      style={{
        width: 60,
        flexShrink: 0,
        backgroundColor: '#1f6aac',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 15 }}>
        <NavIcon icon={faGaugeHigh} />
        <NavIcon icon={faGraduationCap} />
        <NavIcon icon={faChalkboardUser} />
        <NavIcon icon={faFileLines} />
        <NavIcon icon={faCertificate} />
        <div style={{ height: 30 }} />
        <NavIcon icon={faGear} active />
        <NavIcon icon={faChartBar} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
        <NavIcon icon={faCircleQuestion} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: '100%',
          }}
        >
          {/* Figma "Navigation/MainNav/Elements/Logo" — TI Logo (small), Contrast */}
          <img src={tiLogo} alt="TI" style={{ height: 26, width: 'auto' }} />
        </div>
      </div>
    </div>
  );
}

export default LeftIconNav;
