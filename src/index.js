import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { setupSuicidePage } from './scripts/suicide.js';
import { setupPopulationPage } from './scripts/spiral.js';
import { setupHungerPage } from './scripts/hunger.js';


let SCREEN_ID = ["death", "population", "suicide", "hunger"];

var ACTIVE_FLAGS = {};
SCREEN_ID.forEach((id)=> { ACTIVE_FLAGS[id] = false});
ACTIVE_FLAGS[SCREEN_ID[0]] = true;

document.addEventListener('DOMContentLoaded', function(event){
    var pageNumber = 0
    document.getElementById("changeView").addEventListener("click", changeView)

    // hide intro page once user clicks
    var introPage = document.getElementById("intro_page")
    introPage.addEventListener("click", (e)=> {
        introPage.style.display = "None"
    })
    document.getElementById("changeView").addEventListener("click", changeView)

    function changeView() {
        let pages = SCREEN_ID.map((pageId) => {
            return document.getElementById(pageId)
        })

        pageNumber += 1
        pageNumber = pageNumber % pages.length
        pages.forEach((page, index) => {
            if (index === pageNumber) {
                page.style.display = "block"
                ACTIVE_FLAGS[page.id] = true
            } else {
                page.style.display = "None"
                ACTIVE_FLAGS[page.id] = false
            }
        })
    }    
})


document.addEventListener('DOMContentLoaded', function(event){
    
    let scene, camera, stars, renderer, controls;
    // document.body.appendChild( renderer.domElement );

    function startScreen(){
        init("#death-canvas", 1, 20, 3);
        createMilkyWay();
        createLight();
        animateMilkyway();
        console.log("screen start")
    }

    function init(canvas, cam_x, cam_y, cam_z){
        canvas = document.querySelector(canvas);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = cam_x;
        camera.position.y = cam_y;
        camera.position.z = cam_z;
        renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls = new OrbitControls(camera, canvas);
    }

    function createLight(){
        const light_1 = new THREE.PointLight();
        scene.add(light_1);
        light_1.position.set(0, 0, -10);
        const light_2 = new THREE.PointLight();
        scene.add(light_2);
        light_2.position.set(0, 0, 0);
    }
        
    function createMilkyWay(){
        stars = [];
        for (let i = 0; i < 10000; i++){
            const star = createStar();
            stars.push(star);
            scene.add(star);
            star.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
        }
    }

    function createStar(){
        const geometry = new THREE.IcosahedronGeometry(0.05, 0);
        const material = new THREE.MeshPhongMaterial( {
            color: "#FFF9DC"
            // color: "#" + Math.floor(Math.random() * 0xffffff)
            // .toString(16)
            // .padStart(6, "0"),
        } );
        const star = new THREE.Mesh( geometry, material );
        return star;
    }

    function animateMilkyway(time) {
        // if pause flag is true return
        if (!ACTIVE_FLAGS["death"]) {
            requestAnimationFrame(animateMilkyway);
            return
        }
        console.log("animate")
        requestAnimationFrame(animateMilkyway);
        stars.forEach((star, index) =>{
            const radius = 0.1 + 30 * index / stars.length;
            const speed = index / stars.length / 1000;
            star.position.set(
                5 * radius * Math.sin(index + 0.1 * time * speed),
                3 * radius * Math.cos(index + 0.1 * time * speed),
                // 3 * radius * Math.sin(index + 0.1 * time * speed)
            );
        })
        
        renderer.render( scene, camera );
    }

    startScreen();
    setupSuicidePage("#suicide-canvas", ACTIVE_FLAGS);
    setupPopulationPage("#population-canvas", ACTIVE_FLAGS);
    setupHungerPage("hunger")
})

