import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

let w = window.innerWidth;
let h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
});
const container = document.getElementById("canvas-container");
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 60;
const fovRad = (fov / 2) * (Math.PI / 180);
const dist = h / 2 / Math.tan(fovRad);
const camera = new THREE.PerspectiveCamera(fov, w / h, 1, dist * 2);
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
// scene.add(box);

// TextMesh
const Beatrice = "../src/Beatrice Headline Trial_Italic.json",
	Arial = "../src/Arial_Regular.json";
const orange = new THREE.Color(0xff4b12),
	white = new THREE.Color(0xffffff);
const fontLoader = new FontLoader();

const txtData = [
	{
		font: Beatrice,
		text: "S",
		size: "192",
		color: orange,
		pos: {
			x: -621,
			y: 221,
			z: -200,
		},
	},
	{
		font: Beatrice,
		text: "shimakawa",
		size: "20",
		color: white,
		pos: {
			x: -481,
			y: 136,
			z: -200,
		},
	},
	{
		font: Arial,
		text: "S",
		size: "192",
		color: white,
		pos: {
			x: -333,
			y: 221,
			z: -200,
		},
	},
	{
		font: Arial,
		text: "shodai",
		size: "20",
		color: white,
		pos: {
			x: -228,
			y: 136,
			z: -200,
		},
	},
	{
		font: Beatrice,
		text: "Port",
		size: "192",
		color: orange,
		pos: {
			x: -360,
			y: 3.5,
			z: -200,
		},
	},
	{
		font: Arial,
		text: "Fol",
		size: "192",
		color: white,
		pos: {
			x: 175,
			y: 12,
			z: -200,
		},
	},
	{
		font: Beatrice,
		text: "io",
		size: "192",
		color: orange,
		pos: {
			x: 473,
			y: 3.5,
			z: -200,
		},
	},
	{
		font: Arial,
		text: "20",
		size: "192",
		color: white,
		pos: {
			x: -561,
			y: -224,
			z: -200,
		},
	},
	{
		font: Beatrice,
		text: "24",
		size: "192",
		color: orange,
		pos: {
			x: -262,
			y: -220,
			z: -200,
		},
	},
];

txtData.forEach((e, i) => {
	createText(e.font, e.text, e.size, e.color, e.pos.x, e.pos.y, e.pos.z);
});

function createText(font, text, size, color, posX, posY, posZ) {
	fontLoader.load(font, (font) => {
		const txtGeometry = new TextGeometry(text, {
			font: font,
			size: size,
			height: 0,
			curveSegments: 12,
		});
		// txtGeometry.center();
		const txtMaterial = new THREE.MeshBasicMaterial({ color: color });
		const txtMesh = new THREE.Mesh(txtGeometry, txtMaterial);
		txtMesh.position.set(posX, posY, posZ);
		scene.add(txtMesh);
	});
}

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

	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}
