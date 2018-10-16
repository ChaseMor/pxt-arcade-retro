namespace scene {
	export class RetroBackground extends Background {

		scenes: Image[];
		constructor(camera: Camera, scenes: Image[]) {
			super(camera);
			this.scenes = scenes;
            this.color = 0;
            this.camera = camera;
        }

        render() {
            screen.fill(this.color);
            for (let i = 0; i < this.scenes.length; i++) {
                screen.drawImage(this.scenes[i], -this.camera.offsetX + (screen.width * i), 0);
            }
        }
	}

    export class RetroCamera extends Camera {

        numOfScenes: number;
        constructor(scenes: number) {
            super();
            this.numOfScenes = scenes;
        }

        update() {
            const scene = game.currentScene();

            // if sprite, follow sprite
            if (this.sprite && retro.canFreeRoam()) {
                this.offsetX = this.sprite.x - (screen.width >> 1);
            }
            this.offsetX = Math.clamp(0, screen.width * (this.numOfScenes - 1), this.offsetX);
        }
    }
}