window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-3d');
  if (!canvas) return;

  // 1. Сцена и камера (ставим камеру так, чтобы нельзя было вылететь за пределы)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 4, 18);
  camera.lookAt(0, 0, 0);

  // 2. Оптимизированный рендерер: фиксированный pixelRatio = 1, чтобы не лагало
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: false, 
    antialias: false,
    powerPreference: "high-performance" 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x050505, 1);

  // 3. Плотный туман, чтобы граница сетки мягко растворялась в темноте
  scene.fog = new THREE.Fog(0x050505, 10, 45);

  // 4. Оптимизированная сетка пола и потолка (меньше линий = 60 FPS)
  const gridSize = 60;
  const gridDivisions = 24;

  const floorGrid = new THREE.GridHelper(gridSize, gridDivisions, 0xff0000, 0x440000);
  floorGrid.position.y = -5;
  scene.add(floorGrid);

  const ceilGrid = new THREE.GridHelper(gridSize, gridDivisions, 0xff0000, 0x440000);
  ceilGrid.position.y = 10;
  scene.add(ceilGrid);

  // 5. Легкие 3D-фигуры
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  
  const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), wireMat);
  cube.position.set(-10, 1, -2);
  scene.add(cube);

  const octa = new THREE.Mesh(new THREE.OctahedronGeometry(2.5, 0), wireMat);
  octa.position.set(10, 2, -4);
  scene.add(octa);

  // 6. Мышь с ЖЕСТКИМ ограничением (нельзя улететь за край)
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    // Нормализуем координаты от -1 до 1
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;

    // Ограничиваем угол поворота максимум на 2-3 единицы
    targetMouseX = Math.max(-1, Math.min(1, nx)) * 2.5;
    targetMouseY = Math.max(-1, Math.min(1, ny)) * 1.5;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Шаг текстуры сетки
  const step = gridSize / gridDivisions;

  // 7. Цикл анимации
  function animate() {
    requestAnimationFrame(animate);

    // Бесконечный цикл движения вперед
    floorGrid.position.z = (floorGrid.position.z + 0.05) % step;
    ceilGrid.position.z = (ceilGrid.position.z + 0.05) % step;

    // Вращение фигур
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    octa.rotation.y += 0.012;
    octa.rotation.z += 0.008;

    // Плавное следование за мышью с лимитом
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    camera.position.x = currentMouseX;
    camera.position.y = 4 + currentMouseY;
    camera.lookAt(0, 1, 0);

    renderer.render(scene, camera);
  }

  animate();
});
