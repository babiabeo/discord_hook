import { assert, base64, basename } from "../deps.ts";

function mimeType(data: ArrayBuffer) {
  const ascii = new TextDecoder("ascii").decode(data);

  if (
    ["JFIF", "Exif"].includes(ascii.substring(6, 10)) ||
    ascii.substring(0, 4) === "\xff\xd8\xff\xdb"
  ) {
    return "image/jpeg";
  } else if (ascii.startsWith("\u{2030}PNG\r\n\x1a\n")) {
    return "image/png";
  } else if (["GIF87a", "GIF89a"].includes(ascii.substring(0, 6))) {
    return "image/gif";
  } else {
    throw new Error("Unsupported image type.");
  }
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export class Attachment {
  name: string;
  source: string;
  isImage: boolean;

  constructor(options: FileOptions) {
    const urlString = options.source instanceof URL
      ? options.source.toString()
      : options.source;

    this.isImage = isImage(urlString);
    this.source = urlString;
    this.name = options.name ?? basename(urlString);
  }

  /** Return the `Blob` object of the file. */
  async blob() {
    try {
      const dd = await fetch(this.source);

      return await dd.blob();
    } catch (_) {
      const uint8 = await Deno.readFile(this.source);

      return new Blob([uint8]);
    }
  }

  /** Return the base64 data of the file (images only). */
  async imageBase64Data() {
    assert(this.isImage, "The given file is not an image");

    const blob = await this.blob();
    const data = await blob.arrayBuffer();
    const base = base64(data);
    const mime = blob.type.length === 0 ? mimeType(data) : blob.type;

    return `data:${mime};base64,${base}`;
  }
}

export interface FileOptions {
  /** The source of the file (can be an url from browser or a file in your device). */
  source: string | URL;
  /** The name of the file (will use the file's base name if not given). */
  name?: string;
}
