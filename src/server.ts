import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createSession, getSession } from "./auth/session.js";
import { createPayment } from "./payments.js";

const PORT = Number(process.env.PORT ?? 3000);

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function requireSession(req: IncomingMessage) {
  const token = req.headers.authorization?.replace(/^Bearer /, "") ?? "";
  return getSession(token);
}

createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      return send(res, 200, { status: "ok" });
    }
    if (req.method === "POST" && req.url === "/sessions") {
      const body = await readJson(req);
      return send(res, 201, createSession(String(body.userId)));
    }
    if (!requireSession(req)) {
      return send(res, 401, { error: "unauthorized" });
    }
    if (req.method === "POST" && req.url === "/payments") {
      const body = await readJson(req);
      return send(res, 201, createPayment(Number(body.amount), body.method as never));
    }
    send(res, 404, { error: "not_found" });
  } catch (err) {
    send(res, 500, { error: (err as Error).message });
  }
}).listen(PORT, () => console.log(`payments-api escuchando en http://localhost:${PORT}`));
