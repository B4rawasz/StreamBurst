import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { app as electronApp } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "../utils.js";

interface Server {
	app: express.Express;
	server: http.Server;
	io: SocketServer;
	enabled: boolean;
	port: number;
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
		this.port = 0;

		this.app.use((req: Request, res: Response, next: NextFunction): void => {
			const requestedPath = path.join(
				electronApp.getPath("userData"),
				"public",
				req.path
			);

			// Check if the requested path is a directory
			if (
				fs.existsSync(requestedPath) &&
				fs.statSync(requestedPath).isDirectory()
			) {
				const indexPath = path.join(requestedPath, "index.html");

				if (fs.existsSync(indexPath)) {
					const fileContent = fs.readFileSync(indexPath, "utf8");
					const modifiedContent = fileContent.replace(
						"<head>",
						"<head><script src='/socket.io/socket.io.js'></script><script src='http://localhost:" +
							this.port +
							"/StreamBurst/stream_burst.js'></script>"
					);
					res.send(modifiedContent);
					return;
				}
			}

			// If no matching folder or index.html, continue to next middleware (404 handler)
			next();
		});

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
		this.port = port;

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
