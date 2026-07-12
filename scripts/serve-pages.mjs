import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const outputRoot = path.resolve(process.cwd(), "out");
const port = Number.parseInt(process.argv[2] ?? "4173", 10);
const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".webmanifest", "application/manifest+json"],
  [".xml", "application/xml; charset=utf-8"],
]);

async function regularFile(candidate) {
  const details = await stat(candidate).catch(() => null);
  return details?.isFile() ? candidate : null;
}

async function resolveRequest(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath.replace(/^\/+/, "");
  const candidate = path.resolve(outputRoot, relativePath);
  const relativeCandidate = path.relative(outputRoot, candidate);

  if (relativeCandidate.startsWith("..") || path.isAbsolute(relativeCandidate)) return null;
  const directFile = await regularFile(candidate);
  if (directFile) return directFile;
  return regularFile(path.join(candidate, "index.html"));
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", "http://static.local");
    const requestedFile = await resolveRequest(requestUrl.pathname);
    const selectedFile = requestedFile ?? await regularFile(path.join(outputRoot, "404.html"));

    if (!selectedFile) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Static output not found. Run npm run build:pages first.");
      return;
    }

    response.writeHead(requestedFile ? 200 : 404, {
      "cache-control": "no-store",
      "content-type": contentTypes.get(path.extname(selectedFile).toLowerCase()) ?? "application/octet-stream",
      "x-content-type-options": "nosniff",
    });

    if (request.method === "HEAD") response.end();
    else createReadStream(selectedFile).pipe(response);
  } catch {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    response.end("Bad request");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${outputRoot} at http://127.0.0.1:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
