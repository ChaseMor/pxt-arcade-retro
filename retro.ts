//% color=#9BED0D
//% weight=50 
//% icon="\uf11b"
//% block="Retro"
namespace retro {

    export const HORIZON_LINE: number = 60;
    export let X_VELOC: number = 80;
    export let Y_VELOC: number = 50;

    // May remove these. Functionality is already in place for sprites
    export enum PlayerProperties {
        //% block="x (horizontal position)"
        X = 1,
        //% block="y (vertical position)"
        Y,
        //% block="vx (velocity x)"
        VX,
        //% block="vy (velocity y)"
        VY,
        //% block="ax (acceleration x)"
        AX,
        //% block="ay (acceleration y)"
        AY,
        //% block="lifespan"
        LIFESPAN,
        //% block="z (depth)"
        Z,
        //% block="left"
        LEFT,
        //% block="right"
        RIGHT,
        //% block="top"
        TOP,
        //% block="bottom"
        BOTTOM
    }

    class Player {

        sprite: Sprite;

        constructor(img: Image) {
            this.sprite = sprites.create(img);
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

        setSpriteImage(img: Image) {
            this.sprite.setImage(img);
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
    //% blockId=retrosetscene p
    //% block="set scene to %scene1=background_image_picker ||, %scene2=background_image_picker"
    //% inlineInputMode=inline
    //% expandableArgumentMode=toggle
    export function setScene(scene1: Image, scene2?: Image) {
        const sc = game.currentScene();
        let camera: scene.RetroCamera = new scene.RetroCamera(scene2 ? 2 : 1);
        sc.camera = camera;
        sc.background = new scene.RetroBackground(camera, scene2 ? [scene1, scene2] : [scene1]);
        retroEnabled = true;
    }


    /**
     * Creates the player with the given image
     */
    //% weight=100
    //% blockId=retrocreateplayer block="create player with image %sprite=screen_image_picker"
    export function setCreatePlayer(img: Image) {
        player = new Player(img);
        const sc = game.currentScene();
        sc.camera.sprite = player.sprite;

    }

    /**
     * Sets the image of the player
     */
    //% weight=10
    //% blockId=retrosetplayerimage block="change player image to %img=screen_image_picker"
    export function setPlayerImage(img: Image) {
        player.setSpriteImage(img);
    }

    /**
     * Returns the sprite of the player
     */
    //% weight=100
    //% blockId=retrogetplayersprite block="get player sprite"
    export function getPlayerSprite(): Sprite {
        return player.sprite;
    }

    /**
     * Set the value of a given property
     */
    //% weight=100
    //% blockId=retrosetprop block="set player's %prop to %value"
    export function setProperty(prop: PlayerProperties, value: number) {
        if (!player) {
            return;
        }
        switch (prop) {
            case PlayerProperties.X:
                player.sprite.x = value;
                break;
            case PlayerProperties.Y:
                player.sprite.y = value;
                break;
            case PlayerProperties.VX:
                player.sprite.vx = value;
                break;
            case PlayerProperties.VY:
                player.sprite.vy = value;
                break;
            case PlayerProperties.AX:
                player.sprite.ax = value;
                break;
            case PlayerProperties.AY:
                player.sprite.ay = value;
                break;
            case PlayerProperties.LIFESPAN:
                player.sprite.lifespan = value;
                break;
            case PlayerProperties.Z:
                player.sprite.z = value;
                break;
            case PlayerProperties.LEFT:
                player.sprite.left = value;
                break;
            case PlayerProperties.RIGHT:
                player.sprite.right = value;
                break;
            case PlayerProperties.TOP:
                player.sprite.top = value;
                break;
            case PlayerProperties.BOTTOM:
                player.sprite.bottom = value;
                break;
        }
    }

    /**
     * Gets the value of a given property
     */
    //% weight=100
    //% blockId=retrogetprop block="get player's %prop"
    export function getProperty(prop: PlayerProperties): number {
        if (!player) {
            return 0;
        }
        switch (prop) {
            case PlayerProperties.X:
                return player.sprite.x;
            case PlayerProperties.Y:
                return player.sprite.y;
            case PlayerProperties.VX:
                return player.sprite.vx;
            case PlayerProperties.VY:
                return player.sprite.vy;
            case PlayerProperties.AX:
                return player.sprite.ax;
            case PlayerProperties.AY:
                return player.sprite.ay;
            case PlayerProperties.LIFESPAN:
                return player.sprite.lifespan;
            case PlayerProperties.Z:
                return player.sprite.z;
            case PlayerProperties.LEFT:
                return player.sprite.left;
            case PlayerProperties.RIGHT:
                return player.sprite.right;
            case PlayerProperties.TOP:
                return player.sprite.top;
            case PlayerProperties.BOTTOM:
                return player.sprite.bottom;
        }
    }
}
