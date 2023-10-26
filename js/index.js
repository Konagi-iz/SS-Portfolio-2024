import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
	CSS3DRenderer,
	CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

let w = window.innerWidth;
let h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	// alpha: true,
});
const container = document.getElementById("canvas-container");
container.appendChild(renderer.domElement);

const cssrender = new CSS3DRenderer();
document.querySelector(".css3drender").appendChild(cssrender.domElement);

const scene = new THREE.Scene();
// const cssscene = new THREE.Scene();

const fov = 60;
const fovRad = (fov / 2) * (Math.PI / 180);
const dist = h / 2 / Math.tan(fovRad);
const camera = new THREE.PerspectiveCamera(fov, 1.0);
camera.position.z = dist;

const controls = new OrbitControls(camera, document.body);

// Box Geometry
const boxGeometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 16, 0.2);
const hdr =
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_08_2k.hdr";
const hdrEquirect = new RGBELoader().load(hdr, () => {
	hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
});
const boxMaterial = new THREE.MeshPhysicalMaterial({
	roughness: 0.07,
	transmission: 1,
	thickness: 0.5,
	envMap: hdrEquirect,
	envMapIntensity: 1,
	ior: 1.9,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.scale.set(200, 200, 200);
scene.add(box);

// TextMesh
const fontLoader = new FontLoader();
const font = fontLoader.load(
	"../src/Beatrice Headline Trial_Italic.json",
	(font) => {
		const txtGeometry = new TextGeometry("Portfolio", {
			font: font,
			weight: "bold",
			size: 1,
			height: 0,
			curveSegments: 12,
		});
		txtGeometry.center();
		const txtMaterial = new THREE.MeshBasicMaterial({});
		const txtMesh = new THREE.Mesh(txtGeometry, txtMaterial);
		txtMesh.scale.set(120, 120, 120);
		scene.add(txtMesh);
		txtMesh.position.set(0, 0, -120);
	}
);

// // DOM txt
// const txt = document.querySelector(".txt");
// const txt3d = new CSS3DObject(txt);
// // txt3d.position.set(100, 100, 0);
// scene.add(txt3d);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);

// Poin Light
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 10, 10);
scene.add(directionalLight, pointLight);

// Loop
tick();

function tick() {
	const sec = performance.now() / 1000;

	box.rotation.x = sec * (Math.PI / 10);
	box.rotation.y = sec * (Math.PI / 10);

	renderer.render(scene, camera);
	// cssrender.render(scene, camera);

	requestAnimationFrame(tick);
}

// Resize
onResize();
window.addEventListener("resize", onResize);

function onResize() {
	w = window.innerWidth;
	h = window.innerHeight;

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(w, h);
	cssrender.setSize(w, h);

	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}
