import { io, Manager } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const container = document.getElementById("container");
const popup = document.getElementById("popup");

const modules = {};

popup.querySelector("div").addEventListener("click", (event) => {
	event.stopPropagation();
});

popup.addEventListener("click", () => {
	popup.style.display = "none";
});

function createModuleContainer(name) {
	const moduleContainer = document.createElement("div");
	moduleContainer.className = "logs-container";
	moduleContainer.id = name;
	moduleContainer.innerHTML = `<span>${name}</span><div class="logs"></div>`;
	container.appendChild(moduleContainer);
	modules[name] = moduleContainer;
}

function createLogEntry(module, data) {
	const logEntry = document.createElement("div");
	logEntry.className = "log";
	switch (data.level) {
		case "error":
			logEntry.classList.add("error");
			break;
		case "warn":
			logEntry.classList.add("warn");
			break;
		case "info":
			logEntry.classList.add("info");
			break;
		case "http":
			logEntry.classList.add("http");
			break;
		case "event":
			logEntry.classList.add("event");
			break;
		case "debug":
			logEntry.classList.add("debug");
			break;
	}
	const type = document.createElement("span");
	const message = document.createElement("span");
	const timestamp = document.createElement("span");

	type.innerText = data.level.toUpperCase();
	message.innerText = data.message;
	timestamp.innerText = new Date(data.timestamp).toLocaleString();

	logEntry.appendChild(type);
	logEntry.appendChild(message);
	logEntry.appendChild(timestamp);

	logEntry.addEventListener("click", () => {
		popup.querySelector("#popup-title").innerText = data.module + " - " + data.level.toUpperCase();
		popup.querySelector("#popup-message").innerText = data.message;
		popup.querySelector("#popup-timestamp").innerText = new Date(data.timestamp).toLocaleString();
		if (data.meta) {
			const metaContent = JSON.stringify(data.meta, null, 2);
			popup.querySelector("#popup-content").textContent = metaContent;
			popup.querySelector("#popup-content").style.whiteSpace = "pre";
		} else {
			popup.querySelector("#popup-content").textContent = "No additional data";
		}
		popup.style.display = "flex";
	});

	module.querySelector(".logs").appendChild(logEntry);
}

createModuleContainer("System");

const manager = new Manager();

const socket = manager.socket("/logs");

socket.on("connect", () => {
	console.log("Connected to the logs stream");
});

socket.on("log", (data) => {
	console.log(data);

	if (data.module == "Main" || data.module == "Utils" || data.module == "Server") {
		createLogEntry(modules["System"], data);
		return;
	}

	if (!modules[data.module]) {
		createModuleContainer(data.module);
	}

	createLogEntry(modules[data.module], data);
});
