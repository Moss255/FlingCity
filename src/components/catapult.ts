import { Sprite, Texture } from "pixijs";

export default class Catapult extends Sprite {
    constructor(x: number, y: number) {
        super(Texture.from('catapult.png'));

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);
    }
}