import winston from "winston";
import Transport from "winston-transport";
import { isDev } from "./utils.js";
import Server from "./server/server.js";
import colors from "@colors/colors";

// Declare custom log levels for TypeScript
declare module "winston" {
	interface Logger {
		event: winston.LeveledLogMethod;
	}
}

interface LogEntry {
	timestamp: string;
	level: string;
	message: string;
	module: string;
	meta?: any;
}

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	event: 4,
	debug: 5,
};

class SocketTransport extends Transport {
	private server?: Server;

	constructor(opts: any = {}) {
		super(opts);
	}

	setServer(server: Server) {
		this.server = server;
	}

	log(info: any, callback: () => void) {
		setImmediate(() => {
			this.emit("logged", info);
		});

		if (this.server) {
			const logEntry: LogEntry = {
				timestamp: info.timestamp,
				level: info.level,
				message: info.message,
				module: info.module || "unknown",
				meta: info.meta,
			};

			this.server.io.of("/logs").emit("log", logEntry);
		}

		callback();
	}
}

class ConsoleTransport extends Transport {
	constructor(opts: any = {}) {
		super(opts);
	}

	log(info: any, callback: () => void) {
		setImmediate(() => {
			this.emit("logged", info);
		});

		let message = `[${info.level.toUpperCase()}] ${info.timestamp} | ${info.module || "unknown"}: ${info.message}`;

		switch (info.level) {
			case "error":
				message = colors.red(message);
				break;
			case "warn":
				message = colors.yellow(message);
				break;
			case "info":
				message = colors.green(message);
				break;
			case "http":
				message = colors.cyan(message);
				break;
			case "event":
				message = colors.magenta(message);
				break;
			case "debug":
				message = colors.blue(message);
				break;
			default:
				message = colors.white(message);
				break;
		}

		if (info.meta) {
			console.log(message, info.meta);
		} else {
			console.log(message);
		}

		callback();
	}
}

class Logger {
	private logger: winston.Logger;
	private socketTransport: SocketTransport;

	constructor() {
		this.socketTransport = new SocketTransport({ level: "debug" });

		this.logger = winston.createLogger({
			levels: levels,
			level: isDev() ? "debug" : "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				winston.format.json()
			),
			transports: [new ConsoleTransport(), this.socketTransport],
		});
	}

	createModuleLogger(module: string) {
		return {
			debug: (message: string, meta?: any) => this.logger.debug(message, { module, meta }),
			info: (message: string, meta?: any) => this.logger.info(message, { module, meta }),
			warn: (message: string, meta?: any) => this.logger.warn(message, { module, meta }),
			error: (message: string, meta?: any) => this.logger.error(message, { module, meta }),
			http: (message: string, meta?: any) => this.logger.http(message, { module, meta }),
			event: (message: string, meta?: any) => this.logger.event(message, { module, meta }),
		};
	}

	setServer(server: Server) {
		this.socketTransport.setServer(server);
	}
}

export const mainLogger = new Logger();
export type { LogEntry };
