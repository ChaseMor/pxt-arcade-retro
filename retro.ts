//% color=#9BED0D
//% weight=50 
//% icon="\uf11b"
//% block="Retro"
namespace retro {

    export const HORIZON_LINE: number = 60;
    export const X_VELOC: number = 80;
    export const Y_VELOC: number = 80;

    class Player {

        sprite: Sprite;
        constructor(img: Image) {
            this.sprite = sprites.create(img, SpriteKind.Player);
            game.currentScene().eventContext.registerFrameHandler(19, () => {
            this.sprite.vx = 0;

            if (controller.left.isPressed()) {
                this.sprite.vx = -X_VELOC;
            }

            if (controller.right.isPressed()) {
                this.sprite.vx = X_VELOC;
            }

            this.sprite.vy = 0;

            // Weird Occilatating bug if both up and down are pressed
            if (controller.down.isPressed() && !controller.up.isPressed()) {
                this.sprite.vy = Y_VELOC;
            }
            if (this.sprite.y > HORIZON_LINE) {
                if (controller.up.isPressed()) {
                    this.sprite.vy = -Y_VELOC;
                }
            } else {
                this.sprite.y = HORIZON_LINE;
            }
        });

       this.sprite.setFlag(SpriteFlag.StayInScreen, true);
        
        }
    }

    enum SpriteKind {
        Player = 0,
        Enemy
    }

    let retroEnabled: boolean;
    export let player: Player;

    /**
     * Set the scene for the game
     */
    //% weight=100
    //% blockId=retrosetscene block="set scene to %img=background_image_picker"
    export function setScene(img: Image) {
        const scene = game.currentScene();
        scene.background.image = img;
        retroEnabled = true;
    }

    /**
     * Sets the sprite of the player
     */
    //% weight=100
    //% blockId=retrosetplayer block="set player sprite to %img=screen_image_picker"
    export function setPlayerSprite(img: Image) {
        player = new Player(img);
    }
}