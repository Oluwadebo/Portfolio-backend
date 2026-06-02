import axios from "axios";

interface PreviewResult {
  image: string | null;
  title: string | null;
  description: string | null;
  liveUrl: string | null;
  source: "og" | "microlink" | "none";
}

// ─── Extract OG tags from raw HTML ─────────────────
function extractOGTags(html: string): Partial<PreviewResult> {
  const getMeta = (property: string): string | null => {
    const match =
      html.match(
        new RegExp(
          `<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`,
          "i",
        ),
      ) ||
      html.match(
        new RegExp(
          `<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`,
          "i",
        ),
      );
    return match ? match[1] : null;
  };

  const getTitleTag = (): string | null => {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : null;
  };

  return {
    image: getMeta("image"),
    title: getMeta("title") || getTitleTag(),
    description: getMeta("description"),
  };
}

// ─── Try fetching OG tags from the URL ─────────────
async function fetchOGPreview(url: string): Promise<Partial<PreviewResult>> {
  const { data: html } = await axios.get(url, {
    timeout: 8000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://yourportfolio.com)",
      Accept: "text/html",
    },
    maxContentLength: 500_000, // only grab first 500kb — enough for <head>
  });

  return extractOGTags(typeof html === "string" ? html : "");
}

function getScreenshotUrl(url: string): string {
  return `https://image.thum.io/get/width/1200/crop/630/${url}`;
}
// ─── Fallback: Microlink API (free, no key needed) ──
async function fetchMicrolinkPreview(
  url: string,
): Promise<Partial<PreviewResult>> {
  // Try Microlink first
  try {
    const { data } = await axios.get("https://api.microlink.io", {
      params: { url, screenshot: true, meta: true, embed: "screenshot.url" },
      timeout: 12000,
    });
    if (data.status === "success") {
      return {
        image: data.data?.screenshot?.url || data.data?.image?.url || null,
        title: data.data?.title || null,
        description: data.data?.description || null,
      };
    }
  } catch {}
  return {
    image: getScreenshotUrl(url),
    title: null,
    description: null,
  };
}

// ─── Main export: try OG → fallback to Microlink ───
export async function getURLPreview(
  url: string,
): Promise<PreviewResult & { tags?: string[] }> {
  // ── GitHub URL — use API directly ──
  if (url.includes("github.com")) {
    try {
      const gh = await fetchGitHubPreview(url);
      if (gh.title || gh.description) {
        console.log(`[preview] GitHub data fetched for ${url}`);
        return {
          image: gh.image ?? null,
          title: gh.title ?? null,
          description: gh.description ?? null,
          liveUrl: gh.liveUrl ?? null,
          source: "og",
          tags: gh.tags,
        };
      }
    } catch (err) {

    }
  }
  //  Try OG tags first
  try {
    const og = await fetchOGPreview(url);
    if (og.image) {
      console.log(`[preview] OG image found for ${url}`);
      return {
        image: og.image,
        title: og.title ?? null,
        liveUrl: og.liveUrl ?? null,
        description: og.description ?? null,
        source: "og",
      };
    }
  } catch (err) {

  }

  //  Fallback to Microlink
  try {
    const ml = await fetchMicrolinkPreview(url);
    if (ml.image) {
      console.log(`[preview] Microlink image found for ${url}`);
      return {
        image: ml.image,
        title: ml.title ?? null,
        description: ml.description ?? null,
        source: "microlink",
        liveUrl: ml.liveUrl ?? null,
      };
    }
  } catch (err) {

  }

  return {
    image: null,
    title: null,
    description: null,
    source: "none",
    liveUrl: null,
  };
}

// ─── Extract GitHub repo info ───────────────────────
async function fetchGitHubPreview(
  url: string,
): Promise<Partial<PreviewResult> & { tags?: string[] }> {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return {};

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");

  const { data } = await axios.get(
    `https://api.github.com/repos/${owner}/${cleanRepo}`,
    { timeout: 8000, headers: { Accept: "application/vnd.github.v3+json" } },
  );

  let image = null;
  if (data.homepage) {
    try {
      const og = await fetchOGPreview(data.homepage);
      image = og.image || null;
      if (!image) {
        image = `https://image.thum.io/get/width/1200/crop/630/${data.homepage}`;
      }
    } catch {}
  }

  return {
    title: data.name?.replace(/-/g, " "),
    description: data.description || null,
    image: image,
    liveUrl: data.homepage || null,
    tags: [...(data.topics || []), data.language].filter(Boolean),
    source: "og" as const,
  };
}
