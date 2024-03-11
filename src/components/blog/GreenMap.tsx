import { FC, useEffect, useRef } from "react"



const GreenMap:FC = ()=>{
    useEffect(()=>{
        init()
    },[])
    const init = () => {
        const canvas = document.createElement("canvas");
        canvas.height = 800;
        canvas.width = 800;
        
        if(divref&&divref.current?.childNodes.length===0){
            divref.current?.appendChild(canvas)
        }

        if(!canvas)return;
        const gl = canvas.getContext("webgl2")
        if(!gl)return;

    
        const dpr = Math.max(1, .5*window.devicePixelRatio)
   
        //glsl
        const vertexSource = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform mat4 u_Matrix;
        void main(){
            gl_Position = a_Position; 
            gl_PointSize = 4.0;
            v_Color=a_Color;
        }
        `
    
        const fragmentSource = `
        precision mediump float;
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
        }
        `
        let program = initShaders(gl, vertexSource, fragmentSource);

        const xCount = 40;
        const yCount = 40;
    
        //x轴 -0.5 -> 0.5 
        const startX=-0.6;
        const endX=0.6;
        //y轴 -0.5 -> 0.5 
        const startY=-0.5;
        const endY=0.5;
        //点维度
        const verticeSize=2;
        //颜色维度
        const colorSize=3;
        
        const pointCount = (xCount*3 -2)*yCount;
    
        const xChunk = (endX-startX)/xCount;
        const yChunk = (endY-startY)/yCount;
    
        const source =new Float32Array(pointCount*(verticeSize+colorSize))
            
        //元素字节数
        const elementBytes = source.BYTES_PER_ELEMENT;
        //类目尺寸
        const categorySize=verticeSize+colorSize;
        //类目字节数
        const categoryBytes=categorySize*elementBytes;
        //系列索引位置
        const verticeByteIndex=0;
        const colorByteIndex=verticeSize*elementBytes;
        //顶点总数
        const sourceSize=source.length/categorySize;
    
    
        const sourceBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,sourceBuffer);
    
        //1.开启透明度合成
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE)
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1.0);
    
        ani1()
        
        function getPoint(o:number){
            var index=0
    
            //y*(x  x-1 * 2)        
            for(let y=0;y<yCount;y++){
                for(let x=0;x<xCount;x++){
                    _getp(x,y)
                }
                for(let x=xCount-1;x>=1;x--){
                    _getp(x,y+1)
                    _getp(x-1,y)
                }
            }
    
            function _getp(__x:number,__y:number){
                let tx = startX+__x*xChunk
                let ty = startY+__y*yChunk
                let nx = tx+ty*0.5
                let ny = ty+Math.sin(tx*16+ty*16+o)*0.05
                source[index]=nx
                source[index+1]=ny
                source[index+2]=0.9
                source[index+3]=0.5+ny
                source[index+4]=0.1+ny*2
                index+=5
            }
        }
    
        function ani1(){
            let offer=0.0;
            const ani = () => {
                offer+=0.01
                getPoint(offer);
                setSource()
                draw()
                requestAnimationFrame(ani);
            }
            ani();
        }
    

        function setSource(){
            if(!gl)return
            if(!program)return
            const a_Color=gl.getAttribLocation(program,'a_Color');
            const a_Position=gl.getAttribLocation(program,'a_Position');
    
            gl.bufferData(gl.ARRAY_BUFFER,source,gl.STATIC_DRAW);
            
            gl.vertexAttribPointer(
                a_Position,
                verticeSize,
                gl.FLOAT,
                false,
                categoryBytes,
                verticeByteIndex);
            gl.enableVertexAttribArray(a_Position);
            
            gl.vertexAttribPointer(
                a_Color,
                colorSize,
                gl.FLOAT,
                false,
                categoryBytes,
                colorByteIndex);
            gl.enableVertexAttribArray(a_Color);
    
       }
    
        function draw(){
            if(!gl)return
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.LINE_STRIP, 0, pointCount);
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

    const divref = useRef<HTMLDivElement>(null)

    return <div ref={divref}>
    </div>
}

export default GreenMap