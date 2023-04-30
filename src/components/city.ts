import { Sprite, Texture } from "pixijs";

type CityType = 'Player' | 'Enemy'

export default class City extends Sprite {
    health: number;
    type: CityType;
    constructor(id: number, x: number, y: number) {
        super(Texture.from(`cities/region_${id}.png`));

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);

        this.interactive = true;

        this.health = 100;

        this.type = 'Player';
    }


}
