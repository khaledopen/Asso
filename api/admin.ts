import { createHmac, createHash, timingSafeEqual } from "node:crypto";

const DEFAULT_GITHUB_REPO = "khaledopen/Asso";
const DEFAULT_GITHUB_BRANCH = "main";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

interface AdminRequestBody {
  action?: unknown;
  password?: unknown;
  filename?: unknown;
  dataUrl?: unknown;
  content?: unknown;
}

function getAdminConfig() {
  return {
    adminPassword: process.env.ADMIN_PASSWORD?.trim() || "",
    githubToken: process.env.GITHUB_TOKEN?.trim() || "",
    repo: (process.env.GITHUB_REPO || DEFAULT_GITHUB_REPO).trim(),
    branch: (process.env.GITHUB_BRANCH || DEFAULT_GITHUB_BRANCH).trim(),
  };
}

function safeEqualStrings(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function signSessionToken(secret: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: expiresAt }),
    "utf8",
  ).toString("base64url");
  const signature = createHmac("sha256", `${secret}::tissem-admin-v1`)
    .update(payload)
    .digest("base64url");
  return { token: `${payload}.${signature}`, expiresAt };
}

function verifySessionToken(token: string, secret: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expectedSig = createHmac("sha256", `${secret}::tissem-admin-v1`)
    .update(payload)
    .digest("base64url");
  if (!safeEqualStrings(signature, expectedSig)) return false;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { role?: string; exp?: number };
    return (
      parsed.role === "admin" &&
      typeof parsed.exp === "number" &&
      parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

function extractBearerToken(request: Request): string {
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return "";
}

function sanitizeSlug(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

async function githubFetch(
  url: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "tissem-cms",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
}

async function getGitHubFileSha(
  repo: string,
  branch: string,
  path: string,
  token: string,
): Promise<string | undefined> {
  const res = await githubFetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    token,
  );
  if (!res.ok) return undefined;
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

async function putGitHubFile({
  repo,
  branch,
  path,
  token,
  base64Content,
  message,
  sha,
}: {
  repo: string;
  branch: string;
  path: string;
  token: string;
  base64Content: string;
  message: string;
  sha?: string;
}): Promise<{ commitSha?: string }> {
  const res = await githubFetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    token,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!res.ok) {
    const errData = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      errData?.message || `Erreur GitHub (${res.status}) sur ${path}`,
    );
  }

  const okData = (await res.json()) as { commit?: { sha?: string } };
  return { commitSha: okData.commit?.sha };
}

async function listGitHubMediaFolder(
  repo: string,
  branch: string,
  folder: string,
  publicPrefix: string,
  token: string,
): Promise<string[]> {
  const res = await githubFetch(
    `https://api.github.com/repos/${repo}/contents/${folder}?ref=${encodeURIComponent(branch)}`,
    token,
  );
  if (!res.ok) return [];
  const entries = (await res.json()) as Array<{
    name?: string;
    type?: string;
  }>;
  if (!Array.isArray(entries)) return [];
  return entries
    .filter(
      (e) =>
        e.type === "file" &&
        typeof e.name === "string" &&
        /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(e.name),
    )
    .map((e) => `${publicPrefix}/${e.name}`)
    .sort((a, b) => a.localeCompare(b));
}

function isValidContentShape(content: unknown): content is Record<string, unknown> {
  if (!content || typeof content !== "object") return false;
  const obj = content as Record<string, unknown>;
  return (
    typeof obj.brand === "object" &&
    typeof obj.home === "object" &&
    typeof obj.association === "object" &&
    Array.isArray(obj.actions) &&
    Array.isArray(obj.news) &&
    Array.isArray(obj.gallery) &&
    typeof obj.donation === "object" &&
    Array.isArray(obj.helloAssoActions) &&
    typeof obj.contact === "object" &&
    typeof obj.legal === "object"
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: AdminRequestBody;
  try {
    body = (await request.json()) as AdminRequestBody;
  } catch {
    return Response.json(
      { ok: false, error: "Requête JSON invalide." },
      { status: 400 },
    );
  }

  const action = typeof body.action === "string" ? body.action : "";
  const { adminPassword, githubToken, repo, branch } = getAdminConfig();

  if (action === "status") {
    return Response.json({
      ok: true,
      hasAdminPassword: Boolean(adminPassword),
      hasGithubToken: Boolean(githubToken),
      repo,
      branch,
    });
  }

  if (!adminPassword) {
    return Response.json(
      {
        ok: false,
        error:
          "Mot de passe admin non configuré sur Vercel (ajoutez la variable ADMIN_PASSWORD).",
      },
      { status: 503 },
    );
  }

  if (action === "login") {
    const password = typeof body.password === "string" ? body.password : "";
    if (!password || !safeEqualStrings(password, adminPassword)) {
      return Response.json(
        { ok: false, error: "Mot de passe incorrect." },
        { status: 401 },
      );
    }
    const { token, expiresAt } = signSessionToken(adminPassword);
    return Response.json({
      ok: true,
      token,
      expiresAt,
      hasGithubToken: Boolean(githubToken),
    });
  }

  const bearer = extractBearerToken(request);
  if (!bearer || !verifySessionToken(bearer, adminPassword)) {
    return Response.json(
      { ok: false, error: "Session expirée ou non autorisée." },
      { status: 401 },
    );
  }

  if (action === "verify") {
    return Response.json({
      ok: true,
      hasGithubToken: Boolean(githubToken),
    });
  }

  if (!githubToken) {
    return Response.json(
      {
        ok: false,
        error:
          "Variable GITHUB_TOKEN manquante sur Vercel : ajoutez un token GitHub (Contents Read & Write) pour publier les modifications.",
      },
      { status: 503 },
    );
  }

  if (action === "list-media") {
    const [uploads, official, actions] = await Promise.all([
      listGitHubMediaFolder(repo, branch, "public/uploads", "/uploads", githubToken),
      listGitHubMediaFolder(repo, branch, "public/official", "/official", githubToken),
      listGitHubMediaFolder(repo, branch, "public/actions", "/actions", githubToken),
    ]);
    return Response.json({
      ok: true,
      files: [...uploads.reverse(), ...official, ...actions],
    });
  }

  if (action === "upload") {
    const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl.trim() : "";
    const rawName = typeof body.filename === "string" ? body.filename : "image";
    const match = /^data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(
      dataUrl,
    );

    if (!match) {
      return Response.json(
        { ok: false, error: "Format d’image invalide." },
        { status: 400 },
      );
    }

    const mime = match[1].toLowerCase();
    const ext = ALLOWED_IMAGE_MIME[mime];
    if (!ext) {
      return Response.json(
        {
          ok: false,
          error: "Formats acceptés : JPG, PNG, WebP, GIF ou SVG.",
        },
        { status: 400 },
      );
    }

    const base64Data = match[2];
    const byteLength = Buffer.byteLength(base64Data, "base64");
    if (byteLength === 0 || byteLength > MAX_UPLOAD_BYTES) {
      return Response.json(
        {
          ok: false,
          error: "L’image est trop lourde (maximum 4 Mo après compression).",
        },
        { status: 400 },
      );
    }

    const filename = `${Date.now()}-${sanitizeSlug(rawName)}.${ext}`;
    const repoPath = `public/uploads/${filename}`;

    try {
      await putGitHubFile({
        repo,
        branch,
        path: repoPath,
        token: githubToken,
        base64Content: base64Data,
        message: `chore(cms): upload image ${filename}`,
      });
      return Response.json({ ok: true, url: `/uploads/${filename}` });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Échec de l’envoi sur GitHub.";
      return Response.json({ ok: false, error: msg }, { status: 502 });
    }
  }

  if (action === "save") {
    if (!isValidContentShape(body.content)) {
      return Response.json(
        { ok: false, error: "Structure du contenu invalide." },
        { status: 400 },
      );
    }

    const formatted = `${JSON.stringify(body.content, null, 2)}\n`;
    const base64Content = Buffer.from(formatted, "utf8").toString("base64");

    try {
      const sha = await getGitHubFileSha(
        repo,
        branch,
        "public/content.json",
        githubToken,
      );
      const { commitSha } = await putGitHubFile({
        repo,
        branch,
        path: "public/content.json",
        token: githubToken,
        base64Content,
        message: "chore(cms): update site content from back-office",
        sha,
      });
      return Response.json({
        ok: true,
        commitSha: commitSha || null,
      });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Impossible de sauvegarder sur GitHub.";
      return Response.json({ ok: false, error: msg }, { status: 502 });
    }
  }

  return Response.json(
    { ok: false, error: "Action d’administration inconnue." },
    { status: 400 },
  );
}
