import { FC, useEffect, useRef } from "react"
import {Mandelbrot as Man} from "./utils";


const Mandelbrot:FC = ()=>{
    useEffect(()=>{

        if(divRef.current){
            var m = new Man(divRef.current);
            m.draw()
        }
        
    },[])

    const divRef = useRef<HTMLDivElement>(null);

    return <div ref={divRef}>
    
    </div>
}

export default Mandelbrot