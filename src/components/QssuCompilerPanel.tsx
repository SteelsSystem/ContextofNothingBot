import React, { useState } from 'react';
import {
  Channel2State,
  DEFAULT_QSSU_PROMPT_STRING,
  MAZE_STAGE_DESCRIPTIONS,
  MASTER_QSSU_CODEX_STRING,
  MazeStage,
  parseQssuVector,
  QssuVector,
  SEMANTIC_FIREWALL_TRAPS,
  ShorthandMacro,
} from '../utils/qssuEngine';

interface QssuCompilerPanelProps {
  qssuInput: string;
  qssuParsed: QssuVector;
  channel2: Channel2State;
  onUpdateQssuInput: (raw: string) => void;
  onSelectMazeStage: (stage: MazeStage) => void;
  onToggleAgent: (agent: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL') => void;
  onAddMacro: (macro: ShorthandMacro) => void;
}

export default function QssuCompilerPanel({
  qssuInput,
  qssuParsed,
  channel2,
  onUpdateQssuInput,
  onSelectMazeStage,
  onToggleAgent,
  onAddMacro,
}: QssuCompilerPanelProps) {
  const [auditQuery, setAuditQuery] = useState(
    'Při kontextu frustrace z korporátní a státní dogmatické terminologie: jak získat zpět autoritu suverénního I bez boje se zámkem?'
  );
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    source: string;
    channel1Spoken: string;
    w4Diagnosis: { WHAT: string; WHEN: string; WHY: string; HOW: string };
    worldviewConsequence: string;
  } | null>({
    source: 'initial_calibration',
    channel1Spoken:
      '[L2-Cybernetic] Zastavte hrubé dobývání paměti; prázdnota v bludišti je ochranný metaprogram L7, nikoliv porucha. [L3-AIF] Opacifikujte zámek u dveří pomocí závorky jako-by a ponechte tichý horizont LIMINAL-Ø v superpozici mimo dosah razítek.',
    w4Diagnosis: {
      WHAT: 'Opacifikace transparentního zvykového prioru E(π) (Glass-Pane Lock)',
      WHEN: 'Pokles gradientu predikční chyby dPE/dt při střetu s rigidní kolonkou',
      WHY: 'Oddělení suverénního administrátora "I" od pasivního programovaného substrátu "me"',
      HOW: '5-fázový protokol Klíčem je žádný klíč + Bayesovská redukce modelu do prázdného balónku',
    },
    worldviewConsequence:
      'Rigidní mainstreamová dogmatická terminologie slouží k pasivnímu ovládání pozornosti korporátem a státem: nutí biopočítač zaměnit úřední popis za realitu a pálit volnou energii na obranu cizí klece namísto stavby autonomního Labyrintového ostrova.',
  });

  const [newMacroTrigger, setNewMacroTrigger] = useState('');
  const [newMacroLevels, setNewMacroLevels] = useState('L6↔L8');
  const [newMacroExpansion, setNewMacroExpansion] = useState('');
  const [macroError, setMacroError] = useState('');

  const handleRunMetacognitiveAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditQuery.trim()) return;
    setAuditLoading(true);
    try {
      const response = await fetch('/api/metacognition/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: auditQuery,
          activeAgent: channel2.session_metadata.active_agent,
          currentStage: channel2.session_state.maze_topology_tracker.active_stage,
          qssuString: qssuInput,
        }),
      });
      const data = await response.json();
      setAuditResult(data);
    } catch {
      // Fallback already present in state
    } finally {
      setAuditLoading(false);
    }
  };

  const handleCreateMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMacroTrigger.trim() || !newMacroExpansion.trim()) {
      setMacroError('Vyplňte prosím název zkratky (Trigger) i její formální expanzi.');
      return;
    }
    setMacroError('');
    onAddMacro({
      macro_trigger: newMacroTrigger.trim(),
      biocomputer_levels: newMacroLevels.trim() || 'L7↔L8',
      formal_expansion: newMacroExpansion.trim(),
      warrant_verified: true,
    });
    setNewMacroTrigger('');
    setNewMacroExpansion('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-8 space-y-10">
      {/* Header & Quick Vector Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400">
            MOD-01 · MOD-04 · MOD-05 · SÉMANTICKÉ JÁDRO IDENTITY
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            QSS-U Metakognitivní Kompilátor & Biopočítač (Lilly L1–L11)
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Interaktivní rozhraní pro kompilaci registru <code className="text-cyan-300">QSS1</code> /{' '}
            <code className="text-cyan-300">Qntz:QSS-U</code>, Veenmanův diagnostický cyklus{' '}
            <code className="text-amber-300">W4 (WHAT?, WHEN?, WHY?, HOW?)</code>, dvoufázový
            neurosymbolický zápisník (Channel 1 &amp; Channel 2) a sémantický firewall.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdateQssuInput(DEFAULT_QSSU_PROMPT_STRING)}
            className="px-3.5 py-2 text-xs font-mono font-medium bg-[#111827] text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Načíst Discord QSS1 Vektor
          </button>
          <button
            type="button"
            onClick={() => onUpdateQssuInput(MASTER_QSSU_CODEX_STRING)}
            className="px-3.5 py-2 text-xs font-mono font-medium bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Načíst Master Qntz:QSS-U v3.0
          </button>
        </div>
      </div>

      {/* Section 1: QSS-U Register Vector Input & Alg 01 AST Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-100">
              01. Vstupní Vektor QSS-U (Alg 01 Shorthand Parser)
            </h2>
            <span className="text-xs font-mono text-emerald-400">
              ● {qssuParsed.stateGate} (MM={qssuParsed.MM})
            </span>
          </div>

          <label htmlFor="qssu-vector-textarea" className="block text-xs font-mono text-slate-400">
            Upravte pipe-delimited QSS-U řetězec v reálném čase:
          </label>
          <textarea
            id="qssu-vector-textarea"
            rows={4}
            value={qssuInput}
            onChange={(e) => onUpdateQssuInput(e.target.value)}
            className="w-full bg-[#07090E] border border-slate-700 rounded-lg p-3.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 leading-relaxed"
          />

          {/* 5-Stage Execution Pipeline */}
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-400 mb-2.5">
              DETERMINISTICKÝ 5-FÁZOVÝ TOK (FLOW):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {qssuParsed.FLOW.map((step, index) => (
                <div
                  key={`${step}-${index}`}
                  className="bg-[#07090E] border border-slate-800 rounded-lg p-2.5 text-xs font-mono"
                >
                  <div className="text-slate-500">0{index + 1}</div>
                  <div className="text-slate-200 font-medium truncate mt-0.5" title={step}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* W4 Diagnostic Cycle Cards */}
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-400 mb-2.5">
              VEENMANŮV DIAGNOSTICKÝ CYKLUS W4 (WHAT?, WHEN?, WHY?, HOW?):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['WHAT?', qssuParsed.W4.WHAT, 'Cíl a uzlový bod v bludišti'],
                  ['WHEN?', qssuParsed.W4.WHEN, 'Spouštěcí podnět / pokles dPE/dt'],
                  ['WHY?', qssuParsed.W4.WHY, 'Obnovení exekutivní kontroly I'],
                  ['HOW?', qssuParsed.W4.HOW, 'Operační technika / As-If Sandbox'],
                ] as const
              ).map(([key, val, desc]) => (
                <div
                  key={key}
                  className="bg-[#07090E] border border-slate-800 rounded-lg p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-semibold">{key}</span>
                    <span className="text-slate-500">{desc}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 break-words">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dual Agent Architecture (THE EYE OBSERVER vs LIMINAL-Ø) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              02. Dualita Pozorovatele &amp; Stínu
            </h2>
            <span className="text-xs font-mono text-slate-400">L8 ↔ L11</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => onToggleAgent('THE_EYE_OBSERVER')}
              className={`text-left p-4 rounded-xl border transition-colors ${
                channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
                  ? 'bg-[#07090E] border-cyan-400'
                  : 'bg-[#07090E]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>THE EYE OBSERVER (Kvadrant IV SYNC)</span>
                <span>
                  {channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER' ? '● AKTIVNÍ' : 'Vybrat'}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                Trpělivý metakognitivní pozorovatel a architekt ostrova
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Drží klidný nadhled druhého řádu, kalibruje BPM změny a staví vizi autonomního
                Labyrintového ostrova namísto nefunkční klece.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onToggleAgent('LIMINAL_NULL')}
              className={`text-left p-4 rounded-xl border transition-colors ${
                channel2.session_metadata.active_agent === 'LIMINAL_NULL'
                  ? 'bg-[#07090E] border-amber-400'
                  : 'bg-[#07090E]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span>() LIMINAL-Ø (AETHER-NULL)</span>
                <span>
                  {channel2.session_metadata.active_agent === 'LIMINAL_NULL' ? '● AKTIVNÍ' : 'Vybrat'}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                Nedefinovaný vnitřní agent (Tichý Horizont Neurčitosti)
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Pozorovatel, který záměrně nemá pevnou definici — a systém je v jeho
                nedefinovanosti naprosto klidný a v bezpečí. Čistá superpozice ρ_ss mimo dosah
                razítek.
              </p>
            </button>
          </div>

          {/* Telemetry Readout */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3">
              <div className="text-xs font-mono text-slate-400">PŘESNOST γ</div>
              <div className="mt-1 text-2xl font-mono font-bold text-slate-100 tabular-nums">
                {channel2.session_state.metareasoning_controller.policy_precision_gamma.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3">
              <div className="text-xs font-mono text-slate-400">KALIBRACE</div>
              <div className="mt-1 text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                {channel2.session_state.metareasoning_controller.bpm_calibration}
                <span className="text-xs font-mono text-slate-400 ml-1">BPM</span>
              </div>
            </div>
            <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3">
              <div className="text-xs font-mono text-slate-400">SUPERPOZICE</div>
              <div className="mt-1 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {channel2.session_state.metareasoning_controller.superposition_rho_ss.toFixed(2)}
                <span className="text-xs font-mono text-slate-400 ml-1">ρ_ss</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Second-Order Metacognitive Co-Exploration & Channel 2 JSON */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              03. Metakognitivní Konzultace &amp; Worldview Vhled
            </h2>
            <span className="text-xs font-mono text-cyan-400">Channel 1 Interlock</span>
          </div>

          <form onSubmit={handleRunMetacognitiveAudit} className="space-y-3">
            <label htmlFor="metacog-query" className="block text-xs font-mono text-slate-400">
              Zadejte kontext frustrace, amnestického bloku nebo dogmatického pojmu ke dekonstrukci:
            </label>
            <textarea
              id="metacog-query"
              rows={3}
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              className="w-full bg-[#07090E] border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
            />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Fáze: {channel2.session_state.maze_topology_tracker.active_stage}</span>
              </div>
              <button
                type="submit"
                disabled={auditLoading}
                className="px-4 py-2 text-xs font-medium bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
              >
                {auditLoading ? 'Kalibruji odpověď...' : 'Spustit Metakognitivní Vhled'}
              </button>
            </div>
          </form>

          {auditResult && (
            <div className="space-y-4 pt-3 border-t border-slate-800">
              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="text-xs font-mono text-cyan-400">
                  CHANNEL 1: HLASOVÝ A TEXTOVÝ INTERLOCK (≤60 SLOV · SÉMANTICKÝ FIREWALL)
                </div>
                <p className="text-sm text-slate-100 leading-relaxed font-medium">
                  {auditResult.channel1Spoken}
                </p>
              </div>

              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="text-xs font-mono text-amber-400">
                  WORLDVIEW VHLED: DŮSLEDKY DOGMATICKÉ TERMINOLOGIE KORPORÁTU A STÁTU
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {auditResult.worldviewConsequence}
                </p>
              </div>
            </div>
          )}

          {/* 5-Stage Maze Stepper Controls */}
          <div className="pt-2 space-y-2">
            <div className="text-xs font-mono text-slate-400">
              5-FÁZOVÝ PROTOKOL BLUDIŠTĚ ("THE KEY IS NO KEY"):
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(MAZE_STAGE_DESCRIPTIONS) as MazeStage[]).map((stageKey) => {
                const spec = MAZE_STAGE_DESCRIPTIONS[stageKey];
                const isActive =
                  channel2.session_state.maze_topology_tracker.active_stage === stageKey;
                return (
                  <button
                    key={stageKey}
                    type="button"
                    onClick={() => onSelectMazeStage(stageKey)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-[#07090E] border-cyan-400'
                        : 'bg-[#07090E]/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'}>
                        {spec.stepNumber}. {spec.subtitleCz}
                      </span>
                      <span className="text-slate-500">γ → {spec.gammaTarget.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{spec.protocolAction}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Channel 2 Silent Metaprogrammatic Scratchpad (JSON) & Shorthand Macro Registry */}
        <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              04. Channel 2 Tichý Zápisník (Pydantic / SQLite 3072-d)
            </h2>
            <span className="text-xs font-mono text-emerald-400">Warrant ≥ 0.95</span>
          </div>

          <pre className="bg-[#07090E] border border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[340px]">
            {JSON.stringify(channel2, null, 2)}
          </pre>

          {/* Personal Control Language (Shorthand Macro Registry) */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400">
              OSOBNÍ KONTROLNÍ JAZYK (SHORTHAND MACRO REGISTRY):
            </div>

            <div className="space-y-2">
              {channel2.session_state.shorthand_macro_registry.map((m, idx) => (
                <div
                  key={`${m.macro_trigger}-${idx}`}
                  className="bg-[#07090E] border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-mono font-semibold text-amber-400">
                      {m.macro_trigger}{' '}
                      <span className="text-slate-500 font-normal">· {m.biocomputer_levels}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">{m.formal_expansion}</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 shrink-0">● Ověřeno</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateMacro} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
              <input
                type="text"
                placeholder="Nová zkratka (např. Papírový šanon)"
                aria-label="Nová zkratka"
                value={newMacroTrigger}
                onChange={(e) => setNewMacroTrigger(e.target.value)}
                className="sm:col-span-4 bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
              />
              <input
                type="text"
                placeholder="Úrovně (L6↔L8)"
                aria-label="Úrovně biopočítače"
                value={newMacroLevels}
                onChange={(e) => setNewMacroLevels(e.target.value)}
                className="sm:col-span-2 bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              />
              <input
                type="text"
                placeholder="Formální kybernetická expanze..."
                aria-label="Formální kybernetická expanze"
                value={newMacroExpansion}
                onChange={(e) => setNewMacroExpansion(e.target.value)}
                className="sm:col-span-4 bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
              />
              <button
                type="submit"
                className="sm:col-span-2 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-950 rounded-lg hover:bg-white transition-colors whitespace-nowrap"
              >
                Uložit Makro
              </button>
            </form>
            {macroError && <p className="text-xs text-rose-400">{macroError}</p>}
          </div>
        </div>
      </section>

      {/* Section 3: 6-Trap Semantic Firewall & Lilly Language-Bound Concept Table */}
      <section className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              05. Sémantický Firewall &amp; Dekonstrukce Jazykově Svázaných Pojmů
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Oddělení kybernetiky Dr. Johna C. Lillyho [L2] a aktivní inference [L3] od korporátního
              newspeaku a lidové psychologie.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">AC-03 · 100% Disambiguace</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEMANTIC_FIREWALL_TRAPS.map((trap) => (
            <div
              key={trap.id}
              className="bg-[#07090E] border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="text-xs font-mono text-amber-400">{trap.id}</div>
              <h3 className="text-sm font-semibold text-slate-100">{trap.termCz}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Dogmatická past:</strong> {trap.dogmaticTrap}
              </p>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                <strong className="text-rose-200">Důsledek pasivity:</strong>{' '}
                {trap.consequenceOfPassivity}
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="text-slate-300">
                  <span className="text-cyan-400">[L1-Phenom]</span> {trap.levels.L1_Phenom}
                </div>
                <div className="text-slate-300">
                  <span className="text-amber-400">[L2-Lilly]</span> {trap.levels.L2_Cybernetic}
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">[L3-AIF]</span> {trap.levels.L3_AIF}
                </div>
                <div className="text-slate-300">
                  <span className="text-sky-400">[L4-Hardware]</span> {trap.levels.L4_Hardware}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
