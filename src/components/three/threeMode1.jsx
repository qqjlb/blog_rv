import "./threecss.css"

import * as T from "three"

const ThreeX = () => {
    // const canRef = useRef(null);

    function init(){
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        const renderer = new T.WebGLRenderer({
            // canvas: canRef,
            canvas:document.getElementById("bg")
        })
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
    
        camera.position.setZ(30);
    
        const geometry = new T.TorusGeometry(10,3,16,100);
        const material = new T.MeshBasicMaterial({color:0xff6347,wireframe:true});
        const torus = new T.Mesh(geometry, material);
    
        scene.add(torus);
        renderer.render(scene, camera);
    
        // function animate(){
        //     requestAnimationFrame(animate);
        //     torus.rotation.x+=0.01;
        //     torus.rotation.y+=0.005;
        //     torus.rotation.z+=0.005;
        //     renderer.render(scene,camera);
        // }
        // animate()
    }

    setTimeout(()=>{
        init()
    },100)

    return <div className="main" onClick={()=>{console.log(document.getElementById("bg"))}}>
        <canvas className="bg" id="bg"/>
    </div>
  }
  
  export default ThreeX
  