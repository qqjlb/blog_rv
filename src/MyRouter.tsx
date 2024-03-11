
/*
 * @Author: lxy 644537920@qq.com
 * @Date: 2023-11-15 14:14:04
 * @LastEditors: qqjlb 33191092+qqjlb@users.noreply.github.com
 * @LastEditTime: 2024-03-11 16:18:08
 * @FilePath: \react_vite\mode\app-client\src\MyRouter.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// type Fnode={
//   key:string;
//   value:Fnode[];
// }

const data = import.meta.glob("./view/**/index.tsx",{
  eager:true,
  import:'default'
})

const creatElement = (path:string)=>{
  // return <div>{path}</div>
  
  const ProfilePage = React.lazy(() => import(path));
  return <Suspense fallback={<div>loading...</div>}>
    <ProfilePage/>
  </Suspense>
}

const pageData = Object.entries(data).map((item)=>{
  var path = item[0].replace("./view/","").replace("index.tsx","");
  path=path.slice(0,path.length-1).replace("/",'-').toLowerCase()
  // path = path||"/"
  
  const lazyComponent = creatElement(item[0])
  
  return {
    path,
    element:lazyComponent
  }
})
export const PageData = pageData


// const getPageData = (basePath:string)=>{
//   const tmp:Fnode = {key:basePath,value:[]};
//   const addnode = (root:Fnode[],data:string[],point:number) => {
//     if(data[point]==="index.tsx")return 
//     for(let i=0;i<root.length;i++){
//       if(root[i].key===data[point]){
//         addnode(root[i].value,data,point+1)
//         return
//       }
//     }
//     root.push({key:data[point],value:[]})
//     addnode(root[root.length-1].value,data,point+1)
//   }

//   const treetodata = (root:Fnode,_s:string):object=>{
//     if(root.value.length===0){
//       return {path:root.key,element:creatElement(_s+root.key+"/index.tsx")}
//     }else{
//       const list =[]
//       for(let i=0;i<root.value.length;i++){
//         list.push(treetodata(root.value[i],_s+root.key+"/"))
//       }
//       return {path:root.key,element:creatElement(_s+root.key+"/index.tsx"),children:list}
//     }
//   }

//   Object.entries(data).map(item=>{
//     var pathlist = item[0].split('/');
//     addnode(tmp.value,pathlist,2);
//   })

//   return [treetodata(tmp,"./"),{path:"",element:<div>home</div>}];
// }



function Router() {
  return createBrowserRouter(pageData)
  // return createBrowserRouter(getPageData("view"));
}


export const MyRouter = () => {
    return <>

      <RouterProvider router={Router()} />
    </>
}

