import { Container, DisplayObject, Sprite, Texture } from "pixijs";

export default class Button extends Sprite {
    type: number;
    constructor(id: number, x: number, y: number, stage: Container<DisplayObject>) {
        super(Texture.from(`ammo/region_${id}.png`));

        this.type = id;

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);

        this.interactive = true;

        this.scale.set(2);

        this.on('pointerdown', e => {
            stage.emit('buttonPressed', { id });
        })
    }
}