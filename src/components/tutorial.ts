import { Container, DisplayObject, Sprite, Rectangle, Ticker, Text } from "pixijs";

export default class Tutorial extends Container<DisplayObject> {
    constructor(screen: Rectangle, ticker: Ticker, stage: Container<DisplayObject>) {
        super();

        let display = Sprite.from('tutorial.png');
        display.x = screen.width / 2;
        display.y = screen.height / 2;
        display.anchor.set(0.5);
        display.scale.set(0.8);
        this.addChild(display);

        let caption = new Text(`Tap to start`, {
            fill: "#fff",
            fontSize: 14,
            fontWeight: 'bold',
        });
        caption.anchor.set(0.5);
        caption.x = screen.width / 2;
        caption.y = screen.height - 25;
        this.addChild(caption);

        this.interactive = true;

        ticker.add(() => {});

        this.on('pointerdown', () => {
            // @ts-ignore
            stage.emit('changeScene', { scene: 'level' });
        });
    }
}