"use server";

import { randomBytes } from "crypto";
import parseDataURL from "data-urls";
import { JSDOM } from "jsdom";
import fsPromises from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import Stream from "stream";
import mime from "mime";

export async function saveEditorImages(editorData: string) {
  const { window } = new JSDOM(editorData);
  const document = window.document;

  const images: NodeListOf<HTMLImageElement> = document.querySelectorAll("img");

  for (const image of images) {
    const src = image.src.trim();
    const parent = image.parentNode;

    if (src === "") {
      parent?.removeChild(image);
    }

    const data = parseDataURL(src);

    if (data === null) {
      try {
        new URL(src);
      } catch (e) {
        parent?.removeChild(image);
        console.warn("[EDITOR_IMAGE_SAVE]: Invalid data url");

        continue;
      }
    } else {
      const mime = data.mimeType;
      const body = data.body;

      if (mime.type !== "image") {
        parent?.removeChild(image);
        console.warn("[EDITOR_IMAGE_SAVE]: Invalid mime-type, must be image");

        continue;
      }

      const ext = getExtFromSubtype(`${mime.type}/${mime.subtype}`);

      if (!ext) {
        parent?.removeChild(image);
        console.warn(
          "[EDITOR_IMAGE_SAVE]: Invalid mime-subtype, must be an image"
        );

        continue;
      }

      const fileName = `${randomBytes(16).toString("hex")}.${ext}`;

      const uploadDir = "./public/uploads/editor";

      try {
        await storeFile(uploadDir, fileName, body);

        image.src = `/uploads/editor/${fileName}`;
      } catch (e) {
        if (e instanceof Error) {
          console.warn(e.message);
        }
      }
    }
  }

  const figureImages = document.querySelectorAll("figure.image");

  for (const figure of figureImages) {
    if (figure.innerHTML.trim() === "") {
      const parent = figure.parentNode;

      parent?.removeChild(figure);
    }
  }

  return document.body.innerHTML;
}

export async function storeFile(
  fileDirPath: string,
  fileName: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream
) {
  try {
    if (!existsSync(fileDirPath)) {
      await fsPromises.mkdir(fileDirPath, {
        recursive: true,
      });
    }

    await fsPromises.writeFile(path.join(fileDirPath, fileName), data, {
      encoding: "utf-8",
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error("[EDITOR_IMAGE_SAVE]: Error while saving a file", {
        error: e.message,
      });

      throw e;
    }
  }
}

function getExtFromSubtype(type: string) {
  return mime.getExtension(type);
}
