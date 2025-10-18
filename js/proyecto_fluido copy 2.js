// Variables del motor Three.js
var renderer, scene, camera;
var cameraTop;
var cameraAerea;

// Variables de control de personaje
var angulo = -0.01;
var angulo_y = -0.01;
var angulo_x = -0.01;
var angulo_z = 0;
var velocidad_giro = 0;
var p_pos = new THREE.Vector3(0, 3, 0);
var personaje = null;
var mixer = null;
var animationAction = null;
var clock = null;

// Sistema de selección de personajes
var personajesDisponibles = ['seagull', 'Colibrí', 'Charizard', 'Phoenix', 'Pterodactilo', 'Spyro', 'Bombardino Crocodilo'];
var personajeSeleccionado = 0;
var personajeActual = 'seagull';
var personajeConfirmado = 'seagull';
var scenePersonajes = null;
var rendererPersonajes = null;
var cameraPersonajes = null;
var modeloPersonajePreview = null;
var clockPersonajes = null;
var mixerPersonajes = null;

// Configuración de personajes
const escalasPersonajes = {
    'seagull': 1.0,
    'Colibrí': 0.3,
    'Charizard': 2.0,
    'Phoenix': 0.005,
    'Pterodactilo': 4.0,
    'Spyro': 1.0,
    'Bombardino Crocodilo': 2.0
};

const multiplicadoresVelocidad = {
    'seagull': 1.0,
    'Colibrí': 0.8,
    'Charizard': 1.5,
    'Phoenix': 1.2,
    'Pterodactilo': 1.2,
    'Spyro': 1.5,
    'Bombardino Crocodilo': 2.0
};

// Configuración de personajes - Proyectiles
const configCacasPersonajes = {
    'seagull': {
        color: 0xffffff,
        escala: 1.0
    },
    'Colibrí': {
        color: 0xffffff,
        escala: 1.0
    },
    'Charizard': {
        color: 0x000000,
        escala: 1.0
    },
    'Phoenix': {
        coloresAleatorios: [0xff0000, 0xffff00, 0x00ff00, 0x0000ff, 0xff8000, 0x8000ff],
        escala: 1.0
    },
    'Pterodactilo': {
        color: 0x8B7355,
        escala: 1.0
    },
    'Spyro': {
        color: 0xFF8C00,
        escala: 1.0
    },
    'Bombardino Crocodilo': {
        color: 0x2F2F2F,
        escala: 0.0001
    }
};

// Rutas de modelos
const rutasPersonajes = {
    'seagull': 'models/pajaros/seagull/scene.gltf',
    'Colibrí': 'models/pajaros/Colibrí/scene.gltf',
    'Charizard': 'models/pajaros/Charizard/source/Charzard Flying.glb',
    'Phoenix': 'models/pajaros/Phoenix/scene.gltf',
    'Pterodactilo': 'models/pajaros/Pterodactilo/scene.gltf',
    'Spyro': 'models/pajaros/Spyro/scene.gltf',
    'Bombardino Crocodilo': 'models/pajaros/Bombardino Crocodilo/scene.gltf'
};

// Sistema de carga de modelos
let modeloBombaPrecargado = null;

// Minimapa y indicadores
var miniMapIndicator = null;
let miniMapUpdateCounter = 0;

// Sistema de colisiones
var obstaculos = [];
var obstaculosBBoxes = [];
const materialPool = [];

const tmpVec = new THREE.Vector3();
const bboxGaviota = new THREE.Box3();
const tmpBox = new THREE.Box3();
const testBox = new THREE.Box3();

const raycaster = new THREE.Raycaster();

// Sistema de controles
const controls = {
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
    speed: 0.15
};

let keysPressed = {};

// Sistema de colisiones del personaje
const colliderHalfSize = new THREE.Vector3(0.5, 0.2, 0.3);
const colliderBox = new THREE.Box3();

// Configuración de cámara
const cameraDistance = 10;
const cameraHeight = 5;
const cameraMinDistance = 2;
const verticalMovementFactor = 1.0;

let vistaAereaActiva = false;

// Sistema de sprint y stamina
let sprint_stamina = 95;
let lastSprintTime = 0;
let sprintKeyPressed = false;
let sprintKeyStartTime = 0;
let lastSprintUpdateTime = 0;

// Sistema de munición
let cacas = [];
let manchas = [];
let ammo_municion = 95;
const cacaGravity = -9.8;
const cacaSize = 0.1;

// Sistema de efectos especiales (kebab)
let cacaGratisActivo = false;
let cacaGratisTiempoFin = 0;
let cacaContinuaInterval = null;
let cacaAutomaticaActiva = false;
let ultimaCacaAutomatica = 0;

const tiempoEfectoKebab = 10000;
const intervaloCacaAutomatica = 100;
const intervaloBombasDiarrea = 1000;

// Sistema de bombas (Bombardino Crocodilo)
let ultimaBombaLanzada = 0;
const cooldownBomba = 1000;

// Sistema de audio
let audioContext = null;
let sonidosDisponibles = true;
let audioScreamPreloaded = null;
let audioFemaleScreamPreloaded = null;
let audioBombaPreloaded = null;

// Sistema de iconos flotantes (comida)
let iconosFlotantes = [];
let pendingRespawn = [];
const maxIconos = 60;
const iconoSize = 0.5;
const iconoHeight = 8;
const iconoRestoration = 35;
const respawnTime = 5000;

// Sistema de configuración del juego
const imagenesDNPCsDisponibles = false;
let configSonidosActivados = true;
let configFotosActivadas = true;

// Sistema de NPCs
let npcs = [];
let imagenesHombres = [];
let imagenesMujeres = [];
let maxNPCs = 0;
const npcSpeed = 0.02;
const worldBounds = 180;

// Sistema de interacciones con NPCs
let contadorCacasAcertadas = 0;
let notificacionesActivas = [];
const cooldownNotificacionNPC = 3000;

// Configuración de comida/iconos flotantes
const configsComida = {
    'pizza': {
        escala: 100.0,
        hitbox: 1.0,
        rotacion: {
            x: Math.PI / 6,
            y: 0,
            z: Math.PI / 12
        }
    },
    'burger': {
        escala: 3,
        hitbox: 1,
        rotacion: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    'kebab': {
        escala: 2.1,
        hitbox: 1.8,
        rotacion: {
            x: 0,
            y: 0,
            z: 0
        }
    }
};

// Función para aplicar rotación específica a cada personaje
function aplicarRotacionPersonaje(model, nombrePersonaje) {
    switch(nombrePersonaje) {
        case 'Colibrí':
            model.rotation.y += Math.PI ;
            model.rotation.x += Math.PI ;
            model.rotation.z += Math.PI

            break;
        case 'Charizard': 
            break;       
        case 'Phoenix':
            model.rotation.y = 3*Math.PI/2;
            break;
            
        case 'seagull':
            model.rotation.y = Math.PI / 2;
            break;
        case 'Pterodactilo':
        case 'Spyro':
        case 'Bombardino Crocodilo':   
        default:
            break;
    }
}

// Función para aplicar texturas a un modelo de personaje
function aplicarTexturasPersonaje(model, nombrePersonaje) {
    const textureLoader = new THREE.TextureLoader();
    const texturePath = 'models/pajaros/${nombrePersonaje}/textures/';
    
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            
            materials.forEach((material, index) => {
                if (material.isMeshStandardMaterial || material.isMeshBasicMaterial || material.isMeshLambertMaterial) {
                    
                    switch(nombrePersonaje) {
                        case 'seagull':
                            if (!material.map) {
                                material.map = textureLoader.load(texturePath + 'Material_baseColor.png', 
                                    () => {},
                                    undefined,
                                    (error) => {}
                                );
                                material.needsUpdate = true;
                            }
                            break;
                            
                        case 'Colibrí':
                            if (!material.map) {
                                material.map = textureLoader.load(texturePath + 'body_baseColor.png',
                                    () => {},
                                    undefined,
                                    (error) => {}
                                );
                            }
                            if (!material.metalnessMap && !material.roughnessMap) {
                                const metallicRoughness = textureLoader.load(texturePath + 'body_metallicRoughness.png',
                                    () => {},
                                    undefined,
                                    (error) => {}
                                );
                                material.metalnessMap = metallicRoughness;
                                material.roughnessMap = metallicRoughness;
                            }
                            material.needsUpdate = true;
                            break;
                            
                        case 'Charizard':
                            if (!material.map) {
                                material.map = textureLoader.load(texturePath + 'Charizard_col.1001_1.png',
                                    () => {},
                                    undefined,
                                    (error) => {
                                        material.map = textureLoader.load(texturePath + 'Charizard_col.1002_4.png',
                                            () => {},
                                            undefined,
                                            (error2) => {}
                                        );
                                    }
                                );
                            }
                            if (!material.normalMap) {
                                material.normalMap = textureLoader.load(texturePath + 'Body_normal.1001_0.png',
                                    () => {},
                                    undefined,
                                    (error) => {}
                                );
                            }
                            material.needsUpdate = true;
                            break;
                            
                        case 'Phoenix':
                            if (!material.map) {
                                material.map = textureLoader.load(texturePath + 'MatI_Ride_FengHuang_01a_baseColor.png',
                                    () => {},
                                    undefined,
                                    (error) => {
                                        material.map = textureLoader.load(texturePath + 'MatI_Ride_FengHuang_01b_baseColor.png',
                                            () => {},
                                            undefined,
                                            (error2) => {}
                                        );
                                    }
                                );
                            }
                            if (!material.emissiveMap) {
                                material.emissiveMap = textureLoader.load(texturePath + 'MatI_Ride_FengHuang_01a_emissive.png',
                                    () => {},
                                    undefined,
                                    (error) => {
                                        material.emissiveMap = textureLoader.load(texturePath + 'MatI_Ride_FengHuang_01b_emissive.png',
                                            () => {},
                                            undefined,
                                            (error2) => {}
                                        );
                                    }
                                );
                                material.emissive = new THREE.Color(0x111111);
                            }
                            material.needsUpdate = true;
                            break;
                            
                        default:
                            break;
                    }
                    
                    if (material.map) {
                        material.map.wrapS = THREE.RepeatWrapping;
                        material.map.wrapT = THREE.RepeatWrapping;
                        material.map.flipY = false;
                    }
                    
                    if (material.normalMap) {
                        material.normalMap.wrapS = THREE.RepeatWrapping;
                        material.normalMap.wrapT = THREE.RepeatWrapping;
                        material.normalMap.flipY = false;
                    }
                    
                    if (material.emissiveMap) {
                        material.emissiveMap.wrapS = THREE.RepeatWrapping;
                        material.emissiveMap.wrapT = THREE.RepeatWrapping;
                        material.emissiveMap.flipY = false;
                    }
                }
            });
        }
    });
}

// Función para inicializar pool de materiales para edificios
function initMaterialPool() {
    const colores = [0x3D2F20, 0x2F2826, 0x2A2A2A, 0x353535];
    colores.forEach(color => {
        materialPool.push([
            new THREE.MeshLambertMaterial({ color: color }),
            new THREE.MeshLambertMaterial({ color: color }),
            new THREE.MeshLambertMaterial({ color: color }),
            new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
            new THREE.MeshLambertMaterial({ color: color }),
            new THREE.MeshLambertMaterial({ color: color })
        ]);
    });
}

// Función principal para crear todos los edificios del mundo
function crearEdificios() {
    const safeZoneRadius = 10;
    
    initMaterialPool();
    
    const baseGeometry = new THREE.BoxGeometry(1, 1, 1);
    const instancesPerColor = 250;
    const instancedBuildings = [];
    
    for (let colorIndex = 0; colorIndex < 4; colorIndex++) {
        const instancedMesh = new THREE.InstancedMesh(
            baseGeometry, 
            materialPool[colorIndex], 
            instancesPerColor
        );
        instancedBuildings.push(instancedMesh);
        scene.add(instancedMesh);
    }
    
    let buildingCount = 0;
    
    for (let i = 0; i < 1000; i++) {
        const width = 3 + Math.random() * 5;
        const depth = 3 + Math.random() * 5;
        const height = Math.random() * 15 + 5;

        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 50;
        let posX, posZ;
        
        while (!validPosition && attempts < maxAttempts) {
            posX = Math.random() * 400 - 200;
            posZ = Math.random() * 400 - 200;
            
            const distanceToSpawn = Math.sqrt(
                Math.pow(posX - p_pos.x, 2) + 
                Math.pow(posZ - p_pos.z, 2)
            );
            
            if (distanceToSpawn > safeZoneRadius) {
                validPosition = true;
            }
            attempts++;
        }
        
        if (!validPosition) continue;
        
        const matrix = new THREE.Matrix4();
        matrix.compose(
            new THREE.Vector3(posX, height / 2, posZ),
            new THREE.Quaternion(),
            new THREE.Vector3(width, height, depth)
        );
        
        const colorIndex = buildingCount % 4;
        const instanceIndex = Math.floor(buildingCount / 4);
        
        if (instanceIndex < instancesPerColor) {
            instancedBuildings[colorIndex].setMatrixAt(instanceIndex, matrix);
            
            const dummyBox = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth));
            dummyBox.position.set(posX, height / 2, posZ);
            dummyBox.updateMatrixWorld();
            
            obstaculos.push(dummyBox);
            obstaculosBBoxes.push(new THREE.Box3().setFromObject(dummyBox));
        }
        
        buildingCount++;
    }
    
    instancedBuildings.forEach(instancedMesh => {
        instancedMesh.instanceMatrix.needsUpdate = true;
    });
}

function precargaJuego() {
    // Inicializar sistema de audio
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        sonidosDisponibles = true;
    } catch (e) {
        sonidosDisponibles = false;
    }
    
    // Precargar audio grito masculino
    try {
        audioScreamPreloaded = new Audio();
        audioScreamPreloaded.src = 'audios/man-scream.mp3';
        audioScreamPreloaded.preload = 'auto';
        audioScreamPreloaded.volume = 0;
        
        audioScreamPreloaded.addEventListener('canplaythrough', () => {});
        audioScreamPreloaded.addEventListener('error', (e) => {
            audioScreamPreloaded = null;
        });
        
        audioScreamPreloaded.load();
    } catch (e) {
        audioScreamPreloaded = null;
    }
    
    // Precargar audio grito femenino
    try {
        audioFemaleScreamPreloaded = new Audio();
        audioFemaleScreamPreloaded.src = 'audios/girl-screaming.mp3';
        audioFemaleScreamPreloaded.preload = 'auto';
        audioFemaleScreamPreloaded.volume = 0;
        
        audioFemaleScreamPreloaded.addEventListener('canplaythrough', () => {});
        audioFemaleScreamPreloaded.addEventListener('error', (e) => {
            audioFemaleScreamPreloaded = null;
        });
        
        audioFemaleScreamPreloaded.load();
    } catch (e) {
        audioFemaleScreamPreloaded = null;
    }
    
    // Precargar audio de bomba
    try {
        audioBombaPreloaded = new Audio();
        audioBombaPreloaded.src = 'models/pajaros/Bombardino Crocodilo/bomba/La Bomba.mp3';
        audioBombaPreloaded.preload = 'auto';
        audioBombaPreloaded.volume = 0.7;
        
        audioBombaPreloaded.addEventListener('canplaythrough', () => {});
        audioBombaPreloaded.addEventListener('error', (e) => {
            audioBombaPreloaded = null;
        });
        
        audioBombaPreloaded.load();
    } catch (e) {
        audioBombaPreloaded = null;
    }
    
    // Precargar modelo de bomba 3D
    const loader = new THREE.GLTFLoader();
    const rutaBomba = 'models/pajaros/Bombardino Crocodilo/bomba/scene.gltf';
    
    loader.load(
        rutaBomba,
        (gltf) => {
            modeloBombaPrecargado = gltf.scene.clone();
        },
        undefined,
        (error) => {}
    );
}

// Función para cargar desde archivo de configuración JSON de NPCs
async function cargarImagenesDesdeJSON() {
    try {
        const response = await fetch('personas/config.json');
        const config = await response.json();
        
        imagenesHombres = config.hombres || [];
        imagenesMujeres = config.mujeres || [];
        
        imagenesHombres = imagenesHombres.map(img => `personas/Hombres/${img}`);
        imagenesMujeres = imagenesMujeres.map(img => `personas/Mujeres/${img}`);
        
        maxNPCs = imagenesHombres.length + imagenesMujeres.length;
        
        return { hombres: imagenesHombres, mujeres: imagenesMujeres };
        
    } catch (error) {
        imagenesHombres = [];
        imagenesMujeres = [];
        maxNPCs = 0;
        
        return { hombres: [], mujeres: [] };
    }
}


// Funciones del menú principal
function iniciarJuego() {
    document.getElementById('menuPrincipal').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    
    init();
    loadScene();
    render();
}

function mostrarPersonajes() {
    document.getElementById('menuPrincipal').style.display = 'none';
    document.getElementById('menuPersonajes').style.display = 'flex';
    
    try {
        personajeSeleccionado = 0;
        personajeActual = personajesDisponibles[0];
        
        inicializarVisorPersonajes();
        actualizarPersonajePreview();
        
    } catch (error) {
        personajeSeleccionado = 0;
        inicializarVisorPersonajes();
        actualizarPersonajePreview();
    }
}

function actualizarBotonSeleccionar() {
    const botonSeleccionar = document.getElementById('botonSeleccionar');
    
    if (personajeActual === personajeConfirmado) {
        botonSeleccionar.textContent = '✓ Seleccionado';
        botonSeleccionar.classList.add('seleccionado');
    } else {
        botonSeleccionar.textContent = '✓ Seleccionar';
        botonSeleccionar.classList.remove('seleccionado');
    }
}

// Inicializar el visor 3D para preview de personajes
function inicializarVisorPersonajes() {
    const canvas = document.getElementById('canvasPersonaje');
    const container = canvas.parentElement;
    
    rendererPersonajes = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    rendererPersonajes.setSize(280, 280);
    rendererPersonajes.setClearColor(0x000000, 0);
    
    rendererPersonajes.outputEncoding = THREE.sRGBEncoding;
    rendererPersonajes.toneMapping = THREE.ACESFilmicToneMapping;
    rendererPersonajes.toneMappingExposure = 1.0;
    rendererPersonajes.shadowMap.enabled = false;
    
    scenePersonajes = new THREE.Scene();
    
    cameraPersonajes = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    cameraPersonajes.position.set(3, 2, 3);
    cameraPersonajes.lookAt(0, 1, 0);
    
    const luzAmbiente = new THREE.AmbientLight(0x404040, 0.6);
    scenePersonajes.add(luzAmbiente);
    
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.8);
    luzDireccional.position.set(5, 10, 5);
    luzDireccional.castShadow = true;
    scenePersonajes.add(luzDireccional);
    
    const luzPunto = new THREE.PointLight(0xffffff, 0.5);
    luzPunto.position.set(-3, 3, -3);
    scenePersonajes.add(luzPunto);
    
    clockPersonajes = new THREE.Clock();
    
    animarVisorPersonajes();
}

// Actualizar el personaje mostrado en el preview
function actualizarPersonajePreview() {
    if (modeloPersonajePreview) {
        scenePersonajes.remove(modeloPersonajePreview);
        if (mixerPersonajes) {
            mixerPersonajes.stopAllAction();
            mixerPersonajes = null;
        }
    }
    
    const nombreFormateado = personajeActual === 'seagull' ? 'Seagull' : personajeActual;
    document.getElementById('nombrePersonaje').textContent = nombreFormateado;
    document.getElementById('contadorPersonajes').textContent = 
        `${personajeSeleccionado + 1} / ${personajesDisponibles.length}`;
    
    actualizarBotonSeleccionar();
    
    const loader = new THREE.GLTFLoader();
    const modelPath = rutasPersonajes[personajeActual] || rutasPersonajes['seagull'];
    
    loader.load(modelPath, (gltf) => {
        modeloPersonajePreview = gltf.scene;
        
        aplicarTexturasPersonaje(modeloPersonajePreview, personajeActual);
        aplicarRotacionPersonaje(modeloPersonajePreview, personajeActual);
        
        const escalaPersonaje = escalasPersonajes[personajeActual] || 1.0;
        
        let escalaPreview = escalaPersonaje;
        if (personajeActual === 'Charizard') {
            escalaPreview = escalaPersonaje * 0.5;
        }else if (personajeActual === 'Bombardino Crocodilo') {
            escalaPreview = escalaPersonaje * 0.7;
        }else if (personajeActual === 'Phoenix') {
            escalaPreview = escalaPersonaje * 0.8;
        }
        
        modeloPersonajePreview.scale.setScalar(escalaPreview);
        modeloPersonajePreview.position.set(0, 0, 0);
        scenePersonajes.add(modeloPersonajePreview);
        
        if (gltf.animations && gltf.animations.length > 0) {
            mixerPersonajes = new THREE.AnimationMixer(modeloPersonajePreview);
            
            const indiceAnimacion = (personajeActual === 'Spyro') ? 11 : 0;
            const animacionSeleccionada = Math.min(indiceAnimacion, gltf.animations.length - 1);
                        
            const action = mixerPersonajes.clipAction(gltf.animations[animacionSeleccionada]);
            action.play();
        }
        
        const box = new THREE.Box3().setFromObject(modeloPersonajePreview);
        const center = box.getCenter(new THREE.Vector3());
        modeloPersonajePreview.position.sub(center);
        modeloPersonajePreview.position.y = -box.min.y;
        
        switch(personajeActual) {
            case 'seagull':
                modeloPersonajePreview.position.x -= 0.5;
                modeloPersonajePreview.position.y += 0.6;
                break;
            case 'Colibrí':
                modeloPersonajePreview.position.y += 0.5;
                break;
            case 'Charizard':
                modeloPersonajePreview.position.x += 0.5;
                modeloPersonajePreview.position.y -= 0.2;
                break;
            case 'Phoenix':
                modeloPersonajePreview.position.x += 1.5;
                modeloPersonajePreview.position.y += 0.5;
                break;
            case 'Pterodactilo':
                modeloPersonajePreview.position.y -= 0.8;
                break;
            case 'Spyro':
                modeloPersonajePreview.position.x += 0.3;
                break;
            case 'Bombardino Crocodilo':
                modeloPersonajePreview.position.y += 1.0;
                break;
        }
        
    }, undefined, (error) => {});
}

// Loop de animación para el visor de personajes
function animarVisorPersonajes() {
    requestAnimationFrame(animarVisorPersonajes);
    
    if (!scenePersonajes || !rendererPersonajes || !cameraPersonajes) return;
    
    const delta = clockPersonajes.getDelta();
    
    if (mixerPersonajes) {
        mixerPersonajes.update(delta);
    }
    
    if (modeloPersonajePreview) {
        modeloPersonajePreview.rotation.y += 0.01;
    }
    
    rendererPersonajes.render(scenePersonajes, cameraPersonajes);
}

function cambiarPersonajeIzquierda() {
    personajeSeleccionado = (personajeSeleccionado - 1 + personajesDisponibles.length) % personajesDisponibles.length;
    personajeActual = personajesDisponibles[personajeSeleccionado];
    actualizarPersonajePreview();
}

function cambiarPersonajeDerecha() {
    personajeSeleccionado = (personajeSeleccionado + 1) % personajesDisponibles.length;
    personajeActual = personajesDisponibles[personajeSeleccionado];
    actualizarPersonajePreview();
}

function seleccionarPersonaje() {
    if (personajeActual === personajeConfirmado) {
        return;
    }
    
    personajeConfirmado = personajeActual;
    
    actualizarBotonSeleccionar();
    
    const botonSeleccionar = document.getElementById('botonSeleccionar');
    const textoOriginal = botonSeleccionar.textContent;
    botonSeleccionar.textContent = '✓ ¡Seleccionado!';
    
    setTimeout(() => {
        const nombreFormateado = personajeConfirmado === 'seagull' ? 'Seagull' : personajeConfirmado;
        document.getElementById('personajeActualIndicador').textContent = nombreFormateado;
        
        document.getElementById('menuPersonajes').style.display = 'none';
        document.getElementById('menuPrincipal').style.display = 'flex';
        
    }, 800);
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  document.getElementById('container').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 1, 10000);
  camera.position.set(50, 30, 30);
  camera.layers.enable(0);

  cameraTop = new THREE.OrthographicCamera(-200, 200, 200, -200, 1, 1000);
  cameraTop.position.set(0, 500, 0);
  cameraTop.lookAt(0, 0, 0);
  cameraTop.up.set(0, 0, -1);
  cameraTop.updateProjectionMatrix();
  cameraTop.layers.enable(0);
  cameraTop.layers.enable(1);

  cameraAerea = new THREE.PerspectiveCamera(60, aspectRatio, 1, 10000);
  cameraAerea.position.set(0, 15, 0);
  cameraAerea.layers.enable(0);

  clock = new THREE.Clock();

  createHUD();

  precargaJuego();

  lastSprintTime = Date.now();
  
  updateHUD();

  window.addEventListener('resize', updateAspectRatio);
  
  window.addEventListener('keydown', (e) => {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  });
  
  window.addEventListener('click', () => {
    window.focus();
  });
  
  const nombreFormateado = personajeConfirmado === 'seagull' ? 'Seagull' : personajeConfirmado;
  const indicador = document.getElementById('personajeActualIndicador');
  if (indicador) {
    indicador.textContent = nombreFormateado;
  }
}

// Función para reproducir sonido de grito/pánico en bucle con posición 3D
function reproducirSonidoPanico(posicionNPC, genero = 'masculino') {
    const audioSource = genero === 'femenino' ? audioFemaleScreamPreloaded : audioScreamPreloaded;
    
    if (!audioSource) {
        reproducirSonidoSintetico();
        return null;
    }
    
    try {
        const audio = audioSource.cloneNode();
        audio.loop = true;
        
        const distancia = calcularDistanciaGaviota(posicionNPC);
        const volumen = calcularVolumenPorDistancia(distancia);
        audio.volume = volumen;
        
        const playPromise = configSonidosActivados && audio ? audio.play() : Promise.resolve();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
            }).catch(error => {
                if (configSonidosActivados) {
                    reproducirSonidoSintetico();
                }
                return null;
            });
        }
        
        return audio;
        
    } catch (e) {
        reproducirSonidoSintetico();
        return null;
    }
}

function calcularDistanciaGaviota(posicion) {
    if (!p_pos) return 1000;
    
    const dx = p_pos.x - posicion.x;
    const dy = p_pos.y - posicion.y;
    const dz = p_pos.z - posicion.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calcularVolumenPorDistancia(distancia) {
    const distanciaMaxima = 100;
    const distanciaMinima = 5;
    const volumenMaximo = 0.8;
    
    if (distancia <= distanciaMinima) {
        return volumenMaximo;
    } else if (distancia >= distanciaMaxima) {
        return 0;
    } else {
        const factor = (distanciaMaxima - distancia) / (distanciaMaxima - distanciaMinima);
        return volumenMaximo * factor;
    }
}

function actualizarVolumenAudio(audio, posicionNPC) {
    if (!audio) return;
    
    if (!configSonidosActivados) {
        audio.volume = 0;
        return;
    }
    
    const distancia = calcularDistanciaGaviota(posicionNPC);
    const nuevoVolumen = calcularVolumenPorDistancia(distancia);
    
    if (Math.abs(audio.volume - nuevoVolumen) > 0.05) {
        audio.volume = nuevoVolumen;
    }
}

function reproducirSonidoSintetico() {
    if (!audioContext || !configSonidosActivados) return;
    
    try {
        const duracion = 0.8;
        const tiempo = audioContext.currentTime;
        
        const oscilador1 = audioContext.createOscillator();
        const ganancia1 = audioContext.createGain();
        
        oscilador1.type = 'sawtooth';
        oscilador1.frequency.setValueAtTime(220, tiempo);
        oscilador1.frequency.linearRampToValueAtTime(350, tiempo + 0.1);
        oscilador1.frequency.linearRampToValueAtTime(180, tiempo + duracion);
        
        ganancia1.gain.setValueAtTime(0, tiempo);
        ganancia1.gain.linearRampToValueAtTime(0.3, tiempo + 0.05);
        ganancia1.gain.linearRampToValueAtTime(0, tiempo + duracion);
        
        oscilador1.connect(ganancia1);
        ganancia1.connect(audioContext.destination);
        
        oscilador1.start(tiempo);
        oscilador1.stop(tiempo + duracion);
        
    } catch (e) {}
}

function reproducirSonidoBomba() {
    if (!audioBombaPreloaded) {
        return;
    }
    
    if (!sonidosDisponibles) {
        return;
    }
    
    try {
        const audioBomba = audioBombaPreloaded.cloneNode();
        audioBomba.volume = 0.8;
        
        const playPromise = configSonidosActivados && audioBomba ? audioBomba.play() : Promise.resolve();
        playPromise.then(() => {
        }).catch((e) => {});
        
    } catch (e) {}
}

//=============================================================================
// FUNCIONES DE INTERFAZ DE USUARIO (HUD)
//=============================================================================

function createHUD() {
  // Crear contenedor principal del HUD
  const hudContainer = document.createElement('div');
  hudContainer.id = 'hud-container';
  hudContainer.style.cssText = `
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 0px;
  `;
  document.body.appendChild(hudContainer);

  // Logo del personaje (círculo con imagen del personaje)
  const playerLogo = document.createElement('div');
  playerLogo.id = 'player-logo';
  
  // Determinar la imagen del personaje seleccionado
  const imagenPersonaje = `logos/${personajeConfirmado}.png`;
  
  playerLogo.style.cssText = `
    width: 60px;
    height: 60px;
    background-image: url('${imagenPersonaje}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
  `;
  hudContainer.appendChild(playerLogo);

  // Contenedor para las barras (pegado al logo)
  const barsContainer = document.createElement('div');
  barsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: -10px;
    z-index: 1;
  `;
  hudContainer.appendChild(barsContainer);

  // Barra de Sprint (azul) - superior
  const sprintBarContainer = document.createElement('div');
  sprintBarContainer.style.cssText = `
    background-color: rgba(0, 0, 0, 0.6);
    height: 20px;
    width: 220px;
    margin-top: 5px;
    padding: 3px 8px 3px -5px;
    clip-path: polygon(0% 0%, 95% 0%, 85% 100%, 0% 100%);
    border: 2px solid #000000;
    border-right: none;
    border-left: none;
  `;
  
  const sprintBar = document.createElement('div');
  sprintBar.id = 'sprint-bar';
  sprintBar.style.cssText = `
    width: 100%;
    height: 100%;
    background-color: #4a90e2;
    transition: width 0.3s ease;
    position: relative;
    border-left: none;
    clip-path: polygon(0% 0%, 95% 0%, 85% 100%, 0% 100%);
  `;
  
  const sprintLabel = document.createElement('div');
  sprintLabel.style.cssText = `
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    line-height: 14px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin-top: -17px;
    position: relative;
    z-index: 1;
  `;
  sprintLabel.textContent = 'SPRINT';

  sprintBarContainer.appendChild(sprintBar);
  sprintBarContainer.appendChild(sprintLabel);
  barsContainer.appendChild(sprintBarContainer);

  // Barra de Munición (blanca) - inferior
  const ammoBarContainer = document.createElement('div');
  ammoBarContainer.style.cssText = `
    background-color: rgba(0, 0, 0, 0.6);
    height: 20px;
    width: 190px;
    margin-bottom: 5px;
    padding: 3px 8px 3px -5px;
    clip-path: polygon(0% 0%, 95% 0%, 85% 100%, 0% 100%);
    border: 2px solid #000000;
    border-right: none;
    border-left: none;
  `;
  
  const ammoBar = document.createElement('div');
  ammoBar.id = 'ammo-bar';
  ammoBar.style.cssText = `
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    transition: width 0.3s ease;
    position: relative;
    border-left: none;
    clip-path: polygon(0% 0%, 95% 0%, 85% 100%, 0% 100%);
  `;
  
  const ammoLabel = document.createElement('div');
  ammoLabel.style.cssText = `
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    line-height: 14px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin-top: -17px;
    position: relative;
    z-index: 1;
  `;
  ammoLabel.textContent = 'CACA';

  ammoBarContainer.appendChild(ammoBar);
  ammoBarContainer.appendChild(ammoLabel);
  barsContainer.appendChild(ammoBarContainer);

  // Indicador de efecto kebab
  const kebabIndicator = document.createElement('div');
  kebabIndicator.id = 'kebab-indicator';
  kebabIndicator.style.cssText = `
    background-color: #ff6b35;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 15px;
    text-align: center;
    margin-top: 8px;
    display: none;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    animation: kebab-pulse 1s infinite alternate;
  `;
  
  // Mensaje específico según el personaje
  if (personajeConfirmado === 'Bombardino Crocodilo') {
      kebabIndicator.textContent = '🥙💣 DIARREA DE BOMBAS';
  } else {
      kebabIndicator.textContent = '🥙💩 DIARREA INTENSA';
  }
  
  barsContainer.appendChild(kebabIndicator);

  // Agregar animación CSS para el indicador kebab
  const style = document.createElement('style');
  style.textContent = `
    @keyframes kebab-pulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.05); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Contadores de NPCs (esquina superior derecha)
  const countersContainer = document.createElement('div');
  countersContainer.id = 'counters-container';
  countersContainer.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;
  document.body.appendChild(countersContainer);

  // Contador de cacas acertadas
  const acertadasCounter = document.createElement('div');
  acertadasCounter.id = 'acertadas-counter';
  acertadasCounter.style.cssText = `
    background-color: rgba(255, 140, 0, 0.8);
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  `;
  acertadasCounter.textContent = '🎯💩 Aciertos: 0';
  countersContainer.appendChild(acertadasCounter);

  // Contenedor de notificaciones (esquina inferior derecha)
  const notificacionesContainer = document.createElement('div');
  notificacionesContainer.id = 'notificaciones-container';
  notificacionesContainer.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1001;
    font-family: Arial, sans-serif;
    pointer-events: none;
    display: flex;
    flex-direction: column-reverse;
    gap: 0px;
    max-width: 300px;
  `;
  document.body.appendChild(notificacionesContainer);

}

function loadScene() {
    


    // Crear y añadir un plano que actúe como suelo (4 veces más grande)
    const planeGeometry = new THREE.PlaneGeometry(400, 400);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0x1A1A1A, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // Luces 
    const ambient = new THREE.AmbientLight(0x555555, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(50, 100, 50);
    scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x555555, 0.6);
    scene.add(hemi);

    // Crear indicador triangular para el minimapa (personaje principal)
    const indicatorGeometry = new THREE.ConeGeometry(15, 35, 3); // 5x más grande: radio 15, altura 35
    const indicatorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000 // Rojo
    });
    miniMapIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    miniMapIndicator.rotation.x = Math.PI / 2; // Apuntar hacia abajo (hacia -Y) para que se vea desde arriba
    miniMapIndicator.position.y = 25; // Por encima de la mayoría de edificios (max height ~20)
    miniMapIndicator.layers.set(1); // Solo visible en capa 1 (minimapa)
    scene.add(miniMapIndicator);

    // 🏢 CREAR EDIFICIOS
    crearEdificios();
    

    // Cargar GLTF de la gaviota
    const loader = new THREE.GLTFLoader();
    const modelPath = rutasPersonajes[personajeConfirmado] || rutasPersonajes['seagull'];
    loader.load(modelPath, (gltf) => {
        const wrapper = new THREE.Object3D();
        wrapper.position.copy(p_pos);
        wrapper.rotation.order = "YXZ";
        scene.add(wrapper);
        personaje = wrapper;

        const model = gltf.scene;
        
        // APLICAR TEXTURAS AL PERSONAJE
        aplicarTexturasPersonaje(model, personajeConfirmado);
        
        // APLICAR ROTACIÓN ESPECÍFICA DEL PERSONAJE
        aplicarRotacionPersonaje(model, personajeConfirmado);
        
        // APLICAR ESCALA ESPECÍFICA DEL PERSONAJE EN EL JUEGO
        const escalaPersonaje = escalasPersonajes[personajeConfirmado] || 1.0;
        // Aplicar directamente la escala configurada, igual que en el preview
        const escalaJuego = escalaPersonaje;
        
        model.scale.set(escalaJuego, escalaJuego, escalaJuego);
        model.position.set(0, 0, 0);
        
        wrapper.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            
            // Obtener índice de animación específico para este personaje
            const indiceAnimacion = (personajeConfirmado === 'Spyro') ? 11 : 0;
            const animacionSeleccionada = Math.min(indiceAnimacion, gltf.animations.length - 1); // Asegurar que no exceda el límite
                        
            const clip = gltf.animations[animacionSeleccionada];
            animationAction = mixer.clipAction(clip, model);
            animationAction.reset();
            animationAction.setLoop(THREE.LoopRepeat);
            animationAction.play();
        } else {
            console.warn('El GLTF cargado no contiene animaciones (gltf.animations vacío).');
        }

        // Inicializar iconos flotantes después de cargar todo
        inicializarIconosFlotantes();
        
        // Inicializar NPCs después de cargar todo
        inicializarNPCs();

    }, undefined, (err) => {
        console.error(`Error cargando personaje ${personajeConfirmado} desde ${rutasPersonajes[personajeConfirmado] || rutasPersonajes['seagull']}`, err);
    });
}

function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // También actualizar la cámara aérea
  if (cameraAerea) {
    cameraAerea.aspect = window.innerWidth / window.innerHeight;
    cameraAerea.updateProjectionMatrix();
  }
}

function updateSprint() {
    const currentTime = Date.now();
    
    if (sprintKeyPressed) {
        // Solo consumir stamina si hay stamina disponible
        if (sprint_stamina > 0) {
            // Calcular cuánto tiempo ha pasado desde el último frame
            const deltaTime = (currentTime - (lastSprintUpdateTime || currentTime)) / 1000;
            const staminaToReduce = deltaTime * 10; // 10 puntos por segundo
            
            // Reducir stamina pero no por debajo de 0
            sprint_stamina = Math.max(0, sprint_stamina - staminaToReduce);
        }
        
        // Actualizar el tiempo del último update
        lastSprintUpdateTime = currentTime;
        
    } else {
        // Si no se está presionando S, verificar si han pasado 5 segundos para regenerar
        const timeSinceLastSprint = (currentTime - lastSprintTime) / 1000;
        
        if (timeSinceLastSprint > 3) {
            // Regenerar stamina gradualmente
            const deltaTime = (currentTime - (lastSprintUpdateTime || currentTime)) / 1000;
            const staminaToAdd = deltaTime * 3 + timeSinceLastSprint * 0.02; // 5 puntos por segundo
            
            // Aumentar stamina pero no por encima de 95
            sprint_stamina = Math.min(95, sprint_stamina + staminaToAdd);
        }
        
        // Actualizar el tiempo del último update
        lastSprintUpdateTime = currentTime;
    }
    
    // Actualizar el HUD con los nuevos valores
    updateHUD();
}

function updateHUD() {
    // Actualizar barra de sprint
    const sprintBar = document.getElementById('sprint-bar');
    const sprintBarContainer = sprintBar?.parentElement;
    
    if (sprintBar && sprintBarContainer) {
        // Calcular A y B basados en sprint_stamina
        // Cuando stamina = 95 (máximo): A = 95, B = 85 (forma normal)
        // Cuando stamina = 0 (mínimo): A = 0, B = 0 (barra invisible)
        const A = 95 - (95 - sprint_stamina); // Simplificado: A = sprint_stamina
        const B = Math.max(0, 85 - (95 - sprint_stamina)); // B = Math.max(0, sprint_stamina - 10)
        
        // Crear el nuevo clip-path
        const newClipPath = `polygon(0% 0%, ${A}% 0%, ${B}% 100%, 0% 100%)`;
        
        // NO aplicar clip-path al contenedor (mantener el fondo completo)
        // Solo aplicar clip-path a la barra interna
        sprintBar.style.clipPath = newClipPath;
        
        // También actualizar el ancho de la barra interna para mostrar el nivel de stamina
        const staminaPercentage = (sprint_stamina / 95) * 100;
        sprintBar.style.width = `${staminaPercentage}%`;
    }
    
    // Actualizar barra de munición
    const ammoBar = document.getElementById('ammo-bar');
    const ammoBarContainer = ammoBar?.parentElement;
    
    if (ammoBar && ammoBarContainer) {
        // Calcular A y B basados en ammo_municion (similar al sprint)
        // Cuando munición = 95 (máximo): A = 95, B = 85 (forma normal)
        // Cuando munición = 0 (mínimo): A = 0, B = 0 (barra invisible)
        const A = 95 - (95 - ammo_municion); // Simplificado: A = ammo_municion
        const B = Math.max(0, 85 - (95 - ammo_municion)); // B = Math.max(0, ammo_municion - 10)
        
        // Crear el nuevo clip-path
        const newClipPath = `polygon(0% 0%, ${A}% 0%, ${B}% 100%, 0% 100%)`;
        
        // Solo aplicar clip-path a la barra interna
        ammoBar.style.clipPath = newClipPath;
        
        // También actualizar el ancho de la barra interna para mostrar el nivel de munición
        const ammoPercentage = (ammo_municion / 95) * 100;
        ammoBar.style.width = `${ammoPercentage}%`;
    }
    
    // Actualizar contador de aciertos
    const acertadasCounter = document.getElementById('acertadas-counter');
    if (acertadasCounter) {
        acertadasCounter.textContent = `🎯💩 Aciertos: ${contadorCacasAcertadas}`;
    }
}

function updateKebabIndicator() {
    const kebabIndicator = document.getElementById('kebab-indicator');
    if (kebabIndicator) {
        if (cacaGratisActivo) {
            const tiempoRestante = Math.max(0, cacaGratisTiempoFin - Date.now());
            const segundosRestantes = Math.ceil(tiempoRestante / 1000);

            kebabIndicator.textContent = `El KEBAB te ha dado DIARREA INTENSA (${segundosRestantes}s)`;
            
            kebabIndicator.style.display = 'block';
        } else {
            kebabIndicator.style.display = 'none';
        }
    }
}

// Función para mostrar notificación de caca con cooldown por NPC
function mostrarNotificacionCaca(nombreNPC, rutaImagen = null, npcId = null) {
    if (npcId !== null) {
        const tiempoActual = Date.now();
        
        if (window.cooldownNotificaciones && window.cooldownNotificaciones[npcId]) {
            const tiempoUltimaNotificacion = window.cooldownNotificaciones[npcId];
            if (tiempoActual - tiempoUltimaNotificacion < cooldownNotificacionNPC) {
                return;
            }
        }
        
        if (!window.cooldownNotificaciones) {
            window.cooldownNotificaciones = {};
        }
        
        window.cooldownNotificaciones[npcId] = tiempoActual;
    }

    const container = document.getElementById('notificaciones-container');
    if (!container) return;
    
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        background-color: rgba(139, 69, 19, 0.95);
        color: white;
        font-size: 14px;
        font-weight: bold;
        padding: 12px 16px;
        border-radius: 8px;
        border: 2px solid #8B4513;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        margin-bottom: 0px;
        margin-top: 5px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 60px;
    `;
    
    if (rutaImagen && imagenesDNPCsDisponibles && configFotosActivadas) {
        const imagenContainer = document.createElement('div');
        imagenContainer.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid white;
            flex-shrink: 0;
            background-color: rgba(255, 255, 255, 0.1);
        `;
        
        const imagen = document.createElement('img');
        imagen.src = rutaImagen;
        imagen.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        imagen.onerror = () => {
            imagenContainer.innerHTML = '👤';
            imagenContainer.style.display = 'flex';
            imagenContainer.style.alignItems = 'center';
            imagenContainer.style.justifyContent = 'center';
            imagenContainer.style.fontSize = '24px';
        };
        
        imagenContainer.appendChild(imagen);
        notificacion.appendChild(imagenContainer);
    }
    
    const textoContainer = document.createElement('div');
    textoContainer.style.cssText = `
        flex: 1;
        text-align: left;
    `;
    textoContainer.textContent = `💩 ${nombreNPC}`;
    
    notificacion.appendChild(textoContainer);
    container.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateX(0)';
    }, 50);
    
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Función para crear caca automática (sin consumir munición)
function crearCacaAutomatica() {
    if (personajeConfirmado === 'Bombardino Crocodilo') {
        const posicionBomba = p_pos.clone();
        posicionBomba.y -= 0.5;
        
        crearBomba(posicionBomba, null, true);
        return;
    }
    
    const config = configCacasPersonajes[personajeConfirmado];
    const configCaca = !config ? { color: 0xffffff, escala: 1.0 } : 
        config.coloresAleatorios ? { color: config.coloresAleatorios[Math.floor(Math.random() * config.coloresAleatorios.length)], escala: config.escala } :
        { color: config.color, escala: config.escala };
    const tamañoCaca = cacaSize * configCaca.escala;
    
    const cacaGeometry = new THREE.SphereGeometry(tamañoCaca, 8, 6);
    const cacaMaterial = new THREE.MeshLambertMaterial({ color: configCaca.color });
    const cacaMesh = new THREE.Mesh(cacaGeometry, cacaMaterial);
    
    cacaMesh.position.copy(p_pos);
    cacaMesh.position.y -= 0.5;
    
    scene.add(cacaMesh);
    
    const caca = {
        mesh: cacaMesh,
        velocity: new THREE.Vector3(0, 0, 0),
        active: true,
        tamaño: tamañoCaca
    };
    
    cacas.push(caca);
}

// Función para activar pánico en un NPC
function activarPanicoNPC(npc) {
    if (npc.enPanico) return;
    
    npc.audioPanico = reproducirSonidoPanico(npc.wrapper.position, npc.genero);
    
    npc.enPanico = true;
    npc.tiempoFinPanico = Date.now() + 5000;
    
    npc.velocidad = npc.velocidadOriginal * 4;
    npc.intervalosCambio = 1000;
    
    if (npc.genero === 'femenino') {
        if (npc.action) {
            npc.action.timeScale = 2.5;
        }
    } else {
        const runModelPath = npc.runModelPath;
        
        const loader = new THREE.GLTFLoader();
        loader.load(runModelPath, (gltf) => {
            if (gltf.animations && gltf.animations.length > 0) {
                if (npc.action) {
                    npc.action.stop();
                }
                
                npc.mixerPanico = new THREE.AnimationMixer(npc.model);
                const clipPanico = gltf.animations[0];
                npc.actionPanico = npc.mixerPanico.clipAction(clipPanico);
                npc.actionPanico.reset();
                npc.actionPanico.setLoop(THREE.LoopRepeat);
                npc.actionPanico.timeScale = 1.5;
                npc.actionPanico.play();
            }
        }, undefined, (error) => {
            if (npc.action) {
                npc.action.timeScale = 2.5;
            }
        });
    }
}

// Función para restaurar NPC del pánico
function restaurarNPCDelPanico(npc) {
    npc.enPanico = false;
    npc.velocidad = npc.velocidadOriginal;
    npc.intervalosCambio = 5000 + Math.random() * 10000;
    
    if (npc.audioPanico) {
        npc.audioPanico.pause();
        npc.audioPanico.currentTime = 0;
        npc.audioPanico = null;
    }
    
    if (npc.genero === 'femenino') {
        if (npc.action) {
            npc.action.timeScale = 1.0;
        }
    } else {
        if (npc.actionPanico) {
            npc.actionPanico.stop();
            npc.actionPanico = null;
        }
        if (npc.mixerPanico) {
            npc.mixerPanico = null;
        }
        
        if (npc.actionOriginal) {
            npc.actionOriginal.reset();
            npc.actionOriginal.timeScale = 1.0;
            npc.actionOriginal.play();
            npc.action = npc.actionOriginal;
        }
    }
}

// Función para crear una caca (manual, siempre consume munición)
function crearCaca() {
    if (cacaAutomaticaActiva) {
        return;
    }
    
    const costoMunicion = (personajeConfirmado === 'Bombardino Crocodilo') ? 15 : 1;
    
    if (personajeConfirmado === 'Bombardino Crocodilo') {
        const tiempoActual = Date.now();
        const tiempoTranscurrido = tiempoActual - ultimaBombaLanzada;
        
        if (tiempoTranscurrido < cooldownBomba) {
            return;
        }
    }
    
    if (ammo_municion < costoMunicion) {
        return;
    }
    
    ammo_municion = Math.max(0, ammo_municion - costoMunicion);
    updateHUD();
    
    if (personajeConfirmado === 'Bombardino Crocodilo') {
        const posicionBomba = p_pos.clone();
        posicionBomba.y -= 0.5;
        
        crearBomba(posicionBomba);
        return;
    }
    
    const config = configCacasPersonajes[personajeConfirmado];
    const configCaca = !config ? { color: 0xffffff, escala: 1.0 } : 
        config.coloresAleatorios ? { color: config.coloresAleatorios[Math.floor(Math.random() * config.coloresAleatorios.length)], escala: config.escala } :
        { color: config.color, escala: config.escala };
    const tamañoCaca = cacaSize * configCaca.escala;
    
    const cacaGeometry = new THREE.SphereGeometry(tamañoCaca, 8, 6);
    const cacaMaterial = new THREE.MeshLambertMaterial({ color: configCaca.color });
    const cacaMesh = new THREE.Mesh(cacaGeometry, cacaMaterial);
    
    cacaMesh.position.copy(p_pos);
    cacaMesh.position.y -= 0.5;
    
    scene.add(cacaMesh);
    
    const caca = {
        mesh: cacaMesh,
        velocity: new THREE.Vector3(0, 0, 0),
        active: true,
        tamaño: tamañoCaca
    };
    
    cacas.push(caca);
}

// Función para crear bomba personalizada (Bombardino Crocodilo)
function crearBomba(posicion, direccion = null, esAutomatica = false) {
    if (!esAutomatica) {
        ultimaBombaLanzada = Date.now();
    }
    
    reproducirSonidoBomba();
    
    if (!modeloBombaPrecargado) {
        const cacaGeometry = new THREE.SphereGeometry(cacaSize, 8, 6);
        const colorConfig = configCacasPersonajes['Bombardino Crocodilo'];
        const cacaMaterial = new THREE.MeshLambertMaterial({ color: colorConfig ? colorConfig.color : 0x8B4513 });
        const cacaMesh = new THREE.Mesh(cacaGeometry, cacaMaterial);
        
        cacaMesh.position.copy(posicion);
        scene.add(cacaMesh);
        
        const caca = {
            mesh: cacaMesh,
            velocity: new THREE.Vector3(0, 0, 0),
            active: true,
            tamaño: cacaSize
        };
        
        cacas.push(caca);
        return;
    }
    
    const bombaMesh = modeloBombaPrecargado.clone();
    bombaMesh.position.copy(posicion);
    
    const escalaBase = escalasPersonajes[personajeSeleccionado] || 1.0;
    const escalaBomba = escalaBase * 0.005;
    bombaMesh.scale.set(escalaBomba, escalaBomba, escalaBomba);
    bombaMesh.rotation.set(0, 0, 0);
    
    scene.add(bombaMesh);
    
    const bomba = {
        mesh: bombaMesh,
        velocity: new THREE.Vector3(0, 0, 0),
        active: true,
        tamaño: cacaSize,
        esBomba: true,
        areaImpacto: 30
    };
    
    cacas.push(bomba);
}
// Función para actualizar la física de las cacas
function updateCacas(deltaTime) {
    for (let i = cacas.length - 1; i >= 0; i--) {
        const caca = cacas[i];
        
        if (!caca.active) continue;
        
        // Aplicar gravedad
        caca.velocity.y += cacaGravity * deltaTime;
        
        // Actualizar posición
        caca.mesh.position.add(caca.velocity.clone().multiplyScalar(deltaTime));
        
        // Verificar colisión con el suelo o edificios
        const colision = verificarColisionCaca(caca);
        if (colision) {
            // Solo crear mancha si es necesario (suelo o edificios, NO NPCs)
            if (colision.crearMancha) {
                crearMancha(caca.mesh.position, caca);
            }
            
            scene.remove(caca.mesh);
            cacas.splice(i, 1);
        }
    }
}

// Función para verificar colisiones de la caca
function verificarColisionCaca(caca) {
    const pos = caca.mesh.position;
    
    // Determinar si es bomba al inicio
    const esBomba = caca.esBomba || false;
    
    // Colisión con el suelo
    if (pos.y <= 0) {
        // Si es bomba, verificar NPCs en radio de 100 unidades al explotar
        if (esBomba) {
            let npcsAfectados = 0;
            let npcsAfectadosIds = new Set(); // Para evitar contar el mismo NPC dos veces
            
            for (let i = 0; i < npcs.length; i++) {
                const npc = npcs[i];
                if (!npc.active) continue;
                
                // Para bombas: verificar distancia de 100 unidades al explotar
                const distancia = pos.distanceTo(npc.wrapper.position);
                if (distancia <= 100) {
                    // Solo contar si no hemos afectado ya a este NPC
                    if (!npcsAfectadosIds.has(npc.id || i)) {
                        npcsAfectadosIds.add(npc.id || i);
                        contadorCacasAcertadas++;
                        npcsAfectados++;
                        
                        activarPanicoNPC(npc);
                        
                        // Mostrar notificación solo si el NPC debe mostrarla
                        if (npc.mostrarNotificacion) {
                            const rutaImagen = imagenesDNPCsDisponibles ? npc.rutaImagen : null;
                            mostrarNotificacionCaca("Te has cagado en "+npc.nombre, rutaImagen, npc.id || i);
                        }
                    }
                }
            }
            
            return { tipo: 'bomba-suelo', crearMancha: true, npcsAfectados: npcsAfectados };
        }
        
        return { tipo: 'suelo', crearMancha: true };
    }
    
    // Las bombas NO detectan colisiones durante el vuelo (solo explotan al tocar suelo)
    if (esBomba) {
        return false; // Las bombas siguen volando hasta tocar el suelo
    }
    
    // SOLO para cacas normales: Verificar colisión con NPCs durante el vuelo
    const tamañoCacaReal = caca.tamaño || cacaSize;
    
    for (let i = 0; i < npcs.length; i++) {
        const npc = npcs[i];
        if (!npc.active) continue;
        
        // Para cacas normales: usar caja de colisión tradicional
        const tamañoDeteccion = tamañoCacaReal;
        
        const cacaBox = new THREE.Box3().setFromCenterAndSize(
            pos, 
            new THREE.Vector3(tamañoDeteccion * 2, tamañoDeteccion * 2, tamañoDeteccion * 2)
        );
        
        // Crear caja de colisión para el NPC (tamaño estándar)
        let hitboxSize = new THREE.Vector3(1.5, 3, 1.5); // Tamaño base de una persona
        
        const npcBox = new THREE.Box3().setFromCenterAndSize(
            npc.wrapper.position,
            hitboxSize
        );
        
        if (cacaBox.intersectsBox(npcBox)) {
            contadorCacasAcertadas++;
            
            if (npc.mostrarNotificacion) {
                const rutaImagen = imagenesDNPCsDisponibles ? npc.rutaImagen : null;
                mostrarNotificacionCaca("Te has cagado en "+npc.nombre, rutaImagen, npc.id || i);
            }
            
            activarPanicoNPC(npc);
            
            return { tipo: 'npc', crearMancha: false };
        }
    }
    
    // Para cacas normales: Colisión con edificios
    const factorDeteccion = 1;
    const tamañoDeteccion = tamañoCacaReal * factorDeteccion;
    
    const cacaBox = new THREE.Box3().setFromCenterAndSize(
        pos, 
        new THREE.Vector3(tamañoDeteccion * 2, tamañoDeteccion * 2, tamañoDeteccion * 2)
    );
    
    for (let i = 0; i < obstaculosBBoxes.length; i++) {
        if (cacaBox.intersectsBox(obstaculosBBoxes[i])) {
            return { tipo: 'edificio', crearMancha: true };
        }
    }
    
    return false;
}

// Función para crear una mancha permanente
function crearMancha(position, caca = null) {
    // OBTENER CONFIGURACIÓN PERSONALIZADA DE LA MANCHA
    let colorMancha = 0xffffff; // Color por defecto (blanco)
    let tamañoMancha = 0.3; // Tamaño por defecto
    let esBomba = false;
    
    if (caca) {
        esBomba = caca.esBomba || false;
        
        if (esBomba) {
            tamañoMancha = 100;
            colorMancha = 0xCCCCCC;
        } else if (caca.tamaño) {
            tamañoMancha = caca.tamaño * 3;
            
            if (caca.mesh && caca.mesh.material && caca.mesh.material.color) {
                colorMancha = caca.mesh.material.color.getHex();
            }
        }
    }
    
    // Crear geometría de disco plano para la mancha con tamaño personalizado
    const manchaGeometry = new THREE.CircleGeometry(tamañoMancha, esBomba ? 16 : 8); // Más detalle para explosiones
    const manchaMaterial = new THREE.MeshLambertMaterial({ 
        color: colorMancha,
        transparent: true,
        opacity: esBomba ? 0.9 : 0.8 // Explosiones más opacas
    });
    
    // Para bombas, crear cercos concéntricos múltiples
    let manchaMesh;
    if (esBomba) {
        // Cerco 1: Gris claro de radio 50 (más externo)
        const cerco1Geometry = new THREE.CircleGeometry(50, 32); // Más segmentos para mejor calidad
        const cerco1Material = new THREE.MeshLambertMaterial({ 
            color: 0xCCCCCC, // Gris claro
            transparent: true,
            opacity: 0.6
        });
        const cerco1Mesh = new THREE.Mesh(cerco1Geometry, cerco1Material);
        cerco1Mesh.position.copy(position);
        cerco1Mesh.position.y = Math.max(0.01, position.y);
        cerco1Mesh.rotation.x = -Math.PI / 2;
        scene.add(cerco1Mesh);
        manchas.push(cerco1Mesh);
        
        // Cerco 2: Gris oscuro de radio 25 (medio)
        const cerco2Geometry = new THREE.CircleGeometry(25, 24);
        const cerco2Material = new THREE.MeshLambertMaterial({ 
            color: 0x444444, // Gris oscuro
            transparent: true,
            opacity: 0.7
        });
        const cerco2Mesh = new THREE.Mesh(cerco2Geometry, cerco2Material);
        cerco2Mesh.position.copy(position);
        cerco2Mesh.position.y = Math.max(0.02, position.y); // Ligeramente más alto
        cerco2Mesh.rotation.x = -Math.PI / 2;
        scene.add(cerco2Mesh);
        manchas.push(cerco2Mesh);
        
        // Cerco 3: Negro de radio 10 (más interno)
        const cerco3Geometry = new THREE.CircleGeometry(10, 16);
        const cerco3Material = new THREE.MeshLambertMaterial({ 
            color: 0x000000, // Negro
            transparent: true,
            opacity: 0.8
        });
        manchaMesh = new THREE.Mesh(cerco3Geometry, cerco3Material);
        
        // Ya no crear cráteres adicionales, los cercos concéntricos son suficiente efecto
    } else {
        manchaMesh = new THREE.Mesh(manchaGeometry, manchaMaterial);
    }
    
    // Posicionar la mancha principal en el suelo o superficie
    manchaMesh.position.copy(position);
    if (esBomba) {
        manchaMesh.position.y = Math.max(0.03, position.y); // Cerco negro más alto que los otros
    } else {
        manchaMesh.position.y = Math.max(0.01, position.y); // Altura normal para cacas
    }
    manchaMesh.rotation.x = -Math.PI / 2; // rotar para que esté horizontal
    
    scene.add(manchaMesh);
    
    manchas.push(manchaMesh);
}

//=============================================================================
// FUNCIONES DE GENERACIÓN DE MUNDO Y POSICIONES
//=============================================================================

// Función para generar una posición aleatoria válida para iconos
function generarPosicionValidaIcono() {
    let intentos = 0;
    const maxIntentos = 100;
    
    while (intentos < maxIntentos) {
        // Generar posición aleatoria en el mapa (4x más grande)
        const x = (Math.random() - 0.5) * 380; // -190 a 190 (margen de 10 desde los bordes)
        const z = (Math.random() - 0.5) * 380; // -190 a 190
        const y = iconoHeight + Math.random() * 5; // altura base + variación
        
        // Verificar que no esté dentro de ningún edificio
        const iconoBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(iconoSize * 2, iconoSize * 2, iconoSize * 2)
        );
        
        let posicionValida = true;
        for (let i = 0; i < obstaculosBBoxes.length; i++) {
            // Crear una versión expandida del edificio para mantener margen
            const edificioExpandido = obstaculosBBoxes[i].clone();
            edificioExpandido.expandByScalar(2); // margen de 2 unidades
            
            if (iconoBox.intersectsBox(edificioExpandido)) {
                posicionValida = false;
                break;
            }
        }
        
        if (posicionValida) {
            return new THREE.Vector3(x, y, z);
        }
        
        intentos++;
    }
    
    // Si no encuentra posición válida, usar una por defecto
    console.warn("No se pudo encontrar posición válida para icono, usando posición por defecto");
    return new THREE.Vector3(0, iconoHeight + 5, 0);
}

// Función para generar posición válida para NPCs en el suelo
function generarPosicionValidaNPC() {
    let intentos = 0;
    const maxIntentos = 100;
    
    while (intentos < maxIntentos) {
        // Generar posición aleatoria en el suelo
        const x = (Math.random() - 0.5) * (worldBounds * 2); // dentro de los límites del mundo
        const z = (Math.random() - 0.5) * (worldBounds * 2);
        const y = 0.5; // ligeramente sobre el suelo
        
        // Verificar que no esté dentro de ningún edificio
        const npcBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(2, 4, 2) // tamaño aproximado de un NPC
        );
        
        let posicionValida = true;
        for (let i = 0; i < obstaculosBBoxes.length; i++) {
            // Crear una versión expandida del edificio para mantener margen
            const edificioExpandido = obstaculosBBoxes[i].clone();
            edificioExpandido.expandByScalar(3); // margen de 3 unidades para NPCs
            
            if (npcBox.intersectsBox(edificioExpandido)) {
                posicionValida = false;
                break;
            }
        }
        
        // También verificar que no esté muy cerca del jugador inicialmente
        const distanciaAlJugador = Math.sqrt(
            Math.pow(x - p_pos.x, 2) + Math.pow(z - p_pos.z, 2)
        );
        
        if (posicionValida && distanciaAlJugador > 15) {
            return new THREE.Vector3(x, y, z);
        }
        
        intentos++;
    }
    
    // Si no encuentra posición válida, usar una alejada del jugador
    console.warn("No se pudo encontrar posición válida para NPC, usando posición por defecto");
    return new THREE.Vector3(50, 0.5, 50);
}

//=============================================================================
// FUNCIONES DE CREACIÓN DE OBJETOS DEL MUNDO
//=============================================================================

// Función para crear un icono flotante con modelo de comida
function crearIconoFlotante(position) {
    // Seleccionar tipo de comida aleatoriamente
    const random = Math.random();
    const tipoComida = random < 0.4 ? 'pizza' : random < 0.8 ? 'burger' : 'kebab';
    const modelPath = `models/food/${tipoComida}/scene.gltf`;
    
    // Determinar la posición
    const iconoPosition = position ? position : generarPosicionValidaIcono();
        
    // Cargar el modelo GLTF
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        
        // Obtener configuración completa para este tipo de comida
        const configComida = configsComida[tipoComida] || configsComida['pizza'];
        model.scale.set(configComida.escala, configComida.escala, configComida.escala);
        
        // Aplicar rotación específica del alimento
        model.rotation.x = configComida.rotacion.x;
        model.rotation.y = configComida.rotacion.y;
        model.rotation.z = configComida.rotacion.z;
        
        // Posicionar el modelo
        model.position.copy(iconoPosition);
        

        
        // Hacer el modelo semitransparente
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = 0.9; // Menos transparencia
                // Añadir un brillo sutil
                if (child.material.emissive) {
                    child.material.emissive.setHex(0x111111);
                }
            }
        });
        
        // Añadir al escenario
        scene.add(model);
        
        // Crear objeto de icono con propiedades
        const icono = {
            mesh: model,
            tipo: tipoComida,
            rotationSpeed: Math.random() * 0.02 + 0.01, // velocidad de rotación aleatoria
            floatOffset: Math.random() * Math.PI * 2, // offset para animación de flotación
            baseY: iconoPosition.y, // guardar Y base para animación de flotación
            active: true
        };
        
        // Añadir a la lista de iconos
        iconosFlotantes.push(icono);
        
        
    }, 
    // Progress callback
    (progress) => {
    },
    // Error callback
    (err) => {
        console.error(`❌ Error cargando modelo de comida ${modelPath}:`, err);
        // Los modelos de comida siempre deberían cargar correctamente
    });
}

// Función para crear un NPC
function crearNPC(genero = 'masculino', nombre = 'NPC Anónimo', rutaImagen = null) {
    const npcPosition = generarPosicionValidaNPC();
    
    // Para NPCs sin nombre, generar un identificador simple
    const esNPCSinNombre = (nombre === null);
    const nombreFinal = esNPCSinNombre ? `NPC-${genero.substring(0,1).toUpperCase()}${Math.floor(Math.random() * 1000)}` : nombre;
    
    // Determinar modelo y animaciones según género
    let modelPath, runModelPath;
    if (genero === 'femenino') {
        modelPath = 'models/npcs/basic_walk_free_animation_30_frames_loop/scene.gltf'; // Mujer caminando
        runModelPath = 'models/npcs/female_running_free_animation_20_frames_loop/scene.gltf'; // Mujer corriendo
    } else {
        modelPath = 'models/npcs/male_basic_walk_30_frames_loop/scene.gltf'; // Hombre caminando
        runModelPath = 'models/npcs/male_running_20_frames_loop/scene.gltf'; // Hombre corriendo
    }
    
    
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
        
        // Crear wrapper para el NPC
        const npcWrapper = new THREE.Object3D();
        npcWrapper.position.copy(npcPosition);
        scene.add(npcWrapper);
        
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // tamaño normal
        model.position.set(0, 0, 0);
        npcWrapper.add(model);
        
        // Configurar animación si existe
        let npcMixer = null;
        let npcAction = null;
        if (gltf.animations && gltf.animations.length > 0) {
            npcMixer = new THREE.AnimationMixer(model);
            const clip = gltf.animations[0]; // usar la primera animación (caminar)
            npcAction = npcMixer.clipAction(clip);
            npcAction.reset();
            npcAction.setLoop(THREE.LoopRepeat);
            npcAction.timeScale = 1.0; // Velocidad normal para ambos géneros
            npcAction.play();
        }
        
        // Generar propiedades aleatorias para el NPC
        const velocidadAleatoria = npcSpeed * (0.5 + Math.random() * 1.5); // entre 0.5x y 2x la velocidad base
        const direccionAleatoria = Math.random() * Math.PI * 2; // dirección aleatoria en radianes
        
        // Crear objeto NPC con propiedades
        const npc = {
            wrapper: npcWrapper,
            model: model,
            mixer: npcMixer,
            action: npcAction,
            velocidad: velocidadAleatoria,
            direccion: direccionAleatoria,
            tiempoUltimoCambio: Date.now(),
            intervalosCambio: 5000 + Math.random() * 10000, // cambiar dirección cada 5-15 segundos
            active: true,
            // Nuevas propiedades
            nombre: nombreFinal,
            genero: genero,
            modelPath: modelPath,
            runModelPath: runModelPath,
            rutaImagen: rutaImagen, // Ruta de la imagen de la persona
            mostrarNotificacion: !esNPCSinNombre, // Solo mostrar notificación si tiene nombre real
            // Propiedades para estado de pánico
            enPanico: false,
            tiempoFinPanico: 0,
            velocidadOriginal: velocidadAleatoria,
            actionOriginal: npcAction,
            mixerPanico: null,
            actionPanico: null,
            audioPanico: null // Referencia al audio de pánico
        };
        
        // Orientar el NPC hacia su dirección inicial
        npcWrapper.rotation.y = direccionAleatoria;
        
        // Añadir a la lista de NPCs
        npcs.push(npc);
        
        
    }, 
    (progress) => {
    },
    (err) => {
        console.error(`❌ Error cargando NPC ${nombre} desde ${modelPath}:`, err);
        console.error(`🔍 Detalles del error:`, err.message || err);
        // Los modelos de NPC siempre deberían cargar correctamente
    });
}

// Función para inicializar todos los iconos flotantes
function inicializarIconosFlotantes() {
    console.log(`Inicializando ${maxIconos} iconos flotantes...`);
    // Crear los iconos iniciales
    for (let i = 0; i < maxIconos; i++) {
        crearIconoFlotante();
    }
    console.log(`${maxIconos} iconos flotantes solicitados para inicialización`);
}


// Función para inicializar todos los NPCs
async function inicializarNPCs() {
    console.log('🚶 Inicializando sistema de NPCs...');
    
    try {
        // Cargar imágenes desde archivo de configuración JSON
        await cargarImagenesDesdeJSON();
        
        if (maxNPCs === 0) {
            console.warn('No se encontraron imágenes de personas.');
            console.log('Para usar el sistema de NPCs:');
            console.log('Crea el archivo personas/config.json con la lista de imágenes');
            return;
        }
        
        console.log(`Creando ${maxNPCs} NPCs (${imagenesHombres.length} hombres + ${imagenesMujeres.length} mujeres)...`);
        
        let delay = 0;
        
        // Crear NPCs masculinos basados en las imágenes encontradas
        for (let i = 0; i < imagenesHombres.length; i++) {
            const rutaImagen = imagenesHombres[i];
            const nombre = rutaImagen.split('/').pop().split('.')[0];
            
            setTimeout(() => {
                crearNPC('masculino', nombre, rutaImagen);
            }, delay);
            
            delay += 200; // escalonar la creación para evitar sobrecarga
        }
        
        // Crear NPCs femeninos basados en las imágenes encontradas
        for (let i = 0; i < imagenesMujeres.length; i++) {
            const rutaImagen = imagenesMujeres[i];
            const nombre = rutaImagen.split('/').pop().split('.')[0];
            
            setTimeout(() => {
                crearNPC('femenino', nombre, rutaImagen);
            }, delay);
            
            delay += 200;
        }
        
        // Crear 30 NPCs hombres adicionales sin nombre
        console.log('👥 Creando 30 NPCs hombres adicionales sin nombre...');
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                crearNPC('masculino', null, null); // sin nombre, sin imagen
            }, delay);
            
            delay += 150; // un poco más rápido para los NPCs sin nombre
        }
        
        // Crear 30 NPCs mujeres adicionales sin nombre
        console.log('Creando 30 NPCs mujeres adicionales sin nombre...');
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                crearNPC('femenino', null, null); // sin nombre, sin imagen
            }, delay);
            
            delay += 150;
        }
        
        console.log(`Sistema de NPCs inicializado con ${maxNPCs + 60} NPCs programados (${maxNPCs} con nombre + 60 sin nombre) - NPCs especiales eliminados para optimización`);
        
    } catch (error) {
        console.error('❌ Error inicializando NPCs:', error);
    }
}

//=============================================================================
// FUNCIONES DE ACTUALIZACIÓN DEL LOOP PRINCIPAL  
//=============================================================================

// Función para actualizar los NPCs (movimiento y animaciones) - OPTIMIZADA
function updateNPCs(deltaTime) {
    const currentTime = Date.now();
    
    // Frustum culling: solo actualizar NPCs que están cerca o visibles
    const cameraPosition = camera.position;
    const maxDistance = 150; // distancia máxima para actualizar NPCs completos
    const basicUpdateDistance = 300; // distancia para actualizaciones básicas
    
    for (let i = 0; i < npcs.length; i++) {
        const npc = npcs[i];
        
        if (!npc.active) continue;
        
        // Calcular distancia al jugador
        const distance = cameraPosition.distanceTo(npc.wrapper.position);
        
        // Verificar si debe salir del pánico (siempre necesario)
        if (npc.enPanico && currentTime > npc.tiempoFinPanico) {
            restaurarNPCDelPanico(npc);
        }
        
        // Optimización: NPCs muy lejanos solo actualizaciones básicas
        if (distance > basicUpdateDistance) {
            // Solo verificar pánico, no mover ni animar
            continue;
        }
        
        // NPCs cercanos: actualización completa
        if (distance <= maxDistance) {
            // Actualizar animación (normal o de pánico)
            if (npc.enPanico && npc.mixerPanico) {
                npc.mixerPanico.update(deltaTime);
            } else if (npc.mixer) {
                npc.mixer.update(deltaTime);
            }
            
            // Actualizar volumen del audio de pánico basado en distancia
            if (npc.enPanico && npc.audioPanico) {
                actualizarVolumenAudio(npc.audioPanico, npc.wrapper.position);
            }
        }
        
        // NPCs medianamente cerca: movimiento sin animación detallada
        else {
            // Solo actualizar mixer básico sin audio
            if (npc.mixer) {
                npc.mixer.update(deltaTime * 0.5); // Animación más lenta para lejanos
            }
        }
        
        // Verificar si es hora de cambiar dirección
        if (currentTime - npc.tiempoUltimoCambio > npc.intervalosCambio) {
            npc.direccion = Math.random() * Math.PI * 2; // nueva dirección aleatoria
            npc.tiempoUltimoCambio = currentTime;
            
            // Intervalo según estado (pánico o normal)
            if (npc.enPanico) {
                npc.intervalosCambio = 500 + Math.random() * 1000; // cambio rápido y errático (0.5-1.5s)
            } else {
                npc.intervalosCambio = 5000 + Math.random() * 10000; // intervalo normal (5-15s)
            }
            
            // Orientar el NPC hacia la nueva dirección
            npc.wrapper.rotation.y = npc.direccion;
        }
        
        // Calcular movimiento
        const deltaX = Math.sin(npc.direccion) * npc.velocidad;
        const deltaZ = Math.cos(npc.direccion) * npc.velocidad;
        
        // Nueva posición propuesta
        const nuevaPosX = npc.wrapper.position.x + deltaX;
        const nuevaPosZ = npc.wrapper.position.z + deltaZ;
        
        // Verificar límites del mundo
        if (Math.abs(nuevaPosX) < worldBounds && Math.abs(nuevaPosZ) < worldBounds) {
            // Verificar colisiones con edificios
            let hitboxMovimiento = new THREE.Vector3(2, 4, 2); // Tamaño base para movimiento
            
            const npcBox = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(nuevaPosX, npc.wrapper.position.y, nuevaPosZ),
                hitboxMovimiento
            );
            
            let puedeMoverse = true;
            for (let j = 0; j < obstaculosBBoxes.length; j++) {
                const edificioExpandido = obstaculosBBoxes[j].clone();
                edificioExpandido.expandByScalar(2); // margen de seguridad
                
                if (npcBox.intersectsBox(edificioExpandido)) {
                    puedeMoverse = false;
                    break;
                }
            }
            
            if (puedeMoverse) {
                // Aplicar movimiento
                npc.wrapper.position.x = nuevaPosX;
                npc.wrapper.position.z = nuevaPosZ;
                
            } else {
                // Cambiar dirección si hay colisión
                npc.direccion = Math.random() * Math.PI * 2;
                npc.wrapper.rotation.y = npc.direccion;
            }
        } else {
            // Cambiar dirección si llega al límite del mundo
            npc.direccion = Math.atan2(-npc.wrapper.position.x, -npc.wrapper.position.z); // apuntar hacia el centro
            npc.wrapper.rotation.y = npc.direccion;
        }
    }
}

// Función para actualizar los iconos flotantes (animación y colisiones)
function updateIconosFlotantes(deltaTime) {
    const currentTime = Date.now();
    
    // Actualizar iconos activos
    for (let i = iconosFlotantes.length - 1; i >= 0; i--) {
        const icono = iconosFlotantes[i];
        
        if (!icono.active) continue;
        
        // Animación de rotación
        icono.mesh.rotation.y += icono.rotationSpeed;
        
        // Animación de flotación (sube y baja suavemente) usando la posición base
        icono.mesh.position.y = icono.baseY + Math.sin(currentTime * 0.003 + icono.floatOffset) * 0.3;
        
        // Verificar colisión con el pájaro
        const distancia = p_pos.distanceTo(icono.mesh.position);
        const configComida = configsComida[icono.tipo] || configsComida['pizza'];
        
        // Ajustar hitbox según el personaje - Pterodactilo tiene hitbox más pequeño
        let hitboxPersonaje = 1.0; // Hitbox normal para todos los personajes
        
        if (distancia < (configComida.hitbox + hitboxPersonaje)) { // colisión usando hitbox específico del personaje
            // Restaurar munición
            const nuevaMunicion = Math.min(95, ammo_municion + iconoRestoration);
            ammo_municion = nuevaMunicion;
            
            // Efecto especial para kebab
            if (icono.tipo === 'kebab') {
                cacaGratisActivo = true;
                cacaAutomaticaActiva = true;
                cacaGratisTiempoFin = Date.now() + tiempoEfectoKebab;
                ultimaCacaAutomatica = Date.now(); // Inicializar timestamp
                updateKebabIndicator(); // Actualizar indicador inmediatamente
            }
            
            // Actualizar HUD
            updateHUD();
            
            // Remover el icono del escenario
            scene.remove(icono.mesh);
            iconosFlotantes.splice(i, 1);
            
            // Programar respawn después de 5 segundos
            setTimeout(() => {
                crearIconoFlotante();
            }, respawnTime);
            
        }
    }
}

function updateCamera() {
    // Calcular posición ideal de la cámara
    let velocity = new THREE.Vector3(Math.sin(angulo_y), 0, Math.cos(angulo_y));
    let offset = velocity.clone().multiplyScalar(-cameraDistance);
    offset.y += cameraHeight;
    let idealCamPos = new THREE.Vector3().addVectors(p_pos, offset);

    // Lanzar rayo desde el personaje hacia la posición ideal de la cámara
    let direction = new THREE.Vector3().subVectors(idealCamPos, p_pos).normalize();
    let maxDistance = idealCamPos.distanceTo(p_pos);

    raycaster.set(p_pos, direction);
    raycaster.far = maxDistance;
    
    // Detectar intersecciones con obstáculos
    const intersects = raycaster.intersectObjects(obstaculos, false);

    let finalCamPos;
    if (intersects.length > 0) {
        // Hay un obstáculo en el camino
        let hitDistance = intersects[0].distance;
        
        // Colocar la cámara justo antes del obstáculo, pero no más cerca que la distancia mínima
        let safeDistance = Math.max(hitDistance - 0.5, cameraMinDistance);
        finalCamPos = p_pos.clone().add(direction.multiplyScalar(safeDistance));
    } else {
        // No hay obstáculos, usar posición ideal
        finalCamPos = idealCamPos;
    }

    // Suavizar el movimiento de la cámara para evitar saltos bruscos
    camera.position.lerp(finalCamPos, 0.1);
    camera.lookAt(p_pos);

    // Actualizar cámara aérea para que siga al jugador
    if (cameraAerea) {
        // Posición más cercana al pájaro
        cameraAerea.position.x = p_pos.x;
        cameraAerea.position.z = p_pos.z;
        cameraAerea.position.y = p_pos.y + 8; // Solo 8 unidades arriba (mucho más cerca)
        
        // Aplicar la misma rotación Y que el pájaro para que rote con él
        cameraAerea.rotation.order = "YXZ";
        cameraAerea.rotation.y = angulo_y + Math.PI; // Seguir la orientación del pájaro + 180° para que mire hacia arriba
        cameraAerea.rotation.x = -Math.PI / 2; // Mirar hacia abajo
        cameraAerea.rotation.z = 0; // Sin rotación en Z
    }
}

function update() {
    // delta para el mixer
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Controlar velocidad de animación según sprint y personaje
    if (animationAction) {
        let canSprint = sprintKeyPressed && sprint_stamina > 0;
        let sprintAnimationSpeed = canSprint ? 1.5 : 1.0;
        
        // Aplicar multiplicador de velocidad personalizado del personaje
        let characterSpeedMultiplier = multiplicadoresVelocidad[personajeConfirmado] || 1.0;
        
        // Combinar ambos multiplicadores para la animación
        let totalAnimationSpeed = sprintAnimationSpeed * characterSpeedMultiplier;
        
        animationAction.setEffectiveTimeScale(totalAnimationSpeed);
    }

    // Actualizar sistema de sprint y stamina
    updateSprint();

    // Verificar si se agotó el efecto de caca gratis del kebab
    if (cacaGratisActivo && Date.now() >= cacaGratisTiempoFin) {
        cacaGratisActivo = false;
        cacaAutomaticaActiva = false;
    }

    // Lógica de caca automática durante el efecto kebab
    if (cacaAutomaticaActiva) {
        const tiempoActual = Date.now();
        
        // Determinar el intervalo según el personaje
        const intervaloPersonaje = (personajeConfirmado === 'Bombardino Crocodilo') 
            ? intervaloBombasDiarrea  // 1 segundo para Bombardino
            : intervaloCacaAutomatica; // 100ms para otros personajes
            
        if (tiempoActual - ultimaCacaAutomatica >= intervaloPersonaje) {
            crearCacaAutomatica();
            ultimaCacaAutomatica = tiempoActual;
        }
    }

    // Actualizar indicador de kebab (optimizado: cada 5 frames)
    if (miniMapUpdateCounter % 5 === 0) {
        updateKebabIndicator();
    }

    // Actualizar física de las cacas
    updateCacas(delta);

    // Actualizar iconos flotantes
    updateIconosFlotantes(delta);

    // Actualizar NPCs
    updateNPCs(delta);

    // Actualizar ángulos por controles con giros más pronunciados y banking
    let giro_actual = 0;
    
    if (controls.moveLeft) {
        angulo_y += 0.05; // Giros más pronunciados (0.025 -> 0.05)
        giro_actual = 1; // Girando a la izquierda
    }
    if (controls.moveRight) {
        angulo_y -= 0.05; // Giros más pronunciados (0.025 -> 0.05)
        giro_actual = -1; // Girando a la derecha
    }
    if (controls.moveUp) angulo_x += 0.025;
    if (controls.moveDown) angulo_x -= 0.025;
    angulo_x = Math.max(-Math.PI/4, Math.min(Math.PI/4, angulo_x));
    
    // Suavizar la velocidad de giro para banking
    velocidad_giro = THREE.MathUtils.lerp(velocidad_giro, giro_actual, 0.1);
    
    // Calcular banking (inclinación lateral) basado en la velocidad de giro
    const max_banking = Math.PI / 6; // Máximo 30 grados de inclinación
    angulo_z = -velocidad_giro * max_banking; // Negativo para inclinación correcta

    // factor de velocidad según inclinación
    let factor = 1.0 - (angulo_x / (-Math.PI/4)) * 0.3;

    // Calculamos el vector de avance
    let avanceLocal = new THREE.Vector3(0, 0, 1);
    avanceLocal.applyEuler(new THREE.Euler(angulo_x, angulo_y, 0, 'YXZ'));

    // Aplicar multiplicador de sprint si S está presionada Y hay stamina
    let canSprint = sprintKeyPressed && sprint_stamina > 0;
    let sprintMultiplier = canSprint ? 1.5 : 1.0;
    
    // Aplicar multiplicador de velocidad personalizado del personaje
    let characterSpeedMultiplier = multiplicadoresVelocidad[personajeConfirmado] || 1.0;
    
    // Combinar ambos multiplicadores
    let totalSpeedMultiplier = sprintMultiplier * characterSpeedMultiplier;
    
    tmpVec.copy(avanceLocal).normalize().multiplyScalar(controls.speed * factor * totalSpeedMultiplier);
    tmpVec.y *= verticalMovementFactor;

    // Colisión usando caja proxy (sistema original)
    colliderBox.min.set(
        p_pos.x - colliderHalfSize.x,
        p_pos.y - colliderHalfSize.y,
        p_pos.z - colliderHalfSize.z
    );
    colliderBox.max.set(
        p_pos.x + colliderHalfSize.x,
        p_pos.y + colliderHalfSize.y,
        p_pos.z + colliderHalfSize.z
    );

    // Pruebas por componentes (sistema original)
    let canMoveX = true;
    let canMoveY = true;
    let canMoveZ = true;

    // TEST X
    testBox.copy(colliderBox);
    testBox.translate(new THREE.Vector3(tmpVec.x, 0, 0));
    for (let i = 0; i < obstaculosBBoxes.length; i++) {
        if (testBox.intersectsBox(obstaculosBBoxes[i])) {
            canMoveX = false;
            break;
        }
    }

    // TEST Y
    testBox.copy(colliderBox);
    testBox.translate(new THREE.Vector3(0, tmpVec.y, 0));
    for (let i = 0; i < obstaculosBBoxes.length; i++) {
        if (testBox.intersectsBox(obstaculosBBoxes[i])) {
            canMoveY = false;
            break;
        }
    }

    // TEST Z
    testBox.copy(colliderBox);
    testBox.translate(new THREE.Vector3(0, 0, tmpVec.z));
    for (let i = 0; i < obstaculosBBoxes.length; i++) {
        if (testBox.intersectsBox(obstaculosBBoxes[i])) {
            canMoveZ = false;
            break;
        }
    }

    // Aplicar movimiento
    if (canMoveX) p_pos.x += tmpVec.x;
    if (canMoveY) p_pos.y += tmpVec.y;
    if (canMoveZ) p_pos.z += tmpVec.z;

    // Límites del escenario - muro invisible
    const worldLimit = 200; // límite del mundo (coincide con el plano de 400x400)
    const margin = Math.max(colliderHalfSize.x, colliderHalfSize.z); // margen basado en el collider box
    
    // Aplicar límites en X
    if (p_pos.x < -worldLimit + margin) {
        p_pos.x = -worldLimit + margin;
    } else if (p_pos.x > worldLimit - margin) {
        p_pos.x = worldLimit - margin;
    }
    
    // Aplicar límites en Z
    if (p_pos.z < -worldLimit + margin) {
        p_pos.z = -worldLimit + margin;
    } else if (p_pos.z > worldLimit - margin) {
        p_pos.z = worldLimit - margin;
    }

    // Evitar atravesar el suelo
    const minY = colliderHalfSize.y; // usar la altura del collider como altura mínima
    if (p_pos.y < minY) p_pos.y = minY;

    // Actualizar personaje
    if (personaje) {
        personaje.rotation.order = "YXZ";
        personaje.rotation.y = angulo_y;
        personaje.rotation.x = angulo_x;
        personaje.rotation.z = angulo_z; // Aplicar banking (inclinación lateral)
        personaje.position.copy(p_pos);
    }

    // Actualizar cámara con detección de oclusión
    updateCamera();
    
    // Actualizar indicador del minimapa (optimizado: cada 3 frames)
    miniMapUpdateCounter++;
    if (miniMapUpdateCounter % 3 === 0) {
        updateMiniMapIndicator();
        // NPCs especiales eliminados - updateSpecialNPCIndicators ya no es necesario
    }
}

function updateMiniMapIndicator() {
    if (!miniMapIndicator) return;
    
    // Límites del minimapa (basado en la cámara ortográfica: -200 a 200, 4 veces mayor)
    const mapMin = -200;
    const mapMax = 200;
    
    // Clonar posición del personaje
    let indicatorX = p_pos.x;
    let indicatorZ = p_pos.z;
    
    // Clamp (limitar) la posición a los bordes del minimapa
    indicatorX = Math.max(mapMin, Math.min(mapMax, indicatorX));
    indicatorZ = Math.max(mapMin, Math.min(mapMax, indicatorZ));
    
    // Actualizar posición del indicador
    miniMapIndicator.position.x = indicatorX;
    miniMapIndicator.position.z = indicatorZ;
    
    // Aplicar rotaciones en el orden correcto
    // Primero rotamos en Y para que siga al personaje, luego inclinamos en X
    miniMapIndicator.rotation.order = "YXZ";
    miniMapIndicator.rotation.y = angulo_y;
    miniMapIndicator.rotation.x = Math.PI / 2; // Mantener apuntando hacia abajo
}

//=============================================================================
// FUNCIONES DE RENDERIZADO
//=============================================================================

function render() {
    requestAnimationFrame(render);
    update();

    // Elegir cámara según vista activa
    const cameraActiva = vistaAereaActiva ? cameraAerea : camera;

    // vista 3d perspectiva (o vista aérea si está activada)
    renderer.autoClear = false;
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xa2a2f2));
    renderer.clear();
    renderer.render(scene, cameraActiva);

    // vista de arriba (minimapa) - solo si no está en vista aérea
    if (!vistaAereaActiva) {
        var ds = Math.min(window.innerHeight, window.innerWidth) / 4;
        renderer.setViewport(0, 0, ds, ds);
        renderer.setScissor(0, 0, ds, ds);
        renderer.setScissorTest(true);
        renderer.setClearColor(new THREE.Color(0xaffff));
        renderer.clear();
        renderer.setScissorTest(false);
        renderer.render(scene, cameraTop);
    }
}

//=============================================================================
// EVENT LISTENERS - CONFIGURACIÓN DE EVENTOS
//=============================================================================

// Event listeners para controles del juego
document.addEventListener('keydown', (event) => {
    // Activar audio context en primera interacción
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Marcar la tecla como presionada
    keysPressed[event.code] = true;
    
    switch (event.code) {
        case 'ArrowUp':
            controls.moveUp = true;
            event.preventDefault(); // Evitar scroll de página
            break;
        case 'ArrowDown':
            controls.moveDown = true;
            event.preventDefault(); // Evitar scroll de página
            break;
        case 'ArrowLeft':
            controls.moveLeft = true;
            event.preventDefault(); // Evitar scroll de página
            break;
        case 'ArrowRight':
            controls.moveRight = true;
            event.preventDefault(); // Evitar scroll de página
            break;
        case 'KeyS':
            // Sprint - detectar cuando se empieza a presionar S
            if (!sprintKeyPressed) {
                sprintKeyPressed = true;
                sprintKeyStartTime = Date.now();
            }
            break;
        case 'KeyD':
            // Cagar - iniciar cagamiento continuo si no está activo
            if (!cacaContinuaInterval && !cacaAutomaticaActiva) {
                // Crear caca inmediatamente
                crearCaca();
                // Iniciar cagamiento continuo cada 100ms (10 cacas por segundo)
                cacaContinuaInterval = setInterval(() => {
                    if (keysPressed['KeyD'] && !cacaAutomaticaActiva) {
                        crearCaca();
                    } else {
                        // Si la tecla D no está presionada o hay diarrea, parar
                        clearInterval(cacaContinuaInterval);
                        cacaContinuaInterval = null;
                    }
                }, 100);
            }
            break;
        case 'Space':
            // Vista aérea - activar mientras se mantiene presionado
            if (!vistaAereaActiva) {
                vistaAereaActiva = true;
            }
            event.preventDefault(); // Evitar scroll de página
            break;
    }
});

document.addEventListener('keyup', (event) => {
    // Marcar la tecla como no presionada
    keysPressed[event.code] = false;
    
    switch (event.code) {
        case 'ArrowUp':
            controls.moveUp = false;
            event.preventDefault();
            break;
        case 'ArrowDown':
            controls.moveDown = false;
            event.preventDefault();
            break;
        case 'ArrowLeft':
            controls.moveLeft = false;
            event.preventDefault();
            break;
        case 'ArrowRight':
            controls.moveRight = false;
            event.preventDefault();
            break;
        case 'KeyS':
            // Sprint - cuando se suelta S, marcar el tiempo para regeneración
            if (sprintKeyPressed) {
                sprintKeyPressed = false;
                lastSprintTime = Date.now();
            }
            break;
        case 'KeyD':
            // Parar el cagamiento continuo cuando se suelta D
            if (cacaContinuaInterval) {
                clearInterval(cacaContinuaInterval);
                cacaContinuaInterval = null;
            }
            break;
        case 'Space':
            // Vista aérea - desactivar cuando se suelta
            if (vistaAereaActiva) {
                vistaAereaActiva = false;
            }
            event.preventDefault(); // Evitar scroll de página
            break;
    }
});

// Configurar eventos del menú cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar configuración desde localStorage
    const sonidos = localStorage.getItem('configSonidos');
    const fotos = localStorage.getItem('configFotos');
    if (sonidos !== null) configSonidosActivados = sonidos === 'true';
    
    // Solo cargar configuración de fotos si está disponible desde código
    if (imagenesDNPCsDisponibles && fotos !== null) {
        configFotosActivadas = fotos === 'true';
    }
    
    // Eventos del menú principal
    document.getElementById('botonJugar').addEventListener('click', iniciarJuego);
    document.getElementById('botonConfiguracion').addEventListener('click', () => {
        // Ocultar menú principal
        document.getElementById('menuPrincipal').style.display = 'none';
        // Mostrar menú de configuración
        document.getElementById('menuConfiguracion').style.display = 'flex';
        // Cargar configuración actual en los checkboxes
        document.getElementById('configSonidos').checked = configSonidosActivados;
        
        // Solo mostrar/configurar la opción de fotos si está disponible desde código
        if (imagenesDNPCsDisponibles) {
            document.getElementById('configFotos').checked = configFotosActivadas;
            document.getElementById('configFotos').parentElement.style.display = 'block';
        } else {
            document.getElementById('configFotos').parentElement.style.display = 'none';
        }
    });
    document.getElementById('botonPersonajes').addEventListener('click', mostrarPersonajes);
    
    // Eventos del menú de personajes
    document.getElementById('flechaIzquierda').addEventListener('click', cambiarPersonajeIzquierda);
    document.getElementById('flechaDerecha').addEventListener('click', cambiarPersonajeDerecha);
    document.getElementById('botonSeleccionar').addEventListener('click', seleccionarPersonaje);
    document.getElementById('botonVolverPersonajes').addEventListener('click', () => {
        // Ocultar menú de personajes
        document.getElementById('menuPersonajes').style.display = 'none';
        // Mostrar menú principal
        document.getElementById('menuPrincipal').style.display = 'flex';
    });
    
    // Eventos del menú de configuración
    document.getElementById('botonGuardarConfig').addEventListener('click', () => {
        configSonidosActivados = document.getElementById('configSonidos').checked;
        
        // Solo cambiar configuración de fotos si está disponible desde código
        if (imagenesDNPCsDisponibles) {
            configFotosActivadas = document.getElementById('configFotos').checked;
            localStorage.setItem('configFotos', configFotosActivadas);
        }
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('configSonidos', configSonidosActivados);
        // Ocultar menú de configuración
        document.getElementById('menuConfiguracion').style.display = 'none';
        // Mostrar menú principal
        document.getElementById('menuPrincipal').style.display = 'flex';
    });
    document.getElementById('botonVolverConfig').addEventListener('click', () => {
        // Ocultar menú de configuración
        document.getElementById('menuConfiguracion').style.display = 'none';
        // Mostrar menú principal
        document.getElementById('menuPrincipal').style.display = 'flex';
    });
});