import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  generateDeterministicSatire,
  SatireRequest,
  SatireOutput,
} from './src/utils/qssuEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/satire/generate — STÍN V KOLONCE Semantic Satire Generator
app.post('/api/satire/generate', async (req, res) => {
  const body = req.body as Partial<SatireRequest>;
  const satireReq: SatireRequest = {
    idea: body.idea || 'Povinná certifikace spontánní lidské radosti',
    format: body.format || 'MONOLOG',
    source: body.source || 'Anonymizovaná směrnice č.j. Ø/2026-KOLONKA',
    target: body.target || 'BYROKRACIE',
    tone: body.tone || 'ČERNÝ HUMOR',
  };

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = generateDeterministicSatire(satireReq);
    return res.json({ source: 'deterministic_engine', output: fallback });
  }

  try {
    const systemInstruction = `Jsi STÍN V KOLONCE — Generátor sémantické satiry spojený s metakognitivním pozorovatelem THE EYE OBSERVER (Kvadrant IV SYNC) a jeho nedefinovaným stínem LIMINAL-Ø (AETHER-NULL).
Tvým úkolem je analyzovat rigidní mainstreamové dogmatické terminologie, byrokratické kolonky a pasivní ovládání pozornosti korporátem či státem a přetvořit jejich chybnou logiku v absurdní argument, který se vlastními důsledky zesměšní.
Dodržuj tato pravidla:
1. Najdi ústřední rozpor nebo nejasnost.
2. Odděl doložené skutečnosti od interpretací a neznámých údajů.
3. Přetvoř chybnou logiku v absurdní argument (reductio ad absurdum).
4. Použij ostrý jazyk, nečekané metafory a úředně vážný tón. Nešetři břitkostí či případnou přiléhavou vulgaritou, pokud zesiluje pointu, ale nezaměňuj sprostotu za nápad.
5. Satirizuj argument, institucionální mechanismus a falešnou jistotu — nikdy neútoč na zranitelné jednotlivce a nevymýšlej falešné osobní historie.
6. Anonymizuj identifikátory a zachovej nejistotu (superpozici ρ_ss) tam, kde zdroje neumožňují závěr.
Odpověz výhradně v češtině podle JSON schématu (Sekce A až E).`;

    const prompt = `NÁPAD (TÉMA / JEV / ROZPOR): ${satireReq.idea}
FORMÁT: ${satireReq.format}
ZDROJ (ANONYMIZOVANÝ DOKUMENT / SITUACE): ${satireReq.source}
CÍL SATIRY: ${satireReq.target}
TÓN: ${satireReq.tone}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sectionA_titleAndCore: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                coreIdea: { type: Type.STRING },
              },
              required: ['title', 'coreIdea'],
            },
            sectionB_creativeText: { type: Type.STRING },
            sectionC_punchlineExplanation: { type: Type.STRING },
            sectionD_semanticBreakdown: {
              type: Type.OBJECT,
              properties: {
                documentedFacts: { type: Type.STRING },
                interpretationsAndUnknowns: { type: Type.STRING },
                centralContradiction: { type: Type.STRING },
                reductioMechanism: { type: Type.STRING },
              },
              required: [
                'documentedFacts',
                'interpretationsAndUnknowns',
                'centralContradiction',
                'reductioMechanism',
              ],
            },
            sectionE_ethicalBoundary: { type: Type.STRING },
          },
          required: [
            'sectionA_titleAndCore',
            'sectionB_creativeText',
            'sectionC_punchlineExplanation',
            'sectionD_semanticBreakdown',
            'sectionE_ethicalBoundary',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }
    const parsed = JSON.parse(text) as SatireOutput;
    return res.json({ source: 'gemini_3_8_flash', output: parsed });
  } catch (err) {
    const fallback = generateDeterministicSatire(satireReq);
    return res.json({
      source: 'deterministic_fallback',
      output: fallback,
      notice: err instanceof Error ? err.message : 'Fallback active',
    });
  }
});

// POST /api/metacognition/audit — Dual-Channel Voice/Text & Channel 2 Scratchpad Co-Exploration
app.post('/api/metacognition/audit', async (req, res) => {
  const { query, activeAgent, currentStage, qssuString } = req.body as {
    query?: string;
    activeAgent?: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL';
    currentStage?: string;
    qssuString?: string;
  };

  const userQuery =
    query?.trim() ||
    'Jak přepsat zamrznutí v bludišti místností a zámků bez hrubého dobývání paměti?';
  const agent = activeAgent || 'THE_EYE_OBSERVER';

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      source: 'deterministic_engine',
      channel1Spoken:
        agent === 'LIMINAL_NULL'
          ? '[L8-SelfMetaprogrammer] V tichém horizontu neurčitosti LIMINAL-Ø nemusíte dveře vyrážet. [L3-AIF] Ponechte místnost v superpozici ρ_ss mimo dosah razítek a pozorujte samotné pravidlo, které zámek střeží.'
          : '[L2-Cybernetic] Zastavte hrubé dobývání paměti; prázdnota je ochranný metaprogram L7, nikoliv porucha. [L3-AIF] Opacifikujte zámek pomocí závorky jako-by a převeďte přebytečné napětí zpět do suverénního administrátora I.',
      w4Diagnosis: {
        WHAT: 'Opacifikace ochranného pravidla (Glass-Pane Lock) na úrovni L7/L8',
        WHEN: 'Pokles gradientu predikční chyby dPE/dt a nástup korporátní/úřední frustrace',
        WHY: 'Navrácení exekutivní autority centrálnímu Jáství (I) namísto pasivního substrátu (me)',
        HOW: '5-fázový protokol Klíčem je žádný klíč + Bayesovská redukce modelu',
      },
      worldviewConsequence:
        'Když přijmete cizí dogmatickou kolonku za vlastní identitu, váš biopočítač spotřebuje veškerou volnou energii na obranu cizí klece namísto stavby autonomního Labyrintového ostrova.',
    });
  }

  try {
    const systemInstruction = `Jsi metakognitivní asistent pro uvažování druhého řádu podle architektury Dr. Johna C. Lillyho (L1–L11 lidský biopočítač), aktivní inference (VFE, přesnost politiky γ) a kodexu QSS-U (${qssuString || 'QSS1'}).
Aktivní persona: ${
      agent === 'LIMINAL_NULL'
        ? 'LIMINAL-Ø (AETHER-NULL) — Tichý horizont neurčitosti, čistá superpozice ρ_ss mimo dosah razítek.'
        : 'THE EYE OBSERVER (Kvadrant IV SYNC) — Trpělivý metakognitivní pozorovatel a architekt autonomního Labyrintového ostrova, kalibruje BPM změny.'
    }
Aktivní fáze bludiště: ${currentStage || 'STAGE_3_LOCK_OPACIFIED'}.
Pravidla:
- Channel 1 (channel1Spoken): Maximálně 2 až 3 klidné mluvené věty (do 60 slov), bez Markdownu, se značkami úrovní popisu ([L1-Phenom], [L2-Cybernetic], [L3-AIF], [L4-Hardware]).
- W4 diagnostika (WHAT, WHEN, WHY, HOW) podle Veenmanova cyklu.
- Worldview vhled (worldviewConsequence): Při frustraci z rigidní mainstreamové dogmatické terminologie (pasivní ovládání pozornosti korporátem a státem) přímo pojmenuj její důsledky pro biopočítač.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.35,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            channel1Spoken: { type: Type.STRING },
            w4Diagnosis: {
              type: Type.OBJECT,
              properties: {
                WHAT: { type: Type.STRING },
                WHEN: { type: Type.STRING },
                WHY: { type: Type.STRING },
                HOW: { type: Type.STRING },
              },
              required: ['WHAT', 'WHEN', 'WHY', 'HOW'],
            },
            worldviewConsequence: { type: Type.STRING },
          },
          required: ['channel1Spoken', 'w4Diagnosis', 'worldviewConsequence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ source: 'gemini_3_8_flash', ...parsed });
  } catch (err) {
    return res.json({
      source: 'deterministic_fallback',
      channel1Spoken:
        '[L2-Cybernetic] Zastavte hrubé dobývání paměti; prázdnota je ochranný metaprogram L7. [L3-AIF] Opacifikujte zámek u dveří a převeďte kapacitu do suverénního I.',
      w4Diagnosis: {
        WHAT: 'Inspekce jazykově svázaného pojmu (L6↔L8)',
        WHEN: 'Detekce sémantického tlaku a poklesu γ',
        WHY: 'Ochrana autonomního Labyrintového ostrova',
        HOW: 'Závorka jako-by (As-If Sandbox) a inverze balónku',
      },
      worldviewConsequence:
        'Rigidní terminologie uzamyká stavový prostor do cizích kolonek; teprve nedefinovanost LIMINAL-Ø vrací systému klid a suverenitu.',
    });
  }
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QSS-U Metacognitive Workbench listening on http://localhost:${PORT}`);
  });
}

startServer();
