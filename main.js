document.addEventListener("DOMContentLoaded", function() {
    // Criar cena
    const container = document.getElementById('container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF); // Cor do fundo

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const isMobile = window.innerWidth <= 768; // Define se o dispositivo é móvel
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024; // Define se o dispositivo é tablet

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8); // Ajustar altura
    container.appendChild(renderer.domElement);

    // Adicionar controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false; 
    controls.target.set(0, 0, 0); // Mude o alvo para (0, 0, 0)

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0x404040); 
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1); 
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-5, 5, 5).normalize(); 
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(5, -5, 5).normalize(); 
    scene.add(light3);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100); 
    pointLight.position.set(0, 2, 0); 
    scene.add(pointLight);

    // Carregar os modelos glb
    const gltfLoader = new THREE.GLTFLoader();
    let carro1, carro2; 

    // Aplicar cor ao material do carro
    function applyLightColor(car, color) {
        car.traverse((node) => {
            if (node.isMesh) {
                node.material.color.set(color);
                node.material.needsUpdate = true; 
            }
        });
    }

    // Carregar o primeiro carro
    gltfLoader.load('models/carro_cheio.glb', function(gltf) {
        console.log('glTF do carro 1 carregado');
        carro1 = gltf.scene; 
        carro1.scale.set(0.1, 0.1, 0.1); // Ajustar a escala

        // Ajustar a posição dependendo se é móvel, tablet ou não
        if (isMobile) {
            carro1.position.set(-1.5, -1, 0); // Posição mais adequada para visualização de cima
            carro1.scale.set(0.05, 0.05, 0.05); // Ajustar a escala
        } else if (isTablet) {
            carro1.position.set(-3.5, -2, 0); // Ajustar para tablet
            carro1.scale.set(0.09, 0.09, 0.09); // Ajustar a escala
        } else {
            carro1.position.set(-5, -1, 0); // Lado a lado no desktop
            carro1.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
        }

        // Rotação inicial
        carro1.rotation.y = 0; // Em radianos

        // Aplicar cor no carro 
        applyLightColor(carro1, 0x87CEEB); 

        // Adicionar carro à cena
        scene.add(carro1);

        // Carregar o segundo carro
        gltfLoader.load('models/formula1_cheio.glb', function(gltf) {
            console.log('glTF do carro 2 carregado');
            carro2 = gltf.scene; 

            // Ajustar a posição dependendo se é móvel, tablet ou não
            if (isMobile) {
                carro2.position.set(1.5, -1, 0); // Ajustar para visualização de cima
                carro2.scale.set(0.01, 0.01, 0.01); // Ajustar a escala
            } else if (isTablet) {
                carro2.position.set(2.5, -2, 0); // Ajustar para tablet
                carro2.scale.set(0.02, 0.02, 0.02); // Ajustar a escala
            } else {
                carro2.position.set(3, -1, 0); // Lado a lado no desktop
                carro2.scale.set(0.025, 0.025, 0.025); // Ajustar a escala
            }

            // Rotação inicial
            carro2.rotation.y = 0; // Em radianos

            // Aplicar cor no carro
            applyLightColor(carro2, 0xFFCCCB); 

            // Adicionar carro à cena
            scene.add(carro2);

            // Remover indicador de carregamento
            document.getElementById('loading').style.display = 'none';

            // Função de animação
            function animate() {
                requestAnimationFrame(animate);
                controls.update(); 
                renderer.render(scene, camera);
            }

            animate();
        }, undefined, function(error) {
            console.error('Erro ao carregar o modelo do carro 2:', error);
            document.getElementById('loading').textContent = 'Erro ao carregar o modelo do carro 2.';
        });
    }, undefined, function(error) {
        console.error('Erro ao carregar o modelo do carro 1:', error);
        document.getElementById('loading').textContent = 'Erro ao carregar o modelo do carro 1.';
    });

    // Ajustar tamanho 
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight * 0.8; 
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Ajustar posição da câmera
    if (isMobile) {
        camera.position.set(0, 3, 0); // Posição acima para celular
        controls.minDistance = 9; 
        controls.maxDistance = 15;
    } else if (isTablet) {
        camera.position.set(0, 1.8, 4); // Posição para tablet
        controls.minDistance = 15; 
        controls.maxDistance = 25;
    } else {
        camera.position.set(0, 2, 5); // Posição para desktop
        controls.minDistance = 15; // Distância mínima
        controls.maxDistance = 30; // Distância máxima
    }

    const carContentsLeft = {
        'pneu': 'Todos os carros da Fórmula E utilizam o mesmo pneu, chamado de Michelin Pilot Sport EV.\nEsse tipo de pneu é feito para todo tipo de clima, não necessitando a troca de pneus para pista seca ou para pista molhada',
        'motor': 'Motor formula E',
        'chassi': 'Chassi formula E',
        'velocidade': 'O carro da Fórmula E,  o GEN3, pode chegar a 322 km/h. \nO GEN3 vai de 0 a 100 km/h em 2,8 segundos!',
        'comprimento': 'Comprimento formula E',
        'potencia': 'Potência formula E',
        'peso': 'Peso formula E',
        'eficiencia': 'Eficiência formula E',
        'bateria': 'Bateria formula E',
        'software': 'Software formula E',
        'performance': 'Performance formula E',
        'padronizacao': 'Padronizacao formula E',
        'tecnologia': 'Laboratório formula E',
        'estrategia': 'Estratégia formula E'
    };
  
    const carContentsRight = {
        'pneu': 'Pneu formula 1',
        'motor': 'Motor formula 1',
        'chassi': 'Chassi formula 1',
        'velocidade': 'O carro da Fórmula 1, pode chegar a uma velocidade de 329km/h, \nchegando de 0 a 100 km/h em 2,8 segundos.',
        'comprimento': 'Comprimento formula 1',
        'potencia': 'Potência formula 1',
        'peso': 'Peso formula 1',
        'eficiencia': 'Eficiência formula 1',
        'bateria': 'Bateria formula 1',
        'software': 'Software formula 1',
        'performance': 'Performance formula 1',
        'padronizacao': 'Padronizacao formula 1',
        'tecnologia': 'Laboratório formula 1',
        'estrategia': 'Estratégia formula 1'
    };
    
    window.showPopup = function (carModel) {
        const contentLeft = carContentsLeft[carModel];
        const contentRight = carContentsRight[carModel];
        if (contentLeft && contentRight) {
        document.getElementById('popup-text1').innerText = contentLeft;
        document.getElementById('popup1').style.display = 'block';
        document.getElementById('popup-text2').innerText = contentRight;
        document.getElementById('popup2').style.display = 'block';
      } else {
        document.getElementById('popup-text1').innerText = 'Conteúdo não encontrado.';
        document.getElementById('popup1').style.display = 'block';
        document.getElementById('popup-text2').innerText = 'Conteúdo não encontrado.';
        document.getElementById('popup2').style.display = 'block';
      }
    };
    
    window.closePopups = function (popupId) {
        document.getElementById('popup1').style.display = 'none';
        document.getElementById('popup2').style.display = 'none';
    };
      
      
});
