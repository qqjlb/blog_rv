const vertexShader = `
attribute vec4 a_Position;
void main(){
    gl_Position = a_Position;
}
`
const fragmentShader = `
precision mediump float;
uniform vec2 resolution;
float mandelbrot(float x, float y) {
    float a = x, b = y;
    for (float i = 0.0; i < 128.0; ++i) {
        float c = a * a - b * b + x, d = 2.0 * a * b + y;
        a = c, b = d;
        if (a * a + b * b > 4.0) 
        {
            return 8.0/i;
        }
    }
    return 0.0;
}
void main(){
    vec2 uv = (gl_FragCoord.xy-.5*resolution);
    float mx =  (uv.x-600.0)*0.005;
    float my =  (uv.y-400.0)*0.005;
    float v = mandelbrot(mx,my);
    vec3 color = vec3(v);
    gl_FragColor = vec4(color,1);
}
`

export class Mandelbrot{
    _vs="";
    _fs="";
    gl;
    program: WebGLProgram | undefined;
    drawCount=6;
    cw=0;
    ch=0;
    constructor(p:HTMLElement){
        this._vs=vertexShader;
        this._fs=fragmentShader;
        const canvas = document.createElement("canvas")
        canvas.width=800;
        canvas.height=800;
        if(!canvas)return;
        this.gl = canvas.getContext("webgl2")

        if(p&&p?.childNodes.length===0){
            p.appendChild(canvas)
        }

        this.init();
    }
    init(){
        if (!this.gl) { return };
        this.initShaders(this.gl,this._vs,this._fs);
        this.bindBuffer(this.gl);
    }

    bindBuffer(gl:WebGL2RenderingContext){
        if(!this.program)return
        const vertices=new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,

            -1.0, 1.0,
            1.0, 1.0,
            1.0, -1.0,
            ])
        const vertexBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        const a_Position=gl.getAttribLocation(this.program,'a_Position');
        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_Position);

        const a_Resolution = gl.getUniformLocation(this.program, "resolution")
        gl.uniform2f(a_Resolution, this.cw, this.ch)

    }

    draw(){
        if(!this.gl)return;
        // 指定将要用来清理绘图区的颜色
        this.gl.clearColor(0., 0.0, 0.0, 1.0);
        // 清理绘图区
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // 绘制顶点
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.drawCount);
    }
    
    initShaders(gl:WebGL2RenderingContext,vsSource:string,fsSource:string){
        //创建程序对象
        const program = gl.createProgram();
        if(!program)return;
        //建立着色对象
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if(!vertexShader)return;
        if(!fragmentShader)return;
        //把顶点着色对象装进程序对象中
        gl.attachShader(program, vertexShader);
        //把片元着色对象装进程序对象中
        gl.attachShader(program, fragmentShader);
        //连接webgl上下文对象和程序对象
        gl.linkProgram(program);
        //启动程序对象
        gl.useProgram(program);
        //将程序对象挂到上下文对象上
        this.program = program;
        return true;
    }

    loadShader(gl:WebGL2RenderingContext,type:number, source:string) {
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