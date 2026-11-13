import { test } from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:4321";

for (const locale of ["en", "th"]) {
  test(`${locale} timeline renders its entries and project links`, async () => {
    const response = await fetch(new URL(`/${locale}/timeline`, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.doesNotMatch(html, /<pre\b/i);
    assert.match(html, /<time>2019(?:\s*\/\s*2562)?<\/time>/);
    assert.match(html, /<time>2023(?:\s*\/\s*2566)?<\/time>/);
    assert.match(html, new RegExp(`<a\\b[^>]*href="/${locale}/project/internship/?"[^>]*>`));
    assert.match(html, new RegExp(`<a\\b[^>]*href="/${locale}/project/cost-estimation/?"[^>]*>`));
  });
}
