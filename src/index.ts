import { createContext } from "./context/createContext";
import { CoreSegmentEvent, SegmentEventType } from "interfaces";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL = "app.stably.dev";

interface ExtraOptions {
  cdnUrl?: string;
  userId?: string;
}

export class Analytics {
  readonly anonymousId = uuidv4();
  readonly cdnUrl: string;

  constructor(
    private readonly writeKey: string,
    private readonly options?: ExtraOptions
  ) {
    this.cdnUrl = this.options?.cdnUrl ?? BACKEND_URL;
  }

  public track = (eventName: string, properties?: Record<string, any>) =>
    this.emitEvent(eventName, "track", properties);

  private async emitEvent(
    eventName: string,
    type: SegmentEventType,
    properties?: Record<string, any>
  ): Promise<void> {
    const now = new Date();

    const request: CoreSegmentEvent = {
      event: eventName,
      type: type,
      anonymousId: this.anonymousId,
      userId: this.options?.userId,
      properties: properties,
      writeKey: this.writeKey,
      timestamp: now,
      sentAt: now,
      context: createContext(),
    };

    await fetch(`http://${this.cdnUrl}/api/public/track/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  }
}
