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


    enum SpriteKind {
        Player = 0,
        Enemy
    }


    
    interface Handler {
        handler: (player: Player, enemy: Enemy) => void;
    }
    

    controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
        if (!player.attacking) {
            control.runInParallel(() => player.attack());
        }
    });


    let retroEnabled: boolean;
    export let player: Player;
    export let enemies: Enemy[];
    export let _overrideRoam = false;
    let _onHurtHandlers : Handler[] = [];
    let _onHitHandlers : Handler[] = [];


    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (playerSprite, enemySprite) {
        if (player.attacking && (playerSprite.x < enemySprite.x == player.lookingRight)) {
            _onHitHandlers
            .forEach(h => control.runInParallel(() => h.handler(player, getEnemyFromSprite(enemySprite))));
        } else {
            _onHurtHandlers
            .forEach(h => control.runInParallel(() => h.handler(player, getEnemyFromSprite(enemySprite))));
        }
    });

    /**
     * Set the scene for the game
     */
    //% weight=100
    //% blockId=retrosetscene p
    //% block="set scene to %scenes"
    //% inlineInputMode=inline
    //% expandableArgumentMode=toggle
    export function setScene(scenes: Image[]) {
        const sc = game.currentScene();
        let camera: scene.RetroCamera = new scene.RetroCamera(scenes.length);
        sc.camera = camera;
        sc.background = new scene.RetroBackground(camera, scenes);
        enemies = [];
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
     * Sets the attacking image of the player
     */
    //% weight=10
    //% blockId=retrosetattackimage block="change player attacking image to %img=screen_image_picker"
    export function setAttackingPlayerImage(img: Image) {
        player.setAttackingImage(img)
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
     * Adds in an enemy
     */
    //% weight=10
    //% blockId=retroaddenemy block="add enemy %img=screen_image_picker"
    export function addEnemy(img: Image) {
        let enemy: Enemy = new Enemy(sprites.create(img, SpriteKind.Enemy), enemies);
        enemy.sprite.x = game.currentScene().camera.offsetX + (Math.randomRange(0, 1) * screen.width);
        enemy.sprite.y = Math.randomRange(HORIZON_LINE,screen.height);
        enemy.setTarget(player);
        enemies.push(enemy);
    }

    /**
     * Can free roam
     */
    //% weight=10
    //% blockId=retrocanfreeroam block="can free roam"
    export function canFreeRoam(): boolean {
        if (_overrideRoam) {
            return _overrideRoam;
        }
        return !enemies || enemies.length == 0;
    }

    /**
     * Run code when the player is hurt by an enemy
     */
    //% group="Events"
    //% weight=10 draggableParameters
    //% blockId=retroonhurt block="on $player hurt by $enemy"
    export function onHurt(handler: (player: Player, enemy: Enemy) => void) {
        _onHurtHandlers.push({
            handler: handler
        });
    }
    
    /**
     * Run code when the player hits an enemy
     */
    //% group="Events"
    //% weight=10 draggableParameters
    //% blockId=retroonhit block="on $player hits $enemy"
    export function onHit(handler: (player: Player, enemy: Enemy) => void) {
        _onHitHandlers.push({
            handler: handler
        });
    }

    /**
     * Destroy the given enemy
     */
    //% weight=10
    //% blockId=retrodstroyenemy block="destroy $enemy"
    export function destroyEnemy(enemy: Enemy) {
        enemy.kill();
    }

    /**
     * Set an enemy's target
     */
    //% weight=10 
    //% blockId=retroenemytarget block="have $enemy follow $player"
    export function setEnemyTarget(enemy: Enemy, player: Player) {
        enemy.setTarget(player);
    }

    function getEnemyFromSprite(sprite: Sprite): Enemy {
        for (let enemy of enemies) {
            if (enemy.sprite.id == sprite.id) {
                return enemy
            }
        }
        return null;
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
