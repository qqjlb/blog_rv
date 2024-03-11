import React, { FC, useState } from "react"

import "./style/index.css";

interface MaskProps {
    children?: React.ReactNode;
};

type point = {
    x:number,
    y:number,
}


class DrawTool{
    _canvas:HTMLCanvasElement;
    _ctx:CanvasRenderingContext2D|null =null;
    width: number=0;
    height: number=0;
    track: point[]=[];
    _ppoint:point={x:0,y:0};
    _cpoint:point={x:0,y:0};

    constructor(){
        this._canvas = document.getElementById('canvasx') as HTMLCanvasElement;
        if(!this._canvas)return
        this._ctx = this._canvas.getContext('2d');
        if(!this._ctx)return
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this.width =  window.innerWidth;
        this.height = window.innerHeight;
        this.track = [];

        document.onmousemove=(e:MouseEvent)=>{
            this._ppoint=this._cpoint;
            this._cpoint={x:e.x,y:e.y};
            document.onmousemove=(e:MouseEvent)=>{
                var dx = e.x-this._cpoint.x
                var dy = e.y-this._cpoint.y
                if(dx*dx+dy*dy>100){
                    this.track.push({x:e.x,y:e.y})
                    this._ppoint=this._cpoint;
                    this._cpoint={x:e.x,y:e.y};
                    this.draw()
                }
            }
        }
    }
    static Mod_L=[
        [8,8,8,8,8,8,8,8],
        [4,4,4,4,4,4,4,4],
        [0,0,0,0,0,0,4,8],
        [0,0,0,0,0,0,4,8],
        [0,0,0,0,0,0,4,8],
        [0,0,0,0,0,0,4,8],
        [0,0,0,0,0,0,4,8],
        [0,0,0,0,0,0,4,8],
    ]

    mousemoveHandle(e:MouseEvent){
        this._ppoint=this._cpoint;
        this._cpoint={x:e.x,y:e.y};
        this.draw()
    }
    draw(){
        if(!this._ctx)return
        //point
        // this._ctx.arc(this._cpoint.x, this._cpoint.y, 8, 0, Math.PI * 2);
        // this._ctx.stroke();
        //line
        this._ctx.moveTo(this._ppoint.x, this._ppoint.y);
        this._ctx.lineTo(this._cpoint.x, this._cpoint.y);
        this._ctx.stroke();
    }
    over(){
        document.onmousemove=(e:MouseEvent)=>{
        }
        this.identification();
        this.track = [];
        console.log("draw over");
    }
    identification(){
        const minpoint = this.track.reduce((p,c)=>{return {x:Math.min(p.x,c.x),y:Math.min(p.y,c.y)}});
        const maxpoint = this.track.reduce((p,c)=>{return {x:Math.max(p.x,c.x),y:Math.max(p.y,c.y)}});
        const TARGETSIZE = 8;
        const scalen=15/this.track.length;
        const scalex=TARGETSIZE/(maxpoint.x-minpoint.x)
        const scaley=TARGETSIZE/(maxpoint.y-minpoint.y)
        const tlist:point[]=[]
        var tn=-1
        for(let i=0;i<this.track.length;i++){
            if(i*scalen>tn){
                this.track[i].x-=minpoint.x;
                this.track[i].x*=scalex;
                this.track[i].x=Math.min(this.track[i].x,7)
                this.track[i].y-=minpoint.y;
                this.track[i].y*=scaley;
                this.track[i].y=Math.min(this.track[i].y,7)
                tlist.push(this.track[i])
                tn++;
            }
   
        }
        if(window.location.pathname!=="/")
        if(this.Matrix(tlist,DrawTool.Mod_L)){
            var a = document.createElement("a");
            a.setAttribute('href',"/")
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // let navigate = useNavigate()
            // navigate("/")
        }
    }
    Matrix(list:point[], target:number[][]){
        var score=0
        list.map(item=>{
            score+=target[Math.floor(item.x)][Math.floor(item.y)]
        })
        return score>=120
    }
}

const MainMask: FC<MaskProps> = ({})=>{
    const [isShow,setIsShow]=useState(false)
    var drawtool:DrawTool|null
    React.useEffect(()=>{
        if(isShow)
            drawtool = new DrawTool();
    },[isShow])
    document.oncontextmenu=(e)=>{
        e.preventDefault()
        return false
    }
    document.onmousedown=(e)=>{
        if(e.button===2){
            setIsShow(true)
            e.preventDefault()
            return false
        }
    }        
    document.onmouseup=()=>{
        setIsShow(false)
        drawtool&&drawtool.over();
    }   


    if(isShow)
        return <div className="main_mask">
            <canvas id="canvasx"></canvas>
        </div>
    else
        return null
}   



export default MainMask;
