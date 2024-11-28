import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

const Plate: React.FC = () => {
  const plateContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!plateContainerRef.current) return;

    // Crear escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Habilitar transparencia

    // Establecer el tamaño del renderizador para que ocupe todo el contenedor
    renderer.setSize(plateContainerRef.current.clientWidth, plateContainerRef.current.clientHeight);
    plateContainerRef.current.appendChild(renderer.domElement);
    
    // Cambiar el color de fondo de la escena a transparente
    renderer.setClearColor(0xaaaaaa, 0); // Color de fondo gris con transparencia

    // Crear la geometría y material de la placa
    const plateWidth = 5; // Ancho de la placa
    const plateHeight = 4; // Alto de la placa
    const geometry = new THREE.PlaneGeometry(plateWidth, plateHeight);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plate = new THREE.Mesh(geometry, material);
    scene.add(plate);

    // Rotar la placa para que quede horizontal
    plate.rotation.x = -Math.PI / 2;

    // Posicionar la cámara
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Agregar controles de órbita para rotar y mover la cámara
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Activar el suavizado
    controls.dampingFactor = 0.25; // Factor de suavizado

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Actualizar controles
      renderer.render(scene, camera);
    };

    // Iniciar la animación
    animate();

    // Cleanup cuando el componente se desmonta
    return () => {
      if (plateContainerRef.current) {
        plateContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={plateContainerRef}
      style={{
        width: '850px',
        height: '530px',
        position: 'relative',
        backgroundColor: 'transparent', // Hacer que el contenedor sea transparente
        borderRadius: '15px', // Ajustar según desees
        overflow: 'hidden', // Ocultar el desbordamiento
      }} 
    />
  );
};

export default Plate;
