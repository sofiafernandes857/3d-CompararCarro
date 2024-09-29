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
        'pneu': `<ul><strong>Fórmula E</strong>
        <li>Os carros da Fórmula E utilizam o mesmo pneu, chamado de Michelin Pilot Sport EV.</li><li>Esse tipo de pneu é feito para todo tipo de clima, não necessitando a troca de pneus para pista seca ou para molhada.</li><li>Tem uma maior eficiência energética.</li><li>Durabilidade, podendo utilizar o mesmo pneu a corrida inteira.</li><li>Sustentáveis.</li></ul>`,
        'motor': `<ul><strong>Fórmula E</strong>
        <li>Cada equipe pode escolher o motor que deseja utilizar</li><li>Os motores utilizados são projetados para máxima eficiência e potência, podendo chegar a 350 kW</li><li>Cada equipe pode projetar sua própria unidade de potência, que inclui o motor elétrico, a transmissão e o sistema de controle, permitindo uma variedade de abordagens e inovações tecnológicas.</ul>`,
        'chassi': `<ul><strong>Fórmula E</strong>
        <li>O GEN3 usa o chassi fabricado pela Dallara com materiais compostos, como fibra de carbono.</li><li>Ele acomoda as unidades de potência elétricas, baterias e sistemas de controle, proporcionando um pacote otimizado para as corridas.<li>Tem um comprimento de 5 metros de comprimento e 1,7 metros de largura</li> </ul>`,
        'velocidade': `<ul><strong>Fórmula E</strong><li>O Gen3 pode chegar a uma velocidade de 322 km/h</li><li> Vai de o a 100km/h em 1,86 segundos</li></ul>`,
        'comprimento': `<ul><strong>Fórmula E</strong>
        <li>Comprimento: 5 metros</li><li>Largura: 1,7 metros</li><li>Altura: 1,2 metros</li></ul>`,
        'potencia': `<ul><strong>Fórmula E</strong>
        <li>O Gen3 possui uma potência de 350 kW feita pelo motor.</li><li>Mas essa potência pode aumentar para 600 kW por conta da recuperação de energia pelos freios.</li></ul>`,
        'peso': `<ul><strong>Fórmula E</strong>
        <li>O Gen3 pesa aproximadamente 850kg</li></ul>`,
        'bateria': `<ul><strong>Fórmula E</strong>
        <li>Os carros utilizam baterias de íon de lítio que são projetadas especificamente para as demandas das corridas elétricas.</li><li>O Gen3 introduziu baterias com uma capacidade de 66 kWh.</li><li> Aumenta a potência e a eficiência, permitindo velocidades mais altas e melhor desempenho em corridas.</li><li>A Fórmula E tem um forte foco em sustentabilidade, e as baterias são projetadas para serem mais eficientes e com menor impacto ambiental.</li></ul>`,
        'software': `<ul><strong>Fórmula E</strong><li>O software é extremamente importante para a FE principalmente para a equipe desenvolver uma estratégia com o piloto para um melhor desempenho durante a corrida. Outros são:</li><li>Telemetria</li><li>Gerenciamento de energia</li><li>Estratégia de corrida</li><li>Análise de desempenho</li><li>Comunicação</li><li>Simulações e desenvolvimento</li><li>Controle de pistas</li><li>Segurança</li></ul>`,
        'padronizacao': `<ul><strong>Fórmula E</strong><li>95% de todos os componentes do carro da FE são exatamente os mesmos para todas as equipes.</li><li></li>Isso é um diferencial muito grande na Fórmula E, por conta que a vitória vai ao piloto que tiver a melhor estratégia e habilidade para aquela corrida.</ul>`,
        'tecnologia': `<ul><strong>Fórmula E</strong><li>A Fórmula E é considerada o laboratório de tecnologias para as fabricantes de carros.</li><li>É nesta corrida que as marcas testam suas novas tecnologias para levar para os carros de rua e conseguir ao longo dos anos, deixar um trânsito mais sustentável para o planeta.</li></ul>`
    };
  
    const carContentsRight = {
        'pneu': `<ul><strong>Fórmula 1</strong>
        <li>Os carros da Fórmula 1 utilizam diferentes tipos de pneus durante a corrida, fornecidos pela Pirelli.</li><li>Para pista seca, são divididos em 5 tipos, do C1 ao C5, sendo o C1 o mais duro e o C5 o mais macio.</li><li>Para pista molhada, existem dois tipos, intermediários e wets.</li><li>Possuem cores diferentes para facilitar a identificação de cada tipo de pneu.</li></ul>`,
        'motor': `<ul><strong>Fórmula 1</strong>
        <li>Os motores são motores de combustão interna de 1.6 litros V6 turboalimentados, com sistemas híbridos. Isso significa que eles combinam um motor a gasolina com um sistema elétrico.</li><li>Cada motor é chamado de "Unidade de Potência" (PU) e inclui o motor de combustão interna (ICE), um sistema de recuperação de energia cinética (ERS), um gerador de motor elétrico (MGU-K) e um gerador de calor (MGU-H).</li></ul>`,
        'chassi': `<ul><strong>Fórmula 1</strong>
        <li> Cada equipe desenvolve um chassi único que é otimizado para o desempenho de seu motor, sistema de suspensão e aerodinâmica </li><li>Geralmente são feitos de fibra de carbono</li><li>Precisa ter um comprimento mínimo de 3,6 metros e uma largura máxima de 2 metros</li></ul>`,
        'velocidade': `<ul><strong>Fórmula 1</strong>
        <li>Pode chegar a uma velocidade de 329 km/h</li><li>Vai de o a 100km/h em 2,8 segundos</li></ul>`,
        'comprimento': `<ul><strong>Fórmula 1</strong>
        <li>Comprimento: variam entre 4 metros e 4,5 metros</li><li>Largura: no máximo 2 metros</li><li>Altura: Varia entre 0,95 metros e 1,2 metros</li></ul>`,
        'potencia': `<ul><strong>Fórmula 1</strong>
        <li>Possui uma potência de 750 cv feita pelo motor.</li><li>Essa potência pode chagar a 1 050 cv pela regenação de energia.</li></ul>`,
        'peso': `<ul><strong>Fórmula 1</strong>
        <li>Um carro de Fórmula 1 pesa aproximadamente 798kg</li></ul>`,
        'bateria': `<ul><strong>Fórmula 1/strong><li>A capacidade da bateria varia dependendo do fabricante e do design específico, mas geralmente é em torno de 4 a 5 kWh. Essa capacidade é suficiente para armazenar energia recuperada durante a frenagem e fornecê-la para o sistema elétrico do carro.</li></ul>`,
        'software': `<ul><strong>Fórmula 1</strong><li>Telemetria</li><li>Gerenciamento de energia</li><li>Design</li><li>Análise de desempenho</li><li>Comunicação</li><li>Simulações e desenvolvimento</li><li>Controle de pistas</li><li>Segurança</li></ul>`,
        'padronizacao': `<ul><strong>Fórmula 1</strong><li>Por mais que exista uma regulamentação sobre chassi, motor, pneu e outros, a os carros da F1 não são padronizados, fazendo que a maior parte da vitória seja por quem melhor constuiu o carro.</li></ul>`,
        'tecnologia': `<ul><strong>Fórmula 1</strong><li>No passado, a F1 foi um laboratório para novas tecnologias automotivas, entretanto isso já não é mais uma verdade.</li><li>Com o crescente debate sobre um mundo mais sustentável, muitos países vão até proibir a fabricação de carros a combustão, por ser um automóvel altamente poluente.</li></ul>`
    };
    
    window.showPopup = function (carModel) {
        const contentLeft = carContentsLeft[carModel];
        const contentRight = carContentsRight[carModel];
        if (contentLeft && contentRight) {
        document.getElementById('popup-text1').innerHTML = contentLeft;
        document.getElementById('popup1').style.display = 'block';
        document.getElementById('popup-text2').innerHTML = contentRight;
        document.getElementById('popup2').style.display = 'block';
      } else {
        document.getElementById('popup-text1').innerHTML = 'Conteúdo não encontrado.';
        document.getElementById('popup1').style.display = 'block';
        document.getElementById('popup-text2').innerHTML = 'Conteúdo não encontrado.';
        document.getElementById('popup2').style.display = 'block';
      }
    };
    
    window.closePopups = function (popupId) {
        document.getElementById('popup1').style.display = 'none';
        document.getElementById('popup2').style.display = 'none';
    };
      
      
});
