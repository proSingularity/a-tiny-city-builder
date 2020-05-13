import { GameObjects, Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";
import { atCenter } from "../../utils/atCenter";
import { IPoint } from "../../utils/IPoint";
import { PostIt } from "./PostIt";

export class PostItWithImage {
    public readonly postIt: PostIt;
    public readonly image: GameObjects.Image;

    constructor(
        scene: Scene,
        at: IPoint,
        cfg: {
            component: {
                texture: string;
                scale?: number;
            };
            onPointerup: () => void;
            scale?: number;
        }
    ) {
        this.postIt = new PostIt(scene, at, cfg);
        const center = atCenter(this.postIt);
        this.image = scene.add
            .image(center.x, center.y, cfg.component.texture)
            .setDepth(GUI_DEPTH);
        if (cfg.component.scale) {
            this.image.setScale(cfg.component.scale);
        }
    }
}