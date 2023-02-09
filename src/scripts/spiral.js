import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var ACTIVE_FLAGS;

function setupPopulationPage(canvasId, flags, pop_year) {
  ACTIVE_FLAGS = flags;

  const canvas = document.querySelector(canvasId);
  const renderer = new THREE.WebGLRenderer({ canvas });

  var scene, camera, light_1, light_2, controls, meshes;

  function initialize() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 10;
    camera.position.y = 0;
    camera.position.z = 0;
    light_1 = new THREE.PointLight({ intensity: 50 });
    scene.add(light_1);
    light_1.position.set(50, 0, 50);
    light_2 = new THREE.PointLight();
    scene.add(light_2);
    light_2.position.set(30, 30, 0);
    controls = new OrbitControls(camera, canvas);
    meshes = [];
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animateSpiral(time) {
    if (!ACTIVE_FLAGS["population"]) {
      requestAnimationFrame(animateSpiral);
      return;
    }

    meshes.forEach((mesh, index) => {
      const radius = 1 + (10 * index) / meshes.length;
      const speed = index / meshes.length / 1000;
      mesh.position.set(
        radius * Math.sin(index + 1 * time * speed),
        radius * Math.cos(index + 2 * time * speed),
        radius * Math.sin(index + 2 * time * speed)
      );
      mesh.lookAt(0, 0, 0);
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animateSpiral);
  }

  function createMesh() {
    // const geometry = new THREE.IcosahedronGeometry(0.1, 1);
    // const geometry = new THREE.TorusGeometry(0.1, 0.04, 8, 6)
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color:
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0"),
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  async function createSpiral() {
    for (let i = 1; i < pop_year / 10000; i++) {
      let mesh = createMesh();
      mesh.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      meshes.push(mesh);
      scene.add(mesh);
    }
    renderer.render(scene, camera);
  }

  initialize();
  createSpiral();
  animateSpiral();
}

export { setupPopulationPage };
