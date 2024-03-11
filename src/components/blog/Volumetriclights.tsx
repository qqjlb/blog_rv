import { FC, useEffect } from "react"



const VolumetricLights:FC = ()=>{
    useEffect(()=>{
        init()
    },[])
    const init = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        if(!canvas)return;
        const gl = canvas.getContext("webgl2")

        canvas.style.width = "100%"
        canvas.style.height = "auto"
        canvas.style.userSelect = "none"
    
        const dpr = Math.max(1, .5*window.devicePixelRatio)
    
        function resize() {
            if(gl===null)return;
            const {
                innerWidth: width,
                innerHeight: height
            } = window
            canvas.width = width * dpr
            canvas.height = height * dpr
            gl.viewport(0, 0, width * dpr, height * dpr)
        }
        window.onresize = resize
    
        
const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec4 position;

void main(void) {
    gl_Position = position;
}
`

const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent) 
*/
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec2 touch;
uniform int pointerCount;

#define mouse (touch/resolution)
#define P pointerCount
#define T time
#define S smoothstep

#define syl(p,s) (length(p)-s)

mat2 rot(float a) {
  float c = cos(a),
  s = sin(a);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = clamp(
    .5+.5*(b-a)/k,
    .0,
    1.
  );
  return mix(b,a,h)-k*h*(1.-h);
}

vec2 smax(vec2 a, vec2 b, float k) {
  a.x = smin(a.x, -b.x, k);
  
  return a;
}

float rnd(vec2 p) {
  return fract(sin(dot(p.xy,p.yx+vec2(234, 543)))*345678.);
}

float rnd(float a) {
  return fract(sin(a*12.599)*78.233);
}

float curve(float t) {
  t /= .5;
  
  return mix(
    rnd(floor(t)),
    rnd(floor(t)+1.),
    pow(S(.0, 1., fract(t)), 4.)
  );
}

float box(vec3 p, vec3 s, float r) {
  p = abs(p) - s;
  
  return length(max(p,.0))+
    min(.0, max(max(p.x,p.y),p.z))-r;
}

vec2 map(vec3 p) {
  vec2 flr = vec2(-box((p-.2)-vec3(0,4,0), vec3(10,5,10), .2), 0),
  sph = vec2(syl(p, 1.), 1),
  cyl = vec2(-syl(abs(p.xy)-vec2(.25), .18), -1),
  lgt = vec2(syl(abs(p)-vec3(.25,.25,0), .1), 2),
  a = smax(sph, -cyl, -.055);
  a = a.x < flr.x ? a: flr;
  a = a.x < lgt.x ? a: lgt;
  
  return a;
}

float pattern(vec3 p) {
  vec2 uv = p.xy;
  
  return step(length(abs(uv)-vec2(.25))-.2, .0);
}

vec3 tiles(vec3 p) {
  if (p.y > 5. || p.x > 9.9 || p.z > 9.9) return vec3(0);
  
  vec2 uv = p.xz;
  vec3 col = vec3(0);
  vec2 grid = S(.31,.3,abs(fract(uv)-.5));
  vec2 cell = floor(uv);
  
  col += min(grid.x, grid.y);
  col *= vec3(rnd(cell), rnd(cell + 12.23), rnd(cell + 78.59));
  col *= curve(T*4.+rnd(cell)*99.33);
  
  return col;
}

vec3 wallart(vec3 p) {
  vec3 col = vec3(0);
  vec2 uv = vec2(0);
  
  p.y -= 4.;
  
  if (abs(p.x) > 9.8 || abs(p.z) > 9.8) {
    p.y = abs(p.y) - .75;
    uv = p.yz;
    for (float i = .0; i < 4.; i++) {
      uv.x += sin((i+3.)*T*1.5+uv.y*1.2)*.6;
      col += abs(.057/uv.x*.65)*1.618;
    }

    col *= .3*pow(.6+.6*cos(6.3*(T*.25)+vec3(0,23,21)), vec3(.5));
  }

  return col;
}

vec3 vol(vec3 p, vec3 rd, vec3 ro, float maxd) {
  const float s = .2;
  
  float distort = rnd(p.xz),
  d = s * distort;
  
  vec3 col = vec3(0);
  vec3 vr = rd * s,
  vp = ro + vr * distort;
  
  for (float i = .0; i < 50.; i++) {
    if (d > maxd) break;
    
    float fadep = 1.-clamp(abs(.5+vp.z*vp.z)*.02, .0, 1.),
    fadet = 1.-clamp(vp.y*vp.y*vp.y, .0, 1.);
    
    col += pattern(vp)*.01 * fadep*fadep;
    col += tiles(vp)*.02 * fadet*fadet;
    
    vp += vr;
    d += s;
  }

  return pow(col*4.2, vec3(4));
}

vec3 norm(vec3 p) {
  float h = 1e-3;
  vec2 k = vec2(-1, 1);
  
  return normalize(
    k.xyy*map(p+k.xyy*h).x+
    k.yxy*map(p+k.yxy*h).x+
    k.yyx*map(p+k.yyx*h).x+
    k.xxx*map(p+k.xxx*h).x
  );
}

void cam(inout vec3 p) {
  if (P > 0) {
    p.yz *= rot(-mouse.y*3.1415+1.5707);
    p.xz *= rot(3.1415-mouse.x*6.2832);
  } else {
    p.yz *= rot(clamp((sin(T*.05)*.5+.5)*.5-.4,-.2,1.));
    p.xz *= rot(-T*.2);
  }
}

void main(void) {
  vec2 uv = (
    gl_FragCoord.xy-.5*resolution
  )/min(resolution.x, resolution.y);
  
  vec3 col = vec3(0),
  ro = vec3(0, 0, exp(-cos(T * .2)) - 5.),
  rd = normalize(vec3(uv, 1));
  
  cam(ro);
  cam(rd);
  
  vec3 p = ro;
  
  const float steps = 400., maxd = 80.;
  float dd = .0, at = .0, e = 1., bnz = .0;
  
  for (float i = .0; i < steps; i++) {
    vec2 d = map(p);
    
    if (d.x < 1e-3) {
      if (bnz++ > 2.) break;
      
      int id = int(d.y);
      vec3 n = norm(p);
      
      if (id == 2) {
        col = vec3(1);
        break;
      }

      col += vol(p, rd, ro, dd);
      
      if (id == 0) {
        col += e * tiles(p);
        col += e * wallart(p);
        
        if (bnz > .0) break;
      }

      rd = reflect(rd, n);
      d.x = 5e-1;
      e *= .5;
    }

    if (dd > maxd) {
      dd = maxd;
      break;
    }

    dd += d.x;
    p += rd * d.x;
    at += .05 * (.05 / dd);
  }

  col = pow(col, vec3(.4545));
  col = S(.0, 1., col);
  col += at;
  
  fragColor = vec4(col, 1);
}
`
    
        function compile(shader:WebGLShader, source:string) {
            if(gl===null)return;
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader))
            }
        }
    
        let program:WebGLProgram | null
    
        function setup() {
            if(gl===null)return;
            const vs = gl.createShader(gl.VERTEX_SHADER)
            const fs = gl.createShader(gl.FRAGMENT_SHADER)
            if(vs===null)return;
            if(fs===null)return;
            compile(vs, vertexSource)
            compile(fs, fragmentSource)
            program = gl.createProgram()
            if(program===null)return;
            gl.attachShader(program, vs)
            gl.attachShader(program, fs)
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program))
            }
        }
    
        let vertices, buffer: WebGLBuffer | null;
    
        function init() {
            if(gl===null)return;
            vertices = [
                -1,-1, 1,
                -1,-1, 1,
                -1, 1, 1,
                -1, 1, 1
            ]
            buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
            if(program===null)return;
            const position = gl.getAttribLocation(program, "position")
    
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    
            (program as any).resolution = gl.getUniformLocation(program, "resolution");
            (program as any).time = gl.getUniformLocation(program, "time");
            (program as any).touch = gl.getUniformLocation(program, "touch");
            (program as any).pointerCount = gl.getUniformLocation(program, "pointerCount");
        }
    
        const mouse = {
            x: 0,
            y: 0,
            touches: new Set(),
            update: function(x:number, y:number, pointerId:any) {
                this.x = x * dpr
                this.y = (innerHeight - y) * dpr
                this.touches.add(pointerId)
            },
            remove: function(pointerId: unknown) { this.touches.delete(pointerId) }
        }
    
        function loop(now:number) {
            if(gl===null)return;
            gl.clearColor(0, 0, 0, 1)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            if(program===null)return;
            gl.uniform2f((program as any).resolution, canvas.width, canvas.height)
            gl.uniform1f((program as any).time, now * 1e-3)
            gl.uniform2f((program as any).touch, mouse.x, mouse.y)
            gl.uniform1i((program as any).pointerCount, mouse.touches.size)
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length * .5)
            requestAnimationFrame(loop)
        }
    
        setup()
        init()
        resize()
        loop(0)
    
        window.addEventListener("pointerdown", e => mouse.update(e.clientX, e.clientY, e.pointerId))
        window.addEventListener("pointerup", e => mouse.remove(e.pointerId))
        window.addEventListener("pointermove", e => {
        if (mouse.touches.has(e.pointerId))
            mouse.update(e.clientX, e.clientY, e.pointerId)
        })
    }
    return <div>
        <canvas id="canvas" style={{width:"100vw",background:"#659"}}></canvas>
    </div>
}

export default VolumetricLights