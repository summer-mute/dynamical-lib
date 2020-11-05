import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

function main(){
    const canvas = document.querySelector('#animation');
    const renderer = new THREE.WebGLRenderer({canvas});

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z=120;

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const objects = [];
    const spread = 15;
    
    function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    
    scene.add(obj);
    objects.push(obj);
    }

    function createMaterial() {
        const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        });
    
        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;
        material.color.setHSL(hue, saturation, luminance);
    
        return material;
    }

    function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
    }

    {
        const width = 8;
        const height = 8;
        const depth = 8;
        addSolidGeometry(-2, 2, new THREE.BoxBufferGeometry(width, height, depth));
      }
      {
        const radius = 7;
        const segments = 24;
        addSolidGeometry(-1, 2, new THREE.CircleBufferGeometry(radius, segments));
      }
      {
        const radius = 6;
        const height = 8;
        const segments = 16;
        addSolidGeometry(0, 2, new THREE.ConeBufferGeometry(radius, height, segments));
      }
      {
        const radiusTop = 4;
        const radiusBottom = 4;
        const height = 8;
        const radialSegments = 12;
        addSolidGeometry(1, 2, new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments));
      }
      {
        const radius = 7;
        addSolidGeometry(2, 2, new THREE.DodecahedronBufferGeometry(radius));
      }

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      function render(time) {
        time *= 0.001;
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
    
        objects.forEach((obj, ndx) => {
          const speed = .1 + ndx * .05;
          const rot = time * speed;
          obj.rotation.x = rot;
          obj.rotation.y = rot;
        });
    
        renderer.render(scene, camera);
    
        requestAnimationFrame(render);
      }
    
      requestAnimationFrame(render);
}

main();