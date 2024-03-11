import { FC, useEffect } from "react"



const Cube:FC = ()=>{
    useEffect(()=>{
        init()
    },[])
    const init = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        if(!canvas)return;
        const gl = canvas.getContext("webgl2")
        if(!gl)return;
        canvas.style.width = "100%"
        canvas.style.height = "auto"
        canvas.style.userSelect = "none"
    
        const dpr = Math.max(1, .5*window.devicePixelRatio)
    

    
        //glsl
        const vertexSource = `#version 300 es
        attribute vec4 a_Position;
        attribute vec2 a_Pin;
        varying vec2 v_Pin;
        void main(){
            gl_Position = a_Position;
            v_Pin=a_Pin;
        }
        `
    
        const fragmentSource = `#version 300 es
        precision mediump float;
        uniform sampler2D u_Sampler;
        varying vec2 v_Pin;
        void main(){
          gl_FragColor=texture2D(u_Sampler,v_Pin);
        }
        `

        let program = initShaders(gl, vertexSource, fragmentSource);
        if(!program)return
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1.0);
    
        //点数据
        const source =new Float32Array([
        -0.5, 0.5, 0, 1,
          -0.5, -0.5, 0, 0.0,
          0.5, 0.5, 1.0, 1,
          0.5, -0.5, 1.0, 0.0,
        ])
    
        const FSIZE = source.BYTES_PER_ELEMENT;
        //元素字节数
        const elementBytes = source.BYTES_PER_ELEMENT
        //系列尺寸
        const posSize = 2
        const pinSize = 2
        //类目尺寸
        const categorySize = posSize + pinSize
        //类目字节数
        const categoryBytes = categorySize * elementBytes
        //系列字节索引位置
        const posByteIndex = 0
        const pinByteIndex = posSize * elementBytes
        //顶点总数
        const sourceSize = source.length / categorySize
    
    
        const sourceBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);
    
    
    
        const a_Position=gl.getAttribLocation(program,'a_Position');
        gl.vertexAttribPointer(
            a_Position,
            posSize,
            gl.FLOAT,
            false,
            categoryBytes,
            posByteIndex);
        gl.enableVertexAttribArray(a_Position);
    
        const a_Pin=gl.getAttribLocation(program,'a_Pin');
        gl.vertexAttribPointer(
            a_Pin,
            pinSize,
            gl.FLOAT,
            false,
            categoryBytes,
            pinByteIndex);
        gl.enableVertexAttribArray(a_Pin);
    
        /* 图像预处理 */
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    
        gl.activeTexture(gl.TEXTURE1)
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        const image = new Image();
      
        image.src = `data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M10 0L0 10v10l10-10 10 10V10zm10 20v10l10-10 10 10V20L30 10z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M10-20L0-10V0l10-10L20 0v-10L10-20zM20 0v10L30 0l10 10V0L30-10 20 0zM10 20L0 30v10l10-10 10 10V30L10 20zm10 20v10l10-10 10 10V40L30 30 20 40z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>`
        // image.src = "./image/test5.png"
        // image.setAttribute("crossOrigin", 'Anonymous')
        image.onload = function (){
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGB,
                gl.RGB,
                gl.UNSIGNED_BYTE,
                image
            )
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                gl.LINEAR
            )
            if(!program)return 
            const u_Sampler=gl.getUniformLocation(program,"u_Sampler");
            gl.uniform1i(u_Sampler,1)
            render()
        }
    
    
 
    
        function render(){
            if(!gl)return
            // 清理绘图区
            gl.clear(gl.COLOR_BUFFER_BIT);
            // 绘制顶点
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, sourceSize);
        }
        function initShaders(gl:WebGL2RenderingContext ,vsSource:string,fsSource:string){
            //创建程序对象
            const _program = gl.createProgram();
            if(!_program)return;
            //建立着色对象
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            if(!vertexShader)return;
            if(!fragmentShader)return;
            //把顶点着色对象装进程序对象中
            gl.attachShader(_program, vertexShader);
            //把片元着色对象装进程序对象中
            gl.attachShader(_program, fragmentShader);
            //连接webgl上下文对象和程序对象
            gl.linkProgram(_program);
            //启动程序对象
            gl.useProgram(_program);
            //将程序对象挂到上下文对象上
            return _program;
        }
    
        function loadShader(gl:WebGL2RenderingContext , type:number, source:string) {
            //根据着色类型，建立着色器对象
            const shader = gl.createShader(type);
            if(!shader)return;
            //将着色器源文件传入着色器对象中
            gl.shaderSource(shader, source);
            //编译着色器对象
            gl.compileShader(shader);
            //返回着色器对象
            return shader;
        }
    

    
    }
    return <div>
        <canvas id="canvas" style={{width:"100vw",background:"#659"}}></canvas>
    </div>
}

export default Cube