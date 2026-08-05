import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a0a2e, 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 50;
controls.minDistance = 5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enablePan = false;

const ambientLight = new THREE.AmbientLight(0xffb6c1, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xff69b4, 1.5);
mainLight.position.set(10, 20, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
scene.add(mainLight);

const pointLight1 = new THREE.PointLight(0xff1493, 2, 30);
pointLight1.position.set(-10, 5, -5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff69b4, 2, 30);
pointLight2.position.set(10, 8, 5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffb6c1, 1.5, 25);
pointLight3.position.set(0, -5, 10);
scene.add(pointLight3);

function createHeartShape() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
    shape.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
    shape.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
    shape.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    return shape;
}

const hearts = [];
const heartGroup = new THREE.Group();
scene.add(heartGroup);

function create3DHeart(scale = 1, color = 0xff1493) {
    const shape = createHeartShape();
    const extrudeSettings = {
        depth: 0.3 * scale,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.05 * scale,
        bevelThickness: 0.05 * scale
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.95
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.castShadow = true;
    heart.receiveShadow = true;
    return heart;
}

const centralHeart = create3DHeart(3, 0xff1493);
centralHeart.position.set(0, 2, 0);
heartGroup.add(centralHeart);
hearts.push({ mesh: centralHeart, speed: 0.5, offset: 0, radius: 0, yOffset: 2 });

const heartColors = [0xff69b4, 0xff1493, 0xffb6c1, 0xff0066, 0xff3366, 0xff6699];
for (let i = 0; i < 12; i++) {
    const scale = 0.5 + Math.random() * 0.8;
    const heart = create3DHeart(scale, heartColors[i % heartColors.length]);
    const angle = (i / 12) * Math.PI * 2;
    const radius = 6 + Math.random() * 6;
    heart.position.set(
        Math.cos(angle) * radius,
        Math.sin(i * 0.8) * 3 + 2,
        Math.sin(angle) * radius
    );
    heartGroup.add(heart);
    hearts.push({
        mesh: heart,
        speed: 0.3 + Math.random() * 0.5,
        offset: angle,
        radius: radius,
        yOffset: heart.position.y,
        rotSpeed: (Math.random() - 0.5) * 2
    });
}
