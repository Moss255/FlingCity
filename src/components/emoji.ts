import { Point } from "@pixi/math";
import "@pixi/math-extras";
import * as PIXI from "pixijs";
import { distanceBetweenPoints } from "../utils";
import Config from '../config.json';

export default class Emoji extends PIXI.Sprite {
    type: number;
    constructor(id: number, startPos: PIXI.Point, target: PIXI.Point, ticker: PIXI.Ticker) {
        super(PIXI.Texture.from(`ammo/region_${id}.png`));

        this.x = startPos.x;
        this.y = startPos.y;
        this.anchor.set(0.5);

        this.type = id;

        ticker.add((delta: number) => {
            if (this.destroyed) {
                return;
            }
            let pos = new Point(this.x, this.y);
            let towards = pos.subtract(target).normalize();
            this.position.set(this.position.x - towards.x * Config.baseFiringSpeed, this.position.y - towards.y * Config.baseFiringSpeed);

            let scale = distanceBetweenPoints(pos, target) / 80;

            this.scale.set(scale);

            if (Math.round(pos.x) === target.x && Math.round(pos.y) === target.y || scale <= 0.3) {
                this.destroy();
            }
        });
    }
}