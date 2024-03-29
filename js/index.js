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
const boxGroup = new THREE.Group();
boxGroup.add(box);
scene.add(boxGroup);

// TextMesh
const Beatrice = "../assets/json/Beatrice_Headline_Italic.json";
const Arial = "../assets/json/Arial_Regular.json";
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

// set Lights
let pointLight;
setLights();
function setLights() {
	// Directional Light
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1);
	// Poin Light
	pointLight = new THREE.PointLight(0xffffff, 10000, 0, 0.01);
	pointLight.position.set(0, 0, -1000);
	scene.add(directionalLight, pointLight);
}

// scroll
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
	scrollY = window.scrollY;
});

// box animation
setBoxAnimation();
function setBoxAnimation() {
	const boxAnim = gsap.timeline({
		scrollTrigger: {
			// markers: true,
			trigger: ".lcl-hello",
			scrub: 2,
		},
	});
	boxAnim.add("hello", 0).add("about", 10);
	// Hello
	boxAnim
		.to(
			boxGroup.position,
			{
				x: w / -4,
				z: 1000,
				ease: "power2.inOut",
			},
			"hello"
		)
		.to(
			box.rotation,
			{
				y: 3,
				ease: "power3.inOut",
			},
			"<"
		);
	// About
	boxAnim
		.to(
			boxGroup.position,
			{
				x: w / 4,
				ease: "power2.inOut",
			},
			"abotut"
		)
		.to(
			box.rotation,
			{
				x: 3,
				ease: "power3.inOut",
			},
			"<"
		);
	// canvasを固定する
	ScrollTrigger.create({
		// markers: true,
		trigger: ".lcl-hello",
		start: "top bottom",
		endTrigger: ".lcl-about",
		end: "50% 50%",
		pin: ".lcl-canvas",
		pinSpacing: false,
	});
}

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
	boxGroup.rotation.x = sec * (Math.PI / 10);
	boxGroup.rotation.y = sec * (Math.PI / 10);
	txtGroup.position.y = scrollY;
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

/*---------------------------------------------
 photo parallax
---------------------------------------------*/
const parallaxImgs = document.querySelectorAll(".lcl-photo-parallax__img");
parallaxImgs.forEach((e) => {
	const speed = e.dataset.speed;
	const imgHeight = e.clientHeight;
	gsap.fromTo(
		e,
		{
			y: h * speed + imgHeight * (speed - 1),
		},
		{
			y: -h * speed,
			ease: "none",
			scrollTrigger: {
				// markers: true,
				trigger: ".lcl-photo",
				end: "bottom 50top",
				scrub: 1 * speed,
			},
		}
	);
});
