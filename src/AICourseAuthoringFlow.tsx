import React, { useState } from 'react';
import { ChatMessage, FlowStage, LessonType, RightPanelTab } from './types';
import { AI_FOLLOWUP_RESPONSES, AI_INTRO_RESPONSE, DEFAULT_DESCRIPTION, DEFAULT_SOURCE_DOC } from './mockData';
import { ComposeStep } from './ComposeStep';
import { ThinkingStep } from './ThinkingStep';
import { ResultStep } from './ResultStep';
import { useMediaQuery } from './useMediaQuery';

export interface AICourseAuthoringFlowProps {
  onClose: () => void;
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export function AICourseAuthoringFlow({ onClose }: AICourseAuthoringFlowProps) {
  const [stage, setStage] = useState<FlowStage>('compose');
  const isNarrow = useMediaQuery('(max-width: 640px)');

  // Compose state
  const [sourceDoc, setSourceDoc] = useState<string | null>(DEFAULT_SOURCE_DOC);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>(['document']);
  const [language, setLanguage] = useState('English');
  const [objectives, setObjectives] = useState<string[]>([
    'Understand how to properly manage and maintain regulatory documents throughout a clinical trial.',
  ]);

  // Result state
  const [activeSlideId, setActiveSlideId] = useState('video');
  const [rightTab, setRightTab] = useState<RightPanelTab>('edit');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'intro', from: 'ai', text: AI_INTRO_RESPONSE, timestamp: '12:35' },
  ]);
  const [followUpPending, setFollowUpPending] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);

  const toggleLessonType = (type: LessonType) => {
    setLessonTypes(prev => (prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]));
  };

  const changeObjective = (index: number, value: string) => {
    setObjectives(prev => prev.map((o, i) => (i === index ? value : o)));
  };

  const addObjective = () => setObjectives(prev => [...prev, '']);

  const handleGenerate = () => {
    setStage('thinking');
    window.setTimeout(() => setStage('result'), 1400);
  };

  const handleSendFollowUp = (text: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: 'user', text, timestamp: now() };
    setChatMessages(prev => [...prev, userMsg]);
    setFollowUpPending(true);
    window.setTimeout(() => {
      const reply = AI_FOLLOWUP_RESPONSES[followUpCount % AI_FOLLOWUP_RESPONSES.length];
      setChatMessages(prev => [...prev, { id: `a-${Date.now()}`, from: 'ai', text: reply, timestamp: now() }]);
      setFollowUpCount(c => c + 1);
      setFollowUpPending(false);
    }, 1100);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11,21,40,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isNarrow ? 8 : 20,
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0px 5px 12px rgba(0,0,0,0.2)',
          width: stage === 'result' ? 1350 : 850,
          maxWidth: '100%',
          height: stage === 'result' ? 900 : 'auto',
          minHeight: stage === 'compose' && !isNarrow ? 560 : undefined,
          maxHeight: isNarrow ? '96vh' : '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {stage === 'compose' && (
          <ComposeStep
            sourceDoc={sourceDoc}
            onRemoveSource={() => setSourceDoc(null)}
            description={description}
            onChangeDescription={setDescription}
            lessonTypes={lessonTypes}
            onToggleLessonType={toggleLessonType}
            language={language}
            onChangeLanguage={setLanguage}
            objectives={objectives}
            onChangeObjective={changeObjective}
            onAddObjective={addObjective}
            onCancel={onClose}
            onGenerate={handleGenerate}
          />
        )}

        {stage === 'thinking' && <ThinkingStep onCancel={onClose} />}

        {stage === 'result' && (
          <ResultStep
            activeSlideId={activeSlideId}
            onSelectSlide={setActiveSlideId}
            rightTab={rightTab}
            onChangeTab={setRightTab}
            description={description}
            chatMessages={chatMessages}
            onSendFollowUp={handleSendFollowUp}
            followUpPending={followUpPending}
            language={language}
            onChangeLanguage={setLanguage}
            objectives={objectives}
            onChangeObjective={changeObjective}
            onAddObjective={addObjective}
            onApply={() => setRightTab('edit')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default AICourseAuthoringFlow;
