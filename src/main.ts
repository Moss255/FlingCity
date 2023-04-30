import '@pixi/math-extras';
import './style.css';
import Catapult from './components/catapult';
import City from './components/city';
import Emoji from './components/emoji';
import * as PIXI from 'pixijs';
import randomInteger from 'random-int';
import { Point } from '@pixi/math';
import Zombie from './components/zombie';
import { getLaneXPosition } from './utils';
import Config from './config.json';
import Button from './components/button';


let ammoChoice: number = 2;
const currentLevel: number = 1;
let coins: number = 0;

const app = new PIXI.Application({ background: '#1099bb', width: 375,  height: 667});
document.body.appendChild(app.view);

let ammos: Emoji[] = [];
let cities: City[] = [];
let zombies: Zombie[] = [];

let buttons: Button[] = [];

for (let i = 0; i < 3; i++) {
  let button = new Button(i, getLaneXPosition(app.screen.width, i), app.screen.height / 2 + 300, app.stage);
  buttons.push(button);
  app.stage.addChild(button);
}

for (let i = 0; i < 3; i++) {
  let city = new City(1, getLaneXPosition(app.screen.width, i), app.screen.height / 2 + 100);
  cities.push(city);
  app.stage.addChild(city);
}

const playerCatapult = new Catapult(app.screen.width / 2, app.screen.height / 2 + 200);

app.stage.interactive = true;
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height - 100);

app.stage.on('pointerdown', function (e: PIXI.FederatedPointerEvent) {
  app.stage.emit('fireForPlayer', { ammoId: ammoChoice, x: e.x, y: e.y});
});

interface IFireForPlayerEvent {
  x: number;
  y: number;
  ammoId: number;
}

app.stage.on('fireForPlayer', (e: IFireForPlayerEvent) => {
    let target: Point = new Point(e.x, e.y)
    let ammo = new Emoji(e.ammoId, playerCatapult.position, target, app.ticker)
    app.stage.addChild(ammo);
    ammos.push(ammo);
});

interface IZombieHitCityEvent {
  city: City;
  zombie: Zombie;
}

app.stage.on('zombieHitCity', (e: IZombieHitCityEvent) => {
  const { city, zombie } = e;
  city.health -= 10;
  zombie.destroy();
  cities = cities.filter(x => !x.destroyed);
  zombies = zombies.filter(x => !x.destroyed);
});



interface IButtonPressedEvent {
  id: number;
}

app.stage.on('buttonPressed', (e: IButtonPressedEvent) => {
  ammoChoice = e.id;
});

interface IAmmoHitZombieEvent {
  ammo: Emoji;
  zombie: Zombie;
}

app.stage.on('ammoHitZombie', (e: IAmmoHitZombieEvent) => {
  const { ammo, zombie } = e;
  ammo.destroy();
  switch (ammo.type) {
    case 0:
      zombie.state = 'Reverse';
      break;
    case 1:
      zombie.state = 'Stopped';
      break;
    case 2:
      zombie.state = 'Slowed';
      break;
    case 3:
      zombie.state = 'Rage';
      break;
  }
  ammos = ammos.filter(x => !x.destroyed);
});

interface IZombieReturnHomeEvent {
  zombie: Zombie;
}

app.stage.on('zombieReturnHome', (e: IZombieReturnHomeEvent) => {
  coins += e.zombie.reward;
  e.zombie.destroy();
})

const spawnRate: number = Config.levels[currentLevel].zombieSpawnRate;
let timeTillNextSpawn: number = spawnRate;

app.ticker.add((delta: number) => {
  timeTillNextSpawn -= delta / 100;



  for (let ammo of ammos) {
    if (ammo.destroyed) {
      app.stage.removeChild(ammo);
      continue;
    }

    for (let zombie of zombies) {
      if (ammo.containsPoint(zombie.position)) {
        app.stage.emit('ammoHitZombie', { ammo, zombie});
        break;
      }
    }
  }

  for (let zombie of zombies) {
    for (let city of cities) {
      if (city.containsPoint(zombie.position)) {
        app.stage.emit('zombieHitCity', { city, zombie });
        break;
      }
    }

    if (zombie.y > 0) {
      app.stage.emit('zombieReturnHome', { zombie });
    }
  }

  if (timeTillNextSpawn <= 0) {
    let zombie = new Zombie(0, getLaneXPosition(app.screen.width, randomInteger(2)), 200, app.ticker);
    zombies.push(zombie);
    app.stage.addChild(zombie);
    timeTillNextSpawn = spawnRate;
  }




});

app.stage.addChild(playerCatapult);