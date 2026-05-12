"use server";

import { randomBytes } from "crypto";
import { JSDOM } from "jsdom";

type Link = {
    id: string;
    text: string;
    links?: Link[];
};

export async function getTableOfContentsFromHTML(html: string) {
    const toc: Link[] = [];

    const containerId = `article-${Date.now()}`;
    const document = new JSDOM(`<div id=${containerId}>${html}<div>`).window
        .document;

    const h2s = document.querySelectorAll("h2");

    h2s.forEach((h2, i) => {
        const id = `heading-${randomBytes(8).toString("hex")}`;

        const section = h2.closest("section");

        section?.setAttribute("aria-label", id);

        h2.id = id;

        toc.push({
            id,
            text: h2.textContent.trim(),
        });

        const h3s = h2.parentElement?.querySelectorAll("h3");

        h3s?.forEach((h3) => {
            const h3_id = `heading-${randomBytes(8).toString("hex")}`;

            h3.id = h3_id;

            toc[i].links = [];

            toc[i].links.push({
                id: h3_id,
                text: h3.textContent.trim(),
            });
        });
    });

    const article = document.getElementById(containerId);

    return { toc, html: article?.innerHTML };
}
