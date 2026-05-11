document.addEventListener('DOMContentLoaded', async () => {

    // --- Тема (все кнопки с классом .theme-toggle-btn) ---
    const themeIcos = document.querySelectorAll('.theme-ico');

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcos.forEach(ico => {
            ico.src = isDark ? 'images/light.svg' : 'images/dark.svg';
        });
    };

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (themeToggleBtns.length) {
        if (localStorage.getItem('theme') === 'dark') {
            applyTheme(true);
        }
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(!document.body.classList.contains('dark'));
            });
        });
    }

    // --- Бургер ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            mobileBtn.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
        });

        // Закрыть при клике вне меню
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileBtn.textContent = '☰';
            }
        });
    }

    // --- Слайдер ---
    const track = document.getElementById('slider-track');
    if (track) {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        let currentIndex = 0;

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateSlider();
        });
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateSlider();
        });
    }

    // --- Калькулятор ---
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        const modelSelect = document.querySelector('#model');
        const inputText = document.querySelector('#input-text');
        const webSearch = document.querySelector('#web-search');
        const resultOutput = document.querySelector('#result');
        const rubOutput = document.querySelector('#rubles');

        const NEURON_PRICE = 0.004;
        const MARKUP = 1.15;
        const M_TOKENS = 1000000;
        const RUB_RATE = 0.5;

        const modelData = {
            'ChatGPT 5.4 Pro':    { in: 31.5,  out: 189,   web: 0.0105, type: 'token' },
            'ChatGPT 5.4':        { in: 2.625, out: 15.75, web: 0.0105, type: 'token' },
            'ChatGPT 5.2 Pro':    { in: 44.1,  out: 352.8, web: 0,      type: 'token' },
            'ChatGPT 5.3 Chat':   { in: 1.837, out: 14.7,  web: 0.105,  type: 'token' },
            'Gemini 3.1 Pro':     { in: 4.2,   out: 25.2,  web: 0,      type: 'token' },
            'Gemini 3 Flash':     { in: 1.05,  out: 6.3,   web: 0,      type: 'token' },
            'Nano Banana Pro':    { fixed: 80,             type: 'fixed' },
            'Nano Banana 2':      { fixed: 25,             type: 'fixed' },
            'Kling 2.6 Pro':      { fallback: 0.91,        type: 'fallback' },
            'Sora 2':             { fallback: 1.04,        type: 'fallback' },
            'Veo 3.1 Fast':       { fallback: 1.04,        type: 'fallback' },
            'LTXV 2 Fast':        { fallback: 0.3,         type: 'fallback' },
            'Kling 2.6 Pro I2V':  { fallback: 0.455,       type: 'fallback' },
            'Sora 2 I2V':         { fallback: 0.65,        type: 'fallback' },
            'Veo 3.1 Fast I2V':   { fallback: 1.04,        type: 'fallback' },
        };

        calcBtn.addEventListener('click', () => {
            const selectedModel = modelSelect.value;
            const data = modelData[selectedModel];
            if (!data) return;

            let neuron = 0;

            switch (data.type) {
                case 'token': {
                    const tokensIn = inputText.value.length * 1.3;
                    const tokensOut = 500;
                    const costInUsd = (tokensIn * data.in) / M_TOKENS;
                    const costOutUsd = (tokensOut * data.out) / M_TOKENS;
                    const currentWebPrice = webSearch.checked ? data.web : 0;
                    neuron = Math.ceil((costInUsd + costOutUsd + currentWebPrice) / NEURON_PRICE);
                    break;
                }
                case 'fixed':
                    neuron = data.fixed;
                    break;

                case 'fallback':
                    neuron = Math.ceil((data.fallback * MARKUP) / NEURON_PRICE);
                    break;
            }

            resultOutput.textContent = neuron;
            rubOutput.textContent = (neuron * RUB_RATE).toFixed(2);
        });
    }

    // --- Three.js (только на index.html, динамический импорт) ---
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        canvasContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 8);
        scene.add(ambientLight);

        const frontLight = new THREE.DirectionalLight(0xffffff, 5);
        frontLight.position.set(0, 0, 15);
        scene.add(frontLight);

        const topLight = new THREE.PointLight(0xff0033, 5);
        topLight.position.set(5, 5, 5);
        scene.add(topLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;

        const loader = new GLTFLoader();
        loader.load('models/gpu.glb', (gltf) => {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            scene.add(model);
            camera.position.z = 7;

            function animate() {
                requestAnimationFrame(animate);
                model.rotation.y += 0.005;
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        });

        const updateSize = () => {
            const w = canvasContainer.clientWidth;
            const h = canvasContainer.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', updateSize);
    }
});