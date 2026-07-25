import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

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

const directories = ["assets", "images"];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of files) {
	await cp(join(root, file), join(client, file));
}

for (const directory of directories) {
	await cp(join(root, directory), join(client, directory), { recursive: true });
}

const worker = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`;

await writeFile(join(server, "index.js"), worker);

console.log("Static site build complete.");
