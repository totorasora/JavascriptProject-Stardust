import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var ACTIVE_FLAGS;

function setupSuicidePage(canvasId, flags) {
  ACTIVE_FLAGS = flags;

  const canvas = document.querySelector(canvasId);
  const renderer = new THREE.WebGLRenderer({ canvas });

  var scene, camera, light_1, light_2, controls, stars, updateStarId, angle;

  // var previousStateActive = false

  function initialize() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 20;
    // camera.position.y = 20;
    camera.position.z = 100;
    light_1 = new THREE.PointLight();
    scene.add(light_1);
    light_1.position.set(0, 0, 10);
    light_2 = new THREE.PointLight();
    // light_2.position.set(0, 0, 0);
    scene.add(light_2);
    controls = new OrbitControls(camera, canvas);
    stars = [];
    renderer.setSize(window.innerWidth, window.innerHeight);

    const suicide_time = 1 / (703000 / 365 / 24 / 60 / 60);

    updateStarId = setInterval(function () {
      const geometry = new THREE.IcosahedronGeometry(0.5, 0);
      const material = new THREE.MeshPhongMaterial({ color: "#FFF9DC" });
      const star = new THREE.Mesh(geometry, material);
      star.position.x = (Math.random() - 0.5) * 0.1 * window.innerWidth;
      star.position.y = (Math.random() - 0.5) * 0.1 * window.innerHeight;
      star.position.z = (Math.random() - 0.5) * 100;
      stars.push(star);
      scene.add(star);
    }, suicide_time * 1000);

    angle = 0;
  }

  function animateSuicide() {
    if (!ACTIVE_FLAGS["suicide"]) {
      requestAnimationFrame(animateSuicide);
      return;
    }

    stars.forEach((star, index) => {
      star.rotation.x += 0.02;
      star.rotation.y += 0.02;
      const radius = 3 + (20 * index) / stars.length;
      const speed = index / stars.length / 100;
      star.position.x += (Math.random() - 0.5) * speed;
      star.position.y += (Math.random() - 0.5) * speed;
      // star.position.z += (Math.random() - 0.5) * speed;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animateSuicide);
  }

  initialize();
  animateSuicide();
}

export { setupSuicidePage };
