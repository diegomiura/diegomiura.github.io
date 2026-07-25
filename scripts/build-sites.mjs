import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

const files = [
	"index.html",
	"publications.html",
	"leadership.html",
	"projects.html",
	"class-notes.html",
	"favicon.ico",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"apple-touch-icon.png",
	"android-chrome-192x192.png",
	"android-chrome-512x512.png",
	"site.webmanifest",
];

const assets = [
	"assets/css/main.css",
	"assets/css/fontawesome-all.min.css",
	"assets/docs/Liu_2025_ApJ_994_162.pdf",
	"assets/docs/APHY5750_Final_Project_The_Kernel_Trick.pdf",
	"assets/docs/HIST1568_Final_Paper.pdf",
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of files) {
	await cp(join(root, file), join(client, file));
}

for (const asset of assets) {
	const target = join(client, asset);
	await mkdir(dirname(target), { recursive: true });
	await cp(join(root, asset), target);
}

await cp(join(root, "assets/webfonts"), join(client, "assets/webfonts"), {
	recursive: true,
});

const worker = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`;

await writeFile(join(server, "index.js"), worker);

console.log("Static site build complete.");
