import { useEffect } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

//https://codepen.io/prisoner849/pen/zYeaaWr

const init = ()=>{
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 10, 10).setLength(17);
    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", event => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    })

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let gu = {
    time: {value: 0}
    }

    let params = {
    instanceCount: {value: 10},
    instanceLength: {value: 1.75},
    instanceGap: {value: 0.5},
    profileFactor: {value: 1.5}
    }

    let ig = new THREE.InstancedBufferGeometry().copy(new THREE.BoxGeometry(1, 1, 1, 100, 1, 1).translate(0.5, 0, 0));
    ig.instanceCount = params.instanceCount.value;

    let material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.uniforms.instanceCount = params.instanceCount;
        shader.uniforms.instanceLength = params.instanceLength;
        shader.uniforms.instanceGap = params.instanceGap;
        shader.uniforms.profileFactor = params.profileFactor;
        shader.vertexShader = `
        uniform float time;
        
        uniform float instanceCount;
        uniform float instanceLength;
        uniform float instanceGap;
        
        uniform float profileFactor;
        
        varying float noGrid;
        
        mat2 rot(float a){return mat2(cos(a), sin(a), -sin(a), cos(a));}
        
        ${shader.vertexShader}
        `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
        
            float t = time * 0.1;
            
            float iID = float(gl_InstanceID);
            
            float instanceTotalLength = instanceLength + instanceGap;
            float instanceFactor = instanceLength / instanceTotalLength;
            
            float circleLength = instanceTotalLength * instanceCount;
            float circleRadius = circleLength / PI2;
            
            float partAngle = PI2 / instanceCount;
            float boxAngle = partAngle * instanceFactor;

            float partTurn = PI / instanceCount;
            float boxTurn = partTurn * instanceFactor;
            
            float startAngle = t + partAngle * iID;
            float startTurn = t * 0.5 + partTurn * iID;
            
            float angleFactor = position.x;
            
            float angle = startAngle + boxAngle * angleFactor;
            float turn = startTurn + boxTurn * angleFactor;
            
            vec3 pos = vec3(0, position.y, position.z);
            pos.yz *= rot(turn);
            pos.yz *= profileFactor;
            pos.z += circleRadius;
            pos.xz *= rot(angle);
            
            transformed = pos;
            float nZ = floor(abs(normal.z) + 0.1);
            float nX = floor(abs(normal.x) + 0.1);
            noGrid = 1. - nX;
            vColor = vec3(nZ == 1. ? 0.1 : nX == 1. ? 0. : 0.01);
        `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
        varying float noGrid;
        
        float lines(vec2 coord, float thickness){
            vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / thickness;
            float line = min(grid.x, grid.y);
            return 1.0 - min(line, 1.0);
        }
        ${shader.fragmentShader}
        `.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
            
            float multiply = vColor.r > 0.05 ? 3. : 2.;
            float edges = lines(vUv, 3.);
            float grid = min(noGrid, lines(vUv * multiply, 1.));
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1), max(edges, grid));
        `
        )
        //console.log(shader.fragmentShader)
    }
    });
    material.defines = {"USE_UV": ""};

    let torus = new THREE.Mesh(ig, material);
    scene.add(torus)
    torus.rotation.z = -Math.PI * 0.25;

    let clock = new THREE.Clock();
    let t = 0;

    renderer.setAnimationLoop(()=>{
    let dt = clock.getDelta();
    t += dt;
    gu.time.value = t;
    controls.update();
    renderer.render(scene, camera);
    })
}


const useThreeX = () => {
    useEffect(()=>{init()},[])

    return <div className="tb">
        {/* <canvas className="bg" id="bg"/> */}
    </div>
}

export default useThreeX