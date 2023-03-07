import { CoreExtraContext } from "interfaces";
import { version } from "../gen/version";

// normalize and dispatch
export function createContext(): CoreExtraContext {
  return {
    // @ts-ignore
    locale: navigator.userLanguage || navigator.language,
    page: pageDefaults(),
    userAgent: window.navigator.userAgent,
    library: {
      name: "stably",
      version,
    },
    campaign: utm(window.location.search),
    // TODO: skipping referrer information for now
    referrer: {},
  };
}

function utm(query: string): {
  name: string;
  term: string;
  source: string;
  medium: string;
  content: string;
} {
  if (query.startsWith("?")) {
    query = query.substring(1);
  }
  query = query.replace(/\?/g, "&");

  const res = query.split("&").reduce((acc, str) => {
    const [k, v = ""] = str.split("=");
    if (k.includes("utm_") && k.length > 4) {
      let utmParam = k.substr(4);
      if (utmParam === "campaign") {
        utmParam = "name";
      }
      acc[utmParam] = gracefulDecodeURIComponent(v);
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    name: res["name"],
    term: res["term"],
    source: res["source"],
    medium: res["medium"],
    content: res["content"],
  };
}

/**
 * Tries to gets the unencoded version of an encoded component of a
 * Uniform Resource Identifier (URI). If input string is malformed,
 * returns it back as-is.
 *
 * Note: All occurences of the `+` character become ` ` (spaces).
 **/
function gracefulDecodeURIComponent(encodedURIComponent: string): string {
  try {
    return decodeURIComponent(encodedURIComponent.replace(/\+/g, " "));
  } catch {
    return encodedURIComponent;
  }
}

interface PageDefault {
  [key: string]: unknown;
  path: string;
  referrer: string;
  search: string;
  title: string;
  url: string;
}

/**
 * Get the current page's canonical URL.
 *
 * @return {string|undefined}
 */
function canonical(): string {
  const tags = document.getElementsByTagName("link");
  let canon: string | null = "";

  Array.prototype.slice.call(tags).forEach((tag) => {
    if (tag.getAttribute("rel") === "canonical") {
      canon = tag.getAttribute("href");
    }
  });

  return canon;
}

/**
 * Return the canonical path for the page.
 */
function canonicalPath(): string {
  const canon = canonical();
  if (!canon) {
    return window.location.pathname;
  }

  const a = document.createElement("a");
  a.href = canon;
  const pathname = !a.pathname.startsWith("/") ? "/" + a.pathname : a.pathname;

  return pathname;
}

/**
 * Return the canonical URL for the page concat the given `search`
 * and strip the hash.
 */

export function canonicalUrl(search = ""): string {
  const canon = canonical();
  if (canon) {
    return canon.includes("?") ? canon : `${canon}${search}`;
  }
  const url = window.location.href;
  const i = url.indexOf("#");
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Return a default `options.context.page` object.
 *
 * https://segment.com/docs/spec/page/#properties
 */
export function pageDefaults(): PageDefault {
  return {
    path: canonicalPath(),
    referrer: document.referrer,
    search: location.search,
    title: document.title,
    url: canonicalUrl(location.search),
  };
}
