/*
 * @Author: lxy 644537920@qq.com
 * @Date: 2023-11-15 11:54:46
 * @LastEditors: qqjlb 33191092+qqjlb@users.noreply.github.com
 * @LastEditTime: 2023-12-19 17:58:19
 * @FilePath: \react_vite\mode\app-client\src\view\Blog\index.tsx
 * @Description: blog
 */

import { FC,Suspense,useState } from "react"
import "../../style/test.css";
import React from "react";




const Blog:FC = ()=>{

    const [path,setPath]=useState("")

    const creatElement = (name:string)=>{
        if(path===""){
            return <div>{"^_^"}</div>
        }
        const ProfilePage = React.lazy(() => import("../../components/blog/"+name+".tsx"));
        return <Suspense fallback={<div>loading...</div>}>
          <ProfilePage/>
        </Suspense>
      }

      
    return <div>
        <button onClick={()=>{setPath("ResetTriangle")}}>控制一个三角形</button>
        <button onClick={()=>{setPath("Cube")}}>移动的方块</button>
        <button onClick={()=>{setPath("VolumetricLights")}}>灯光和球</button>
        <button onClick={()=>{setPath("Mandelbrot")}}>曼德勃罗集</button>
        <button onClick={()=>{setPath("Tmaps")}}>贴图</button>
        <button onClick={()=>{setPath("GreenMap")}}>一片绿色</button>
        <br/>
        <button onClick={()=>{setPath("")}}>还原</button>
        {creatElement(path)}
    </div>
}
export default Blog