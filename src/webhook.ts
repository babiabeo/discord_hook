import { assert } from "../deps.ts";
import { APIEmbed, DiscordEmbed } from "./embed.ts";
import { Attachment } from "./file_attachment.ts";

export class DiscordWebhook {
  url: string;
  username?: string;
  avatarUrl?: string;

  constructor(options: WebhookOptions) {
    this.username = options.username;
    this.avatarUrl = options.avatarUrl;

    if (options.url.includes("/v10")) {
      this.url = options.url;
    } else {
      const splittedUrl = options.url.split("/");
      const token = splittedUrl.at(-1);
      const id = splittedUrl.at(-2);

      this.url = `https://discord.com/api/v10/webhooks/${id}/${token}`;
    }
  }

  /** Get this webhook data. */
  async fetchData(): Promise<ResponseData> {
    const res = await fetch(this.url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    if (res.status === 429) {
      return {
        ok: false,
        status: res.status,
        error:
          `Request was ratelimited. Retry after: ${json.retry_after} seconds`,
      };
    }

    if (res.status === 200) {
      return {
        ok: true,
        status: res.status,
        data: json,
      };
    }

    return { ok: false, status: res.status, error: json };
  }

  /** Execute this webhook (Send a message by webhook). */
  async execute(data: ExecuteData): Promise<ResponseData> {
    assert(
      data.content || data.embeds?.length || data.files?.length,
      "One of content, embeds or files must be set",
    );

    const username = data.username ?? this.username;
    const avatar = data.avatarUrl ?? this.avatarUrl;
    const headers: Record<string, string> = {};
    const payload: APIExecuteWebhook = {
      username,
      avatar_url: avatar,
      tts: data.tts,
      flags: data.flags,
      embeds: data.embeds?.map((e) => e.toJSON()),
      content: data.content,
    };

    let body: string | FormData;
    // Avoid empty array.
    if (data.files && data.files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        formData.append(`file[${i}]`, await file.blob(), file.name);
      }

      formData.append("payload_json", JSON.stringify(payload));
      body = formData;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const url = `${this.url}?wait=${data.wait ?? true}${
      data.threadId ? `&thread_id=${data.threadId}` : ""
    }`;
    const res = await fetch(url, {
      body,
      headers,
      method: "POST",
    });

    if (res.status === 204) {
      return { ok: true, status: res.status };
    }

    const json = await res.json();

    if (res.status === 429) {
      return {
        ok: false,
        status: res.status,
        error:
          `Request was ratelimited. Retry after: ${json.retry_after} seconds`,
      };
    }

    if (res.status === 200) {
      return { ok: true, status: res.status, data: json };
    }

    return { ok: false, status: res.status, error: json };
  }

  /** Edit a message that was sent by this webhook. */
  async editMessage(data: ModifyMessageData): Promise<ResponseData> {
    const headers: Record<string, string> = {};
    const payload = {
      content: data.content,
      embeds: data.embeds?.map((e) => e.toJSON()),
    };

    let body: string | FormData;
    if (data.files && data.files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        formData.append(`file[${i}]`, await file.blob(), file.name);
      }

      formData.append("payload_json", JSON.stringify(payload));
      body = formData;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const url = `${this.url}/messages/${data.messageId}${
      data.threadId ? `?thread_id=${data.threadId}` : ""
    }`;
    const res = await fetch(url, {
      body,
      headers,
      method: "PATCH",
    });

    const json = await res.json();

    if (res.status === 200) {
      return { ok: true, status: res.status, data: json };
    }

    return { ok: false, status: res.status, error: json };
  }

  /** Modify/Edit this webhook. */
  async modify(options: ModifyOptions): Promise<ResponseData> {
    const payload: APIModifyWebhook = {
      name: options.name,
      avatar: await options.avatar?.imageBase64Data(),
    };

    const res = await fetch(this.url, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status === 429) {
      return {
        ok: false,
        status: res.status,
        error:
          `Request was ratelimited. Retry after: ${json.retry_after} seconds`,
      };
    }

    if (res.status === 200) {
      return { ok: true, status: res.status, data: json };
    }

    return { ok: false, status: res.status, error: json };
  }

  /** Delete a message that was sent by this webhook. */
  async deleteMessage(
    messageId: string,
    threadId?: string,
  ): Promise<ResponseData> {
    const url = `${this.url}/messages/${messageId}${
      threadId ? `?thread_id=${threadId}` : ""
    }`;
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (res.status === 204) {
      return { ok: true, status: res.status };
    }

    const json = await res.json();

    if (res.status === 429) {
      return {
        ok: false,
        status: res.status,
        error:
          `Request was ratelimited. Retry after: ${json.retry_after} seconds`,
      };
    }

    return { ok: false, status: res.status, error: json };
  }
}

export interface ResponseData {
  /** Whether the request is success. */
  ok: boolean;
  /** Status code of the request. */
  status: number;
  /** The returned data. */
  data?: unknown;
  /** The occurred error. */
  error?: unknown;
}

export interface ExecuteData {
  /** The message contents (up to 2000 characters). */
  content?: string;
  /** Override the default username of the webhook. */
  username?: string;
  /** Override the default avatar of the webhook. */
  avatarUrl?: string;
  /** `true` if this is a TTS message. */
  tts?: boolean;
  /** Embedded `rich` content (up to 10 embeds). */
  embeds?: DiscordEmbed[];
  /** Message flags combined as a bitfield (only `SUPPRESS_EMBEDS` can be set). */
  flags?: 4;
  /** The contents of the file being sent. */
  files?: Attachment[];
  /** Wait for server confirmation of message send before response, and returns the created message body. */
  wait?: boolean;
  /** Specified thread within a webhook's channel. The thread will automatically be unarchived. */
  threadId?: string;
}

export interface ModifyOptions {
  /** The default name of the webhook. */
  name?: string;
  /** Image for the default webhook avatar. */
  avatar?: Attachment;
}

export interface ModifyMessageData {
  /** The id of message. */
  messageId: string;
  /** The message contents (up to 2000 characters). */
  content?: string;
  /** Embedded `rich` content (up to 10 embeds). */
  embeds?: DiscordEmbed[];
  /** The contents of the file being sent/edited. */
  files?: Attachment[];
  /** Id of the thread the message is in. */
  threadId?: string;
}

export interface WebhookOptions {
  /** The url of the webhook. */
  url: string;
  /** Override the default username of the webhook. */
  username?: string;
  /** Override the default avatar of the webhook. */
  avatarUrl?: string;
}

export interface APIModifyWebhook {
  name?: string;
  avatar?: string | null;
}

export interface APIExecuteWebhook {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  flags?: number;
  embeds?: APIEmbed[];
}
