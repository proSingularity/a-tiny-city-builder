import { Physics, Scene } from "phaser";
import { House } from "../utils/Entity";
import { IPoint } from "../utils/IPoint";
import { Sprite } from "../utils/Sprite";
import { Hobo } from "./jobs/Hobo";
import { IJob } from "./jobs/IJob";

const MIN_DISTANCE_TO_TARGET = 5;
const SPEED = 200; // px per frame

export class Citizen extends Physics.Arcade.Sprite {
    public idle = true;
    public target?: Sprite; // move towards this target if defined
    public home?: House;
    public job: IJob = new Hobo();

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "citizen");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.blocked = {
            none: true,
            down: false,
            left: false,
            right: false,
            up: false,
        };
    }

    public move(to: Sprite) {
        const Vector = Phaser.Math.Vector2;
        const location = new Vector(this.x, this.y);
        const goal = new Vector(to.x, to.y);
        const direction = goal
            .add(location.negate())
            .normalize()
            .scale(SPEED);
        this.setVelocity(direction.x, direction.y);
    }

    public setJob(job: IJob) {
        this.job = job;
    }

    public setIdle(val: boolean) {
        this.idle = val;
    }

    public preUpdate() {
        this.job.update();
        if (!this.target) {
            this.maybeGoHome();
            return;
        }
        if (this.isCloseToTarget()) {
            this.setVelocity(0);
        } else {
            this.move(this.target);
        }
    }

    public maybeGoHome() {
        this.idle = true;
        if (this.home) {
            this.target = this.home;
        }
    }

    public setTarget(target: Sprite | undefined) {
        this.target = target;
    }

    public isCloseToTarget() {
        if (!this.target) {
            return false;
        }
        const dist = this.dist(this.target);
        return dist < MIN_DISTANCE_TO_TARGET;
    }

    public dist(other: IPoint) {
        return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
    }
}
