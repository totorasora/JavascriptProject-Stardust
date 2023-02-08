import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



function cluster(canvas){
    let scene, camera, stars, renderer, controls;
    
    function init(canvas){
        canvas = document.querySelector(canvas);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 1;
        camera.position.y = 20;
        camera.position.z = 3;
        stars = [];
        renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize( window.innerWidth, window.innerHeight );
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
        
    function create(){
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
        const star = new THREE.Mesh(geometry, material);
        return star;
    }

    function animateCluster(time){
        requestAnimationFrame(animate);
        stars.forEach((star, index) =>{
            const radius = 0.1 + 30 * index / stars.length;
            const speed = index / stars.length / 1000;
            star.position.set(
                5 * radius * Math.sin(index + 0.1 * time * speed),
                3 * radius * Math.cos(index + 0.1 * time * speed),
                // 3 * radius * Math.sin(index + 0.1 * time * speed)
            );
        })
        renderer.render(scene, camera);
    }

    init();
    create();
    createLight();
    animateCluster();
}