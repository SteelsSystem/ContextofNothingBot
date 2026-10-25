import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Channel2State,
  MAZE_STAGE_DESCRIPTIONS,
  MazeStage,
  QssuVector,
} from '../utils/qssuEngine';

interface LabyrinthIslandSceneProps {
  qssu: QssuVector;
  channel2: Channel2State;
  onSelectMazeStage: (stage: MazeStage) => void;
  onToggleAgent: (agent: 'THE_EYE_OBSERVER' | 'LIMINAL_NULL') => void;
  onNavigateTab: (tab: 'observatory' | 'qssu' | 'satire' | 'bioscience') => void;
}

export type CameraPreset = 'overview' | 'eye_tower' | 'liminal_null' | 'maze_locks';

// Pre-allocated module-scope scratch objects (Zero GC in render loop)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 2.2, 0);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyEuler = new THREE.Euler();
const _scratchColor = new THREE.Color();

function createProceduralBumpTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle concentric & grid architectural relief lines
  ctx.strokeStyle = '#9a9a9a';
  ctx.lineWidth = 2;
  for (let i = 16; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Deterministic pseudo-random stipple
  let seed = 1337;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 1400; i++) {
    const x = Math.floor(nextRand() * 256);
    const y = Math.floor(nextRand() * 256);
    const v = Math.floor(110 + nextRand() * 45);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function createProceduralDialTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#07090E';
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // Outer telemetry rings
  ctx.strokeStyle = '#06B6D4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 175, 0, Math.PI * 2);
  ctx.stroke();

  // Radial ticks for L1-L11 Biocomputer levels
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const innerR = i % 5 === 0 ? 195 : 212;
    const outerR = 226;
    ctx.strokeStyle = i % 5 === 0 ? '#F8FAFC' : '#06B6D4';
    ctx.lineWidth = i % 5 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
    ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export default function LabyrinthIslandScene({
  qssu,
  channel2,
  onSelectMazeStage,
  onToggleAgent,
  onNavigateTab,
}: LabyrinthIslandSceneProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [explodedSeparation, setExplodedSeparation] = useState<number>(0.15);

  // Store mutable state in refs for zero-re-mount WebGL access
  const stateRef = useRef({
    cameraPreset: 'overview' as CameraPreset,
    explodedSeparation: 0.15,
    activeStage: channel2.session_state.maze_topology_tracker.active_stage,
    activeAgent: channel2.session_metadata.active_agent,
    gamma: channel2.session_state.metareasoning_controller.policy_precision_gamma,
    bpm: channel2.session_state.metareasoning_controller.bpm_calibration,
    rhoSs: channel2.session_state.metareasoning_controller.superposition_rho_ss,
    userControllingCamera: false,
  });

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.userControllingCamera = false;
  }, [cameraPreset]);

  useEffect(() => {
    stateRef.current.explodedSeparation = explodedSeparation;
  }, [explodedSeparation]);

  useEffect(() => {
    stateRef.current.activeStage = channel2.session_state.maze_topology_tracker.active_stage;
    stateRef.current.activeAgent = channel2.session_metadata.active_agent;
    stateRef.current.gamma = channel2.session_state.metareasoning_controller.policy_precision_gamma;
    stateRef.current.bpm = channel2.session_state.metareasoning_controller.bpm_calibration;
    stateRef.current.rhoSs = channel2.session_state.metareasoning_controller.superposition_rho_ss;
  }, [channel2]);

  // Keyboard shortcut 'H' to collapse/expand bottom HUD dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software-WebGL Guard (Three.js Skill Standard)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const horizonColor = new THREE.Color(0x07090e);
    scene.background = horizonColor;
    scene.fog = new THREE.FogExp2(0x07090e, 0.022);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      46,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.1,
      200
    );
    camera.position.set(0, 8.5, 19.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 5;
    controls.maxDistance = 38;
    controls.target.set(0, 2.2, 0);

    controls.addEventListener('start', () => {
      stateRef.current.userControllingCamera = true;
    });

    // 3. Balanced Studio Lighting Rig (Warm Key Light + Cool Hemisphere Fill + Rim Light)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.85);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.4);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 45;
    const d = 14;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.35);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // Procedural Textures
    const bumpTex = createProceduralBumpTexture(renderer);
    const dialTex = createProceduralDialTexture(renderer);

    // Shared PBR Materials (Varied roughness & metalness >= 0.25 across adjacent parts)
    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.82,
      metalness: 0.15,
      bumpMap: bumpTex,
      bumpScale: 0.06,
    });

    const brushedTitaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      roughness: 0.24,
      metalness: 0.92,
      anisotropy: 0.75,
      clearcoat: 0.3,
    });

    const brassGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.95,
      anisotropy: 0.8,
    });

    const cyanCoreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.65,
      roughness: 0.18,
      metalness: 0.4,
    });

    const glassLockMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.85,
      transmission: isSoftwareGl ? 0 : 0.9,
      roughness: 0.12,
      metalness: 0.05,
      ior: 1.52,
      thickness: 1.2,
      depthWrite: false,
    });

    const opacifiedLockMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      roughness: 0.32,
      metalness: 0.85,
    });

    // =========================================================================
    // COMPOSITE MODEL 1: Autonomous Labyrinth Island Base & Contact Grounding
    // =========================================================================
    const islandGroup = new THREE.Group();
    islandGroup.position.set(0, 0, 0);
    scene.add(islandGroup);

    // Part 1: Tapered Lathe Rock Underside (Floating Sky/Sea Island Silhouette)
    const lathePoints = [
      new THREE.Vector2(0.0, -4.2),
      new THREE.Vector2(3.2, -3.5),
      new THREE.Vector2(6.8, -1.8),
      new THREE.Vector2(9.4, -0.3),
      new THREE.Vector2(9.6, 0.0),
      new THREE.Vector2(0.0, 0.0),
    ];
    const islandHullGeo = new THREE.LatheGeometry(lathePoints, 32);
    const islandHullMesh = new THREE.Mesh(islandHullGeo, basaltMat);
    islandHullMesh.receiveShadow = true;
    islandGroup.add(islandHullMesh);

    // Part 2: Upper Stepped Obsidian Plaza Terrace (offset Y +0.02 to prevent Z-fighting)
    const terraceGeo = new THREE.CylinderGeometry(8.6, 9.2, 0.36, 32);
    const terraceMesh = new THREE.Mesh(terraceGeo, brushedTitaniumMat);
    terraceMesh.position.y = 0.18;
    terraceMesh.receiveShadow = true;
    islandGroup.add(terraceMesh);

    // Part 3: Calibrated Telemetry Dial Chapter Ring (offset Y +0.38 with polygonOffset)
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.35,
      metalness: 0.5,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const dialGeo = new THREE.CircleGeometry(7.8, 48);
    dialGeo.rotateX(-Math.PI / 2);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.y = 0.38;
    dialMesh.receiveShadow = true;
    islandGroup.add(dialMesh);

    // Part 4-6: Three Concentric Labyrinth Ring Walls (Beveled Extrude / Cylinder segments)
    const mazeRings: THREE.Mesh[] = [];
    const ringRadii = [3.4, 5.2, 7.0];
    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.16, 16, 64, Math.PI * 1.65);
      ringGeo.rotateX(Math.PI / 2);
      const mat = idx % 2 === 0 ? basaltMat : brushedTitaniumMat;
      const ringMesh = new THREE.Mesh(ringGeo, mat);
      ringMesh.position.y = 0.54 + idx * 0.08;
      ringMesh.rotation.y = idx * 1.1;
      ringMesh.castShadow = !isSoftwareGl;
      ringMesh.receiveShadow = true;
      islandGroup.add(ringMesh);
      mazeRings.push(ringMesh);
    });

    // Soft radial contact shadow beneath central tower
    const contactShadowGeo = new THREE.CircleGeometry(3.2, 32);
    contactShadowGeo.rotateX(-Math.PI / 2);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.position.y = 0.395;
    islandGroup.add(contactShadow);

    // =========================================================================
    // COMPOSITE MODEL 2: THE EYE OBSERVER (Quadrant IV SYNC Central Tower)
    // 9 distinct procedural parts across Primary, Secondary, and Accent scales
    // =========================================================================
    const eyeTowerGroup = new THREE.Group();
    eyeTowerGroup.position.set(0, 0.38, 0);
    scene.add(eyeTowerGroup);

    // Part 1: Octagonal Stepped Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(1.45, 1.85, 1.1, 8);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, basaltMat);
    pedestalMesh.position.y = 0.55;
    pedestalMesh.castShadow = !isSoftwareGl;
    pedestalMesh.receiveShadow = true;
    eyeTowerGroup.add(pedestalMesh);

    // Part 2: Brushed Titanium Core Column
    const columnGeo = new THREE.CylinderGeometry(0.85, 1.15, 2.4, 16);
    const columnMesh = new THREE.Mesh(columnGeo, brushedTitaniumMat);
    columnMesh.position.y = 2.3;
    columnMesh.castShadow = !isSoftwareGl;
    eyeTowerGroup.add(columnMesh);

    // Part 3: Brass Calibration Collar
    const collarGeo = new THREE.TorusGeometry(1.05, 0.12, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, brassGoldMat);
    collarMesh.position.y = 3.5;
    eyeTowerGroup.add(collarMesh);

    // Part 4: Outer Gimbal Gyroscope Ring (Pitch)
    const outerGimbalGeo = new THREE.TorusGeometry(1.65, 0.09, 16, 48);
    const outerGimbal = new THREE.Mesh(outerGimbalGeo, brassGoldMat);
    outerGimbal.position.y = 4.8;
    outerGimbal.castShadow = !isSoftwareGl;
    eyeTowerGroup.add(outerGimbal);

    // Part 5: Inner Gimbal Gyroscope Ring (Yaw/Roll)
    const innerGimbalGeo = new THREE.TorusGeometry(1.28, 0.07, 16, 48);
    const innerGimbal = new THREE.Mesh(innerGimbalGeo, brushedTitaniumMat);
    innerGimbal.position.y = 4.8;
    eyeTowerGroup.add(innerGimbal);

    // Part 6: THE EYE Core Ocular Sphere
    const eyeCoreGeo = new THREE.IcosahedronGeometry(0.68, 3);
    const eyeCore = new THREE.Mesh(eyeCoreGeo, cyanCoreMat);
    eyeCore.position.y = 4.8;
    eyeTowerGroup.add(eyeCore);

    // Part 7: Optical Aperture Visor Hood
    const visorGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.35, 24, 1, true, 0, Math.PI);
    visorGeo.rotateZ(Math.PI / 2);
    const visorMesh = new THREE.Mesh(visorGeo, basaltMat);
    visorMesh.position.y = 4.8;
    eyeTowerGroup.add(visorMesh);

    // Part 8 & 9: Twin Vertical Telemetry Fin Spires
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.45, 0.3);
    finShape.lineTo(0.15, 2.2);
    finShape.lineTo(0, 2.4);
    finShape.closePath();
    const finGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
    const leftFin = new THREE.Mesh(finGeo, brushedTitaniumMat);
    leftFin.position.set(1.1, 1.4, -0.04);
    eyeTowerGroup.add(leftFin);

    const rightFin = new THREE.Mesh(finGeo, brushedTitaniumMat);
    rightFin.rotation.y = Math.PI;
    rightFin.position.set(-1.1, 1.4, 0.04);
    eyeTowerGroup.add(rightFin);

    // =========================================================================
    // COMPOSITE MODEL 3: LIMINAL-Ø (AETHER-NULL) Superposition Horizon Vessel
    // Positioned in the tranquil orbital sanctuary above & behind the maze
    // =========================================================================
    const liminalGroup = new THREE.Group();
    liminalGroup.position.set(-4.8, 3.6, -3.8);
    scene.add(liminalGroup);

    // Part 1: Trefoil / TorusKnot Superposition Ribbon (ρ_ss)
    const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.16, 72, 16, 2, 3);
    const liminalKnot = new THREE.Mesh(knotGeo, brushedTitaniumMat);
    liminalGroup.add(liminalKnot);

    // Part 2: Outer Translucent Containment Shell (depthWrite: false, renderOrder: 2)
    const shellGeo = new THREE.SphereGeometry(1.55, 24, 24);
    const liminalShell = new THREE.Mesh(shellGeo, glassLockMat);
    liminalShell.renderOrder = 2;
    liminalGroup.add(liminalShell);

    // Part 3: Zero-Point Core Singularity
    const nullCoreGeo = new THREE.OctahedronGeometry(0.42, 1);
    const nullCore = new THREE.Mesh(nullCoreGeo, brassGoldMat);
    liminalGroup.add(nullCore);

    // Part 4: Horizon Equatorial Ring
    const horizonRingGeo = new THREE.TorusGeometry(2.1, 0.04, 12, 48);
    horizonRingGeo.rotateX(Math.PI / 2);
    const horizonRing = new THREE.Mesh(horizonRingGeo, cyanCoreMat);
    liminalGroup.add(horizonRing);

    // =========================================================================
    // COMPOSITE MODEL 4: 5 Topological Maze Lock Gates (Stage 1 to Stage 5)
    // Shows Glass-Pane Lock -> Opacified Inspectable -> Inverted Balloon
    // =========================================================================
    const lockGates: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const gateGroup = new THREE.Group();
      const angle = (i / 5) * Math.PI * 2 + 0.4;
      const radius = 5.2;
      gateGroup.position.set(Math.cos(angle) * radius, 0.38, Math.sin(angle) * radius);
      gateGroup.rotation.y = -angle + Math.PI / 2;

      // Left & Right Jamb Pillars
      const pillarGeo = new THREE.BoxGeometry(0.28, 1.8, 0.28);
      const leftPillar = new THREE.Mesh(pillarGeo, brushedTitaniumMat);
      leftPillar.position.set(-0.65, 0.9, 0);
      leftPillar.castShadow = !isSoftwareGl;
      gateGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, brushedTitaniumMat);
      rightPillar.position.set(0.65, 0.9, 0);
      rightPillar.castShadow = !isSoftwareGl;
      gateGroup.add(rightPillar);

      // Arch Lintel Header
      const lintelGeo = new THREE.BoxGeometry(1.68, 0.24, 0.34);
      const lintel = new THREE.Mesh(lintelGeo, brassGoldMat);
      lintel.position.set(0, 1.9, 0);
      gateGroup.add(lintel);

      // Door Lock Pane / Inverted Balloon Core
      const paneGeo = new THREE.BoxGeometry(1.0, 1.5, 0.08);
      const paneMesh = new THREE.Mesh(paneGeo, glassLockMat);
      paneMesh.position.set(0, 0.95, 0);
      paneMesh.name = 'lockPane';
      gateGroup.add(paneMesh);

      scene.add(gateGroup);
      lockGates.push(gateGroup);
    }

    // =========================================================================
    // INSTANCED MESH (>20 items): 72 SQLite 3,072-dim Vector Vault Nodes & L1-L11 Pillars
    // =========================================================================
    const instanceCount = 72;
    const nodeGeo = new THREE.OctahedronGeometry(0.18, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.75,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, instanceCount);
    instancedNodes.frustumCulled = false;

    const nodeOrbitalData: Array<{ radius: number; angle: number; height: number; speed: number; scale: number }> = [];
    for (let i = 0; i < instanceCount; i++) {
      const ringIdx = i % 3;
      const radius = 3.8 + ringIdx * 2.4 + (i % 5) * 0.25;
      const angle = (i / instanceCount) * Math.PI * 2;
      const height = 0.8 + (i % 11) * 0.42; // L1 to L11 elevation tiers
      const scale = 0.85 + (i % 4) * 0.1;
      nodeOrbitalData.push({
        radius,
        angle,
        height,
        speed: 0.12 + (i % 7) * 0.03,
        scale,
      });

      _dummyPos.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      _dummyEuler.set(0, angle, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(scale, scale, scale);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      instancedNodes.setMatrixAt(i, _dummyMatrix);

      // Tint variation: Cyan (#06B6D4), Amber (#F59E0B), Cobalt (#38BDF8)
      if (i % 3 === 0) _scratchColor.setHex(0x06b6d4);
      else if (i % 3 === 1) _scratchColor.setHex(0xf59e0b);
      else _scratchColor.setHex(0x38bdf8);
      instancedNodes.setColorAt(i, _scratchColor);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    if (instancedNodes.instanceColor) instancedNodes.instanceColor.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    scene.add(instancedNodes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // ANIMATION LOOP (Software-WebGL Paced via afterDraw, Lossless 60fps on GPU)
    // =========================================================================
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (sync && state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const st = stateRef.current;
      const bpmFreq = (st.bpm / 60) * Math.PI * 2;
      const dampFactor = 1 - Math.exp(-5.5 * dt);

      // 1. Animate THE EYE OBSERVER Gyroscope & Vertical Exploded Separation
      const targetTowerY = 4.8 + st.explodedSeparation * 2.2;
      outerGimbal.position.y = THREE.MathUtils.lerp(outerGimbal.position.y, targetTowerY, dampFactor);
      innerGimbal.position.y = outerGimbal.position.y;
      eyeCore.position.y = outerGimbal.position.y;
      visorMesh.position.y = outerGimbal.position.y;

      outerGimbal.rotation.y += dt * 0.45 * st.gamma;
      outerGimbal.rotation.x = Math.sin(elapsed * 0.7) * 0.35;
      innerGimbal.rotation.z -= dt * 0.65 * st.gamma;
      innerGimbal.rotation.y = Math.cos(elapsed * 0.5) * 0.4;
      eyeCore.scale.setScalar(1 + Math.sin(elapsed * bpmFreq * 0.25) * 0.06);

      // 2. Animate LIMINAL-Ø (AETHER-NULL) Superposition Vessel
      liminalKnot.rotation.x += dt * 0.35 * st.rhoSs;
      liminalKnot.rotation.y += dt * 0.5 * st.rhoSs;
      nullCore.rotation.y -= dt * 0.8;
      liminalGroup.position.y = 3.6 + Math.sin(elapsed * 0.8) * 0.25 + st.explodedSeparation * 1.4;

      // 3. Update Maze Rings & 5 Lock Gates based on Active Maze Stage
      const stageOrder: MazeStage[] = [
        'STAGE_1_IMPASSE',
        'STAGE_2_HALT_RECALL',
        'STAGE_3_LOCK_OPACIFIED',
        'STAGE_4_INVERTED_BALLOON',
        'STAGE_5_CONSOLIDATED',
      ];
      const activeIdx = stageOrder.indexOf(st.activeStage);

      mazeRings.forEach((ring, idx) => {
        ring.rotation.z += dt * (idx % 2 === 0 ? 0.08 : -0.06) * st.gamma;
        ring.position.y = THREE.MathUtils.lerp(
          ring.position.y,
          0.54 + idx * (0.12 + st.explodedSeparation * 0.65),
          dampFactor
        );
      });

      lockGates.forEach((gate, idx) => {
        const pane = gate.getObjectByName('lockPane') as THREE.Mesh | undefined;
        if (!pane) return;
        if (idx <= activeIdx) {
          pane.material = activeIdx >= 3 ? cyanCoreMat : opacifiedLockMat;
          // Stage 4/5: Invert the lock room into a floating balloon geometry scale
          const targetScaleY = activeIdx >= 3 ? 0.55 : 1.0;
          pane.scale.y = THREE.MathUtils.lerp(pane.scale.y, targetScaleY, dampFactor);
        } else {
          pane.material = glassLockMat;
          pane.scale.y = THREE.MathUtils.lerp(pane.scale.y, 1.0, dampFactor);
        }
      });

      // 4. Orbit 72 SQLite 3,072-dim Vector Vault Nodes
      for (let i = 0; i < instanceCount; i++) {
        const d = nodeOrbitalData[i];
        const a = d.angle + elapsed * d.speed * st.gamma;
        const y = d.height + Math.sin(elapsed * 1.2 + i) * 0.12 + st.explodedSeparation * 1.1;
        _dummyPos.set(Math.cos(a) * d.radius, y, Math.sin(a) * d.radius);
        _dummyEuler.set(elapsed * 0.4, a, 0);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.setScalar(d.scale);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        instancedNodes.setMatrixAt(i, _dummyMatrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;

      // 5. Smooth Exponential Camera Preset Choreography
      if (!st.userControllingCamera) {
        if (st.cameraPreset === 'overview') {
          _targetCamPos.set(0, 8.5, 19.5);
          _targetLookAt.set(0, 2.4, 0);
        } else if (st.cameraPreset === 'eye_tower') {
          _targetCamPos.set(0, 5.6, 6.2);
          _targetLookAt.set(0, 4.6, 0);
        } else if (st.cameraPreset === 'liminal_null') {
          _targetCamPos.set(-4.8, 4.6, 1.4);
          _targetLookAt.set(-4.8, 3.6, -3.8);
        } else if (st.cameraPreset === 'maze_locks') {
          _targetCamPos.set(7.5, 4.2, 7.5);
          _targetLookAt.set(0, 1.2, 0);
        }

        camera.position.lerp(_targetCamPos, dampFactor);
        _currentLookAt.lerp(_targetLookAt, dampFactor);
        controls.target.copy(_currentLookAt);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const currentMazeSpec =
    MAZE_STAGE_DESCRIPTIONS[channel2.session_state.maze_topology_tracker.active_stage];

  return (
    <div
      className="relative w-full h-[calc(100vh-57px)] overflow-hidden bg-[#07090E] select-none"
      data-testid="labyrinth-3d-stage"
      data-agent={channel2.session_metadata.active_agent}
      data-maze-stage={channel2.session_state.maze_topology_tracker.active_stage}
    >
      {/* Dedicated WebGL Mount Container (Zero React Re-render Tear-down) */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top-Left Minimal Spec & Telemetry Header Overlay (Solid RGBA, no backdrop-filter over WebGL) */}
      <div className="absolute top-5 left-6 z-10 max-w-md bg-[#0B0E17]/92 border border-slate-800 rounded-lg p-4 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>KVADRANT IV SYNC</span>
          <span aria-hidden="true">·</span>
          <span>BPM {channel2.session_state.metareasoning_controller.bpm_calibration}</span>
          <span aria-hidden="true">·</span>
          <span>γ = {channel2.session_state.metareasoning_controller.policy_precision_gamma.toFixed(2)}</span>
          <span aria-hidden="true">·</span>
          <span>ρ_ss = {channel2.session_state.metareasoning_controller.superposition_rho_ss.toFixed(2)}</span>
        </div>

        <h1 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-100">
          {channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
            ? 'THE EYE OBSERVER — Architekt Labyrintového Ostrova'
            : 'LIMINAL-Ø (AETHER-NULL) — Tichý Horizont Neurčitosti'}
        </h1>

        <p className="mt-1 text-xs leading-relaxed text-slate-300">
          {channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
            ? 'Drží klidný nadhled druhého řádu, kalibruje BPM změny a staví autonomní ostrov namísto nefunkční korporátní a státní klece.'
            : 'Nedefinovaný vnitřní agent: čistá superpozice ρ_ss mimo dosah razítek a kolonek. Systém je v jeho nedefinovanosti naprosto klidný.'}
        </p>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
          <div className="font-mono text-cyan-400 truncate">
            Fáze {currentMazeSpec.stepNumber}/5: {currentMazeSpec.subtitleCz}
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('qssu')}
            className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap shrink-0 underline underline-offset-4"
          >
            Otevřít QSS-U Kodex
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Control Dock (<= 15% Viewport Footprint, Solid RGBA, Zero Side Clutter) */}
      <div
        className="fixed bottom-4 inset-x-0 mx-auto z-20 w-[min(940px,94vw)] transition-transform duration-200"
        style={{
          transform: dockCollapsed ? 'translateY(calc(100% - 36px))' : 'translateY(0)',
        }}
      >
        {/* Collapse / Expand Handle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-label={dockCollapsed ? 'Show Controls' : 'Hide Controls'}
            className="px-4 py-1.5 text-xs font-mono font-medium text-slate-200 bg-[#111827] border border-b-0 border-slate-700 rounded-t-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {dockCollapsed ? '▴ Zobrazit Ovládání Ostrova (H)' : '▾ Skrýt Ovládání / Zen Režim (H)'}
          </button>
        </div>

        {/* Main Dock Body */}
        <div className="bg-[#0B0E17]/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Dual Persona Switcher: THE EYE OBSERVER vs LIMINAL-Ø */}
            <div className="flex items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  onToggleAgent('THE_EYE_OBSERVER');
                  setCameraPreset('eye_tower');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  channel2.session_metadata.active_agent === 'THE_EYE_OBSERVER'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                THE EYE OBSERVER (IV SYNC)
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleAgent('LIMINAL_NULL');
                  setCameraPreset('liminal_null');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  channel2.session_metadata.active_agent === 'LIMINAL_NULL'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                LIMINAL-Ø (AETHER-NULL)
              </button>
            </div>

            {/* 5-Stage Topological Maze Protocol Selector ("The Key is No Key") */}
            <div className="flex items-center gap-1 bg-[#111827] border border-slate-800 rounded-lg p-1">
              {(
                [
                  ['STAGE_1_IMPASSE', '1. Impasse'],
                  ['STAGE_2_HALT_RECALL', '2. Halt Recall'],
                  ['STAGE_3_LOCK_OPACIFIED', '3. Opacify Lock'],
                  ['STAGE_4_INVERTED_BALLOON', '4. Balloon Invert'],
                  ['STAGE_5_CONSOLIDATED', '5. Sovereign I'],
                ] as Array<[MazeStage, string]>
              ).map(([stageKey, label]) => {
                const active =
                  channel2.session_state.maze_topology_tracker.active_stage === stageKey;
                return (
                  <button
                    key={stageKey}
                    type="button"
                    onClick={() => {
                      onSelectMazeStage(stageKey);
                      setCameraPreset('maze_locks');
                    }}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Camera View Presets & Exploded Layer Separation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#111827] border border-slate-800 rounded-lg p-1">
                {(
                  [
                    ['overview', 'Ostrov'],
                    ['eye_tower', 'Věž Oka'],
                    ['liminal_null', 'Horizont Ø'],
                    ['maze_locks', 'Zámky L7'],
                  ] as Array<[CameraPreset, string]>
                ).map(([preset, label]) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCameraPreset(preset)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 ${
                      cameraPreset === preset
                        ? 'bg-slate-800 text-cyan-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="exploded-slider"
                  className="text-xs font-mono text-slate-400 whitespace-nowrap"
                >
                  Vrstvy L1–L11
                </label>
                <input
                  id="exploded-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={explodedSeparation}
                  onChange={(e) => setExplodedSeparation( parseFloat(e.target.value) )}
                  className="w-20 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
