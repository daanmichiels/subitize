let state = "get_ready";
let t0 = 0.0;

let pattern = [];

function draw() {
	let canvas = document.getElementById("content");
	let ctx = canvas.getContext("2d");
	let w = canvas.clientWidth;
	let h = canvas.clientHeight;
	ctx.clearRect(0, 0, w, h);
	ctx.beginPath();
	let radius = 0.9 * Math.min(w / 2, h / 2);
	ctx.arc(w / 2, h / 2, radius, 0, 2 * Math.PI);
	ctx.lineWidth = 3;
	ctx.stroke();

	if (state === "get_ready") {
		ctx.font = (0.25 * radius) + "px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Get ready...", w / 2, h / 2);
	}
	else if (state === "showing_question") {
		draw_dots(ctx, w, h, radius, false);
	}
	else if (state === "thinking_time") {
		ctx.font = (0.25 * radius) + "px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("How many?", w / 2, h / 2);
	}
	else if (state === "showing_answer") {
		draw_dots(ctx, w, h, radius, true);
		ctx.font = (0.45 * radius) + "px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("" + pattern.length, w / 2, h / 2);
	}
}

function draw_dots(ctx, w, h, radius, fade) {
	for (let i=0; i<pattern.length; ++i) {
		let dot = pattern[i];
		ctx.beginPath();
		if (fade) {
			ctx.fillStyle = dot['color'] + "99";
		} else {
			ctx.fillStyle = dot['color'];
		}
		ctx.arc(w / 2 + dot['x'] * 0.9 * radius, h / 2 + dot['y'] * 0.9 * radius, dot['r'] * radius, 0, 2 * Math.PI);
		ctx.fill();
	}
	ctx.fillStyle = "#000000";
}

function handle_resize() {
	let canvas = document.getElementById("content");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	draw();
}

function step(t1) {
	window.requestAnimationFrame(step);
	let dt = t1 - t0;

	if (state === "get_ready" && dt > 3000) {
		state = "showing_question";
		t0 = t1;
	} else if (state === "showing_question" && dt > 200) {
		state = "thinking_time";
		t0 = t1;
	} else if (state === "thinking_time" && dt > 5000) {
		state = "showing_answer";
		t0 = t1;
	} else if (state === "showing_answer" && dt > 5000) {
		state = "get_ready";
		t0 = t1;
		sample_pattern();
	}
	draw();
}

let dot_colors = [
	"#c94c4c",
	"#034f84",
	"#405d27",
];

function sample_pattern() {
	let n = 2 + Math.floor(Math.random() * 11);
	let dots = [];
	while (dots.length < n) {
		let r = Math.sqrt(Math.random());
		let theta = Math.random() * 2 * Math.PI;
		let x = r * Math.cos(theta);
		let y = r * Math.sin(theta);
		let rr = 0.06 + 0.04 * Math.random();

		let okay = true;
		for (let j=0; j<dots.length; ++j) {
			let other = dots[j];
			let distance2 = 0.0;
			distance2 += (other['x'] - x)**2;
			distance2 += (other['y'] - y)**2;
			if (distance2 < 1.05 * (rr + other['r'])**2) {
				okay = false;
				console.log("hit");
				break;
			}
		}

		if (okay) {
			dots.push({
				'x': x,
				'y': y,
				'r': rr,
				'color': dot_colors[Math.floor(dot_colors.length * Math.random())],
			})
		}
	}
	console.log(dots);
	pattern = dots;
}

function go() {
	handle_resize();
	sample_pattern();
	draw();
	step();
}
