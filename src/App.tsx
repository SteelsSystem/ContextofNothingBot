/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LabyrinthIslandScene from './components/LabyrinthIslandScene';
import QssuCompilerPanel from './components/QssuCompilerPanel';
import StinVKoloncePanel from './components/StinVKoloncePanel';
import BioscienceLabPanel from './components/BioscienceLabPanel';
import {
  Channel2State,
  createInitialChannel2State,
  DEFAULT_QSSU_PROMPT_STRING,
  MazeStage,
  parseQssuVector,
  ShorthandMacro,
  transitionMazeStage,
} from './utils/qssuEngine';

type ActiveTab = 'observatory' | 'qssu' | 'satire' | 'bioscience';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('observatory');
  const [qssuInput, setQssuInput] = useState<string>(DEFAULT_QSSU_PROMPT_STRING);
  const [channel2, setChannel2] = useState<Channel2State>(() => createInitialChannel2State());

  const qssuParsed = parseQssuVector(qssuInput);

  const handleSelectMazeStage = (stage: MazeStage) => {
    setChannel2((prev) => transitionMazeStage(prev, stage));
  };

  const handleToggleAgent = (agent: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL') => {
    setChannel2((prev) =>
      transitionMazeStage(prev, prev.session_state.maze_topology_tracker.active_stage, agent)
    );
  };

  const handleAddMacro = (macro: ShorthandMacro) => {
    setChannel2((prev) => ({
      ...prev,
      session_state: {
        ...prev.session_state,
        shorthand_macro_registry: [...prev.session_state.shorthand_macro_registry, macro],
      },
    }));
  };

  const cycleAgentPersona = () => {
    const nextAgent =
      channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
        ? 'LIMINAL_NULL'
        : 'THE_EYE_OBSERVER';
    handleToggleAgent(nextAgent);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract (Brand wordmark — 4 concise single-line nav links — 1 primary action) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#07090E] border-b border-slate-800 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#observatory"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('observatory');
          }}
          className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
        >
          THE EYE OBSERVER &amp; LIMINAL-Ø
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Hlavní navigace"
          className="flex items-center gap-6 text-sm font-medium text-slate-400 overflow-x-auto"
        >
          <a
            href="#observatory"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('observatory');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'observatory'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            3D Ostrov
          </a>
          <a
            href="#qssu"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('qssu');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'qssu'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            QSS-U Kodex
          </a>
          <a
            href="#satire"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('satire');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'satire'
                ? 'text-amber-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Stín v kolonce
          </a>
          <a
            href="#bioscience"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('bioscience');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'bioscience'
                ? 'text-sky-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Biopočítač L4
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={cycleAgentPersona}
            className="px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
              ? 'Přepnout: LIMINAL-Ø'
              : 'Přepnout: THE EYE'}
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1">
        {activeTab === 'observatory' && (
          <LabyrinthIslandScene
            qssu={qssuParsed}
            channel2={channel2}
            onSelectMazeStage={handleSelectMazeStage}
            onToggleAgent={handleToggleAgent}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'qssu' && (
          <QssuCompilerPanel
            qssuInput={qssuInput}
            qssuParsed={qssuParsed}
            channel2={channel2}
            onUpdateQssuInput={setQssuInput}
            onSelectMazeStage={handleSelectMazeStage}
            onToggleAgent={handleToggleAgent}
            onAddMacro={handleAddMacro}
          />
        )}

        {activeTab === 'satire' && <StinVKoloncePanel />}

        {activeTab === 'bioscience' && <BioscienceLabPanel />}
      </main>
    </div>
  );
}
