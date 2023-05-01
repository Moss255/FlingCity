import { Sprite, Texture } from "pixijs";

export default class Portal extends Sprite {
    constructor(x: number, y: number) {
        super(Texture.from(`portal/region_1.png`));

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);
    }
}