const DEFAULT_GITHUB_REPO = "khaledopen/Asso";
const DEFAULT_GITHUB_BRANCH = "main";

export async function GET(): Promise<Response> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = (process.env.GITHUB_REPO || DEFAULT_GITHUB_REPO).trim();
  const branch = (process.env.GITHUB_BRANCH || DEFAULT_GITHUB_BRANCH).trim();

  if (!token) {
    return Response.json(
      { ok: false, source: "static" },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/public/content.json?ref=${encodeURIComponent(branch)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.raw+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "tissem-cms",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!response.ok) {
      return Response.json(
        { ok: false, source: "static" },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        },
      );
    }

    const content = (await response.json()) as unknown;
    return Response.json(
      { ok: true, source: "github", content },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  } catch {
    return Response.json(
      { ok: false, source: "static" },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
