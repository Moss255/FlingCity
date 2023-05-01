import { Container, DisplayObject, Rectangle, Ticker } from "pixijs";
import '@pixi/math-extras';
import Catapult from './catapult';
import City from './city';
import Emoji from './emoji';
import * as PIXI from 'pixijs';
import randomInteger from 'random-int';
import { Point } from '@pixi/math';
import Zombie from './zombie';
import { getLaneXPosition } from '../utils';
import Config from '../config.json';
import Button from './button';
import Portal from "./portal";

export default class Level extends Container<DisplayObject> {
    ammoChoice: number = 2;
    currentLevel: number = 1;
    coins: number = 0;
    enemiesReturned: number;
    ammos: Emoji[] = [];
    cities: City[] = [];
    zombies: Zombie[] = [];
    buttons: Button[] = [];
    screen: Rectangle;
    ticker: Ticker;
    counter: PIXI.Text;
    constructor(screen: Rectangle, ticker: Ticker, currentLevel: number, stage: Container<DisplayObject>) {
        super();



        this.currentLevel = currentLevel;
        this.enemiesReturned = 0;
        this.screen = screen;
        this.ticker = ticker;

        let map = PIXI.Sprite.from('map.png');
        this.addChild(map);

        this.counter = new PIXI.Text(`${this.enemiesReturned}/${Config.levels[currentLevel].enemiesCount}`, {
            fill: "#fff",
            fontSize: 40,
            fontWeight: 'bold',
        });
        this.counter.x = 10;
        this.counter.y = 0;
        this.addChild(this.counter);

        for (let i = 0; i < 3; i++) {
            let portal = new Portal(getLaneXPosition(this.screen.width, i), 240);
            this.addChild(portal);
        }

        for (let i = 0; i < 3; i++) {
            let button = new Button(i, getLaneXPosition(this.screen.width, i), this.screen.height / 2 + 350, this, this.ticker);
            this.buttons.push(button);
            this.addChild(button);
        }

        for (let i = 0; i < 3; i++) {
            const { filepath, health } = Config.levels[this.currentLevel].buildings[i];
            let city = new City(PIXI.Texture.from(filepath), getLaneXPosition(this.screen.width, i), this.screen.height / 2 + 160, health);
            this.cities.push(city);
            this.addChild(city);
        }

        const catapult = new Catapult(this.screen.width / 2, this.screen.height / 2 + 260);
        this.addChild(catapult);

        this.interactive = true;
        this.hitArea = this.screen; //new PIXI.Rectangle(0, 0, this.screen.width, this.screen.height - 100);

        this.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (e.y < this.screen.height - 100) {
                // @ts-ignore
                this.emit('fireForPlayer', { ammoId: this.ammoChoice, x: e.x, y: e.y });
            }
        });

        interface IFireForPlayerEvent {
            x: number;
            y: number;
            ammoId: number;
        }
        
        // @ts-ignore
        this.on('fireForPlayer', (e: IFireForPlayerEvent) => {
            let target: Point = new Point(e.x, e.y)
            let ammo = new Emoji(e.ammoId, catapult.position, target, this.ticker)
            this.addChild(ammo);
            this.ammos.push(ammo);
        });

        interface IZombieHitCityEvent {
            city: City;
            zombie: Zombie;
        }
// @ts-ignore
        this.on('zombieHitCity', (e: IZombieHitCityEvent) => {
            const { city, zombie } = e;
            // city.health -= 10;
            zombie.destroy();
            city.destroy();
            this.cities = this.cities.filter(x => !x.destroyed);
            this.zombies = this.zombies.filter(x => !x.destroyed);
        });



        interface IButtonPressedEvent {
            id: number;
        }
// @ts-ignore
        this.on('buttonPressed', (e: IButtonPressedEvent) => {
            this.ammoChoice = e.id;
        });

        interface IAmmoHitZombieEvent {
            ammo: Emoji;
            zombie: Zombie;
        }
// @ts-ignore
        this.on('ammoHitZombie', (e: IAmmoHitZombieEvent) => {
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
            this.ammos = this.ammos.filter(x => !x.destroyed);
        });

        interface IZombieReturnHomeEvent {
            zombie: Zombie;
        }
        // @ts-ignore
        this.on('zombieReturnHome', (e: IZombieReturnHomeEvent) => {
            this.coins += e.zombie.reward;
            this.enemiesReturned += 1;
            e.zombie.destroy();
            this.zombies = this.zombies.filter(x => !x.destroyed);
        })

        const spawnRate: number = Config.levels[currentLevel].zombieSpawnRate;
        let timeTillNextSpawn: number = spawnRate;

        this.ticker.add((delta: number) => {

            timeTillNextSpawn -= delta / 100;

            this.counter.text = `${this.enemiesReturned}/${Config.levels[this.currentLevel].enemiesCount}`;

            if (this.enemiesReturned === Config.levels[this.currentLevel].enemiesCount) {
                // @ts-ignore
                stage.emit('changeLevel', { newLevel: this.currentLevel + 1 });
                return;
            }

            for (let ammo of this.ammos) {
                if (ammo.destroyed) {
                    this.removeChild(ammo);
                    continue;
                }

                for (let zombie of this.zombies) {
                    if (ammo.containsPoint(zombie.position)) {
                        // @ts-ignore
                        this.emit('ammoHitZombie', { ammo, zombie });
                        return;
                    }
                }
            }

            for (let zombie of this.zombies) {
                for (let city of this.cities) {
                    if (city.containsPoint(zombie.position)) {
                        // @ts-ignore
                        this.emit('zombieHitCity', { city, zombie });
                        return;
                    }
                }

                if (zombie.y < 240) {
                    // @ts-ignore
                    this.emit('zombieReturnHome', { zombie });
                    return;
                }

                if (zombie.y > this.screen.height / 2 + 160) {
                    zombie.destroy();
                    this.zombies.filter(x => !x.destroyed);
                    return;
                }
            }

            if (this.cities.length <= 0) {
                // @ts-ignore
                stage.emit('changeScene', { scene: 'credits' });
            }

            if (timeTillNextSpawn <= 0) {
                let zombie = new Zombie(0, getLaneXPosition(this.screen.width, randomInteger(2)), 240, this.ticker);
                this.zombies.push(zombie);
                this.addChild(zombie);
                timeTillNextSpawn = spawnRate;
            }




        });



    }
}