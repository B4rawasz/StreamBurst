/*const socket = io();

socket.on("connect", () => {
	console.log(socket.id);
});

socket.on("disconnect", () => {
	console.log(socket.id);
});*/

class StreamBurst {
	#socket;
	#autoObjects;
	#autoEnabled;

	#events;

	#debug;

	constructor() {
		this.#socket = io();
		this.#autoObjects = [];
		this.#autoEnabled = true;

		this.#events = {};

		this.#debug = false;

		document.addEventListener("DOMContentLoaded", () => {
			this.#autoObjects = document.querySelectorAll(".streamburst");
			this.#autoSwitch();
		});

		this.#socket.on("event", (data) => {
			data = JSON.parse(data);
			if (this.#debug) {
				console.log(data);
			}

			if (this.#events[data.emitter + data.eventId]) {
				this.#events[data.emitter + data.eventId].forEach((callback) => {
					callback(data);
				});
			}

			if (this.#autoEnabled) {
				this.#autoAnimate(data);
			}
		});

		this.#socket.on("debug", (data) => {
			if (this.#debug) {
				data = JSON.parse(data);
				console.log(data);
			}
		});

		this.#socket.on("error", (data) => {
			if (this.#debug) {
				data = JSON.parse(data);
				console.log(data);
			}
		});
	}

	// Public Methods
	on(event, callback) {
		this.#socket.on(event, callback);
	}

	on(module, eventId, callback) {
		if (!this.#events[module + eventId]) {
			this.#events[module + eventId] = [];
		}
		this.#events[module + eventId].push(callback);
	}

	enableAuto() {
		this.#autoEnabled = true;
		this.#autoSwitch();
	}

	disableAuto() {
		this.#autoEnabled = false;
		this.#autoSwitch();
	}

	enableDebug() {
		this.#debug = true;
	}

	disableDebug() {
		this.#debug = false;
	}

	// Private Methods
	#autoSwitch() {
		if (this.#autoEnabled) {
			this.#autoObjects.forEach((object) => {
				object.style.visibility = "hidden";
			});
		} else {
			this.#autoObjects.forEach((object) => {
				object.style.visibility = "visible";
			});
		}
	}

	#autoAnimate(data) {
		this.#autoObjects.forEach((object) => {
			if (object.id == data.emitter + "-" + data.eventId) {
				object.style.visibility = "visible";
				object.animate(
					[{ opacity: 0 }, { opacity: 0.9 }, { opacity: 1 }, { opacity: 0 }],
					{
						duration: 2000,
						easing: "ease-in-out",
					}
				).onfinish = () => {
					object.style.visibility = "hidden";
				};
			}
		});
	}
}

const sb = new StreamBurst();
