import React, { useEffect, useRef, useState } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cubeGeometry = new Three.BoxGeometry(5, 5, 5);

function Cube3D({ canvasDataURL }) {
  const [scene, setScene] = useState(null);
  const [cube, setCube] = useState(null);

  const cubeRef = useRef();

  useEffect(() => {
    const scene = new Three.Scene();
    setScene(scene);

    const camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ alpha: true, antialias: true });
    const redMaterial = new Three.MeshBasicMaterial({
      color: 0xff0000
    });

    const redCube = new Three.Mesh(cubeGeometry, redMaterial);
    setCube(redCube);
    scene.add(redCube);

    camera.position.z = 5;
    renderer.setSize(300, 300);
    renderer.shadowMap.enabled = true;

    cubeRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const light = new Three.SpotLight(0xffffff);
    light.position.set(5, 10, 10);
    light.castShadow = true;
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  useEffect(() => {
    if (cube && canvasDataURL) {
      const textureLoader = new Three.TextureLoader();
      const newTexture = textureLoader.load(canvasDataURL);
      cube.material.map = newTexture;
      cube.material.needsUpdate = true;
    }
  }, [canvasDataURL, cube]);

  return <div ref={cubeRef} />;
}

export default Cube3D;
