import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { app as electronApp } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "../utils.js";
import { mainLogger } from "../logger.js";

const logger = mainLogger.createModuleLogger("Server");

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

		this.app.get("/logs", (req: Request, res: Response) => {
			const logsPath = path.join(electronApp.getPath("userData"), "public", "StreamBurst", "logs.html");

			if (fs.existsSync(logsPath)) {
				res.sendFile(logsPath);
			} else {
				res.status(404).send("Logs page not found.");
			}
		});

		this.app.use((req: Request, res: Response, next: NextFunction): void => {
			const requestedPath = path.join(electronApp.getPath("userData"), "public", req.path);

			// Check if the requested path is a directory
			if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isDirectory()) {
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

		this.app.use(express.static(path.join(electronApp.getPath("userData"), "public")));

		this.io.on("connection", (socket) => {
			logger.http("Client connected", socket.id);

			socket.on("disconnect", () => {
				logger.http("Client disconnected", socket.id);
			});
		});

		this.io.of("/logs").on("connection", (socket) => {
			logger.http("Client connected to logs", socket.id);

			socket.on("disconnect", () => {
				logger.http("Client disconnected from logs", socket.id);
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
			logger.info(`Server started on port ${port}`);
		});
	}

	stop() {
		if (!this.enabled) {
			return;
		}

		this.enabled = false;

		this.server.close(() => {
			logger.info("Server stopped");
		});
	}

	emit(event: string, data: any) {
		if (!this.enabled) return;

		this.io.emit(event, data);
	}
}

export default Server;
