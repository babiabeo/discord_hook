import { Camelize } from "../deps.ts";

export class DiscordEmbed {
  data: APIEmbed;

  constructor(data: APIEmbed = {}) {
    this.data = { ...data };
  }

  setTitle(title: string) {
    this.data.title = title;
    return this;
  }

  setDescription(description: string) {
    this.data.description = description;
    return this;
  }

  setColor(color: number) {
    this.data.color = color;
    return this;
  }

  setAuthor(author: EmbedAuthor) {
    this.data.author = {
      name: author.name,
      url: author.url,
      icon_url: author.iconUrl,
    };
    return this;
  }

  setImage(url: string) {
    this.data.image = {
      url: url,
    };
    return this;
  }

  setThumbnail(url: string) {
    this.data.thumbnail = {
      url: url,
    };
    return this;
  }

  addFields(fields: EmbedField[]) {
    if (!this.data.fields) {
      this.data.fields = fields;
    } else {
      this.data.fields.push(...fields);
    }
    return this;
  }

  setUrl(url: string | URL) {
    this.data.url = url instanceof URL ? url.toString() : url;
    return this;
  }

  setFooter(footer: EmbedFooter) {
    this.data.footer = {
      text: footer.text,
      icon_url: footer.iconUrl,
    };
    return this;
  }

  setTimestamp(timestamp: string | number | Date = Date.now()) {
    this.data.timestamp = new Date(timestamp).toISOString();
    return this;
  }

  toJSON() {
    return { ...this.data } as APIEmbed;
  }
}

export type EmbedField = Camelize<APIEmbedField>;
export type EmbedAuthor = Camelize<APIEmbedAuthor>;
export type EmbedFooter = Camelize<APIEmbedFooter>;

export interface APIEmbedFooter {
  text: string;
  icon_url?: string;
}

export interface APIEmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface APIEmbedImage {
  url: string;
}

export interface APIEmbedThumbnail {
  url: string;
}

export interface APIEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface APIEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: APIEmbedFooter;
  image?: APIEmbedImage;
  thumbnail?: APIEmbedThumbnail;
  author?: APIEmbedAuthor;
  fields?: APIEmbedField[];
}
