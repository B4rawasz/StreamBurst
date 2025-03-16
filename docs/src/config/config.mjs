const config = {
	basePath: "/StreamBurst",
	footerEnabled: ["app"],
};

export const basePath =
	process.env.NODE_ENV == "development" ? "" : config.basePath;

export const isDev = process.env.NODE_ENV == "development";

export function footerEnabled(page) {
	return config.footerEnabled.includes(page);
}
