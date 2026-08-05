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

const petalCount = 200;
const petalGeometry = new THREE.PlaneGeometry(0.3, 0.3);
const petalMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb6c1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
});

const petals = [];
for (let i = 0; i < petalCount; i++) {
    const petal = new THREE.Mesh(petalGeometry, petalMaterial.clone());
    const colors = [0xffb6c1, 0xff69b4, 0xff1493, 0xffc0cb, 0xffa6c9];
    petal.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);

    petal.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 30 - 5,
        (Math.random() - 0.5) * 40
    );
    petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    petal.scale.setScalar(0.5 + Math.random() * 1);
    scene.add(petal);

    petals.push({
        mesh: petal,
        speedY: 0.02 + Math.random() * 0.05,
        speedRot: 0.01 + Math.random() * 0.03,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 1 + Math.random() * 2
    });
}

const sparkleCount = 300;
const sparkleGeometry = new THREE.BufferGeometry();
const sparklePositions = new Float32Array(sparkleCount * 3);
const sparkleSizes = new Float32Array(sparkleCount);

for (let i = 0; i < sparkleCount; i++) {
    sparklePositions[i * 3] = (Math.random() - 0.5) * 50;
    sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5;
    sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    sparkleSizes[i] = Math.random() * 3;
}

sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1));

const sparkleMaterial = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.2,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
scene.add(sparkles);

const groundGeometry = new THREE.CircleGeometry(15, 64);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d1b2d,
    metalness: 0.3,
    roughness: 0.7,
    transparent: true,
    opacity: 0.6
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -3;
ground.receiveShadow = true;
scene.add(ground);

const ringGeometry = new THREE.RingGeometry(14, 15.5, 64);
const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xff69b4,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = -Math.PI / 2;
ring.position.y = -2.9;
scene.add(ring);

const loveParticles = [];
const loveGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const loveColors = [0xff1493, 0xff69b4, 0xffb6c1, 0xff0066];

for (let i = 0; i < 50; i++) {
    const material = new THREE.MeshBasicMaterial({
        color: loveColors[i % loveColors.length],
        transparent: true,
        opacity: 0.6
    });
    const particle = new THREE.Mesh(loveGeometry, material);
    particle.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 15,
        (Math.random() - 0.5) * 20
    );
    scene.add(particle);
    loveParticles.push({
        mesh: particle,
        baseY: particle.position.y,
        speed: 0.5 + Math.random() * 1,
        offset: Math.random() * Math.PI * 2
    });
}

const bursts = [];

function createBurst(position) {
    const burstCount = 30;
    const burstGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(burstCount * 3);
    const velocities = [];

    for (let i = 0; i < burstCount; i++) {
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.3;

        velocities.push({
            x: Math.sin(phi) * Math.cos(theta) * speed,
            y: Math.sin(phi) * Math.sin(theta) * speed,
            z: Math.cos(phi) * speed
        });
    }

    burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const burstMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.5,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const burst = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burst);
    bursts.push({ mesh: burst, velocities: velocities, life: 1.0 });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(heartGroup.children);

    if (intersects.length > 0) {
        createBurst(intersects[0].point);

        const heart = intersects[0].object;
        const originalScale = heart.scale.x;
        heart.scale.setScalar(originalScale * 1.3);
        setTimeout(() => {
            heart.scale.setScalar(originalScale);
        }, 300);
    } else {
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = 10;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        createBurst(pos);
    }
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    hearts.forEach((h, i) => {
        if (i === 0) {
            h.mesh.rotation.y = time * 0.3;
            h.mesh.position.y = h.yOffset + Math.sin(time * 0.8) * 0.5;
            const scale = 3 + Math.sin(time * 1.5) * 0.1;
            h.mesh.scale.setScalar(scale);
        } else {
            const angle = h.offset + time * h.speed * 0.3;
            h.mesh.position.x = Math.cos(angle) * h.radius;
            h.mesh.position.z = Math.sin(angle) * h.radius;
            h.mesh.position.y = h.yOffset + Math.sin(time * h.speed + h.offset) * 1.5;
            h.mesh.rotation.x += h.rotSpeed * 0.01;
            h.mesh.rotation.y += h.rotSpeed * 0.01;
        }
    });

    petals.forEach(p => {
        p.mesh.position.y -= p.speedY;
        p.mesh.position.x += Math.sin(time * p.wobbleSpeed + p.wobble) * 0.02;
        p.mesh.rotation.x += p.speedRot;
        p.mesh.rotation.y += p.speedRot * 0.5;

        if (p.mesh.position.y < -8) {
            p.mesh.position.y = 20;
            p.mesh.position.x = (Math.random() - 0.5) * 40;
            p.mesh.position.z = (Math.random() - 0.5) * 40;
        }
    });

    const positions = sparkles.geometry.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.02;
        positions[i * 3] += Math.cos(time * 0.5 + i * 0.1) * 0.01;
    }
    sparkles.geometry.attributes.position.needsUpdate = true;
    sparkles.rotation.y = time * 0.05;

    loveParticles.forEach(p => {
        p.mesh.position.y = p.baseY + Math.sin(time * p.speed + p.offset) * 2;
        p.mesh.material.opacity = 0.3 + Math.sin(time * 2 + p.offset) * 0.3;
    });

    for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        burst.life -= 0.02;

        if (burst.life <= 0) {
            scene.remove(burst.mesh);
            bursts.splice(i, 1);
            continue;
        }

        const posArray = burst.mesh.geometry.attributes.position.array;
        for (let j = 0; j < burst.velocities.length; j++) {
            posArray[j * 3] += burst.velocities[j].x;
            posArray[j * 3 + 1] += burst.velocities[j].y;
            posArray[j * 3 + 2] += burst.velocities[j].z;
        }
        burst.mesh.geometry.attributes.position.needsUpdate = true;
        burst.mesh.material.opacity = burst.life;
    }

    ring.rotation.z = time * 0.2;
    ringMaterial.opacity = 0.2 + Math.sin(time * 2) * 0.1;

    pointLight1.intensity = 1.5 + Math.sin(time * 1.5) * 0.5;
    pointLight2.intensity = 1.5 + Math.cos(time * 1.2) * 0.5;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1500);
});

animate();
