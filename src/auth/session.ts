import { randomBytes } from "node:crypto";

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

export const SESSION_TTL_MS = 30 * 60 * 1000;

const sessions = new Map<string, Session>();

export function createSession(userId: string, now = Date.now()): Session {
  const session: Session = {
    token: randomBytes(24).toString("hex"),
    userId,
    expiresAt: now + SESSION_TTL_MS,
  };
  sessions.set(session.token, session);
  return session;
}

export function getSession(token: string): Session | undefined {
  return sessions.get(token);
}
