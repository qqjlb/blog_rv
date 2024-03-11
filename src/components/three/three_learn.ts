import * as THREE from "three";


const creartMode = ()=>{
    const str_vertexShader=`
    void main() 
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+10.0, position.y, position.z+5.0, 1.0);
    }`;
    const str_fragmentShader = `
    void main() 
    {
        gl_FragColor = vec4(0.0, 0.58, 0.86, 1.0);
    }`;
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xDDDDDD, 1);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);

    camera.position.z = 50;
    scene.add(camera);
    var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    var shaderMaterial = new THREE.ShaderMaterial( {
        vertexShader: str_vertexShader,
        fragmentShader: str_fragmentShader
    });
    var cube = new THREE.Mesh(boxGeometry, shaderMaterial);

    scene.add(cube);
    cube.rotation.set(0.4, 0.2, 0);

    let currentAngle = 0;
    let lastTimestamp = Date.now();
    let px = 0;
    function animate() {
        // 记下时间，拿到现在的时间戳，因为每次requestAnimationFrame间隔时间是不知道的
        const now = Date.now();
        // 减去老的时间戳
        const duration = now - lastTimestamp;
        lastTimestamp = now;
        // 想要requestAnimationFrame间隔时间内转180度
        currentAngle = currentAngle + duration / 1000 * Math.PI;
        px=px + duration / 1000;
        if(px>2)
        px=0
    }

    function render() {
        animate();
        // cube.rotation.set(0, currentAngle, 0);
        cube.position.x=px;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}

export default creartMode;