import '@pixi/math-extras';
import './style.css';
import * as PIXI from 'pixijs';
import Level from './components/level';
import Credits from './components/credits';
import Start from './components/start';
import Tutorial from './components/tutorial';



let appWidth: number = 360;
let appHeight:number = 800;

let isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
}

//let scaleX: number = appWidth / 360;
// let scaleY: number = appHeight / 800;

const app = new PIXI.Application({ backgroundAlpha: 1, width: appWidth, height: appHeight - 10, resolution: 1});
// @ts-ignore
document.body.appendChild(app.view);


let currentLevel: number = 0;
let level: Level;
let credits: Credits;
let start: Start;
let tutorial: Tutorial;

let scenes: PIXI.Container<PIXI.DisplayObject>[] = [];


type Scene = 'start' | 'level' | 'tutorial' | 'credits';

interface IChangeSceneEvent {
  scene: Scene;
}
// @ts-ignore
app.stage.on('changeScene', (e: IChangeSceneEvent) => {
  app.stage.removeChildren();

  switch (e.scene) {
    case 'start':
      // @ts-ignore
      start = new Start(app.screen, app.ticker, app.stage);
      scenes.push(start);
      app.stage.addChild(start);
      break;
    case 'tutorial':
      // @ts-ignore
      tutorial = new Tutorial(app.screen, app.ticker, app.stage);
      scenes.push(tutorial);
      app.stage.addChild(tutorial);
      break;
    case 'level':
      // @ts-ignore
      level = new Level(app.screen, app.ticker, currentLevel, app.stage);
      scenes.push(level);
      app.stage.addChild(level);
      break;
    case 'credits':
      // @ts-ignore
      credits = new Credits(app.screen, app.ticker);
      scenes.push(credits);
      app.stage.addChild(credits);
  }
});



interface IChangeLevelEvent {
  newLevel: number;
}
// @ts-ignore
app.stage.on('changeLevel', (e: IChangeLevelEvent) => {
  currentLevel = e.newLevel;
  if (currentLevel < 5) {
    level.enemiesReturned = 0;
    app.stage.removeChild(level);
    // @ts-ignore
    level = new Level(app.screen, app.ticker, e.newLevel, app.stage);
    app.stage.addChild(level);
  } else {
    // @ts-ignore
    app.stage.emit('changeScene', { scene: 'credits' });
  }

});

// @ts-ignore
app.stage.emit('changeScene', { scene: 'start' });