

import { FC, useRef, useState } from "react"

import "../../../style/less/cmd.less";




const Cmd:FC = ()=>{
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [x,setX]=useState(0)
    const [y,setY]=useState(0)
    
    const mouseDownHandle = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        let _x = e.pageX -x
        let _y = e.pageY -y
        window.onmousemove = (e)=>{
            setX(e.pageX-_x);
            setY(e.pageY-_y);
        }
        window.onmouseup=()=>{
            window.onmousemove=null
            window.onmouseup=null
        }
    }

    return <>
        <div className="cmd_main" style={{left:x+"px",top:y+"px"}} >
            <div className="title" onMouseDown={mouseDownHandle}>1</div>
            <div ref={contentRef} className="content">
                <div contentEditable className="myinput">

                </div>
            </div>
        </div>
    </>
}

export default Cmd