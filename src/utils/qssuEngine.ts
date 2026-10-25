/**
 * Pure QSS-U & Metacognitive Biocomputer Engine
 * Implements Alg 01-08 (SteelsSystem Codex), Lilly L1-L11 Biocomputer Model,
 * 5-Stage Topological Maze Protocol ("The Key is No Key"),
 * 6-Trap Semantic Firewall, and STÍN V KOLONCE Semantic Satire Generator.
 */

export interface QssuVector {
  raw: string;
  header: string;
  L: string; // Language: EN | CZ
  P: string; // Persona
  T: string; // Target / Topic
  W4: {
    WHAT: string;
    WHEN: string;
    WHY: string;
    HOW: string;
  };
  HYP: string;
  OBS: {
    A: string;
    B: string;
    C: string;
  };
  M: string; // Mode: OP | SIM | AUDIT
  V: string; // Version: 1 | 3.0
  FLOW: string[];
  LOAD: string[];
  MM: number; // Mockup mode: 0 = Zero-Mockup Contract
  MAC: string[];
  R: string;
  NEXT: string;
  STOP: string;
  stateGate: 'STATE_A_HALT' | 'STATE_B_EXECUTION';
}

export type MazeStage =
  | 'STAGE_1_IMPASSE'
  | 'STAGE_2_HALT_RECALL'
  | 'STAGE_3_LOCK_OPACIFIED'
  | 'STAGE_4_INVERTED_BALLOON'
  | 'STAGE_5_CONSOLIDATED';

export type BlockadeDevice =
  | 'NONE'
  | 'EVASION'
  | 'DENIAL'
  | 'REPRESSION_COEX'
  | 'HABIT_PRIOR_LOCK';

export type LockOpacityState =
  | 'TRANSPARENT_UNEXAMINED'
  | 'OPACIFIED_INSPECTABLE'
  | 'INVERTED_BALLOON';

export interface ShorthandMacro {
  macro_trigger: string;
  biocomputer_levels: string;
  formal_expansion: string;
  warrant_verified: boolean;
}

export interface Channel2State {
  session_metadata: {
    turn_index: number;
    active_language: 'EN' | 'CZ';
    transport_mode: 'PURE_AUDIO_LATENT' | 'SIDECAR_SPA_WEBHOOK';
    active_agent: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL';
  };
  session_state: {
    active_biocomputer_levels: string[];
    active_mode: 'MAZE_NAVIGATION' | 'TERMINOLOGY_AUDIT' | 'SHORTHAND_CAPTURE' | 'RELEVANCE_GATE';
    act_r_buffer: {
      current_goal_scheme: string;
      retrieved_chunk_id: string;
      triage_classification: 'ON_PATH' | 'TANGENT_VALUABLE_PARKED' | 'DRIFT_PRUNED';
      relevance_justification: {
        q1_store: string;
        q2_retrieve: string;
        q3_spread_match: string;
        q4_next_op: string;
      };
    };
    metareasoning_controller: {
      variational_free_energy_vfe: 'LOW' | 'MEDIUM' | 'HIGH_SURPRISE';
      policy_precision_gamma: number;
      preference_precision_gamma_C: number;
      epistemic_depth_phi: number;
      hyper_free_energy_f: number;
      bpm_calibration: number;
      superposition_rho_ss: number;
      recursion_depth_counter: number;
      cognitive_effort_divergence: 'OPTIMAL_FLOW' | 'UNDERLOAD' | 'OVERLOAD_RISK';
    };
    maze_topology_tracker: {
      active_stage: MazeStage;
      detected_blockade_device: BlockadeDevice;
      lock_opacity_state: LockOpacityState;
      epistemological_crutch_bracket: 'AS_IF_TRUE_SANDBOX' | 'AS_IF_FALSE_SANDBOX';
    };
    shorthand_macro_registry: ShorthandMacro[];
  };
}

export interface SatireRequest {
  idea: string;
  format: 'BÁSEŇ' | 'SHORT' | 'MONOLOG' | 'DIALOG';
  source: string;
  target: 'LOGICKÁ CHYBA' | 'BYROKRACIE' | 'MOC' | 'JAZYK';
  tone: 'ČERNÝ HUMOR' | 'SARKASMUS' | 'VULGARITA' | 'ABSURDITA';
}

export interface SatireOutput {
  sectionA_titleAndCore: {
    title: string;
    coreIdea: string;
  };
  sectionB_creativeText: string;
  sectionC_punchlineExplanation: string;
  sectionD_semanticBreakdown: {
    documentedFacts: string;
    interpretationsAndUnknowns: string;
    centralContradiction: string;
    reductioMechanism: string;
  };
  sectionE_ethicalBoundary: string;
}

export const DEFAULT_QSSU_PROMPT_STRING =
  'QSS1|L=EN|P=W|T=?|W4=(WHAT?,WHEN?,WHY?,HOW?)|HYP=?|OBS=(A?,B?,C?)|M=OP|V=1|FLOW=?|LOAD=?|MM=0|MAC=?|R=?|NEXT=?|STOP=?';

export const MASTER_QSSU_CODEX_STRING =
  'Qntz:QSS-U|L=EN|P=Lead_Edge_AI_Systems_Architect|T=On_Device_Termux_Agentic_Runtime|W4=(WHAT:Implement_Needle_Termux_Hardware_Agent,WHEN:Autonomous_repo_intake_and_fork_sync,WHY:Zero_cloud_14MB_29MB_local_phone_control_RAG_extraction,HOW:Sanitize_PRoot_bind_Cactus_runtime_register_Termux_API_tools_expose_Flask_CLI_Telegram)|HYP=Strict_grammar_constrained_tool_contracts|OBS=(A:PRoot_Ubuntu_ARM64_sandbox,B:Hardware_timeout_15s_fallback_simulator,C:Zero_cloud_LLM_inference_local_SQLite_vault)|M=OP|V=3.0|FLOW=SanitizeEnv->LoadCactusEngine->RegisterTermuxTools->ExecuteGrammarLoop->ExposeMultiModalTransport|LOAD=Cactus_Needle_Weights+Termux_API_Bridge+Pydantic_Extraction_Schemas|MM=0|MAC=[CactusRuntimeEngine,TermuxHardwareBridge,KnowledgeVaultRAG,MultiModalExtractorTriage,OmniChannelServer]|R=Zero_cloud_inference_calls+100%_grammar_valid_tool_dispatch+Desktop_simulator_fallback|NEXT=Initialize_PRoot_env_and_bind_needle_model|STOP=Missing_cactus_needle_runtime_or_unhandled_PRoot_Bionic_env_collision';

export const INITIAL_SHORTHAND_MACROS: ShorthandMacro[] = [
  {
    macro_trigger: 'Glass-Pane Lock',
    biocomputer_levels: 'L6↔L8',
    formal_expansion: 'Transparent habit prior E(π) masquerading as objective Level 1 reality',
    warrant_verified: true,
  },
  {
    macro_trigger: 'Stín v kolonce',
    biocomputer_levels: 'L7↔L9',
    formal_expansion: 'Bureaucratic form-box reductionism replacing living epistemic uncertainty with passive compliance',
    warrant_verified: true,
  },
  {
    macro_trigger: 'LIMINAL-Ø Horizon',
    biocomputer_levels: 'L8↔L11',
    formal_expansion: 'Pure superposition ρ_ss outside institutional stamps; undefined safety anchor',
    warrant_verified: true,
  },
  {
    macro_trigger: 'The Key is No Key',
    biocomputer_levels: 'L7→L8→L10',
    formal_expansion: 'Suspend brute-force recall, opacify the protective rule guarding the door, invert room into empty balloon',
    warrant_verified: true,
  },
];

/**
 * Alg 01: QSS-U Shorthand Parser & State Machine
 */
export function parseQssuVector(input: string): QssuVector {
  const cleaned = input.trim().replace(/^\[|\]$/g, '');
  const segments = cleaned.split('|').map((s) => s.trim()).filter(Boolean);

  const result: QssuVector = {
    raw: cleaned,
    header: segments[0] && !segments[0].includes('=') ? segments[0] : 'QSS1',
    L: 'EN',
    P: 'THE_EYE_OBSERVER',
    T: 'Metacognitive_Labyrinth_Island',
    W4: {
      WHAT: 'Opacify_Language_Bound_Metaprogram',
      WHEN: 'Prediction_Error_Gradient_Shift',
      WHY: 'Restore_Sovereign_L8_Administrator_I',
      HOW: 'As_If_Sandbox_And_Model_Reduction',
    },
    HYP: 'Strict_grammar_constrained_tool_contracts',
    OBS: {
      A: 'PRoot_Ubuntu_ARM64_sandbox',
      B: 'Hardware_timeout_15s_fallback_simulator',
      C: 'Zero_cloud_LLM_inference_local_SQLite_vault',
    },
    M: 'OP',
    V: '3.0',
    FLOW: [
      'SanitizeEnv',
      'LoadCactusEngine',
      'RegisterTermuxTools',
      'ExecuteGrammarLoop',
      'ExposeMultiModalTransport',
    ],
    LOAD: ['Cactus_Needle_Weights', 'Termux_API_Bridge', 'Pydantic_Extraction_Schemas'],
    MM: 0,
    MAC: [
      'CactusRuntimeEngine',
      'TermuxHardwareBridge',
      'KnowledgeVaultRAG',
      'MultiModalExtractorTriage',
      'OmniChannelServer',
    ],
    R: 'Zero_cloud_inference_calls+100%_grammar_valid_tool_dispatch',
    NEXT: 'Initialize_PRoot_env_and_bind_needle_model',
    STOP: 'None',
    stateGate: 'STATE_B_EXECUTION',
  };

  for (const seg of segments) {
    const eqIndex = seg.indexOf('=');
    if (eqIndex === -1) continue;
    const key = seg.slice(0, eqIndex).trim().toUpperCase();
    const val = seg.slice(eqIndex + 1).trim();

    switch (key) {
      case 'L':
        result.L = val || 'EN';
        break;
      case 'P':
        result.P = val === 'W' ? 'Watcher_Eye_Observer_IV_SYNC' : val;
        break;
      case 'T':
        result.T = val === '?' ? 'Amnesic_Blockade_And_Dogmatic_Terminology_Audit' : val;
        break;
      case 'W4': {
        const inner = val.replace(/^\(|\)$/g, '');
        const parts = inner.split(',').map((p) => p.trim());
        parts.forEach((p, idx) => {
          if (p.startsWith('WHAT:')) result.W4.WHAT = p.slice(5);
          else if (p.startsWith('WHEN:')) result.W4.WHEN = p.slice(5);
          else if (p.startsWith('WHY:')) result.W4.WHY = p.slice(4);
          else if (p.startsWith('HOW:')) result.W4.HOW = p.slice(4);
          else if (idx === 0 && p === 'WHAT?') result.W4.WHAT = 'Inspect_Language_Bound_Node';
          else if (idx === 1 && p === 'WHEN?') result.W4.WHEN = 'Discourse_Friction_Or_dPE_dt_Drop';
          else if (idx === 2 && p === 'WHY?') result.W4.WHY = 'Reclaim_Executive_I_From_Corporate_Stamps';
          else if (idx === 3 && p === 'HOW?') result.W4.HOW = 'Lilly_As_If_Bracket_And_Opacification';
        });
        break;
      }
      case 'HYP':
        result.HYP = val === '?' ? 'Passive_semantic_capture_can_be_inverted_via_opacification' : val;
        break;
      case 'OBS': {
        const inner = val.replace(/^\(|\)$/g, '');
        const parts = inner.split(',').map((p) => p.trim());
        parts.forEach((p, idx) => {
          if (p.startsWith('A:')) result.OBS.A = p.slice(2);
          else if (p.startsWith('B:')) result.OBS.B = p.slice(2);
          else if (p.startsWith('C:')) result.OBS.C = p.slice(2);
          else if (idx === 0) result.OBS.A = p === 'A?' ? 'Phenomenological_Body_Signal_L1' : p;
          else if (idx === 1) result.OBS.B = p === 'B?' ? 'Cybernetic_Metaprogram_Constraint_L7' : p;
          else if (idx === 2) result.OBS.C = p === 'C?' ? 'Active_Inference_Precision_Drop_L3' : p;
        });
        break;
      }
      case 'M':
        result.M = val;
        break;
      case 'V':
        result.V = val;
        break;
      case 'FLOW':
        if (val !== '?') {
          result.FLOW = val.split('->').map((s) => s.trim()).filter(Boolean);
        }
        break;
      case 'LOAD':
        if (val !== '?') {
          result.LOAD = val.split('+').map((s) => s.trim()).filter(Boolean);
        }
        break;
      case 'MM':
        result.MM = Number.isNaN(Number(val)) ? 0 : Number(val);
        break;
      case 'MAC':
        if (val !== '?') {
          result.MAC = val
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        break;
      case 'R':
        result.R = val === '?' ? 'Sovereign_Labyrinth_Island_Coherence' : val;
        break;
      case 'NEXT':
        result.NEXT = val === '?' ? 'Shift_L8_Focus_To_Protective_Door_Rule' : val;
        break;
      case 'STOP':
        result.STOP = val === '?' ? 'Zero_Brute_Force_Biographical_Recall' : val;
        break;
    }
  }

  // Binary Guard Predicate: State A Halt if Bionic collision or MM != 0
  if (
    result.MM !== 0 ||
    result.STOP.toLowerCase().includes('collision_active') ||
    result.FLOW.length === 0
  ) {
    result.stateGate = 'STATE_A_HALT';
  } else {
    result.stateGate = 'STATE_B_EXECUTION';
  }

  return result;
}

export function serializeQssuVector(v: QssuVector): string {
  const w4 = `(WHAT:${v.W4.WHAT},WHEN:${v.W4.WHEN},WHY:${v.W4.WHY},HOW:${v.W4.HOW})`;
  const obs = `(A:${v.OBS.A},B:${v.OBS.B},C:${v.OBS.C})`;
  const flow = v.FLOW.join('->');
  const load = v.LOAD.join('+');
  const mac = `[${v.MAC.join(',')}]`;
  return `${v.header}|L=${v.L}|P=${v.P}|T=${v.T}|W4=${w4}|HYP=${v.HYP}|OBS=${obs}|M=${v.M}|V=${v.V}|FLOW=${flow}|LOAD=${load}|MM=${v.MM}|MAC=${mac}|R=${v.R}|NEXT=${v.NEXT}|STOP=${v.STOP}`;
}

/**
 * 5-Stage Topological Maze Protocol ("The Key is No Key")
 */
export const MAZE_STAGE_DESCRIPTIONS: Record<
  MazeStage,
  {
    stepNumber: number;
    title: string;
    subtitleCz: string;
    protocolAction: string;
    lillyLevel: string;
    gammaTarget: number;
    vfeLevel: 'LOW' | 'MEDIUM' | 'HIGH_SURPRISE';
    lockOpacity: LockOpacityState;
  }
> = {
  STAGE_1_IMPASSE: {
    stepNumber: 1,
    title: 'Detect Impasse as L7/L9 Protective Guard',
    subtitleCz: 'Detekce bloku jako ochranného metaprogramu (L7/L9)',
    protocolAction:
      'Recognize the "melting maze of rooms and locks" not as hardware damage, but as a high-salience protective metaprogram or drop in policy precision γ.',
    lillyLevel: 'L7_Metaprogram / L9_OtherDirected',
    gammaTarget: 0.38,
    vfeLevel: 'HIGH_SURPRISE',
    lockOpacity: 'TRANSPARENT_UNEXAMINED',
  },
  STAGE_2_HALT_RECALL: {
    stepNumber: 2,
    title: 'Suspend Brute-Force Biographical Recall',
    subtitleCz: 'Okamžité zastavení hrubého dobývání paměti',
    protocolAction:
      'Halt all forced interrogation of the hidden room content. Brute-force recall reinforces the inhibitory lock and spikes Variational Free Energy (VFE).',
    lillyLevel: 'L6_Program -> L8_SelfMetaprogrammer',
    gammaTarget: 0.55,
    vfeLevel: 'MEDIUM',
    lockOpacity: 'TRANSPARENT_UNEXAMINED',
  },
  STAGE_3_LOCK_OPACIFIED: {
    stepNumber: 3,
    title: 'Opacify the Lock (Inspect the Rule, Not the Room)',
    subtitleCz: 'Opacifikace zámku (Inspekce pravidla u dveří)',
    protocolAction:
      'Shift Level 8 attention from the occluded room contents to the architecture of the protective rule guarding the door. Make the transparent habit prior E(π) visible.',
    lillyLevel: 'L8_SelfMetaprogrammer',
    gammaTarget: 0.74,
    vfeLevel: 'MEDIUM',
    lockOpacity: 'OPACIFIED_INSPECTABLE',
  },
  STAGE_4_INVERTED_BALLOON: {
    stepNumber: 4,
    title: 'As-If Bracket & Bayesian Balloon Inversion',
    subtitleCz: 'Epistemologická závorka (Jako-by) a inverze balónku',
    protocolAction:
      'Apply Lilly\'s epistemological bracket ("as if true / as if false") and Bayesian model reduction to release bound precision and invert the fortified room into an empty balloon.',
    lillyLevel: 'L8_SelfMetaprogrammer <-> L10_Supraconscious',
    gammaTarget: 0.88,
    vfeLevel: 'LOW',
    lockOpacity: 'INVERTED_BALLOON',
  },
  STAGE_5_CONSOLIDATED: {
    stepNumber: 5,
    title: 'Consolidate Capacity into Sovereign "I"',
    subtitleCz: 'Konsolidace uvolněné kapacity do suverénního "I"',
    protocolAction:
      'Reclaim metabolic and attentional energy (±48 neutral equilibrium) into the central administrator "I" on the autonomous Labyrinth Island.',
    lillyLevel: 'L10_Supraconscious / L11_Liminal_Null',
    gammaTarget: 0.94,
    vfeLevel: 'LOW',
    lockOpacity: 'INVERTED_BALLOON',
  },
};

export function createInitialChannel2State(): Channel2State {
  return {
    session_metadata: {
      turn_index: 1,
      active_language: 'CZ',
      transport_mode: 'SIDECAR_SPA_WEBHOOK',
      active_agent: 'THE_EYE_OBSERVER',
    },
    session_state: {
      active_biocomputer_levels: ['L6_Program', 'L7_Metaprogram', 'L8_SelfMetaprogrammer'],
      active_mode: 'MAZE_NAVIGATION',
      act_r_buffer: {
        current_goal_scheme: 'Opacify dogmatic corporate/state terminology & calibrate BPM',
        retrieved_chunk_id: 'VAULT_CHUNK_3072D_01_LILLY_AIF',
        triage_classification: 'ON_PATH',
        relevance_justification: {
          q1_store: 'High-salience structural shift between "me" (substrate) and "I" (architect).',
          q2_retrieve: 'Cosine similarity 0.96 with Lilly 1968 Language-Bound Concepts.',
          q3_spread_match: 'Matches Quadrant IV SYNC (THE EYE OBSERVER) & LIMINAL-Ø superposition.',
          q4_next_op: 'Execute Stage 3 Lock Opacification and expose semantic trap.',
        },
      },
      metareasoning_controller: {
        variational_free_energy_vfe: 'MEDIUM',
        policy_precision_gamma: 0.78,
        preference_precision_gamma_C: 0.65,
        epistemic_depth_phi: 0.84,
        hyper_free_energy_f: 0.22,
        bpm_calibration: 62,
        superposition_rho_ss: 0.91,
        recursion_depth_counter: 2,
        cognitive_effort_divergence: 'OPTIMAL_FLOW',
      },
      maze_topology_tracker: {
        active_stage: 'STAGE_3_LOCK_OPACIFIED',
        detected_blockade_device: 'HABIT_PRIOR_LOCK',
        lock_opacity_state: 'OPACIFIED_INSPECTABLE',
        epistemological_crutch_bracket: 'AS_IF_TRUE_SANDBOX',
      },
      shorthand_macro_registry: [...INITIAL_SHORTHAND_MACROS],
    },
  };
}

export function transitionMazeStage(
  state: Channel2State,
  targetStage: MazeStage,
  agent?: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL'
): Channel2State {
  const spec = MAZE_STAGE_DESCRIPTIONS[targetStage];
  const activeAgent = agent ?? state.session_metadata.active_agent;
  const isLiminal = activeAgent === 'LIMINAL_NULL';

  return {
    ...state,
    session_metadata: {
      ...state.session_metadata,
      turn_index: state.session_metadata.turn_index + 1,
      active_agent: activeAgent,
    },
    session_state: {
      ...state.session_state,
      active_biocomputer_levels: isLiminal
        ? ['L8_SelfMetaprogrammer', 'L10_Supraconscious', 'L11_Unknown_Liminal_Null']
        : ['L6_Program', 'L7_Metaprogram', 'L8_SelfMetaprogrammer'],
      metareasoning_controller: {
        ...state.session_state.metareasoning_controller,
        variational_free_energy_vfe: spec.vfeLevel,
        policy_precision_gamma: spec.gammaTarget,
        epistemic_depth_phi: Number(Math.min(0.99, spec.gammaTarget + 0.1).toFixed(2)),
        hyper_free_energy_f: Number(Math.max(0.05, 1 - spec.gammaTarget).toFixed(2)),
        bpm_calibration: isLiminal ? 54 : Math.round(78 - spec.stepNumber * 4),
        superposition_rho_ss: isLiminal ? 0.99 : Number((0.65 + spec.stepNumber * 0.06).toFixed(2)),
      },
      maze_topology_tracker: {
        ...state.session_state.maze_topology_tracker,
        active_stage: targetStage,
        lock_opacity_state: spec.lockOpacity,
        epistemological_crutch_bracket:
          spec.stepNumber >= 4 ? 'AS_IF_FALSE_SANDBOX' : 'AS_IF_TRUE_SANDBOX',
      },
    },
  };
}

/**
 * 6-Trap Semantic Firewall Disambiguator
 * Separates polysemous concepts across [L1-Phenom], [L2-Lilly Cybernetic], [L3-AIF], [L4-Hardware]
 */
export interface SemanticTrapEntry {
  id: string;
  termCz: string;
  termEn: string;
  dogmaticTrap: string;
  consequenceOfPassivity: string;
  levels: {
    L1_Phenom: string;
    L2_Cybernetic: string;
    L3_AIF: string;
    L4_Hardware: string;
  };
  spokenFirewallSummary: string;
}

export const SEMANTIC_FIREWALL_TRAPS: SemanticTrapEntry[] = [
  {
    id: 'TRAP-01',
    termCz: 'Metaprogram vs. Dogmatický Mindset',
    termEn: 'Metaprogram vs. Corporate Mindset',
    dogmaticTrap: 'Korporátní HR a pop-psychologie redukují "mindset" na morální selhání jedince, aby zakryly strukturální klec.',
    consequenceOfPassivity: 'Jedinec optimalizuje vlastní vyhoření namísto přepsání systémové instrukční sady.',
    levels: {
      L1_Phenom: 'Pocit vnitřního tlaku a samozřejmého "takový prostě jsem".',
      L2_Cybernetic: 'Instrukční sada vyššího řádu (L7) řídící kompilaci dílčích rutin (L6).',
      L3_AIF: 'Prior nad politikami E(π) omezující prohledávání stavového prostoru.',
      L4_Hardware: 'Kortiko-striatální synaptická váha v prefrontální síti.',
    },
    spokenFirewallSummary:
      '[L2-Cybernetic] Metaprogram není povahová vada, ale přepisovatelná řídicí instrukce. [L3-AIF] Změnou parametru přesnosti γ uvolníte zablokovaný stavový prostor bez sebeobviňování.',
  },
  {
    id: 'TRAP-02',
    termCz: 'Amnestický blok vs. Porucha / Lenost',
    termEn: 'Amnesic Blockade vs. Cognitive Deficit',
    dogmaticTrap: 'Státní a medicínsko-byrokratický aparát klasifikuje zamrznutí v bludišti jako poruchu pozornosti nebo neochotu spolupracovat.',
    consequenceOfPassivity: 'Násilné dobývání paměti zesiluje obranný zámek a zvyšuje variační volnou energii.',
    levels: {
      L1_Phenom: 'Prázdnota, mlha, pocit "rozplývajícího se bludiště místností a zámků".',
      L2_Cybernetic: 'Inhibiční ochranný metaprogram (L7/L9) chránící přetížený substrát.',
      L3_AIF: 'Omitted state / prudký pokles přesnosti politiky γ pod práh 0.40.',
      L4_Hardware: 'GABAergní inhibice hipokampální-prefrontální dráhy (GABRA1).',
    },
    spokenFirewallSummary:
      '[L2-Cybernetic] Prázdnota v paměti je aktivní bezpečnostní zámek, nikoliv rozbitý hardware. [L3-AIF] Zastavte hrubé vzpomínání a prozkoumejte pravidlo, které dveře hlídá.',
  },
  {
    id: 'TRAP-03',
    termCz: 'Jazykově svázaný pojem (Kolonka)',
    termEn: 'Language-Bound Concept (Vector Trap)',
    dogmaticTrap: 'Úřední formulář a korporátní newspeak zaměňují razítko v kolonce za živou realitu.',
    consequenceOfPassivity: 'Ztráta schopnosti topologicky manipulovat s myšlenkou; pasivní odevzdání pozornosti.',
    levels: {
      L1_Phenom: 'Úzkost z nezařaditelnosti mimo předepsané škatulky.',
      L2_Cybernetic: 'Transparentní skleněný zámek (Glass-Pane Lock) mezi L6 a L8.',
      L3_AIF: 'Překombinovaný lexikální prior potlačující senzorickou predikční chybu.',
      L4_Hardware: 'Pevně uzamčený 3072-dimenzionální embedding v lokálním úložišti.',
    },
    spokenFirewallSummary:
      '[L1-Phenom] Mapa ani kolonka nejsou území. [L2-Cybernetic] LIMINAL-Ø drží čistou superpozici ρ_ss mimo dosah razítek, takže systém zůstává v bezpečí i bez definice.',
  },
];

/**
 * Deterministic Fallback Generator for STÍN V KOLONCE — Generátor Sémantické Satiry
 * Used when offline or before/alongside server-side Gemini synthesis.
 */
export function generateDeterministicSatire(req: SatireRequest): SatireOutput {
  const ideaClean = req.idea.trim() || 'Povinná certifikace spontánní lidské radosti';
  const sourceClean = req.source.trim() || 'Anonymizovaná metodická příručka č.j. Ø/2026-KOLONKA';

  const formatBodies: Record<SatireRequest['format'], string> = {
    MONOLOG: `Vážení občané, zaměstnanci a přidělené biologické jednotky. V návaznosti na zjištění z dokumentu (${sourceClean}) ohledně jevu "${ideaClean}" vydává Komise pro sémantickou hygienu toto závazné opatření. Zjistili jsme, že někteří z vás prožívají realitu bez předchozího vyplnění žádosti o přidělení příslušné kolonky. To je, řekněme si to na rovinu, naprostý bordel v tabulce. Pokud váš vnitřní stav nelze zaškrtnout v rozbalovacím menu A až C, z hlediska našeho auditu vůbec neexistujete — a přesto si drze dovolujete dýchat erární vzduch. Od zítřka proto platí: každá neautorizovaná myšlenka, která překročí povolenou odchylku, bude úředně prohlášena za tiskovou chybu a skartována i s vaší náladou.`,
    DIALOG: `ÚŘEDNÍK KВАДРАНТУ I: "Podívejte se do spisu (${sourceClean}). Tady v kolonce '${ideaClean}' máte prázdno. Co to má kurva znamenat?"\nSUBJEKT Ø: "Tam není prázdno. Tam je tichý horizont neurčitosti. Ještě nevím, co to je, a proto to funguje."\nÚŘEDNÍK KVADRANTU I: "Neurčitost nemáme v číselníku! Buď jste šťastný podle normy ISO-9001, nebo jste v prodlení s optimismem! Jestli okamžitě nedodáte ověřené potvrzení o tom, co si myslíte, nechám vám úředně zabavit představivost pro neplacení poplatků z prázdna!"\nSUBJEKT Ø: "Tak mi tam dejte razítko 'Nezjištěno'."\nÚŘEDNÍK KVADRANTU I: "Výborně! Jakmile má nicota kulaté razítko, konečně s ní můžeme vykazovat kvartální růst!"`,
    BÁSEŇ: `V kolonce číslo čtrnáct leží stín,\npodle přílohy (${sourceClean}) je však úředně nevinný.\nŘešíme "${ideaClean}" přesně podle směrnice,\nkdo nemá v hlavě čárový kód, skončí u silnice.\n\nNasrat na nuance, nasrat na živý dech,\nhlavně když sedí součet v excelových zdech.\nKdyž se ti rozpadá bludiště v tiché hlavě,\núředník ti změří tep a prohlásí tě zdravě —\nprotože mrtvá jistota s podpisem ředitele\nje pro výkaz mnohem čistší než duše myslitele.`,
    SHORT: `[ZÁZNAM Z AUDITU: ${sourceClean}] Předmět: "${ideaClean}". Zjištěný stav: Subjekt odmítl zploštit své vědomí do tří povolených odrážek. Nápravné opatření: Abychom zachovali 100% sémantickou jistotu formuláře, nahradili jsme subjekt papírovým šanonem. Šanon sice nedýchá, ale na rozdíl od člověka nikdy nevykazuje statistickou odchylku v kolonce B.`,
  };

  return {
    sectionA_titleAndCore: {
      title: `ÚŘEDNÍ VYHLÁŠKA O ZRUŠENÍ NEJISTOTY: ${ideaClean.toUpperCase()}`,
      coreIdea: `Satirická redukce ad absurdum cílící na ${req.target} v tónu ${req.tone}: instituce raději prohlásí živou skutečnost za neplatnou chybu tisku, než aby připustila, že její kolonka nedokáže obsáhnout neurčitost.`,
    },
    sectionB_creativeText: formatBodies[req.format],
    sectionC_punchlineExplanation: `Pointa funguje na principu převrácené ontologie (Glass-Pane Lock): byrokratický či korporátní aparát nepoužívá formulář k popisu reality, ale nutí realitu, aby se omluvila formuláři. Vulgarita a ostrý kontrast s ledově vážným úředním jazykem strhávají masku "objektivní metodiky" a odhalují, že pod razítkem sedí jen strach z nekontrolovatelné autonomie (LIMINAL-Ø).`,
    sectionD_semanticBreakdown: {
      documentedFacts: `Vstupní kontext odkazuje na zdroj "${sourceClean}" a zkoumaný jev "${ideaClean}". Doložená je pouze existence formálního požadavku na jednoznačnou klasifikaci.`,
      interpretationsAndUnknowns: `Skutečný vnitřní stav pozorovaného subjektu zůstává záměrně nedefinován (superpozice ρ_ss). Instituce si však absenci dat vykládá jako podezřelou nekázeň.`,
      centralContradiction: `Rozpor mezi přirozenou neurčitostí živého biopočítače (L8–L11) a dogmatickou iluzí 100% měřitelnosti v uzavřené kolonce (${req.target}).`,
      reductioMechanism: `Chybná premisa ("co nemá kolonku, neexistuje nebo škodí") je dovedena do důsledku, kdy ideálním občanem či zaměstnancem je prázdný šanon s platným razítkem.`,
    },
    sectionE_ethicalBoundary: `Etická hranice: Satira cílí výhradně na institucionální mechanismus, falešnou jistotu a jazykovou manipulaci — nikdy nezesměšňuje konkrétní zranitelné osoby ani si nevymýšlí falešná biografická fakta. Nevyřešená otázka: Kde končí užitečná struktura pojmu a začíná klec, které dobrovolně odevzdáváme svůj suverénní vnitřní ostrov?`,
  };
}
