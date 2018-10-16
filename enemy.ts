class Enemy {
	sprite: Sprite;
	target: Player;
	allEnemies: Enemy[];
	speed: number;

	constructor(sprite: Sprite, allEnemies: Enemy[]) {
		this.sprite = sprite;
		this.allEnemies = allEnemies;
		this.sprite.onDestroyed(function() {
			allEnemies.removeElement(this);
		});
		this.speed = 20;
	}

	setTarget(target: Player) {
		this.target = target;

        game.currentScene().eventContext.registerFrameHandler(15, () => {
			let xDiff: number = this.target.sprite.x - this.sprite.x;
			let yDiff: number = this.target.sprite.y - this.sprite.y;
			let dist: number = Math.sqrt((xDiff)**2 + (yDiff)**2);
			this.sprite.vx = this.speed * xDiff / dist;
			this.sprite.vy = this.speed * yDiff / dist;
		});
	}

	kill() {
		this.sprite.destroy();
	}
}