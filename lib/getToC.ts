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
    const document = new JSDOM(`<div id=${containerId}>${html}</div>`).window
        .document;

    const container = document.getElementById(containerId) as HTMLDivElement;
    const h2s = Array.from(container.querySelectorAll("h2"));

    const sections: HTMLElement[] = [];

    h2s.forEach((h2) => {
        const id = `heading-${randomBytes(8).toString("hex")}`;
        h2.id = id;

        toc.push({
            id,
            text: h2.textContent?.trim() || "",
        });

        const section = document.createElement("section");
        section.setAttribute("aria-label", id);

        const elementsToMove: Element[] = [h2];

        let nextEl = h2.nextElementSibling;
        while (nextEl) {
            if (nextEl.tagName === "H2") break;

            elementsToMove.push(nextEl);
            nextEl = nextEl.nextElementSibling;
        }

        elementsToMove.forEach((el) => {
            section.appendChild(el.cloneNode(true));
            el.remove();
        });

        sections.push(section);
    });

    sections.forEach((section) => {
        container.appendChild(section);
    });

    return {
        toc,
        html: container.innerHTML,
    };
}
