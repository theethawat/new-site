import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  const match = url.pathname.match(/^\/(blog|projects)(\/.*)?$/);
  if (match) {
    const section = match[1] === "projects" ? "project" : "blog";
    return redirect(`/en/${section}${match[2] ?? ""}${url.search}`, 301);
  }
  return next();
});
