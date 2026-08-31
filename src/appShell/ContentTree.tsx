import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faGear, faChevronRight, faFolder } from '@fortawesome/free-solid-svg-icons';
import { TREE_DATA, TreeNode, DEFAULT_EXPANDED, DEFAULT_SELECTED } from './treeData';

interface RowProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selected: string;
  onSelect: (id: string) => void;
}

function TreeRow({ node, depth, expanded, onToggle, selected, onSelect }: RowProps) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = selected === node.id;
  const isTopLevel = depth === 0;
  const [hover, setHover] = useState(false);

  // Figma "Tree/Elements/Row" — Hover tints the row #d2e5f6 (Primary Color 3)
  // while text/icons stay their resting dark color; Selected is the stronger
  // #5391c6 fill with white text. Hover never overrides Selected.
  const bg = isSelected ? '#5391c6' : hover ? '#d2e5f6' : 'transparent';

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) onToggle(node.id);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          width: '100%',
          height: 35,
          padding: `7px 15px 8px ${15 + depth * 20}px`,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: bg,
          textAlign: 'left',
          transition: 'background-color 100ms',
        }}
      >
        {hasChildren ? (
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{
              width: 9,
              height: 9,
              color: isSelected ? 'white' : '#1f6aac',
              transform: isOpen ? 'rotate(90deg)' : 'none',
              transition: 'transform 100ms',
              flexShrink: 0,
            }}
          />
        ) : (
          <span style={{ width: 9, flexShrink: 0 }} />
        )}
        <FontAwesomeIcon
          icon={faFolder}
          style={{ width: 13, height: 13, color: isSelected ? 'white' : '#1f6aac', flexShrink: 0 }}
        />
        <span
          title={node.label}
          style={{
            flex: '1 0 0',
            fontSize: 14,
            fontWeight: isTopLevel || (hasChildren && depth === 1) ? 600 : 400,
            color: isSelected ? 'white' : '#100040',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          {node.label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? 'white' : '#100040', flexShrink: 0 }}>
          {node.count}
        </span>
      </button>
      {hasChildren && isOpen && (
        <>
          {node.children!.map(child => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </>
  );
}

export function ContentTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(DEFAULT_EXPANDED));
  const [selected, setSelected] = useState(DEFAULT_SELECTED);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', flexShrink: 0, backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: 15 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            flex: '1 0 0',
            height: 30,
            padding: '0 5px',
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: 4,
          }}
        >
          <span style={{ flex: 1, fontSize: 14, color: '#5d6982', fontFamily: "'Open Sans', sans-serif" }}>Search</span>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 13, height: 13, color: '#5d6982' }} />
        </div>
        <FontAwesomeIcon icon={faGear} style={{ width: 15, height: 15, color: '#1f6aac', flexShrink: 0 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TREE_DATA.map(node => (
          <TreeRow
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            onToggle={toggle}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </div>
    </div>
  );
}

export default ContentTree;
