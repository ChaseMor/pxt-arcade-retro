class Player {

    sprite: Sprite;
    normalImage: Image;
    flippedNormalImage: Image;
    attackingImage: Image;
    flippedAttackingImage: Image;
    attackingTime: number;
    attacking: boolean;
    lookingRight: boolean;


    constructor(img: Image) {
        this.sprite = sprites.create(img);
        this.normalImage = img;
        this.flippedNormalImage = img.clone();
        this.flippedNormalImage.flipX();
        game.currentScene().eventContext.registerFrameHandler(19, () => {
            this.sprite.vx = 0;
            this.sprite.vy = 0;

            if (!this.attacking) {
                if (controller.A.isPressed()) {
                    this.attack();
                } else {
                    if (controller.left.isPressed()) {
                        this.sprite.vx = -retro.X_VELOC;
                        this.lookingRight = false;
                        this.sprite.setImage(this.flippedNormalImage);
                    }

                    if (controller.right.isPressed()) {
                        this.sprite.vx = retro.X_VELOC;
                        this.lookingRight = true;
                        this.sprite.setImage(this.normalImage);
                    }

                    // Weird Occilatating bug if both up and down are pressed
                    if (controller.down.isPressed() && !controller.up.isPressed()) {
                        this.sprite.vy = retro.Y_VELOC;
                    }
                    if (this.sprite.y > retro.HORIZON_LINE) {
                        if (controller.up.isPressed()) {
                            this.sprite.vy = -retro.Y_VELOC;
                        }
                    } else {
                        this.sprite.y = retro.HORIZON_LINE;
                    }
                }
            }

        });

        
        this.sprite.setFlag(SpriteFlag.StayInScreen, true);
        this.attackingTime = 400;
        this.attacking = false;
        this.lookingRight = true;

    }

    setSpriteImage(img: Image) {
        this.sprite.setImage(img);
    }

    setAttackingImage(img: Image) {
        this.attackingImage = img;
        this.flippedAttackingImage = img.clone();
        this.flippedAttackingImage.flipX();
    }

    attack() {
        this.attacking = true;
        this.sprite.setImage(this.lookingRight ? this.attackingImage : this.flippedAttackingImage);
        loops.pause(this.attackingTime);
        this.attacking = false;
        this.sprite.setImage(this.lookingRight ? this.normalImage : this.flippedNormalImage);
    }

}