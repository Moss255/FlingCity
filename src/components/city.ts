import { Sprite, Texture } from "pixijs";

type CityType = 'Player' | 'Enemy'

export default class City extends Sprite {
    health: number;
    type: CityType;
    constructor(texture: Texture, x: number, y: number, health: number) {
        super(texture);

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);
        this.scale.set(1.5);

        this.interactive = true;

        this.health = health;

        this.type = 'Player';
    }


}
