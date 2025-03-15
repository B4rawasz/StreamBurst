import { createMDX } from "fumadocs-mdx/next";
import { basePath } from "./src/config/config.mjs";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "export",
	images: {
		unoptimized: true,
	},
	basePath: basePath,
};

export default withMDX(nextConfig);
