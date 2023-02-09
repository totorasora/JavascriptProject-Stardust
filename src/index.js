import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { setupSuicidePage } from "./scripts/suicide.js";
import { setupPopulationPage } from "./scripts/spiral.js";
import { setupHungerPage } from "./scripts/hunger.js";

let SCREEN_ID = ["death", "population", "hunger", "suicide"];

var ACTIVE_FLAGS = {};
SCREEN_ID.forEach((id) => {
  ACTIVE_FLAGS[id] = false;
});
ACTIVE_FLAGS[SCREEN_ID[0]] = true;

// var DESCRIPTION_MAP = {
//   "death": "Every star in the sky, A symbol of hope, a beacon so bright. 10,000 souls pass on every day, Their time on Earth has come to an end, they say.",
//   "population": "From every cube, 10,000 lives take form, Each unique and brilliant, with its own charm. They grow and they flourish, they spread and they thrive, Their potential boundless, a gift to survive.",
//   "suicide": "The stars that twinkle, a symbol of hope. For those lost to suicide, their story untold. A life full of potential, now lost to the night, For every new star, one person takes their own life.",
//   "hunger": "For every new star, one person dies of hunger. Life is a bitch."
// }

var DESCRIPTION_MAP = {
  "death": "Every star represents 10,000 souls which have passed in the past year. Click on the stars button to see next page",
  "population": "Every star represents an increase of 10,000 in the total human population in the past year. Click on the stars button to see next page",
  "suicide": "For every new star, one person commits suicide. Click on the stars button to see next page",
  "hunger": "For every new star, one person dies of hunger. Click on the stars button to see next page"
}


var activePage = SCREEN_ID[0];

document.addEventListener("DOMContentLoaded", function (event) {
  var pageNumber = 0;
  document.getElementById("changeView").addEventListener("click", changeView);

  // hide intro page once user clicks
  var introPage = document.getElementById("intro_page");
  introPage.addEventListener("click", (e) => {
    introPage.style.display = "None";
  });
  document.getElementById("changeView").addEventListener("click", changeView);
  document.getElementById("info").addEventListener("click", showDescription);

  document.documentElement.addEventListener("click", hideDescription);

  let musicControls = document.getElementById("music");
  let musicButton = document.getElementById("music-button");
  musicButton.addEventListener("click", (e) => {
    event.preventDefault();
    event.stopPropagation();
    musicControls.style.display = musicControls.style.display === "none" ? "flex" : "none";
  })

  function showDescription(event) {
    console.log(event)
    let description = DESCRIPTION_MAP[activePage];
    let descriptionNode = document.getElementById("info_description")
    descriptionNode.style.display = "block";
    descriptionNode.textContent = description;
    // show your description
  }

  function hideDescription(event) {
    // do not hide description if user clicked on info button
    if (event.target.id === "info") {
      return;
    }
    let descriptionNode = document.getElementById("info_description");
    descriptionNode.style.display = "None";
  }

  function changeView() {
    let pages = SCREEN_ID.map((pageId) => {
      return document.getElementById(pageId);
    });

    pageNumber += 1;
    pageNumber = pageNumber % pages.length;
    pages.forEach((page, index) => {
      if (index === pageNumber) {
        page.style.display = "block";
        ACTIVE_FLAGS[page.id] = true;
        activePage = page.id;
      } else {
        page.style.display = "None";
        ACTIVE_FLAGS[page.id] = false;
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", fetch_and_init);

async function fetch_and_init(event) {
  const response = await fetch(
    "https://population.un.org/dataportalapi/api/v1/data/indicators/52%2C57%2C60/locations/900?startYear=2023&endYear=2023&sexes=3&pagingInHeader=false&format=json&variants=4"
  );
  const response_json = await response.json();
  const data = response_json.data;

  const pop_year = data[0].value;
  const birth_year = data[1].value;
  const death_year = data[2].value;

  main(event, pop_year, birth_year, death_year);
}

function main(event, pop_year, birth_year, death_year) {
  let scene, camera, stars, renderer, controls;
  // document.body.appendChild( renderer.domElement );

  function startScreen() {
    init("#death-canvas", 1, 20, 3);
    createMilkyWay();
    createLight();
    animateMilkyway();
    console.log("screen start");
  }

  function init(canvas, cam_x, cam_y, cam_z) {
    canvas = document.querySelector(canvas);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = cam_x;
    camera.position.y = cam_y;
    camera.position.z = cam_z;
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new OrbitControls(camera, canvas);
  }

  function createLight() {
    const light_1 = new THREE.PointLight();
    scene.add(light_1);
    light_1.position.set(0, 0, -10);
    const light_2 = new THREE.PointLight();
    scene.add(light_2);
    light_2.position.set(0, 0, 0);
  }

  function createMilkyWay() {
    // const death_year = 60760150 / 10000;
    stars = [];
    for (let i = 0; i < death_year / 10000; i++) {
      const star = createStar();
      stars.push(star);
      scene.add(star);
      star.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
    }
  }

  function createStar() {
    const geometry = new THREE.IcosahedronGeometry(0.05, 0);
    const material = new THREE.MeshPhongMaterial({
      color: "#FFF9DC",
      // color: "#" + Math.floor(Math.random() * 0xffffff)
      // .toString(16)
      // .padStart(6, "0"),
    });
    const star = new THREE.Mesh(geometry, material);
    return star;
  }

  function animateMilkyway(time) {
    // if pause flag is true return
    if (!ACTIVE_FLAGS["death"]) {
      requestAnimationFrame(animateMilkyway);
      return;
    }
    // console.log("animate");
    requestAnimationFrame(animateMilkyway);
    stars.forEach((star, index) => {
      const radius = 0.1 + (30 * index) / stars.length;
      const speed = index / stars.length / 1000;
      star.position.set(
        5 * radius * Math.sin(index + 0.1 * time * speed),
        3 * radius * Math.cos(index + 0.1 * time * speed)
        // 3 * radius * Math.sin(index + 0.1 * time * speed)
      );
    });

    renderer.render(scene, camera);
  }

  startScreen();
  setupSuicidePage("#suicide-canvas", ACTIVE_FLAGS);
  setupPopulationPage("#population-canvas", ACTIVE_FLAGS, pop_year);
  setupHungerPage("#hunger-canvas", ACTIVE_FLAGS);
}
