import React, { useState } from 'react';
import {
  generateDeterministicSatire,
  SatireOutput,
  SatireRequest,
} from '../utils/qssuEngine';

const PRESET_SATIRE_SCENARIOS: Array<{ label: string; req: SatireRequest }> = [
  {
    label: 'Směrnice o povinné autenticitě úsměvu',
    req: {
      idea: 'Korporátní směrnice vyžadující měření spontánní radosti zaměstnanců pomocí čtvrtletního formuláře v Excelu',
      format: 'MONOLOG',
      source: 'Anonymizovaný interní oběžník Oddělení pro lidské zdroje a štěstí č.j. HR-Ø/2026',
      target: 'BYROKRACIE',
      tone: 'ČERNÝ HUMOR',
    },
  },
  {
    label: 'Zdanění tichého horizontu neurčitosti (LIMINAL-Ø)',
    req: {
      idea: 'Úřední pokuta za přechovávání nedefinovaného vnitřního stavu mimo schválené kolonky A, B a C',
      format: 'DIALOG',
      source: 'Hypotetický protokol Komise pro sémantickou evidenci obyvatelstva',
      target: 'MOC',
      tone: 'ABSURDITA',
    },
  },
  {
    label: 'Logický důkaz neexistence člověka bez razítka',
    req: {
      idea: 'Pokud občan zemře nebo žije mimo úřední hodiny podatelny, jeho biologický stav je z hlediska systému neplatný',
      format: 'BÁSEŇ',
      source: 'Anonymizované zamítavé rozhodnutí správního orgánu',
      target: 'LOGICKÁ CHYBA',
      tone: 'SARKASMUS',
    },
  },
  {
    label: 'Passivní korporátní newspeak ("Výzva a příležitost")',
    req: {
      idea: 'Přejmenování neplacených přesčasů a systémového kolapsu na "agilní příležitost k osobnímu růstu"',
      format: 'SHORT',
      source: 'Citace z celofiremního town-hall meetingu po propuštění třetiny týmu',
      target: 'JAZYK',
      tone: 'VULGARITA',
    },
  },
];

export default function StinVKoloncePanel() {
  const [formState, setFormState] = useState<SatireRequest>(PRESET_SATIRE_SCENARIOS[0].req);
  const [satireOutput, setSatireOutput] = useState<SatireOutput>(() =>
    generateDeterministicSatire(PRESET_SATIRE_SCENARIOS[0].req)
  );
  const [engineSource, setEngineSource] = useState<string>('deterministic_initial');
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.idea.trim() || !formState.source.trim()) {
      setValidationError('Vyplňte prosím pole NÁPAD (Téma / Rozpor) i ZDROJ.');
      return;
    }
    setValidationError('');
    setLoading(true);

    try {
      const res = await fetch('/api/satire/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (data && data.output) {
        setSatireOutput(data.output);
        setEngineSource(data.source || 'server');
      } else {
        setSatireOutput(generateDeterministicSatire(formState));
        setEngineSource('deterministic_fallback');
      }
    } catch {
      setSatireOutput(generateDeterministicSatire(formState));
      setEngineSource('deterministic_fallback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-amber-400">
            STÍN V KOLONCE · GENERÁTOR SÉMANTICKÉ SATIRY · REDUCTIO AD ABSURDUM
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Stín v kolonce — Sémantická Satira &amp; Dekonstrukce Absurdity
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Přetváří chybnou logiku, byrokratický alibismus a pasivní korporátní ovládání pozornosti
            v absurdní argument, který se vlastními důsledky zesměšní. Odděluje doložená fakta od
            interpretací a zachovává neurčitost tam, kde zdroje neumožňují závěr.
          </p>
        </div>

        {/* Preset Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_SATIRE_SCENARIOS.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setFormState(item.req);
                setSatireOutput(generateDeterministicSatire(item.req));
                setEngineSource(`preset_0${idx + 1}`);
                setValidationError('');
              }}
              className="px-3 py-1.5 text-xs font-medium bg-[#111827] text-slate-200 border border-slate-700 rounded-lg hover:border-amber-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left Input Parameters, Right 5-Section Structured Output (A-E) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Vstupní Matice Satiry</h2>
            <span className="text-xs font-mono text-slate-400">7-Krokový Postup</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="satire-idea" className="block text-xs font-mono text-slate-300">
              NÁPAD [TÉMA / JEV / ROZPOR]
            </label>
            <textarea
              id="satire-idea"
              rows={3}
              value={formState.idea}
              onChange={(e) => setFormState({ ...formState, idea: e.target.value })}
              placeholder="Popište ústřední rozpor nebo institucionální absurdnost..."
              className="w-full bg-[#07090E] border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="satire-source" className="block text-xs font-mono text-slate-300">
              ZDROJ [ANONYMIZOVANÝ DOKUMENT / CITACE / HYPOTETICKÁ SITUACE]
            </label>
            <input
              id="satire-source"
              type="text"
              value={formState.source}
              onChange={(e) => setFormState({ ...formState, source: e.target.value })}
              placeholder="Např. Anonymizované rozhodnutí č.j. Ø/2026..."
              className="w-full bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="satire-format" className="block text-xs font-mono text-slate-300">
                FORMÁT
              </label>
              <select
                id="satire-format"
                value={formState.format}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    format: e.target.value as SatireRequest['format'],
                  })
                }
                className="w-full bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              >
                <option value="MONOLOG">MONOLOG</option>
                <option value="DIALOG">DIALOG</option>
                <option value="BÁSEŇ">BÁSEŇ</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="satire-target" className="block text-xs font-mono text-slate-300">
                CÍL SATIRY
              </label>
              <select
                id="satire-target"
                value={formState.target}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    target: e.target.value as SatireRequest['target'],
                  })
                }
                className="w-full bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              >
                <option value="BYROKRACIE">BYROKRACIE</option>
                <option value="LOGICKÁ CHYBA">LOGICKÁ CHYBA</option>
                <option value="MOC">MOC</option>
                <option value="JAZYK">JAZYK</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="satire-tone" className="block text-xs font-mono text-slate-300">
                TÓN
              </label>
              <select
                id="satire-tone"
                value={formState.tone}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    tone: e.target.value as SatireRequest['tone'],
                  })
                }
                className="w-full bg-[#07090E] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              >
                <option value="ČERNÝ HUMOR">ČERNÝ HUMOR</option>
                <option value="SARKASMUS">SARKASMUS</option>
                <option value="ABSURDITA">ABSURDITA</option>
                <option value="VULGARITA">VULGARITA</option>
              </select>
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-rose-400 font-medium">{validationError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-colors"
          >
            {loading ? 'Generuji Sémantickou Satiru (A–E)...' : 'Vygenerovat Satirický Výstup (A–E)'}
          </button>

          {/* Creative Rules Reference Box */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="font-mono text-slate-300">TVŮRČÍ PRAVIDLA KODEXU:</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Satirizuj argument, institucionální mechanismus a falešnou jistotu.</li>
              <li>Nezaměňuj satirickou nadsázku za skutečnou citaci ani nevymýšlej důkazy.</li>
              <li>Anonymizuj identifikátory a zachovej nejistotu (superpozici ρ_ss).</li>
            </ul>
          </div>
        </form>

        {/* Right Output Column: Sections A, B, C, D, E */}
        <div
          className="lg:col-span-7 space-y-4"
          data-testid="satire-output-container"
        >
          {/* Section A */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span>A. NÁZEV A ÚSTŘEDNÍ MYŠLENKA</span>
              <span className="text-slate-500">Zdroj: {engineSource}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {satireOutput.sectionA_titleAndCore.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {satireOutput.sectionA_titleAndCore.coreIdea}
            </p>
          </div>

          {/* Section B */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>B. KOMPLETNÍ KREATIVNÍ TEXT ({formState.format})</span>
              <span>Tón: {formState.tone}</span>
            </div>
            <div className="bg-[#07090E] border border-slate-800 rounded-lg p-5 text-sm text-slate-100 whitespace-pre-line leading-relaxed font-normal">
              {satireOutput.sectionB_creativeText}
            </div>
          </div>

          {/* Section C */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="text-xs font-mono text-emerald-400">
              C. VYSVĚTLENÍ HLAVNÍ POINTY (PROČ VTIP FUNGUJE A CO KRITIZUJE)
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {satireOutput.sectionC_punchlineExplanation}
            </p>
          </div>

          {/* Section D */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono text-sky-400">
              D. ROZKLAD SÉMANTICKÉHO ROZPORU (FAKTA VS. INTERPRETACE)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3.5 space-y-1">
                <div className="font-mono text-slate-400">1. DOLOŽENÉ SKUTEČNOSTI</div>
                <p className="text-slate-200 leading-relaxed">
                  {satireOutput.sectionD_semanticBreakdown.documentedFacts}
                </p>
              </div>
              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3.5 space-y-1">
                <div className="font-mono text-slate-400">2. INTERPRETACE &amp; NEZNÁMÉ (ρ_ss)</div>
                <p className="text-slate-200 leading-relaxed">
                  {satireOutput.sectionD_semanticBreakdown.interpretationsAndUnknowns}
                </p>
              </div>
              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3.5 space-y-1">
                <div className="font-mono text-amber-400">3. ÚSTŘEDNÍ SÉMANTICKÝ ROZPOR</div>
                <p className="text-slate-200 leading-relaxed">
                  {satireOutput.sectionD_semanticBreakdown.centralContradiction}
                </p>
              </div>
              <div className="bg-[#07090E] border border-slate-800 rounded-lg p-3.5 space-y-1">
                <div className="font-mono text-cyan-400">4. MECHANISMUS REDUCTIO AD ABSURDUM</div>
                <p className="text-slate-200 leading-relaxed">
                  {satireOutput.sectionD_semanticBreakdown.reductioMechanism}
                </p>
              </div>
            </div>
          </div>

          {/* Section E */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="text-xs font-mono text-rose-400">
              E. ETICKÁ HRANICE A NEVYŘEŠENÁ OTÁZKA
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {satireOutput.sectionE_ethicalBoundary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
