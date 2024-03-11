import * as THREE from "three";


const triangle = () => {

    // 定义宽高
    const width = 400;
    const height = 400;

    const canvas = document.createElement("canvas")
    if(!canvas) return
    document.body.appendChild(canvas)


    // WebGLRenderer如果不传参数不会把dom元素和最终渲染出来的屏幕上的html上的dom元素相关联,那种情况就需要把domElement,append到body上，才能有相关画布出现
    let renderer = new THREE.WebGLRenderer({canvas});
    // 绘制场景，在scene中维护在场景中渲染的物体
    let scene = new THREE.Scene();
    // 使用正交相机（没有透视效果，适合我们这次的平面三角形）,正交相机需要定义上下左右前后的坐标情况，从而规定正交相机所能截取到的相关的平面空间中，物体的情况（视角空间的截取）
    let camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000)
    // 黑色背景，透明度1.0
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    // renderer大小
    renderer.setSize(400, 400);

    // 在three.js官网可查看，有很多预定义的geometry，但是没有三角形，我们可以通过shapeGeometry来绘制
    let triangleShape = new THREE.Shape();
    // 将绘制起始点移动到（const0， 100）这个位置
    triangleShape.moveTo(0, 100);
    // 开始划线
    triangleShape.lineTo(-100, -100);
    triangleShape.lineTo(100, -100);
    triangleShape.lineTo(0, 100);
    // 定义几何体
    const geometry = new THREE.ShapeGeometry(triangleShape);
    // 定义材质，三角形只是基本图形，不需要光照
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        // 默认是一面的(只渲染法向量所对应那一面)，定义为DoubleSide，将正反面都渲染出来
        side: THREE.DoubleSide
    });
    // 第一个参数geometry，是我们之前定义的几何体的坐标情况，就很像之前的webGl中顶点着色器传入的顶点序列，不涉及颜色信息，只是定义几何体形状
    // 第二个参数material, 很像webGl中片段着色器中的，给顶点序列上色
    let mesh = new THREE.Mesh(geometry, material);
    // 设置mesh在scene中的位置
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 1;
    scene.add(mesh);
    // 相机沿着z轴负方向望进去，所以把相机设置在了原点
    // 设置位置直接通过position，要比原生webGl去修改往顶点着色器传的数据要方便很多
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    // camera从（0, 0, 0）的位置望向（0，0，1）
    camera.lookAt(new THREE.Vector3(0, 0, 1));

    let currentAngle = 0;
    let lastTimestamp = Date.now();

    function animate() {
        // 记下时间，拿到现在的时间戳，因为每次requestAnimationFrame间隔时间是不知道的
        const now = Date.now();
        // 减去老的时间戳
        const duration = now - lastTimestamp;
        lastTimestamp = now;
        // 想要requestAnimationFrame间隔时间内转180度
        currentAngle = currentAngle + duration / 1000 * Math.PI;
    }

    function render() {
        animate();
        // mesh 绕 y 轴旋转 currentAngle 角度
        // mesh.rotation.set(0, currentAngle, 0);
        // 渲染
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
    
    return <div>
        sss
        <canvas></canvas>
    </div>
}

export default triangle