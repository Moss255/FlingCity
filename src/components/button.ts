import { Container, DisplayObject, Sprite, Texture, Ticker } from "pixijs";
import Config from '../config.json';

export default class Button extends Sprite {
    type: number;
    cooldown: number;

    constructor(id: number, x: number, y: number, stage: Container<DisplayObject>, ticker: Ticker) {
        super(Texture.from(Config.actions[id].filepath));

        this.type = id;

        this.x = x;
        this.y = y;
        this.anchor.set(0.5);

        this.interactive = true;

        this.cooldown = Config.actions[id].cooldown;

        this.scale.set(2);

        this.on('pointerdown', () => {
            // this.cooldown = Config.actions[id].cooldown;
            // @ts-ignore
            stage.emit('buttonPressed', { id });
        });

        ticker.add(() => {});
    }
}