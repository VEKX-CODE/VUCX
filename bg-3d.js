window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-3d');
  if (!canvas) return;

  // 1. Сцена и камера: адаптивный угол под телефон и ПК
  const isMobile = window.innerWidth < 768;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 65 : 50, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(0, isMobile ? 130 : 110, isMobile ? 300 : 260);
  camera.lookAt(0, 0, 0);

  // 2. Рендерер
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: false, 
    antialias: false,
    powerPreference: "high-performance" 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x050505, 1);

  // 3. Туман горизонта
  scene.fog = new THREE.FogExp2(0x050505, 0.0025);

  // 4. Сетка частиц 80x80 = 6400 точек
  const SEPARATION = 11;
  const AMOUNTX = 80;
  const AMOUNTY = 80;
  const totalParticles = AMOUNTX * AMOUNTY;

  const positions = new Float32Array(totalParticles * 3);
  let i = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;     // X
      positions[i + 1] = 0;                                            // Y
      positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // Z
      i += 3;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 2.2,
    transparent: true,
    opacity: 0.85
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 5. Взаимодействие с мышью
  const raycaster = new THREE.Raycaster();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const mouse3D = new THREE.Vector3(9999, 0, 9999);
  const mouse = new THREE.Vector2(-999, -999);

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, mouse3D);
  });

  // Поддержка пальца на телефоне (прогиб от касания)
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(mousePlane, mouse3D);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse3D.set(9999, 0, 9999);
  });

  // Ударные волны от клика и тапа пальцем на телефоне
  const clickWaves = [];

  function triggerWave(clientX, clientY, target) {
    if (target && target.closest && target.closest('.calculator')) {
      return;
    }
    const m = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    const r = new THREE.Raycaster();
    const hit = new THREE.Vector3();
    r.setFromCamera(m, camera);
    if (r.ray.intersectPlane(mousePlane, hit)) {
      clickWaves.push({
        x: hit.x,
        z: hit.z,
        radius: 0,
        maxRadius: 500,
        strength: 45,
        speed: 3.0
      });
    }
  }

  window.addEventListener('click', (e) => {
    triggerWave(e.clientX, e.clientY, e.target);
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      triggerWave(touch.clientX, touch.clientY, e.target);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const mobile = window.innerWidth < 768;
    camera.fov = mobile ? 65 : 50;
    camera.position.set(0, mobile ? 130 : 110, mobile ? 300 : 260);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 6. Цикл анимации
  let count = 0;

  function animate() {
    requestAnimationFrame(animate);

    const pos = particles.geometry.attributes.position.array;

    // Обновляем волны от кликов (медленное затухание)
    for (let w = clickWaves.length - 1; w >= 0; w--) {
      clickWaves[w].radius += clickWaves[w].speed;
      clickWaves[w].strength *= 0.985; // медленнее затухает, чтобы дойти далеко
      if (clickWaves[w].radius > clickWaves[w].maxRadius || clickWaves[w].strength < 0.3) {
        clickWaves.splice(w, 1);
      }
    }

    let index = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const px = pos[index];
        const pz = pos[index + 2];

        // Фоновая синусоида
        let py = (Math.sin((ix + count) * 0.2) * 18) + (Math.sin((iy + count) * 0.35) * 18);

        // Мышь: сильное глубокое проседание (воронка глубже и шире)
        const dx = px - mouse3D.x;
        const dz = pz - mouse3D.z;
        const distSq = dx * dx + dz * dz;
        const mouseRadius = 75;

        if (distSq < mouseRadius * mouseRadius) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius);
          py -= force * force * 45; // мягкое аккуратное проседание на 45
        }

        // Волна: катится медленно и широко
        for (let w = 0; w < clickWaves.length; w++) {
          const wave = clickWaves[w];
          const wdx = px - wave.x;
          const wdz = pz - wave.z;
          const wDist = Math.sqrt(wdx * wdx + wdz * wdz);
          const diff = Math.abs(wDist - wave.radius);
          const waveThickness = 28; // толщина гребня волны

          if (diff < waveThickness) {
            py += Math.cos((diff / waveThickness) * Math.PI) * wave.strength;
          }
        }

        pos[index + 1] = py;
        index += 3;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    count += 0.035;

    renderer.render(scene, camera);
  }

  animate();
});
