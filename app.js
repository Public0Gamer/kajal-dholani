/**
 * MAKEUP BY KAJAL DHOLANI - LUXURY 3D MOTION WEB APPLICATION
 * Standalone & Universal Browser Architecture
 */

(function () {
  'use strict';

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  function initApp() {
    // 1. Initialize Custom Luxury Cursor
    initCustomCursor();

    // 2. Initialize Ambient Audio Synthesizer (Web Audio API)
    const audioManager = initAmbientAudio();

    // 3. Initialize 3D Motion Studio
    const threeStudio = init3DStudio();

    // 4. Initialize 3D HUD Controls
    init3DHUD(threeStudio, audioManager);

    // 5. Initialize Before & After Slider
    initBeforeAfterSlider(audioManager);

    // 6. Initialize Look Customizer Studio
    initLookCustomizer(audioManager);

    // 7. Initialize Lookbook & Lightbox Modal
    initLookbook(audioManager);

    // 8. Initialize 3D Card Hover Tilts
    initCard3DTilt();

    // 9. Initialize Booking Estimator & VIP Form
    initBookingEstimator(audioManager);

    // 10. Navigation & Mobile Drawer
    initNavigation();

    // 11. Masterclass Enrollment
    initMasterclass(audioManager);
  }

  /* ==========================================================================
     1. CUSTOM LUXURY CURSOR
     ========================================================================== */
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    if (!dot || !outline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function render() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .tilt-card, .chip, .shade-dot, .hud-btn');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     2. AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  function initAmbientAudio() {
    let audioCtx = null;
    let isEnabled = false;
    const toggleBtn = document.getElementById('audioToggle');

    function playLuxuryChime(freq, type, duration) {
      freq = freq || 880;
      type = type || 'sine';
      duration = duration || 0.6;

      if (!isEnabled) return;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn('Audio error', e);
      }
    }

    function playHarmonicChord() {
      if (!isEnabled) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => playLuxuryChime(freq, 'sine', 0.8), idx * 80);
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isEnabled = !isEnabled;
        const text = toggleBtn.querySelector('.audio-text');
        if (isEnabled) {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (text) text.textContent = 'Sound: ON ✨';
          toggleBtn.style.background = 'rgba(197, 160, 89, 0.4)';
          playHarmonicChord();
        } else {
          if (text) text.textContent = 'Sound: OFF';
          toggleBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        }
      });
    }

    return {
      chime: playLuxuryChime,
      chord: playHarmonicChord
    };
  }

  /* ==========================================================================
     3. 3D MOTION STUDIO ENGINE (THREE.JS)
     ========================================================================== */
  function init3DStudio() {
    const container = document.getElementById('three-hero-canvas');
    if (!container || !window.THREE) {
      console.warn('Three.js container or library not ready.');
      return null;
    }

    const THREE = window.THREE;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 560;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.error('WebGL init error:', e);
      return null;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.toneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    }
    container.appendChild(renderer.domElement);

    // Remove canvas loader
    const loader = document.getElementById('canvasLoader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 400);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFF9F0, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFE8C2, 2.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xF8D8DA, 1.6);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xD4AF37, 3.0);
    rimLight.position.set(2, 6, -5);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xFFD700, 1.8, 10);
    accentLight.position.set(0, 2, 2);
    scene.add(accentLight);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xE6C374,
      metalness: 0.95,
      roughness: 0.16
    });

    const roseGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8A99B,
      metalness: 0.9,
      roughness: 0.22
    });

    const lipstickBulletMaterial = new THREE.MeshStandardMaterial({
      color: 0x9C2738,
      roughness: 0.8,
      metalness: 0.08
    });

    const highlighterMaterial = new THREE.MeshStandardMaterial({
      color: 0xF7E2C4,
      roughness: 0.35,
      metalness: 0.4
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial ? new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 1.2
    }) : new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6
    });

    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0xDAA520,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    const silkMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFF5EC,
      roughness: 0.4,
      metalness: 0.25,
      side: THREE.DoubleSide
    });

    const pearlMaterial = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.18,
      metalness: 0.65
    });

    // Models container
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    const models = {};

    // 1. Lipstick
    const lipstickGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 1.4, 48), goldMaterial);
    baseMesh.position.y = -0.8;
    lipstickGroup.add(baseMesh);

    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.405, 0.03, 16, 48), roseGoldMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.1;
    lipstickGroup.add(ringMesh);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.8, 36), roseGoldMaterial);
    neckMesh.position.y = 0.3;
    lipstickGroup.add(neckMesh);

    const bulletGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.1, 48);
    const pos = bulletGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const z = pos.getZ(i);
      if (y > 0.25) pos.setY(i, y - (z * 0.45));
    }
    bulletGeo.computeVertexNormals();

    const lipstickBullet = new THREE.Mesh(bulletGeo, lipstickBulletMaterial);
    lipstickBullet.position.y = 1.0;
    lipstickBullet.rotation.y = Math.PI * 0.2;
    lipstickGroup.add(lipstickBullet);

    const emblemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 32), roseGoldMaterial);
    emblemMesh.position.set(0, -0.65, 0.4);
    emblemMesh.rotation.x = Math.PI / 2;
    lipstickGroup.add(emblemMesh);

    lipstickGroup.position.set(0, -0.1, 0);
    lipstickGroup.rotation.z = -0.12;
    lipstickGroup.rotation.x = 0.18;
    modelsGroup.add(lipstickGroup);
    models.lipstick = lipstickGroup;

    // 2. Compact
    const compactGroup = new THREE.Group();
    const compactBaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.15, 0.24, 64), goldMaterial);
    compactGroup.add(compactBaseMesh);

    const panMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.06, 64), highlighterMaterial);
    panMesh.position.y = 0.11;
    compactGroup.add(panMesh);

    for (let i = 0; i < 8; i++) {
      const ribMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.08), roseGoldMaterial);
      ribMesh.position.y = 0.15;
      ribMesh.rotation.y = (Math.PI / 8) * i;
      compactGroup.add(ribMesh);
    }

    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.12, -1.15);
    const compactLidMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.18, 64), goldMaterial);
    compactLidMesh.position.set(0, 0, 1.15);
    lidPivot.add(compactLidMesh);

    const mirrorMesh = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48), new THREE.MeshStandardMaterial({
      color: 0xE8F0FE,
      metalness: 0.98,
      roughness: 0.05
    }));
    mirrorMesh.position.set(0, -0.1, 1.15);
    mirrorMesh.rotation.x = Math.PI / 2;
    lidPivot.add(mirrorMesh);
    lidPivot.rotation.x = -Math.PI * 0.58;
    compactGroup.add(lidPivot);

    compactGroup.position.set(0, -0.4, 0);
    compactGroup.rotation.x = 0.45;
    compactGroup.rotation.y = -0.3;
    compactGroup.visible = false;
    modelsGroup.add(compactGroup);
    models.compact = compactGroup;

    // 3. Perfume
    const perfumeGroup = new THREE.Group();
    const glassBodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.5, 8), glassMaterial);
    perfumeGroup.add(glassBodyMesh);

    const liquidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.2, 8), liquidMaterial);
    liquidMesh.position.y = -0.1;
    perfumeGroup.add(liquidMesh);

    const perfumeNeckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.45, 32), goldMaterial);
    perfumeNeckMesh.position.y = 0.95;
    perfumeGroup.add(perfumeNeckMesh);

    const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.55, 6), goldMaterial);
    capMesh.position.y = 1.4;
    perfumeGroup.add(capMesh);

    const plaqueMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.05), roseGoldMaterial);
    plaqueMesh.position.set(0, 0, 0.86);
    perfumeGroup.add(plaqueMesh);

    perfumeGroup.position.set(0, -0.2, 0);
    perfumeGroup.rotation.y = 0.4;
    perfumeGroup.visible = false;
    modelsGroup.add(perfumeGroup);
    models.perfume = perfumeGroup;

    // 4. Silk & Pearls
    const silkGroup = new THREE.Group();
    const silkRibbon = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.18, 120, 24, 2, 3), silkMaterial);
    silkGroup.add(silkRibbon);

    const pearls = [];
    const pearlCoords = [
      { x: 1.4, y: 0.8, z: 0.4, r: 0.16 },
      { x: -1.3, y: -0.6, z: 0.6, r: 0.14 },
      { x: 0.7, y: -1.2, z: -0.5, r: 0.2 },
      { x: -0.9, y: 1.1, z: -0.4, r: 0.12 },
      { x: 1.1, y: -0.3, z: 1.1, r: 0.18 }
    ];

    pearlCoords.forEach((p, idx) => {
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 32, 32), pearlMaterial);
      pMesh.position.set(p.x, p.y, p.z);
      pMesh.userData = {
        baseX: p.x,
        baseY: p.y,
        baseZ: p.z,
        speed: 1.2 + idx * 0.3,
        phase: idx * 1.5
      };
      silkGroup.add(pMesh);
      pearls.push(pMesh);
    });

    silkGroup.visible = false;
    modelsGroup.add(silkGroup);
    models.silk = silkGroup;

    // Stardust Particle Field
    const particleCount = 350;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(255, 235, 175, 1)');
    pGrad.addColorStop(0.4, 'rgba(212, 175, 55, 0.75)');
    pGrad.addColorStop(0.7, 'rgba(212, 175, 55, 0.2)');
    pGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const pMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xF6D58D
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Animation & Interaction Variables
    let currentModelType = 'lipstick';
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const clock = new THREE.Clock();

    // Mouse Parallax Listeners
    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouse.targetX = Math.max(-1.5, Math.min(1.5, x));
      mouse.targetY = Math.max(-1.5, Math.min(1.5, y));
    });

    // Touch & Drag Orbit Listeners
    function onPointerDown(e) {
      isDragging = true;
      previousMousePosition = {
        x: e.clientX || (e.touches && e.touches[0].clientX),
        y: e.clientY || (e.touches && e.touches[0].clientY)
      };
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    window.addEventListener('resize', () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!isDragging) {
        targetRotationY += 0.003;
      }

      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      modelsGroup.rotation.y = currentRotationY + (mouse.x * 0.35);
      modelsGroup.rotation.x = currentRotationX + (mouse.y * 0.25);
      modelsGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Silk & Pearls animation
      if (currentModelType === 'silk') {
        silkRibbon.rotation.x = Math.sin(elapsedTime * 0.8) * 0.2;
        silkRibbon.rotation.z = Math.cos(elapsedTime * 0.6) * 0.2;
        pearls.forEach((p) => {
          p.position.y = p.userData.baseY + Math.sin(elapsedTime * p.userData.speed + p.userData.phase) * 0.2;
          p.position.x = p.userData.baseX + Math.cos(elapsedTime * 0.8 + p.userData.phase) * 0.1;
        });
      }

      // Moving Accent Light
      accentLight.position.x = Math.cos(elapsedTime * 1.2) * 2.5;
      accentLight.position.z = Math.sin(elapsedTime * 1.2) * 2.5 + 1.5;
      accentLight.position.y = Math.sin(elapsedTime * 2) * 0.8 + 1.2;

      // Golden Stardust Ascend
      particles.rotation.y = elapsedTime * 0.04;
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < posArr.length; i += 3) {
        posArr[i + 1] += 0.002;
        if (posArr[i + 1] > 3.5) posArr[i + 1] = -3.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();

    return {
      switchModel: function (modelKey) {
        if (!models[modelKey] || currentModelType === modelKey) return;
        const prev = models[currentModelType];
        const next = models[modelKey];
        if (prev) prev.visible = false;
        if (next) {
          next.visible = true;
          next.scale.set(0.3, 0.3, 0.3);
          const enter = () => {
            if (next.scale.x < 0.98) {
              next.scale.x += (1 - next.scale.x) * 0.15;
              next.scale.y += (1 - next.scale.y) * 0.15;
              next.scale.z += (1 - next.scale.z) * 0.15;
              requestAnimationFrame(enter);
            } else {
              next.scale.set(1, 1, 1);
            }
          };
          enter();
        }
        currentModelType = modelKey;
      },
      setShadeColor: function (hexColor) {
        lipstickBulletMaterial.color.set(hexColor);
      }
    };
  }

  /* ==========================================================================
     4. 3D HUD CONTROLS
     ========================================================================== */
  function init3DHUD(threeStudio, audioManager) {
    if (!threeStudio) return;

    const hudBtns = document.querySelectorAll('.hud-btn');
    hudBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        hudBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const model = btn.getAttribute('data-model');
        threeStudio.switchModel(model);
        audioManager.chime(1200, 'triangle', 0.4);
      });
    });

    const shadeDots = document.querySelectorAll('.shade-dot');
    shadeDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        shadeDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        const hex = dot.getAttribute('data-color');
        threeStudio.setShadeColor(hex);
        audioManager.chime(980, 'sine', 0.3);
      });
    });
  }

  /* ==========================================================================
     5. BEFORE & AFTER COMPARISON SLIDER
     ========================================================================== */
  function initBeforeAfterSlider(audioManager) {
    const container = document.getElementById('comparisonSlider');
    const beforeLayer = document.getElementById('beforeLayer');
    const handle = document.getElementById('sliderHandle');
    if (!container || !beforeLayer || !handle) return;

    let isSliding = false;

    function setSliderPosition(x) {
      const rect = container.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      beforeLayer.style.width = pos + '%';
      handle.style.left = pos + '%';
    }

    function onPointerDown(e) {
      isSliding = true;
      setSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerMove(e) {
      if (!isSliding) return;
      setSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerUp() {
      isSliding = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Look Presets
    const looksData = {
      look1: {
        after: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=80',
        before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        base: 'Dewy Airbrush 4K Satin',
        eyes: 'Soft Rose Gold Smokey & 3D Mink Lashes',
        lips: 'Velvet Berry Contour with Peach Center',
        longevity: '18-Hour Humidity-Proof'
      },
      look2: {
        after: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
        before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
        base: 'Glass Skin High-Beam Strobing',
        eyes: 'Bronze Halo Shimmer & Winged Liner',
        lips: 'High-Gloss Nude Glass Finish',
        longevity: 'Transfer-Resistant All-Night Seal'
      },
      look3: {
        after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        before: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
        base: 'Micro-Airbrush Ethereal Second-Skin',
        eyes: 'Champagne Wash & Feathered Brows',
        lips: 'French Rose Blotted Matte Velvet',
        longevity: 'Lightweight Weightless 12-Hour'
      }
    };

    const tabs = document.querySelectorAll('.trans-tab');
    const afterImg = document.getElementById('afterImg');
    const beforeImg = document.getElementById('beforeImg');
    const dBase = document.getElementById('detailBase');
    const dEyes = document.getElementById('detailEyes');
    const dLips = document.getElementById('detailLips');
    const dLong = document.getElementById('detailLongevity');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const lookKey = tab.getAttribute('data-look');
        const look = looksData[lookKey];
        if (look) {
          if (afterImg) afterImg.src = look.after;
          if (beforeImg) beforeImg.src = look.before;
          if (dBase) dBase.textContent = look.base;
          if (dEyes) dEyes.textContent = look.eyes;
          if (dLips) dLips.textContent = look.lips;
          if (dLong) dLong.textContent = look.longevity;
          audioManager.chime(800, 'sine', 0.3);
        }
      });
    });
  }

  /* ==========================================================================
     6. INTERACTIVE LOOK CUSTOMIZER STUDIO
     ========================================================================== */
  function initLookCustomizer(audioManager) {
    const occasionChips = document.querySelectorAll('#occasionChips .chip');
    const toneChips = document.querySelectorAll('#toneChips .chip');
    const eyeChips = document.querySelectorAll('#eyeChips .chip');
    const lipChips = document.querySelectorAll('#lipChips .chip');

    const specOccasion = document.getElementById('specOccasion');
    const specTone = document.getElementById('specTone');
    const specEye = document.getElementById('specEye');
    const specLip = document.getElementById('specLip');

    const swatchBase = document.getElementById('swatchBase');
    const swatchEye = document.getElementById('swatchEye');
    const swatchLip = document.getElementById('swatchLip');

    const toneColorMap = {
      'Warm Golden': '#F0D5BE',
      'Neutral Olive': '#DFC5AC',
      'Cool Rosy': '#F6E0DF',
      'Rich Honey': '#CFA382'
    };

    const eyeColorMap = {
      'Champagne & Bronze Smokey': '#9E7453',
      'Royal Kohl Smudge': '#3D3534',
      'Rose Gold Glitter Wing': '#C58C85',
      'Dewy Minimalist Lift': '#C9A88D'
    };

    function handleChips(group, callback) {
      group.forEach((chip) => {
        chip.addEventListener('click', () => {
          group.forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          callback(chip.getAttribute('data-val'), chip);
          audioManager.chime(1050, 'sine', 0.25);
        });
      });
    }

    handleChips(occasionChips, (val) => {
      if (specOccasion) specOccasion.textContent = val;
    });

    handleChips(toneChips, (val) => {
      if (specTone) specTone.textContent = val;
      if (swatchBase && toneColorMap[val]) {
        swatchBase.style.backgroundColor = toneColorMap[val];
      }
    });

    handleChips(eyeChips, (val) => {
      if (specEye) specEye.textContent = val;
      if (swatchEye && eyeColorMap[val]) {
        swatchEye.style.backgroundColor = eyeColorMap[val];
      }
    });

    handleChips(lipChips, (val, chip) => {
      if (specLip) specLip.textContent = val;
      const color = chip.getAttribute('data-color');
      if (swatchLip && color) {
        swatchLip.style.backgroundColor = color;
      }
    });

    // Apply Blueprint to Booking Notes
    const applyBtn = document.getElementById('applyLookToBooking');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const occasion = specOccasion ? specOccasion.textContent : '';
        const tone = specTone ? specTone.textContent : '';
        const eye = specEye ? specEye.textContent : '';
        const lip = specLip ? specLip.textContent : '';

        const notesField = document.getElementById('clientNotes');
        if (notesField) {
          notesField.value = `[Custom Look Blueprint]: Occasion: ${occasion} | Complexion: ${tone} | Eyes: ${eye} | Lip: ${lip}`;
        }

        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }

        showToast('Look Blueprint Locked!', 'Added to your consultation notes below.');
        audioManager.chord();
      });
    }
  }

  /* ==========================================================================
     7. LOOKBOOK & LIGHTBOX MODAL
     ========================================================================== */
  function initLookbook(audioManager) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        items.forEach((item) => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
        audioManager.chime(920, 'sine', 0.2);
      });
    });

    const modal = document.getElementById('lookbookModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCat = document.getElementById('modalCategory');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalBookBtn = document.getElementById('modalBookBtn');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');
        const img = item.getAttribute('data-img');
        const cat = item.getAttribute('data-category');

        if (modal && modalImg && modalTitle && modalDesc) {
          modalImg.src = img;
          modalTitle.textContent = title;
          modalDesc.textContent = desc;
          if (modalCat) modalCat.textContent = cat.toUpperCase() + ' SPOTLIGHT';
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          audioManager.chord();
        }
      });
    });

    function closeModal() {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    if (modalBookBtn) {
      modalBookBtn.addEventListener('click', () => {
        closeModal();
        const currentTitle = modalTitle ? modalTitle.textContent : '';
        const notes = document.getElementById('clientNotes');
        if (notes) {
          notes.value = `I am specifically inspired by the "${currentTitle}" look from your portfolio.`;
        }
      });
    }
  }

  /* ==========================================================================
     8. 3D CARD HOVER TILTS
     ========================================================================== */
  function initCard3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }

  /* ==========================================================================
     9. BOOKING ESTIMATOR & FORM SUBMISSION
     ========================================================================== */
  function initBookingEstimator(audioManager) {
    const packageSelect = document.getElementById('servicePackage');
    const addonFamily = document.getElementById('addonFamily');
    const addonAirbrush = document.getElementById('addonAirbrush');
    const addonTouchup = document.getElementById('addonTouchup');
    const estimateDisplay = document.getElementById('estimateDisplay');
    const bookingForm = document.getElementById('bookingForm');

    function updateEstimate() {
      if (!packageSelect || !estimateDisplay) return;
      const selectedOption = packageSelect.options[packageSelect.selectedIndex];
      let basePrice = parseInt(selectedOption.getAttribute('data-price') || '65000', 10);

      if (addonFamily && addonFamily.checked) basePrice += parseInt(addonFamily.getAttribute('data-addon') || '15000', 10);
      if (addonAirbrush && addonAirbrush.checked) basePrice += parseInt(addonAirbrush.getAttribute('data-addon') || '8000', 10);
      if (addonTouchup && addonTouchup.checked) basePrice += parseInt(addonTouchup.getAttribute('data-addon') || '12000', 10);

      estimateDisplay.textContent = '₹' + basePrice.toLocaleString('en-IN');
    }

    if (packageSelect) packageSelect.addEventListener('change', updateEstimate);
    if (addonFamily) addonFamily.addEventListener('change', updateEstimate);
    if (addonAirbrush) addonAirbrush.addEventListener('change', updateEstimate);
    if (addonTouchup) addonTouchup.addEventListener('change', updateEstimate);

    // Package Card Direct Selection
    const selectBtns = document.querySelectorAll('.select-package-btn');
    selectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const packName = btn.getAttribute('data-pack');
        if (packageSelect) {
          for (let i = 0; i < packageSelect.options.length; i++) {
            if (packageSelect.options[i].text.includes(packName)) {
              packageSelect.selectedIndex = i;
              break;
            }
          }
          updateEstimate();
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
        audioManager.chord();
      });
    });

    // Form Submit Handler
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName')?.value || 'Valued Bride';
        const phone = document.getElementById('clientPhone')?.value || '';
        const date = document.getElementById('eventDate')?.value || '';
        const city = document.getElementById('eventCity')?.value || '';
        const packageName = packageSelect?.options[packageSelect.selectedIndex]?.text || '';
        const totalCost = estimateDisplay?.textContent || '₹65,000';
        const notes = document.getElementById('clientNotes')?.value || 'None';

        // Confetti
        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#C5A059', '#E0C78D', '#9C2738', '#FAF8F5']
          });
        }

        audioManager.chord();
        showToast('Booking Request Generated!', 'Opening WhatsApp VIP Concierge...');

        const waMsg = `Hello Makeup by Kajal Dholani Studio!%0A%0AI would like to inquire about booking my wedding date:%0A• Name: ${encodeURIComponent(name)}%0A• WhatsApp: ${encodeURIComponent(phone)}%0A• Event Date: ${encodeURIComponent(date)}%0A• Destination / City: ${encodeURIComponent(city)}%0A• Selected Package: ${encodeURIComponent(packageName)}%0A• Estimated Total: ${encodeURIComponent(totalCost)}%0A• Notes: ${encodeURIComponent(notes)}%0A%0APlease confirm Kajal Dholani's availability.`;

        setTimeout(() => {
          window.open(`https://wa.me/919876543210?text=${waMsg}`, '_blank');
        }, 1200);
      });
    }
  }

  /* ==========================================================================
     10. NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  function initNavigation() {
    const header = document.getElementById('siteHeader');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', () => drawer.classList.add('open'));
    }
    if (drawerClose && drawer) {
      drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
    }
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => drawer?.classList.remove('open'));
    });
  }

  /* ==========================================================================
     11. MASTERCLASS ENROLLMENT
     ========================================================================== */
  function initMasterclass(audioManager) {
    const enrollBtn = document.getElementById('enrollMasterclassBtn');
    if (enrollBtn) {
      enrollBtn.addEventListener('click', () => {
        const packageSelect = document.getElementById('servicePackage');
        if (packageSelect) {
          for (let i = 0; i < packageSelect.options.length; i++) {
            if (packageSelect.options[i].value === 'pro-masterclass') {
              packageSelect.selectedIndex = i;
              break;
            }
          }
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast('Masterclass Selected!', 'Complete the form below to receive the detailed syllabus.');
        audioManager.chord();
      });
    }
  }

  /* ==========================================================================
     TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(title, msg) {
    const toast = document.getElementById('toastNotification');
    const tTitle = document.getElementById('toastTitle');
    const tMsg = document.getElementById('toastMsg');
    if (!toast) return;

    if (tTitle) tTitle.textContent = title;
    if (tMsg) tMsg.textContent = msg;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

})();
