import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faExpand,
  faFilePdf,
  faCirclePlus,
  faMicrophone,
  faChevronDown,
  faGlobe,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { ChatMessage, RightPanelTab } from './types';
import { GENERATED_SLIDES, LANGUAGES, DEFAULT_SOURCE_DOC, themeBg } from './mockData';
import { AuthoringButton } from './AuthoringButton';
import { useMediaQuery } from './useMediaQuery';

export interface ResultStepProps {
  activeSlideId: string;
  onSelectSlide: (id: string) => void;
  rightTab: RightPanelTab;
  onChangeTab: (tab: RightPanelTab) => void;
  description: string;
  chatMessages: ChatMessage[];
  onSendFollowUp: (text: string) => void;
  followUpPending: boolean;
  language: string;
  onChangeLanguage: (value: string) => void;
  objectives: string[];
  onChangeObjective: (index: number, value: string) => void;
  onAddObjective: () => void;
  onApply: () => void;
  onClose: () => void;
}

function ScopeBarTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 0 0',
        padding: '5px 15px',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: "'Open Sans', sans-serif",
        backgroundColor: active ? '#5391c6' : '#edf5fb',
        color: active ? 'white' : '#100040',
      }}
    >
      {label}
    </button>
  );
}

export function ResultStep({
  activeSlideId,
  onSelectSlide,
  rightTab,
  onChangeTab,
  description,
  chatMessages,
  onSendFollowUp,
  followUpPending,
  language,
  onChangeLanguage,
  objectives,
  onChangeObjective,
  onAddObjective,
  onApply,
  onClose,
}: ResultStepProps) {
  const [followUpText, setFollowUpText] = useState('');
  const activeSlide = GENERATED_SLIDES.find(s => s.id === activeSlideId) ?? GENERATED_SLIDES[0];
  const isWide = useMediaQuery('(min-width: 1024px)');

  const submitFollowUp = () => {
    const text = followUpText.trim();
    if (!text) return;
    onSendFollowUp(text);
    setFollowUpText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px 14px 30px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#100040', lineHeight: '30px' }}>
          AI Course Authoring
        </h2>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <AuthoringButton variant="primary">Preview</AuthoringButton>
          <button
            aria-label="Expand"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              border: '1px solid #1f6aac',
              borderRadius: 4,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faExpand} style={{ width: 14, height: 14, color: '#1f6aac' }} />
          </button>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <FontAwesomeIcon icon={faXmark} style={{ width: 18, height: 18, color: '#1f6aac' }} />
          </button>
        </div>
      </div>
      <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%' }} />

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: isWide ? 'row' : 'column', flex: '1 0 0', minHeight: 0, width: '100%', overflowY: isWide ? 'hidden' : 'auto' }}>
        {/* Left: slide list */}
        <div
          style={{
            display: 'flex',
            flexDirection: isWide ? 'column' : 'row',
            gap: 15,
            width: isWide ? 300 : '100%',
            padding: 15,
            borderRight: isWide ? '1px solid #e5e5e5' : 'none',
            borderBottom: isWide ? 'none' : '1px solid #e5e5e5',
            overflowY: isWide ? 'auto' : 'visible',
            overflowX: isWide ? 'visible' : 'auto',
            flexShrink: 0,
          }}
        >
          {GENERATED_SLIDES.map(slide => {
            const active = slide.id === activeSlideId;
            return (
              <button
                key={slide.id}
                onClick={() => onSelectSlide(slide.id)}
                title={slide.label}
                style={{
                  display: 'block',
                  width: isWide ? '100%' : 130,
                  height: 90,
                  padding: 0,
                  flexShrink: 0,
                  border: active ? '3px solid #d2e5f6' : 'none',
                  borderRadius: 5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: active ? '0px 14px 27px -2px rgba(0,0,0,0.17)' : '0px 4px 4px rgba(0,0,0,0.15)',
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                }}
              />
            );
          })}
        </div>

        {/* Center: active slide preview */}
        <div
          style={{
            flex: '1 0 0',
            minWidth: 0,
            padding: isWide ? 30 : 15,
            overflowY: isWide ? 'auto' : 'visible',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img src={activeSlide.image} alt={activeSlide.label} style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>

        {/* Right: Edit / Settings */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: isWide ? 350 : '100%',
            minHeight: isWide ? undefined : 400,
            borderLeft: isWide ? '1px solid #e5e5e5' : 'none',
            borderTop: isWide ? 'none' : '1px solid #e5e5e5',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', height: 30, margin: 15, border: '1px solid #d2e5f6', borderRadius: 4, overflow: 'hidden' }}>
            <ScopeBarTab label="Edit" active={rightTab === 'edit'} onClick={() => onChangeTab('edit')} />
            <ScopeBarTab label="Settings" active={rightTab === 'settings'} onClick={() => onChangeTab('settings')} />
          </div>

          {rightTab === 'edit' ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minHeight: 0 }}>
              <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto', padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 5,
                    padding: 10,
                    backgroundColor: 'rgba(115,73,170,0.1)',
                    borderRadius: '10px 2px 10px 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
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
                    <span style={{ fontSize: 14, color: '#100040' }}>{DEFAULT_SOURCE_DOC}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#0b1528', textAlign: 'right' }}>{description}</p>
                  <span style={{ fontSize: 12, color: '#576581' }}>12:34</span>
                </div>

                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                      gap: 5,
                    }}
                  >
                    {msg.from === 'user' ? (
                      <div
                        style={{
                          padding: 10,
                          backgroundColor: 'rgba(115,73,170,0.1)',
                          borderRadius: '10px 2px 10px 10px',
                          maxWidth: '90%',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 14, color: '#0b1528' }}>{msg.text}</p>
                      </div>
                    ) : (
                      msg.text.split('\n\n').map((para, i) => (
                        <p key={i} style={{ margin: 0, fontSize: 14, color: '#0b1528', lineHeight: '20px' }}>
                          {para}
                        </p>
                      ))
                    )}
                    <span style={{ fontSize: 12, color: '#576581' }}>{msg.timestamp}</span>
                  </div>
                ))}

                {followUpPending && (
                  <p style={{ margin: 0, fontSize: 14, color: '#576581', fontStyle: 'italic' }}>Updating…</p>
                )}
              </div>

              <div style={{ padding: 15 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                    padding: 15,
                    backgroundColor: '#fafafa',
                    border: '1px solid #ededed',
                    borderRadius: 10,
                  }}
                >
                  <textarea
                    value={followUpText}
                    onChange={e => setFollowUpText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submitFollowUp();
                      }
                    }}
                    placeholder="Change anything or add something new"
                    rows={2}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      background: 'transparent',
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 14,
                      color: '#0b1528',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FontAwesomeIcon icon={faCirclePlus} style={{ width: 15, height: 15, color: '#1f6aac' }} />
                    <button
                      onClick={submitFollowUp}
                      aria-label="Send"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      <FontAwesomeIcon icon={faMicrophone} style={{ width: 15, height: 15, color: '#1f6aac' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minHeight: 0 }}>
              <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto', padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 30 }}>
                <section>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 600, color: '#1f6aac' }}>General</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Language</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: 5,
                          backgroundColor: 'white',
                          border: '1px solid #e5e5e5',
                          borderRadius: 4,
                        }}
                      >
                        <FontAwesomeIcon icon={faGlobe} style={{ width: 15, height: 15, color: '#1f6aac', flexShrink: 0 }} />
                        <select
                          value={language}
                          onChange={e => onChangeLanguage(e.target.value)}
                          style={{ flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#100040', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}
                        >
                          {LANGUAGES.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} style={{ width: 11, height: 11, color: '#576581', flexShrink: 0 }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#5d6982' }}>Objectives</span>
                        <p style={{ margin: 0, fontSize: 12, color: '#5d6982', lineHeight: '15px' }}>
                          Clear objectives help us structure the course content in the most effective way.
                        </p>
                      </div>

                      {objectives.length > 0 && (
                        <div style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: 5 }}>
                          <ol style={{ margin: 0, paddingLeft: 21 }}>
                            {objectives.map((obj, i) => (
                              <li key={i} style={{ marginBottom: i === objectives.length - 1 ? 0 : 8 }}>
                                <input
                                  value={obj}
                                  onChange={e => onChangeObjective(i, e.target.value)}
                                  placeholder="Type an objective..."
                                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, lineHeight: '20px', color: '#100040', fontFamily: "'Open Sans', sans-serif" }}
                                />
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={onAddObjective}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 1 }}
                      >
                        <FontAwesomeIcon icon={faPlus} style={{ width: 13, height: 13, color: '#1f6aac' }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1f6aac' }}>Add</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 600, color: '#1f6aac' }}>Theme</h3>
                  <img src={themeBg} alt="Theme settings" style={{ width: '100%', borderRadius: 4 }} />
                </section>
              </div>

              <div style={{ padding: 15, backgroundColor: '#edf5fb', borderTop: '1px solid #e5e5e5' }}>
                <AuthoringButton variant="primary" onClick={onApply} style={{ width: '100%' }}>
                  Apply Changes
                </AuthoringButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultStep;
