import { Sprite, Texture, Ticker } from "pixijs";
import Config from '../config.json';

type ZombieState = 'Forward' | 'Reverse' | 'Stopped' | 'Rage' | 'Slowed'

export default class Zombie extends Sprite {
    state: ZombieState;
    reward: number;
    constructor(id: number, x: number, y: number, ticker: Ticker) {
        super(Texture.from(`zombies/region_${id}.png`));

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);

        this.reward = 100;

        this.state = 'Forward';

        ticker.add((delta: number) => {
            if (this.destroyed) {
                return;
            }
            switch (this.state) {
                case 'Forward':
                    this.y += delta * Config.zombieSpeed;
                    break;
                case 'Reverse':
                    this.y -= delta * Config.zombieSpeed;
                    break;
                case 'Slowed':
                    this.y += delta * Config.zombieSpeed / 2;
                    break;
                case 'Stopped':
                    break;
                case 'Rage':
                    this.y -= delta * Config.zombieSpeed;

            }
            
        })
    }
}