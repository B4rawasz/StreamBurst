import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { app as electronApp } from "electron";
import path from "path";
import { isDev } from "../utils.js";

interface Server {
	app: express.Express;
	server: http.Server;
	io: SocketServer;
	enabled: boolean;
	start(port: number): void;
	stop(): void;
}

class Server implements Server {
	app: express.Express;
	server: http.Server;
	io: SocketServer;
	enabled: boolean;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);
		this.io = new SocketServer(this.server);
		this.enabled = false;

		this.app.use(
			express.static(path.join(electronApp.getPath("userData"), "public"))
		);

		this.io.on("connection", (socket) => {
			if (isDev()) {
				console.log("Client connected: ", socket.id);
			}

			socket.on("disconnect", () => {
				if (isDev()) {
					console.log("Client disconnected: ", socket.id);
				}
			});
		});
	}

	start(port: number) {
		if (this.enabled) {
			return;
		}

		this.enabled = true;

		this.server.listen(port, () => {
			if (isDev()) {
				console.log("Server started on port: ", port);
			}
		});
	}

	stop() {
		if (!this.enabled) {
			return;
		}

		this.enabled = false;

		this.server.close(() => {
			if (isDev()) {
				console.log("Server stopped");
			}
		});
	}

	emit(event: string, data: any) {
		if (!this.enabled) return;

		if (isDev()) {
			console.log("Emitting event: ", event, data);
		}

		this.io.emit(event, data);
	}
}

export default Server;
