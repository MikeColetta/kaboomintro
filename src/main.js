import kaboom from "kaboom"

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 1000;
let score = 0;

const k = kaboom()

k.setGravity(1600)
k.loadSprite("bean", "sprites/bean.png")

scene("game", () => {
	const player = add([
		k.sprite("bean"),
		k.pos(80, 40),
		k.area(),
		k.body()
	])

	// .jump() when "space" key is pressed
	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE);
		}
	});

	// add platform
	const ground = add([
		k.rect(width(), 48),
		k.pos(0, height() - 48),
		k.outline(4),
		k.area(),
		k.body({ isStatic: true }),
		k.color(127, 200, 255),
	])

	// add tree loop to have them spawn randomly x number of seconds
	function spawnTree() {
		add([
			rect(48, 64),
			area(),
			outline(4),
			pos(width(), height() - 48),
			anchor("botleft"),
			color(255, 180, 255),
			move(LEFT, 500),
			"tree",
		]);
		wait(rand(1, 1.75), () => {
			spawnTree();
		});
	}

	spawnTree();

	// collision check using tree tag
	player.onCollide("tree", () => {
		addKaboom(player.pos);
		shake();
		go("lose"); // go to "lose" scene here
	});

	const scoreLabel = add([
		text(score),
		pos(24, 24)
	])

	// increment score every frame
	onUpdate(() => {
		score++;
		scoreLabel.text = score;
	});
});

go("game")

scene("lose", () => {
	add([
		k.text("GameOver"),
		k.pos(center()),
		k.anchor("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		anchor("center"),
	]);

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"));
	onClick(() => go("game"));
})