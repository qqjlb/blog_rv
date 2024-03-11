/*
 * @Author: lxy 644537920@qq.com
 * @Date: 2023-11-14 16:19:05
 * @LastEditors: qqjlb 33191092+qqjlb@users.noreply.github.com
 * @LastEditTime: 2023-11-23 16:34:25
 * @FilePath: \react_vite\mode\app-client\src\App.tsx
 * @Description:  主页
 */
import { PageData } from "../MyRouter";


function App() {


  return <div className='main'>
    <h1>There is Home</h1>
  
    <div className='navigation'>
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>

        <ul id="menu">
          {PageData.map(item=>{
            return <a key={item.path} href={"./"+item.path}><li>{(item.path?item.path:"home")}</li></a>
          })}
        </ul>
      </div>
    </div>
    
  </div>
}

export default App
