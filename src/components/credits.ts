import { Rectangle } from "@pixi/math";
import { Container, DisplayObject, Text, Sprite } from "pixijs";

export default class Credits extends Container<DisplayObject> {
    constructor(screen: Rectangle) {
        super();


        let map = Sprite.from('map.png');
        this.addChild(map);

        let credits = new Text(`Thank you for playing!`, {
            fill: "#fff",
            fontSize: 20,
            fontWeight: 'bold',
        });
        credits.x = screen.width / 2;
        credits.y = screen.height / 2;
        credits.anchor.set(0.5);
        this.addChild(credits);
    }
}