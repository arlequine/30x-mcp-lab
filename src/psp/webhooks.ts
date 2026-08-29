export interface PspEvent {
  id: string;
  type: "charge.succeeded" | "charge.failed" | "refund.succeeded";
  pspReference: string;
}

const handled: PspEvent[] = [];

/** Procesa un webhook del PSP. */
export function handleWebhook(event: PspEvent): { processed: boolean } {
  handled.push(event);
  return { processed: true };
}

export function handledEvents(): readonly PspEvent[] {
  return handled;
}
