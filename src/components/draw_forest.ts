
import * as PIXI from "pixi.js"

const W=window.innerWidth-200
const H=window.innerHeight-200

const LineLen = 34
const LineWidth = 4
const DiffuseVal = 4

const background=0x100a07
const leaf_1=0x100d02
const leaf_2=0x110f08
const leaf_3=0x15100c
const leaf_4=0x1d0e01
const leaf_5=0x4d2e21

const randx = () =>{
    return Math.floor(Math.random()*W)
}
const randy = () =>{
    return Math.floor(Math.random()*H)
}



const app = new PIXI.Application({
    width: W,
    height: H,
    antialias: true,
    resolution: 1,
    backgroundColor: background
});
// app.view就是个canvas元素，挂载到页面上
document.body.appendChild(app.view as any);

const createSomeLine = () => {
    const _line = new PIXI.Graphics();
    _line.lineStyle(LineWidth,0xffffff,1);
    return _line;
}


const addSomeLine = () => {
    line.moveTo(randx(),randy());
    line.lineTo(randx(),randy());
    app.stage.addChild(line);
}
const addSomeLine2 = () => {
    for(let i=0;i<10;i++){
        var starx = randx();
        var stary = randy();
        var py = Math.random()*2*LineLen-LineLen
        var endx = starx+py
        var endy = Math.sqrt(LineLen*LineLen-py*py)
        line.moveTo(starx,stary);
        line.lineTo(endx,stary+endy);
        app.stage.addChild(line);
    }
}
//高斯模糊
const filter_blur = (g:PIXI.Graphics) => {
    const blurFilter = new PIXI.BlurFilter()
    blurFilter.blur=DiffuseVal;
    g.filters = [blurFilter];
}
//透明
const filter_alpha = (g:PIXI.Graphics) => {
    const alphaFilter = new PIXI.AlphaFilter()
    alphaFilter.alpha=0.5;
    g.filters = [alphaFilter];
}
const filter_displacement = (g:PIXI.Graphics) => {
    // const displacementFilter = new PIXI.DisplacementFilter(10)
    // // displacementFilter
    // g.filters = [displacementFilter];
}
const filter_noise = (g:PIXI.Graphics) => {
    const noiseFilter = new PIXI.NoiseFilter(0.1,100);
    g.filters = [noiseFilter];
}

const line = createSomeLine()

addSomeLine2();

const clickHandle = () =>{


}




export default {clickHandle}