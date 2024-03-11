import { FC, useState } from "react";

const ReserTtiangle:FC = ()=>{
    const vs= `
    attribute vec3 aPos;
    void main()
    {
        gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    }
    `
    const fs=`
    void main()
    {
        gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);
    }
    `
    const draw = (list:number[]=[],vertexSource?:string,fragmentSource?:string)=>{
        vertexSource = vertexSource||vs;
        fragmentSource = fragmentSource||fs;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if(!canvas) return
        const gl = canvas.getContext('webgl2');
        if(!gl) return
        if (!gl) {
        alert('WebGL not supported');
        }
        if(list.length===0){
            list=[-1.0, -1.0, 0.0,
                0.0, -0.5, 0.0,
                0.0, 0.0, 0.0,]
        }
        // list=[...list,...[-1.0, -1.0, 0.0,
        //     0.0, -0.5, 0.0,
        //     0.0, 0.0, 0.0,]]

        const vertices = new Float32Array(list);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0)

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if(!vertexShader) return
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if(!fragmentShader) return
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        const shaderProgram = gl.createProgram();
        if(!shaderProgram) return
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    const [n0,sn0] = useState(-1.0)
    const [n1,sn1] = useState(-1.0)
    const [n2,sn2] = useState(0.0)
    const [n3,sn3] = useState(0.0)
    const [n4,sn4] = useState(-0.5)
    const [n5,sn5] = useState(0.0)
    const [n6,sn6] = useState(0.0)
    const [n7,sn7] = useState(0.0)
    const [n8,sn8] = useState(0.0)


    const replaceAll = (s1:string,s2:string,s3:string) => {
        return s1.replace(new RegExp(s2,"mg"),s3);
    }
    const clickHandle = ()=>{
        var tdiv1 = (document.getElementById("text1") as HTMLDivElement).innerText
        var tdiv2 = (document.getElementById("text2") as HTMLDivElement).innerText
        draw([n0,n1,n2,n3,n4,n5,n6,n7,n8],tdiv1,tdiv2);
    }

    const parsetext = (s:string)=>{
        return replaceAll(s,"\n","<br/>")
    }
    const reflash = ()=>{
        draw([n0,n1,n2,n3,n4,n5,n6,n7,n8]);
    }

    return <div>
        <canvas id="canvas"></canvas>
        <br/>

        Blog
        <button onClick={clickHandle}>test</button>
        <br/>
        <div style={{width:"600px"}}>
            <br/>
            <span>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n0} onChange={(e)=>{sn0(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n1} onChange={(e)=>{sn1(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n2} onChange={(e)=>{sn2(Number(e.target.value));reflash();}}/>
            </span>
            <br/>
            <span>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n3} onChange={(e)=>{sn3(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n4} onChange={(e)=>{sn4(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n5} onChange={(e)=>{sn5(Number(e.target.value));reflash();}}/>
            </span>
            <br/>
            <span>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n6} onChange={(e)=>{sn6(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n7} onChange={(e)=>{sn7(Number(e.target.value));reflash();}}/>
                <input type="range" min={-1.0} max={1.0} step={0.01} value={n8} onChange={(e)=>{sn8(Number(e.target.value));reflash();}}/>
            </span>
            <br/>
            <a>vertexSource</a>
            <br/>
            <div id="text1" className="my_input" dangerouslySetInnerHTML={{__html:parsetext(vs)}} contentEditable />
            <br/>
            <a>fragmentSource</a>
            <br/>
            <div id="text2" className="my_input" dangerouslySetInnerHTML={{__html:parsetext(fs)}} contentEditable />
        </div>
    </div>
}




const _ReserTtiangle:FC = ()=>{
    return <div>---hello ReserTtiangle---</div>
}

export default ReserTtiangle