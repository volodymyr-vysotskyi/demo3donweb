const modelsSetup = {
    "robot": {
        "setPath": "./assets/robot/",
        "mtl": "robot.mtl",
        "obj": "robot.obj",
        "cameraPosition": 150
    },
    "chair": {
        "setPath": "./assets/chair_demo/",
        "mtl": "guest_chair_1008_source.mtl",
        "obj": "guest_chair_1008_source.obj",
        "cameraPosition": 150
    }
};

//Controls
const controlsSetup = (controls) => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
};

// Lights
const light1 = (scene) => {
    const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
};

const light2 = (scene) => {
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(10, 0.5, 2);
    dirLight.position.multiplyScalar(20);
    dirLight.name = "dirlight";
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 768;//4096;
    dirLight.shadow.mapSize.height = 768; //4096;
    dirLight.shadow.camera.near = -10;
    dirLight.shadow.camera.far = 200;
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambLight);
};

const light3 = (scene) => {
    const ambientLight = new THREE.AmbientLight(new THREE.Color('hsl(27,99%,62%)'));
    scene.add(ambientLight);

    function makeLight(color){
        var light = new THREE.PointLight( color || 0xFFFFFF , 1, 0 );

        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 120;
        light.shadow.bias = 0.9;
        light.shadow.radius = 5;

        light.power = 9;

        return light;
    }

    scene.add(makeLight(new THREE.Color('hsl(357,100%,51%)')));
};

// Loader
const loadersSetup = (mtlLoader, objLoader, modelSetup, scene, camera) => {
    mtlLoader.setTexturePath(modelSetup.setPath);
    mtlLoader.setPath(modelSetup.setPath);
    mtlLoader.load(modelSetup.mtl, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.setPath(modelSetup.setPath);
        objLoader.load(modelSetup.obj, (object) => {
            removeLoaderProgressIndicator();
            scene.add(object);
            // object.position.y -= 60;
        });
    });
};


// Indicator
const removeLoaderProgressIndicator = () => {
    const loader = document.getElementsByClassName('loader');
    if (loader[0]) {
        loader[0].remove();
    }
};

const addLoaderIndicator = () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    return loader;
};


// Add container
const addRendererToDOM = (renderer) => {
    const div = document.getElementById('viewer');

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    const loader = addLoaderIndicator();
    div.appendChild(loader);
    div.appendChild(renderer.domElement);
};

// Camera
const cameraSetup = (camera) => {
    camera.position.z = 200;
};

// Render
const renderSetup = (renderer) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const render = (model, light) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000000000000000);
    const renderer = new THREE.WebGLRenderer();

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    const mtlLoader = new THREE.MTLLoader();
    const objLoader = new THREE.OBJLoader();
    const modelSetup = modelsSetup[model];
    const lightSetupMap = {
        1: light1,
        2: light2,
        3: light3
    };

    scene.background = new THREE.Color(0x41acfa);

    cameraSetup(camera);
    renderSetup(renderer);
    addRendererToDOM(renderer);

    controlsSetup(controls);

    lightSetupMap[light](scene);

    loadersSetup(mtlLoader, objLoader, modelSetup, scene, camera);

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
};

render('chair', 1);
