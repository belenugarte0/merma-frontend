import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Rectangulo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Crear la escena
    const scene = new THREE.Scene();

    // Crear la cámara ortográfica para gráficos 2D
    const camera = new THREE.OrthographicCamera(-40, 40, 40, -40, 0.1, 1000);
    camera.position.z = 5; // Posicionar la cámara para ver el rectángulo

    // Crear el renderizador con fondo verde
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Con transparencia
    renderer.setSize(400, 540); // Tamaño del área donde se renderiza el rectángulo

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Crear un margen negro alrededor del rectángulo
    const marginGeometry = new THREE.PlaneGeometry(72, 75); // Margen un poco más grande que el rectángulo
    const marginMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }); // Color negro
    const margen = new THREE.Mesh(marginGeometry, marginMaterial); // Crear la malla del margen
    
    // Material para el rectángulo (blanco)
    const rectanguloGeometry = new THREE.PlaneGeometry(70, 73); // Dimensiones del rectángulo (ancho x alto)
    const rectanguloMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // Color blanco
    const rectangulo = new THREE.Mesh(rectanguloGeometry, rectanguloMaterial); // Crear la malla del rectángulo

    // Posicionar el rectángulo centrado
    rectangulo.position.z = 0.1; // Elevar un poco para asegurarse de que el rectángulo esté encima del margen

    // Añadir el margen y el rectángulo a la escena
    scene.add(margen); // Agregar el margen a la escena
    scene.add(rectangulo); // Agregar el rectángulo a la escena

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup al desmontar el componente
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};
