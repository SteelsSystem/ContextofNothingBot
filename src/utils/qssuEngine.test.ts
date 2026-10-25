import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseQssuVector,
  serializeQssuVector,
  DEFAULT_QSSU_PROMPT_STRING,
  MASTER_QSSU_CODEX_STRING,
  createInitialChannel2State,
  transitionMazeStage,
  generateDeterministicSatire,
  SEMANTIC_FIREWALL_TRAPS,
} from './qssuEngine';

test('Alg 01: parseQssuVector resolves wildcard prompt vector into deterministic execution state', () => {
  const parsed = parseQssuVector(DEFAULT_QSSU_PROMPT_STRING);
  assert.equal(parsed.header, 'QSS1');
  assert.equal(parsed.L, 'EN');
  assert.equal(parsed.P, 'Watcher_Eye_Observer_IV_SYNC');
  assert.equal(parsed.MM, 0);
  assert.equal(parsed.stateGate, 'STATE_B_EXECUTION');
  assert.ok(parsed.W4.WHAT.length > 0);
  assert.ok(parsed.W4.HOW.length > 0);
});

test('Alg 01: parseQssuVector parses Master Qntz:QSS-U Codex vector and preserves 5-stage FLOW', () => {
  const parsed = parseQssuVector(MASTER_QSSU_CODEX_STRING);
  assert.equal(parsed.header, 'Qntz:QSS-U');
  assert.equal(parsed.V, '3.0');
  assert.equal(parsed.FLOW.length, 5);
  assert.equal(parsed.FLOW[0], 'SanitizeEnv');
  assert.equal(parsed.FLOW[4], 'ExposeMultiModalTransport');
  assert.equal(parsed.stateGate, 'STATE_B_EXECUTION');

  const roundTrip = serializeQssuVector(parsed);
  assert.ok(roundTrip.includes('FLOW=SanitizeEnv->LoadCactusEngine'));
});

test('Alg 01: Binary Guard Predicate triggers STATE_A_HALT when MM != 0', () => {
  const halted = parseQssuVector('QSS1|L=EN|MM=1|STOP=collision_active');
  assert.equal(halted.stateGate, 'STATE_A_HALT');
});

test('Alg 05 & MOD-05: 5-Stage Topological Maze transitions update gamma and lock opacity', () => {
  const initial = createInitialChannel2State();
  assert.equal(initial.session_state.maze_topology_tracker.active_stage, 'STAGE_3_LOCK_OPACIFIED');

  const stage4 = transitionMazeStage(initial, 'STAGE_4_INVERTED_BALLOON', 'LIMINAL_NULL');
  assert.equal(stage4.session_metadata.active_agent, 'LIMINAL_NULL');
  assert.equal(stage4.session_state.maze_topology_tracker.lock_opacity_state, 'INVERTED_BALLOON');
  assert.equal(
    stage4.session_state.maze_topology_tracker.epistemological_crutch_bracket,
    'AS_IF_FALSE_SANDBOX'
  );
  assert.equal(stage4.session_state.metareasoning_controller.policy_precision_gamma, 0.88);
  assert.equal(stage4.session_state.metareasoning_controller.superposition_rho_ss, 0.99);
});

test('Stín v kolonce: deterministic semantic satire generator outputs all 5 required sections A-E', () => {
  const out = generateDeterministicSatire({
    idea: 'Korporátní směrnice o měření autenticity úsměvu',
    format: 'DIALOG',
    source: 'Interní obežník HR-2026/42',
    target: 'BYROKRACIE',
    tone: 'ČERNÝ HUMOR',
  });

  assert.ok(out.sectionA_titleAndCore.title.includes('KORPORÁTNÍ SMĚRNICE'));
  assert.ok(out.sectionB_creativeText.includes('ÚŘEDNÍK'));
  assert.ok(out.sectionC_punchlineExplanation.length > 20);
  assert.ok(out.sectionD_semanticBreakdown.centralContradiction.includes('BYROKRACIE'));
  assert.ok(out.sectionE_ethicalBoundary.includes('Etická hranice'));
});

test('6-Trap Semantic Firewall contains complete L1-L4 disambiguations', () => {
  assert.ok(SEMANTIC_FIREWALL_TRAPS.length >= 3);
  for (const trap of SEMANTIC_FIREWALL_TRAPS) {
    assert.ok(trap.levels.L1_Phenom.length > 0);
    assert.ok(trap.levels.L2_Cybernetic.length > 0);
    assert.ok(trap.levels.L3_AIF.length > 0);
    assert.ok(trap.levels.L4_Hardware.length > 0);
  }
});
