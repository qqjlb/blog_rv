/*
 * @Author: lxy 644537920@qq.com
 * @Date: 2023-11-14 16:19:05
 * @LastEditors: qqjlb 33191092+qqjlb@users.noreply.github.com
 * @LastEditTime: 2023-11-22 09:54:29
 * @FilePath: \react_vite\mode\app-client\src\main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import "./style/less/global.less";
import {MyRouter} from './MyRouter'
import MainMask from './MainMask';




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainMask/>
    <MyRouter/>
  </React.StrictMode>,

)

