import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/*---------------------------------------------
 fv 3D
---------------------------------------------*/

let w = window.innerWidth;
let h = window.innerHeight;

// renderer
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
});
const container = document.getElementById("canvas-container");
container.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();

// px base camera
const fov = 15;
const fovRad = (fov / 2) * (Math.PI / 180);
const dist = h / 2 / Math.tan(fovRad);
const camera = new THREE.PerspectiveCamera(fov, w / h, 1, dist * 2);
camera.position.z = dist;

// const controls = new OrbitControls(camera, document.body);

// Box Geometry
const boxGeometry = new RoundedBoxGeometry(1, 1, 1, 16, 0.2);
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
	envMapIntensity: 0.3,
	ior: 1.9,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.scale.set(380, 380, 380);
scene.add(box);

// TextMesh
const Beatrice = "../src/Beatrice Headline Trial_Italic.json";
const Arial = "../src/Arial_Regular.json";
const orange = new THREE.Color(0xff4b12);
const white = new THREE.Color(0xffffff);
const textPosZ = -1500;
const fontLoader = new FontLoader();
const txtData = [
	{
		font: Beatrice,
		text: "S",
		size: "192",
		color: orange,
		pos: {
			x: -563,
			y: 248,
			z: textPosZ,
		},
	},
	{
		font: Beatrice,
		text: "shimakawa",
		size: "20",
		color: white,
		pos: {
			x: -423,
			y: 163,
			z: textPosZ,
		},
	},
	{
		font: Arial,
		text: "S",
		size: "192",
		color: white,
		pos: {
			x: -275,
			y: 248,
			z: textPosZ,
		},
	},
	{
		font: Arial,
		text: "shodai",
		size: "20",
		color: white,
		pos: {
			x: -170,
			y: 163,
			z: textPosZ,
		},
	},
	{
		font: Beatrice,
		text: "Port",
		size: "192",
		color: orange,
		pos: {
			x: -212,
			y: 16,
			z: textPosZ,
		},
	},
	{
		font: Arial,
		text: "Fol",
		size: "192",
		color: white,
		pos: {
			x: 257,
			y: 12,
			z: textPosZ,
		},
	},
	{
		font: Beatrice,
		text: "io",
		size: "192",
		color: orange,
		pos: {
			x: 559,
			y: 3.5,
			z: textPosZ,
		},
	},
	{
		font: Arial,
		text: "20",
		size: "192",
		color: white,
		pos: {
			x: -501,
			y: -224,
			z: textPosZ,
		},
	},
	{
		font: Beatrice,
		text: "24",
		size: "192",
		color: orange,
		pos: {
			x: -202,
			y: -220,
			z: textPosZ,
		},
	},
];

// create all text
txtData.forEach((e, i) => {
	createText(e.font, e.text, e.size, e.color, e.pos.x, e.pos.y, e.pos.z);
});

// create text function
const txtGroup = new THREE.Group();
function createText(font, text, size, color, posX, posY, posZ) {
	fontLoader.load(font, (font) => {
		const txtGeometry = new TextGeometry(text, {
			font: font,
			size: size,
			height: 0,
			curveSegments: 12,
		});
		txtGeometry.center();
		const txtMaterial = new THREE.MeshBasicMaterial({
			color: color,
		});
		const txtMesh = new THREE.Mesh(txtGeometry, txtMaterial);
		txtMesh.position.set(posX, posY, posZ);
		txtGroup.add(txtMesh);
		scene.add(txtGroup);
	});
}

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
// Poin Light
const pointLight = new THREE.PointLight(0xffffff, 10000, 0, 0.01);
pointLight.position.set(0, 0, -1000);
scene.add(directionalLight, pointLight);

// scroll
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
	scrollY = window.scrollY;
});

// box animation
gsap.to(box.position, {
	x: w / -3,
	z: 1000,
	ease: "power2.inOut",
	scrollTrigger: {
		// markers: true,
		trigger: ".lcl-hello",
		end: "90% bottom",
		scrub: 2,
		toggleActions: "play play reverse reverse",
	},
});
let currentPos = 0;
let isPin = false;
gsap.to(box.position, {
	x: w / 3,
	ease: "power2.inOut",
	immediateRender: false,
	scrollTrigger: {
		// markers: true,
		trigger: ".lcl-about",
		start: "20% bottom",
		end: "110% bottom",
		scrub: 2,
		toggleActions: "play none none reverse",
		onLeave: () => {
			currentPos = scrollY;
			isPin = true;
		},
		onEnterBack: () => {
			isPin = false;
		},
	},
});

// light follow mouse
const mouse = {
	x: 0,
	y: 0,
	currentX: 0,
	currentY: 0,
};

function onMove(x, y) {
	mouse.currentX = (x - w / 2) * 2;
	mouse.currentY = (-y + w / 3) * 2;
}

function lerp(start, end, multiplier) {
	return start * (1 - multiplier) + end * multiplier;
}

function onRaf() {
	mouse.x = lerp(mouse.x, mouse.currentX, 0.04);
	mouse.y = lerp(mouse.y, mouse.currentY, 0.04);

	gsap.set(pointLight.position, {
		x: mouse.x,
		y: mouse.y,
	});
}

window.addEventListener("mousemove", (e) => {
	onMove(e.clientX, e.clientY);
});

// Loop
tick();

function tick() {
	const sec = performance.now() / 1000;

	box.rotation.x = sec * (Math.PI / 10);
	box.rotation.y = sec * (Math.PI / 10);

	txtGroup.position.y = scrollY;

	if (isPin) {
		box.position.y = scrollY - currentPos;
	}

	onRaf();

	renderer.render(scene, camera);

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

/*---------------------------------------------
 snap scroll
---------------------------------------------*/
// window.addEventListener("DOMContentLoaded", () => {
// 	const snapSec = document.querySelectorAll(".snap-sec");
// 	const wHeight = window.innerHeight;
// 	let flag = 1;
// 	window.addEventListener("scroll", () => {
// 		const currentPos = window.scrollY;
// 		snapSec.forEach((sec, i) => {
// 			const prevPos = snapSec[i].getBoundingClientRect().top + currentPos;
// 			const nextPos =
// 				snapSec[i + 1]?.getBoundingClientRect().top + currentPos;

// 			if (snapSec[i + 1]) {
// 				if (
// 					currentPos > prevPos &&
// 					currentPos < nextPos &&
// 					flag === 1
// 				) {
// 					console.log(i);
// 					if (currentPos > prevPos) {
// 						flag = 2;
// 						window.scrollTo({
// 							top: nextPos,
// 							behavior: "smooth",
// 						});
// 						window.onscroll = () => {
// 							if (nextPos === window.scrollY) {
// 								flag = 1;
// 								console.log("flag:"+flag);
// 							}
// 						};
// 					} else if (currentPos < prevPos) {
// 						console.log("back!");
// 						window.scrollTo({
// 							top: prevPos,
// 							behavior: "smooth",
// 						});
// 					}
// 				}
// 			} else {
// 			}
// 		});
// 	});
// });

/*---------------------------------------------
 scroll in
---------------------------------------------*/
window.addEventListener("DOMContentLoaded", () => {
	const scrIn = document.querySelectorAll(".scr-in");
	scrIn.forEach((target) => {
		ScrollTrigger.create({
			// markers: true,
			trigger: target,
			start: "top 90%",
			once: true,
			toggleClass: {
				targets: target,
				className: "scr-in--on",
			},
		});
	});
});
