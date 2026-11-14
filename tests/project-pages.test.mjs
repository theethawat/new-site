import { test } from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:4321";

for (const locale of ["en", "th"]) {
  test(`${locale} project details use the localized project layout`, async () => {
    const response = await fetch(new URL(`/${locale}/project/ehealth`, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, new RegExp(`<html\\b[^>]*lang="${locale}"`));
    assert.match(html, new RegExp(`href="/${locale}/project"`));
    assert.match(html, /\/img\/project\/ehealth\.jpg/);
    assert.match(html, /article-body-shell/);
    assert.match(html, /href="#project-info"/);
    assert.match(html, /href="\/en\/project\/ehealth"/);
    assert.match(html, /href="\/th\/project\/ehealth"/);
    assert.match(html, locale === "en" ? /Tech Stack/ : /เทคโนโลยีที่ใช้/);
  });
}

test("project details identify content shown in its original language", async () => {
  const response = await fetch(new URL("/en/project/eaccom", baseUrl));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /This content is shown in its original language/);
  assert.match(html, /class="article-prose[^"]*" lang="th"/);
  assert.match(html, /hreflang="th"/);
  assert.doesNotMatch(html, /hreflang="en"/);
});

test("project history works without portfolio metadata", async () => {
  const response = await fetch(new URL("/th/project/summary", baseUrl));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="article-prose[^"]*" lang="en"/);
  assert.match(html, /Working Project/);
});

test("missing projects return 404 and the project listing remains available", async () => {
  const missing = await fetch(new URL("/en/project/not-a-project", baseUrl));
  assert.equal(missing.status, 404);
  const listing = await fetch(new URL("/en/project", baseUrl));
  assert.equal(listing.status, 200);
  assert.match(await listing.text(), /href="\/en\/project\/ehealth"/);
});
