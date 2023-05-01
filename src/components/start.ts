import { Rectangle } from "@pixi/math";
import { DisplayObject, Container, Ticker, Text, Sprite } from "pixijs";

export default class Start extends Container<DisplayObject> {
    constructor(screen: Rectangle, ticker: Ticker, stage: Container<DisplayObject>) {
        super();
        
        let map = Sprite.from('map.png');
        this.addChild(map);

        let title = Sprite.from('FlingCityLogo2.png');
        title.anchor.set(0.5);
        title.scale.set(0.8);
        title.x = screen.width / 2;
        title.y = screen.height / 2;
        this.addChild(title);

        

        let caption = new Text(`Tap to start`, {
            fill: "#fff",
            fontSize: 14,
            fontWeight: 'bold',
        });
        caption.anchor.set(0.5);
        caption.x = screen.width / 2;
        caption.y = screen.height / 2 + 200;
        this.addChild(caption);

        this.interactive = true;
        this.hitArea = screen;

        ticker.add(() => {});

        this.on('pointerdown', () => {
            // @ts-ignore
            stage.emit('changeScene', { scene: 'tutorial' });
        });
    }
}