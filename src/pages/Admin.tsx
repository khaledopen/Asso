import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";
import { useSiteContent } from "../context/ContentContext";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type ActionItem,
  type GalleryItem,
  type HelloAssoItem,
  type LegalSectionItem,
  type NewsItem,
  type SiteContent,
} from "../data/siteContent";

type SectionId =
  | "brand"
  | "home"
  | "association"
  | "actions"
  | "news"
  | "gallery"
  | "donation"
  | "contact"
  | "legal";

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: "brand", label: "Identité & liens" },
  { id: "home", label: "Accueil" },
  { id: "association", label: "L’association" },
  { id: "actions", label: "Nos actions" },
  { id: "news", label: "Actualités" },
  { id: "gallery", label: "Galerie" },
  { id: "donation", label: "Soutenir & HelloAsso" },
  { id: "contact", label: "Contact" },
  { id: "legal", label: "Mentions légales" },
];

const GALLERY_CATEGORIES = [
  "Événements & fêtes",
  "Moments partagés",
  "Sorties & loisirs",
  "Ateliers & rencontres",
];

const SESSION_KEY = "tissem_admin_token";

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "element"
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  const [removed] = copy.splice(index, 1);
  copy.splice(target, 0, removed);
  return copy;
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

async function compressImageToDataUrl(file: File): Promise<string> {
  const rawDataUrl = await readFileAsDataUrl(file);
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    file.size <= 900_000
  ) {
    return rawDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1600;
      const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * ratio));
      const height = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const outType =
        file.type === "image/png" && file.size < 1_800_000
          ? "image/png"
          : "image/jpeg";
      resolve(canvas.toDataURL(outType, 0.85));
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

function LinesEditor({
  label,
  items,
  onChange,
  addLabel = "Ajouter une ligne",
  multiline = false,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  multiline?: boolean;
}) {
  return (
    <div className="admin-lines">
      <div className="admin-lines-header">
        <span className="admin-field-label">{label}</span>
        <button
          type="button"
          className="admin-btn-secondary admin-btn-sm"
          onClick={() => onChange([...items, ""])}
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="admin-empty-note">Aucun élément.</p>
      ) : (
        <div className="admin-lines-list">
          {items.map((line, index) => (
            <div key={index} className="admin-line-row">
              {multiline ? (
                <textarea
                  rows={3}
                  value={line}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = e.target.value;
                    onChange(next);
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={line}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = e.target.value;
                    onChange(next);
                  }}
                />
              )}
              <button
                type="button"
                className="admin-icon-btn"
                title="Monter"
                disabled={index === 0}
                onClick={() => onChange(moveItem(items, index, -1))}
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                title="Descendre"
                disabled={index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, 1))}
              >
                <ArrowDown size={15} />
              </button>
              <button
                type="button"
                className="admin-icon-btn danger"
                title="Supprimer"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
  onOpenPicker,
}: {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  onOpenPicker: (onSelect: (url: string) => void) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) onChange(uploadedUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-field">
      <span className="admin-field-label">{label}</span>
      <div className="admin-image-box">
        <div className="admin-image-preview">
          {value ? (
            <img src={value} alt={label} />
          ) : (
            <ImageIcon size={24} />
          )}
        </div>
        <div className="admin-image-controls">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/actions/action-001.jpg ou https://..."
          />
          <div className="admin-image-actions">
            <label className="admin-btn-secondary admin-btn-sm admin-upload-btn">
              <Upload size={14} />
              <span>{uploading ? "Envoi en cours…" : "Importer une photo"}</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleFile}
                hidden
              />
            </label>
            <button
              type="button"
              className="admin-btn-secondary admin-btn-sm"
              onClick={() => onOpenPicker(onChange)}
            >
              <FolderOpen size={14} /> Médiathèque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { content, setContent } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(() => content);
  const [dirty, setDirty] = useState(false);
  const [section, setSection] = useState<SectionId>("home");

  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(SESSION_KEY) || "";
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    hasAdminPassword: boolean;
    hasGithubToken: boolean;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaTargetCallback, setMediaTargetCallback] = useState<
    ((url: string) => void) | null
  >(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [galleryQuickCategory, setGalleryQuickCategory] = useState(
    GALLERY_CATEGORIES[0],
  );
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Sync loaded remote content into draft only if user hasn't started editing
  useEffect(() => {
    if (!dirty) {
      setDraft(content);
    }
  }, [content, dirty]);

  // Add noindex while on /admin
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Warn if leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Check server configuration + verify stored session token
  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const statusRes = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "status" }),
        }).catch(() => null);
        if (active && statusRes?.ok) {
          const st = (await statusRes.json()) as {
            hasAdminPassword?: boolean;
            hasGithubToken?: boolean;
          };
          setServerStatus({
            hasAdminPassword: Boolean(st.hasAdminPassword),
            hasGithubToken: Boolean(st.hasGithubToken),
          });
        }

        if (token) {
          const verifyRes = await fetch("/api/admin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action: "verify" }),
          }).catch(() => null);
          if (active && verifyRes?.ok) {
            setAuthenticated(true);
          } else if (active) {
            window.sessionStorage.removeItem(SESSION_KEY);
            setToken("");
          }
        }
      } finally {
        if (active) setCheckingAuth(false);
      }
    };
    void check();
    return () => {
      active = false;
    };
  }, [token]);

  const loadMediaLibrary = useCallback(async () => {
    const fallbackFiles = Array.from(
      new Set([
        draft.brand.logo,
        draft.home.heroMainImage,
        draft.home.heroDetailImage,
        draft.association.storyImage,
        ...draft.actions.map((a) => a.image),
        ...draft.news.map((n) => n.image),
        ...draft.gallery.map((g) => g.src),
      ]),
    ).filter(Boolean);

    if (!token) {
      setMediaFiles(fallbackFiles);
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "list-media" }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        files?: string[];
      } | null;
      if (res.ok && data?.ok && Array.isArray(data.files)) {
        setMediaFiles(Array.from(new Set([...data.files, ...fallbackFiles])));
        return;
      }
    } catch {
      // Fallback below
    }
    setMediaFiles(fallbackFiles);
  }, [draft, token]);

  useEffect(() => {
    if (authenticated) {
      void loadMediaLibrary();
    }
  }, [authenticated, loadMediaLibrary]);

  const updateDraft = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setDraft((prev) => updater(prev));
    setDirty(true);
    setFeedback(null);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        token?: string;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok || !data.token) {
        setAuthError(data?.error || "Connexion refusée.");
        return;
      }
      window.sessionStorage.setItem(SESSION_KEY, data.token);
      setToken(data.token);
      setAuthenticated(true);
      setPassword("");
    } catch {
      setAuthError("Impossible de joindre le serveur d’administration.");
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setToken("");
    setAuthenticated(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setFeedback(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "upload",
          filename: file.name,
          dataUrl,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        url?: string;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok || !data.url) {
        setFeedback({
          type: "error",
          text: data?.error || "Échec lors de l’envoi de l’image.",
        });
        return null;
      }
      setMediaFiles((prev) => Array.from(new Set([data.url!, ...prev])));
      setFeedback({
        type: "success",
        text: `Image envoyée (${data.url}). Cliquez sur « Enregistrer & Publier » pour sauvegarder la page.`,
      });
      return data.url;
    } catch {
      setFeedback({
        type: "error",
        text: "Erreur réseau pendant l’import de l’image.",
      });
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "save", content: draft }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        setFeedback({
          type: "error",
          text: data?.error || "Impossible d’enregistrer les modifications.",
        });
        return;
      }
      setContent(draft);
      setDirty(false);
      setFeedback({
        type: "success",
        text: "Enregistré et publié ! Vos textes sont à jour immédiatement ; les nouvelles images apparaîtront sur le site public après ~20 à 30 s de redéploiement Vercel.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de contacter le serveur d’enregistrement.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<SiteContent>;
      setDraft(mergeSiteContent(parsed));
      setDirty(true);
      setFeedback({
        type: "success",
        text: "Fichier JSON importé dans l’éditeur. Cliquez sur « Enregistrer & Publier » pour le mettre en ligne.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Le fichier importé n’est pas un JSON valide.",
      });
    }
  };

  const handleQuickGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setGalleryUploading(true);
    try {
      const uploadedItems: GalleryItem[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        if (url) {
          uploadedItems.push({
            src: url,
            alt: `Moment partagé de l’association — ${galleryQuickCategory.toLowerCase()}`,
            label: galleryQuickCategory,
          });
        }
      }
      if (uploadedItems.length > 0) {
        updateDraft((prev) => ({
          ...prev,
          gallery: [...uploadedItems, ...prev.gallery],
        }));
      }
    } finally {
      setGalleryUploading(false);
    }
  };

  const openPickerFor = useCallback(
    (callback: (url: string) => void) => {
      setMediaSearch("");
      setMediaTargetCallback(() => callback);
    },
    [],
  );

  const filteredMedia = useMemo(() => {
    if (!mediaSearch.trim()) return mediaFiles;
    const q = mediaSearch.toLowerCase();
    return mediaFiles.filter((f) => f.toLowerCase().includes(q));
  }, [mediaFiles, mediaSearch]);

  if (checkingAuth) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <p>Vérification de l’accès administration…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <img src={draft.brand.logo} alt={draft.brand.siteName} />
            <div>
              <b>{draft.brand.siteName}</b>
              <span>Espace d’administration</span>
            </div>
          </div>
          <h1>Connexion Back-Office</h1>
          <p className="admin-auth-desc">
            Modifiez librement les textes, photos, actions, actualités et la
            galerie du site.
          </p>

          {serverStatus && !serverStatus.hasAdminPassword && (
            <div className="admin-alert error">
              <AlertCircle size={18} />
              <div>
                <strong>Configuration requise sur Vercel :</strong> ajoutez la
                variable <code>ADMIN_PASSWORD</code> (et{" "}
                <code>GITHUB_TOKEN</code>) dans Vercel → Settings → Environment
                Variables puis redéployez.
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-auth-form">
            <label className="admin-field">
              <span className="admin-field-label">Mot de passe admin</span>
              <div className="admin-password-wrap">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Afficher ou masquer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            {authError && (
              <div className="admin-alert error">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}
            <button type="submit" className="solid-button full">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <img src={draft.brand.logo} alt="" />
          <div>
            <b>Back-Office · {draft.brand.siteName}</b>
            <span>
              {dirty
                ? "Modifications non enregistrées"
                : "Tout est synchronisé"}
            </span>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
          >
            <ExternalLink size={15} /> Voir le site
          </a>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleExportJson}
            title="Télécharger une sauvegarde JSON"
          >
            <Download size={15} /> Exporter
          </button>
          <label className="admin-btn-secondary admin-upload-btn">
            <Upload size={15} /> Importer JSON
            <input
              type="file"
              accept="application/json"
              onChange={handleImportJson}
              hidden
            />
          </label>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              setDraft(DEFAULT_SITE_CONTENT);
              setDirty(true);
            }}
            title="Recharger les textes d’origine dans l’éditeur"
          >
            <RotateCcw size={15} /> Réinitialiser
          </button>
          <button
            type="button"
            className="solid-button"
            disabled={saving}
            onClick={handleSave}
          >
            <Save size={16} />{" "}
            {saving ? "Publication…" : "Enregistrer & Publier"}
          </button>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={handleLogout}
            title="Déconnexion"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {serverStatus && !serverStatus.hasGithubToken && (
        <div className="admin-banner">
          <AlertCircle size={18} />
          <span>
            <strong>GITHUB_TOKEN non configuré sur Vercel :</strong> vous pouvez
            préparer vos modifications et cliquer sur « Exporter », mais pour
            publier en 1 clic sur le site en ligne ajoutez{" "}
            <code>GITHUB_TOKEN</code> (droits Contents Read & Write sur{" "}
            <code>khaledopen/Asso</code>) dans Vercel.
          </span>
        </div>
      )}

      {feedback && (
        <div
          className={`admin-banner ${feedback.type === "error" ? "error" : "success"}`}
        >
          {feedback.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{feedback.text}</span>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={() => setFeedback(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-body">
        <aside className="admin-sidebar" aria-label="Pages du site">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={section === s.id ? "active" : ""}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        <section className="admin-editor">
          {section === "brand" && (
            <div className="admin-panel">
              <h2>Identité globale, coordonnées & liens</h2>
              <div className="admin-grid-2">
                <Field label="Nom de l’association">
                  <input
                    value={draft.brand.siteName}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, siteName: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre du logo">
                  <input
                    value={draft.brand.siteSubtitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, siteSubtitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Téléphone affiché">
                  <input
                    value={draft.brand.phone}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, phone: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Email affiché sur Contact">
                  <input
                    value={draft.brand.contactEmail}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, contactEmail: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Lien Instagram">
                  <input
                    value={draft.brand.instagramUrl}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, instagramUrl: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Lien officiel HelloAsso">
                  <input
                    value={draft.brand.helloassoUrl}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, helloassoUrl: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Lien de la collecte / bouton de don HelloAsso">
                <input
                  value={draft.brand.donationUrl}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      brand: { ...p.brand, donationUrl: e.target.value },
                    }))
                  }
                />
              </Field>
              <ImageField
                label="Logo de l’association"
                value={draft.brand.logo}
                onChange={(url) =>
                  updateDraft((p) => ({
                    ...p,
                    brand: { ...p.brand, logo: url },
                  }))
                }
                onUpload={uploadImage}
                onOpenPicker={openPickerFor}
              />
              <Field label="Texte de présentation (pied de page)">
                <textarea
                  rows={2}
                  value={draft.brand.footerDescription}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      brand: { ...p.brand, footerDescription: e.target.value },
                    }))
                  }
                />
              </Field>
              <div className="admin-grid-2">
                <Field label="Mentions RNA / SIREN (pied de page)">
                  <input
                    value={draft.brand.footerLegal}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, footerLegal: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Devise (tout en bas)">
                  <input
                    value={draft.brand.footerTagline}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brand: { ...p.brand, footerTagline: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Adresse activités (pied de page)">
                <input
                  value={draft.brand.footerAddress}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      brand: { ...p.brand, footerAddress: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          )}

          {section === "home" && (
            <div className="admin-panel">
              <h2>Page Accueil</h2>
              <div className="admin-grid-2">
                <Field label="Titre Hero (début)">
                  <input
                    value={draft.home.heroTitlePrefix}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, heroTitlePrefix: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre Hero (mot rose en italique)">
                  <input
                    value={draft.home.heroTitleEmphasis}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, heroTitleEmphasis: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Sous-titre d’accueil">
                <textarea
                  rows={2}
                  value={draft.home.heroSubtitle}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      home: { ...p.home, heroSubtitle: e.target.value },
                    }))
                  }
                />
              </Field>
              <div className="admin-grid-2">
                <Field label="Texte bouton principal">
                  <input
                    value={draft.home.heroPrimaryCta}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, heroPrimaryCta: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Texte lien secondaire">
                  <input
                    value={draft.home.heroSecondaryCta}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, heroSecondaryCta: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <ImageField
                label="Grande photo d’accueil (à droite)"
                value={draft.home.heroMainImage}
                onChange={(url) =>
                  updateDraft((p) => ({
                    ...p,
                    home: { ...p.home, heroMainImage: url },
                  }))
                }
                onUpload={uploadImage}
                onOpenPicker={openPickerFor}
              />
              <ImageField
                label="Petite photo vignette (en superposition)"
                value={draft.home.heroDetailImage}
                onChange={(url) =>
                  updateDraft((p) => ({
                    ...p,
                    home: { ...p.home, heroDetailImage: url },
                  }))
                }
                onUpload={uploadImage}
                onOpenPicker={openPickerFor}
              />
              <Field label="Petite carte flottante (note)">
                <input
                  value={draft.home.heroNote}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      home: { ...p.home, heroNote: e.target.value },
                    }))
                  }
                />
              </Field>
              <hr className="admin-sep" />
              <h3>Bandeau Manifeste</h3>
              <div className="admin-grid-2">
                <Field label="Grand chiffre / année">
                  <input
                    value={draft.home.manifestoYear}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, manifestoYear: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Surtitre manifeste">
                  <input
                    value={draft.home.manifestoEyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, manifestoEyebrow: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Phrase manifeste">
                <textarea
                  rows={2}
                  value={draft.home.manifestoText}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      home: { ...p.home, manifestoText: e.target.value },
                    }))
                  }
                />
              </Field>
              <hr className="admin-sep" />
              <h3>Bloc « Sur le terrain » & Valeurs</h3>
              <div className="admin-grid-2">
                <Field label="Surtitre">
                  <input
                    value={draft.home.actionsEyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, actionsEyebrow: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre">
                  <input
                    value={draft.home.actionsTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, actionsTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  rows={2}
                  value={draft.home.actionsText}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      home: { ...p.home, actionsText: e.target.value },
                    }))
                  }
                />
              </Field>
              <div className="admin-cards-stack">
                {draft.home.values.map((v, idx) => (
                  <div key={idx} className="admin-subcard">
                    <div className="admin-grid-2">
                      <Field label={`Valeur ${idx + 1} — Titre`}>
                        <input
                          value={v.title}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const values = [...p.home.values];
                              values[idx] = { ...values[idx], title: e.target.value };
                              return { ...p, home: { ...p.home, values } };
                            })
                          }
                        />
                      </Field>
                      <Field label={`Valeur ${idx + 1} — Texte`}>
                        <input
                          value={v.text}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const values = [...p.home.values];
                              values[idx] = { ...values[idx], text: e.target.value };
                              return { ...p, home: { ...p.home, values } };
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="admin-sep" />
              <h3>Bloc Actualités & Appel au soutien</h3>
              <div className="admin-grid-2">
                <Field label="Surtitre Actualités">
                  <input
                    value={draft.home.newsEyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, newsEyebrow: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre Actualités">
                  <input
                    value={draft.home.newsTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, newsTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Surtitre Soutien">
                  <input
                    value={draft.home.supportEyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, supportEyebrow: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre Soutien">
                  <input
                    value={draft.home.supportTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        home: { ...p.home, supportTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {section === "association" && (
            <div className="admin-panel">
              <h2>Page L’association</h2>
              <Field label="Titre principal">
                <input
                  value={draft.association.heroTitle}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      association: { ...p.association, heroTitle: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Sous-titre">
                <textarea
                  rows={2}
                  value={draft.association.heroLede}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      association: { ...p.association, heroLede: e.target.value },
                    }))
                  }
                />
              </Field>
              <ImageField
                label="Photo de l’histoire"
                value={draft.association.storyImage}
                onChange={(url) =>
                  updateDraft((p) => ({
                    ...p,
                    association: { ...p.association, storyImage: url },
                  }))
                }
                onUpload={uploadImage}
                onOpenPicker={openPickerFor}
              />
              <div className="admin-grid-2">
                <Field label="Surtitre histoire">
                  <input
                    value={draft.association.storyEyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        association: {
                          ...p.association,
                          storyEyebrow: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre histoire">
                  <input
                    value={draft.association.storyTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        association: {
                          ...p.association,
                          storyTitle: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Texte de présentation">
                <textarea
                  rows={3}
                  value={draft.association.storyText}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      association: { ...p.association, storyText: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Citation mise en avant">
                <input
                  value={draft.association.storyQuote}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      association: { ...p.association, storyQuote: e.target.value },
                    }))
                  }
                />
              </Field>
              <h3>Les 3 piliers</h3>
              <div className="admin-cards-stack">
                {draft.association.pillars.map((pil, idx) => (
                  <div key={idx} className="admin-subcard">
                    <div className="admin-grid-2">
                      <Field label={`Pilier ${pil.number} — Titre`}>
                        <input
                          value={pil.title}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const pillars = [...p.association.pillars];
                              pillars[idx] = {
                                ...pillars[idx],
                                title: e.target.value,
                              };
                              return {
                                ...p,
                                association: { ...p.association, pillars },
                              };
                            })
                          }
                        />
                      </Field>
                      <Field label={`Pilier ${pil.number} — Texte`}>
                        <input
                          value={pil.text}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const pillars = [...p.association.pillars];
                              pillars[idx] = {
                                ...pillars[idx],
                                text: e.target.value,
                              };
                              return {
                                ...p,
                                association: { ...p.association, pillars },
                              };
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-grid-2">
                <Field label="Titre appel final">
                  <input
                    value={draft.association.ctaTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        association: { ...p.association, ctaTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Texte bouton final">
                  <input
                    value={draft.association.ctaLinkLabel}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        association: {
                          ...p.association,
                          ctaLinkLabel: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {section === "actions" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Nos actions ({draft.actions.length})</h2>
                <button
                  type="button"
                  className="solid-button"
                  onClick={() => {
                    const num = String(draft.actions.length + 1).padStart(
                      2,
                      "0",
                    );
                    const newItem: ActionItem = {
                      slug: `nouvelle-action-${Date.now()}`,
                      number: num,
                      title: "Nouvelle action",
                      kicker: "Inclusion · Partage · Sourires",
                      image: "/actions/action-051.jpg",
                      short: "Courte présentation de l’action.",
                      detail: "Description complète de l’action.",
                    };
                    updateDraft((p) => ({
                      ...p,
                      actions: [...p.actions, newItem],
                    }));
                  }}
                >
                  <Plus size={16} /> Ajouter une action
                </button>
              </div>
              <div className="admin-grid-2">
                <Field label="Titre de la page">
                  <input
                    value={draft.actionsPage.heroTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        actionsPage: {
                          ...p.actionsPage,
                          heroTitle: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre de la page">
                  <input
                    value={draft.actionsPage.heroLede}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        actionsPage: {
                          ...p.actionsPage,
                          heroLede: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="admin-cards-stack">
                {draft.actions.map((action, idx) => (
                  <div key={`${action.slug}-${idx}`} className="admin-subcard">
                    <div className="admin-subcard-head">
                      <strong>
                        #{action.number} · {action.title}
                      </strong>
                      <div className="admin-subcard-tools">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={idx === 0}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              actions: moveItem(p.actions, idx, -1),
                            }))
                          }
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={idx === draft.actions.length - 1}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              actions: moveItem(p.actions, idx, 1),
                            }))
                          }
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              actions: p.actions.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="admin-grid-3">
                      <Field label="Numéro">
                        <input
                          value={action.number}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const actions = [...p.actions];
                              actions[idx] = {
                                ...actions[idx],
                                number: e.target.value,
                              };
                              return { ...p, actions };
                            })
                          }
                        />
                      </Field>
                      <Field label="Titre">
                        <input
                          value={action.title}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const actions = [...p.actions];
                              actions[idx] = {
                                ...actions[idx],
                                title: e.target.value,
                              };
                              return { ...p, actions };
                            })
                          }
                        />
                      </Field>
                      <Field label="Slug URL">
                        <input
                          value={action.slug}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const actions = [...p.actions];
                              actions[idx] = {
                                ...actions[idx],
                                slug: slugify(e.target.value),
                              };
                              return { ...p, actions };
                            })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Mots-clés (kicker)">
                      <input
                        value={action.kicker}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const actions = [...p.actions];
                            actions[idx] = {
                              ...actions[idx],
                              kicker: e.target.value,
                            };
                            return { ...p, actions };
                          })
                        }
                      />
                    </Field>
                    <ImageField
                      label="Image ou affiche"
                      value={action.image}
                      onChange={(url) =>
                        updateDraft((p) => {
                          const actions = [...p.actions];
                          actions[idx] = { ...actions[idx], image: url };
                          return { ...p, actions };
                        })
                      }
                      onUpload={uploadImage}
                      onOpenPicker={openPickerFor}
                    />
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(action.isPoster)}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const actions = [...p.actions];
                            actions[idx] = {
                              ...actions[idx],
                              isPoster: e.target.checked,
                            };
                            return { ...p, actions };
                          })
                        }
                      />
                      <span>
                        Format affiche (affiche l’image entière sans recadrage)
                      </span>
                    </label>
                    <Field label="Résumé court">
                      <textarea
                        rows={2}
                        value={action.short}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const actions = [...p.actions];
                            actions[idx] = {
                              ...actions[idx],
                              short: e.target.value,
                            };
                            return { ...p, actions };
                          })
                        }
                      />
                    </Field>
                    <Field label="Description complète">
                      <textarea
                        rows={3}
                        value={action.detail}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const actions = [...p.actions];
                            actions[idx] = {
                              ...actions[idx],
                              detail: e.target.value,
                            };
                            return { ...p, actions };
                          })
                        }
                      />
                    </Field>
                    <Field label="Titre de l’encadré infos pratiques (optionnel)">
                      <input
                        value={action.highlightsTitle || ""}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const actions = [...p.actions];
                            actions[idx] = {
                              ...actions[idx],
                              highlightsTitle: e.target.value,
                            };
                            return { ...p, actions };
                          })
                        }
                      />
                    </Field>
                    <LinesEditor
                      label="Points infos pratiques (optionnel)"
                      items={action.highlights || []}
                      onChange={(highlights) =>
                        updateDraft((p) => {
                          const actions = [...p.actions];
                          actions[idx] = { ...actions[idx], highlights };
                          return { ...p, actions };
                        })
                      }
                      addLabel="Ajouter un point"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "news" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Actualités ({draft.news.length})</h2>
                <button
                  type="button"
                  className="solid-button"
                  onClick={() => {
                    const today = new Date();
                    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
                    const newArticle: NewsItem = {
                      slug: `actualite-${Date.now()}`,
                      date: dateStr,
                      category: "Événement",
                      title: "Nouvelle actualité de l’association",
                      excerpt:
                        "Résumé affiché sur la carte d’actualité et en tête de l’article.",
                      image: "/actions/action-060.jpg",
                      bodyParagraphs: [
                        "Rédigez ici le contenu complet de votre actualité.",
                      ],
                    };
                    updateDraft((p) => ({
                      ...p,
                      news: [newArticle, ...p.news],
                    }));
                  }}
                >
                  <Plus size={16} /> Publier une actualité
                </button>
              </div>
              <div className="admin-grid-2">
                <Field label="Titre de la page">
                  <input
                    value={draft.newsPage.heroTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        newsPage: { ...p.newsPage, heroTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre de la page">
                  <input
                    value={draft.newsPage.heroLede}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        newsPage: { ...p.newsPage, heroLede: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="admin-cards-stack">
                {draft.news.map((item, idx) => (
                  <div key={`${item.slug}-${idx}`} className="admin-subcard">
                    <div className="admin-subcard-head">
                      <strong>
                        {item.date} · {item.title}
                      </strong>
                      <div className="admin-subcard-tools">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={idx === 0}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              news: moveItem(p.news, idx, -1),
                            }))
                          }
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={idx === draft.news.length - 1}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              news: moveItem(p.news, idx, 1),
                            }))
                          }
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              news: p.news.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="admin-grid-3">
                      <Field label="Date (JJ.MM.AAAA)">
                        <input
                          value={item.date}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const news = [...p.news];
                              news[idx] = { ...news[idx], date: e.target.value };
                              return { ...p, news };
                            })
                          }
                        />
                      </Field>
                      <Field label="Catégorie">
                        <input
                          value={item.category}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const news = [...p.news];
                              news[idx] = {
                                ...news[idx],
                                category: e.target.value,
                              };
                              return { ...p, news };
                            })
                          }
                        />
                      </Field>
                      <Field label="Slug URL">
                        <input
                          value={item.slug}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const news = [...p.news];
                              news[idx] = {
                                ...news[idx],
                                slug: slugify(e.target.value),
                              };
                              return { ...p, news };
                            })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Titre de l’article">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const news = [...p.news];
                            news[idx] = { ...news[idx], title: e.target.value };
                            return { ...p, news };
                          })
                        }
                      />
                    </Field>
                    <Field label="Résumé / chapô">
                      <textarea
                        rows={2}
                        value={item.excerpt}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const news = [...p.news];
                            news[idx] = { ...news[idx], excerpt: e.target.value };
                            return { ...p, news };
                          })
                        }
                      />
                    </Field>
                    <ImageField
                      label="Image de couverture"
                      value={item.image}
                      onChange={(url) =>
                        updateDraft((p) => {
                          const news = [...p.news];
                          news[idx] = { ...news[idx], image: url };
                          return { ...p, news };
                        })
                      }
                      onUpload={uploadImage}
                      onOpenPicker={openPickerFor}
                    />
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(item.isPoster)}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const news = [...p.news];
                            news[idx] = {
                              ...news[idx],
                              isPoster: e.target.checked,
                            };
                            return { ...p, news };
                          })
                        }
                      />
                      <span>Format affiche (non recadrée dans le détail)</span>
                    </label>
                    <div className="admin-grid-2">
                      <Field label="Vidéo MP4 (optionnel, ex: /official/salon-solidaire.mp4)">
                        <input
                          value={item.video || ""}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const news = [...p.news];
                              news[idx] = {
                                ...news[idx],
                                video: e.target.value || undefined,
                              };
                              return { ...p, news };
                            })
                          }
                        />
                      </Field>
                      <Field label="Légende vidéo (optionnel)">
                        <input
                          value={item.videoCaption || ""}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const news = [...p.news];
                              news[idx] = {
                                ...news[idx],
                                videoCaption: e.target.value || undefined,
                              };
                              return { ...p, news };
                            })
                          }
                        />
                      </Field>
                    </div>
                    <LinesEditor
                      label="Paragraphes de l’article"
                      items={item.bodyParagraphs || []}
                      onChange={(bodyParagraphs) =>
                        updateDraft((p) => {
                          const news = [...p.news];
                          news[idx] = { ...news[idx], bodyParagraphs };
                          return { ...p, news };
                        })
                      }
                      addLabel="Ajouter un paragraphe"
                      multiline
                    />
                    <Field label="Titre de l’encadré points forts (optionnel)">
                      <input
                        value={item.highlightsTitle || ""}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const news = [...p.news];
                            news[idx] = {
                              ...news[idx],
                              highlightsTitle: e.target.value || undefined,
                            };
                            return { ...p, news };
                          })
                        }
                      />
                    </Field>
                    <LinesEditor
                      label="Points forts (optionnel)"
                      items={item.highlights || []}
                      onChange={(highlights) =>
                        updateDraft((p) => {
                          const news = [...p.news];
                          news[idx] = { ...news[idx], highlights };
                          return { ...p, news };
                        })
                      }
                      addLabel="Ajouter un point"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "gallery" && (
            <div className="admin-panel">
              <h2>Galerie ({draft.gallery.length} photos)</h2>
              <div className="admin-grid-2">
                <Field label="Titre de la page">
                  <input
                    value={draft.galleryPage.heroTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        galleryPage: {
                          ...p.galleryPage,
                          heroTitle: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre de la page">
                  <input
                    value={draft.galleryPage.heroLede}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        galleryPage: {
                          ...p.galleryPage,
                          heroLede: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="admin-gallery-uploader">
                <div>
                  <strong>Ajouter des photos dans la galerie</strong>
                  <p>
                    Choisissez la catégorie puis importez une ou plusieurs
                    images directement depuis votre appareil.
                  </p>
                </div>
                <div className="admin-gallery-uploader-controls">
                  <select
                    value={galleryQuickCategory}
                    onChange={(e) => setGalleryQuickCategory(e.target.value)}
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <label className="solid-button admin-upload-btn">
                    <Upload size={16} />{" "}
                    {galleryUploading
                      ? "Import en cours…"
                      : "Importer des photos"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={galleryUploading}
                      onChange={handleQuickGalleryUpload}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div className="admin-gallery-list">
                {draft.gallery.map((photo, idx) => (
                  <div key={`${photo.src}-${idx}`} className="admin-gallery-row">
                    <img src={photo.src} alt={photo.alt} />
                    <div className="admin-gallery-meta">
                      <input
                        value={photo.src}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const gallery = [...p.gallery];
                            gallery[idx] = {
                              ...gallery[idx],
                              src: e.target.value,
                            };
                            return { ...p, gallery };
                          })
                        }
                        aria-label="Chemin image"
                      />
                      <div className="admin-grid-2">
                        <select
                          value={photo.label}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const gallery = [...p.gallery];
                              gallery[idx] = {
                                ...gallery[idx],
                                label: e.target.value,
                              };
                              return { ...p, gallery };
                            })
                          }
                        >
                          {GALLERY_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <input
                          value={photo.alt}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const gallery = [...p.gallery];
                              gallery[idx] = {
                                ...gallery[idx],
                                alt: e.target.value,
                              };
                              return { ...p, gallery };
                            })
                          }
                          placeholder="Description (alt)"
                        />
                      </div>
                    </div>
                    <div className="admin-subcard-tools">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        disabled={idx === 0}
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            gallery: moveItem(p.gallery, idx, -1),
                          }))
                        }
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        disabled={idx === draft.gallery.length - 1}
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            gallery: moveItem(p.gallery, idx, 1),
                          }))
                        }
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            gallery: p.gallery.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "donation" && (
            <div className="admin-panel">
              <h2>Page Faire un don & cartes HelloAsso</h2>
              <div className="admin-grid-2">
                <Field label="Titre Hero">
                  <input
                    value={draft.donation.heroTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        donation: { ...p.donation, heroTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre Hero">
                  <input
                    value={draft.donation.heroLede}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        donation: { ...p.donation, heroLede: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Titre section explication">
                <input
                  value={draft.donation.title}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      donation: { ...p.donation, title: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Introduction">
                <textarea
                  rows={2}
                  value={draft.donation.intro}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      donation: { ...p.donation, intro: e.target.value },
                    }))
                  }
                />
              </Field>
              <LinesEditor
                label="Liste à quoi sert votre soutien"
                items={draft.donation.bullets}
                onChange={(bullets) =>
                  updateDraft((p) => ({
                    ...p,
                    donation: { ...p.donation, bullets },
                  }))
                }
              />

              <div className="admin-panel-header" style={{ marginTop: "28px" }}>
                <h3>Cartes Campagnes & Événements HelloAsso</h3>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => {
                    const card: HelloAssoItem = {
                      type: "Collecte en cours",
                      title: "Nouvelle campagne HelloAsso",
                      description: "Description de la campagne ou événement.",
                      image: "/actions/action-051.jpg",
                      url: draft.brand.helloassoUrl,
                      cta: "Voir sur HelloAsso",
                    };
                    updateDraft((p) => ({
                      ...p,
                      helloAssoActions: [...p.helloAssoActions, card],
                    }));
                  }}
                >
                  <Plus size={15} /> Ajouter une carte
                </button>
              </div>
              <div className="admin-cards-stack">
                {draft.helloAssoActions.map((card, idx) => (
                  <div key={idx} className="admin-subcard">
                    <div className="admin-subcard-head">
                      <strong>{card.title}</strong>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            helloAssoActions: p.helloAssoActions.filter(
                              (_, i) => i !== idx,
                            ),
                          }))
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="admin-grid-2">
                      <Field label="Badge / Date">
                        <input
                          value={card.type}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const helloAssoActions = [...p.helloAssoActions];
                              helloAssoActions[idx] = {
                                ...helloAssoActions[idx],
                                type: e.target.value,
                              };
                              return { ...p, helloAssoActions };
                            })
                          }
                        />
                      </Field>
                      <Field label="Titre">
                        <input
                          value={card.title}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const helloAssoActions = [...p.helloAssoActions];
                              helloAssoActions[idx] = {
                                ...helloAssoActions[idx],
                                title: e.target.value,
                              };
                              return { ...p, helloAssoActions };
                            })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const helloAssoActions = [...p.helloAssoActions];
                            helloAssoActions[idx] = {
                              ...helloAssoActions[idx],
                              description: e.target.value,
                            };
                            return { ...p, helloAssoActions };
                          })
                        }
                      />
                    </Field>
                    <ImageField
                      label="Image de la carte"
                      value={card.image}
                      onChange={(url) =>
                        updateDraft((p) => {
                          const helloAssoActions = [...p.helloAssoActions];
                          helloAssoActions[idx] = {
                            ...helloAssoActions[idx],
                            image: url,
                          };
                          return { ...p, helloAssoActions };
                        })
                      }
                      onUpload={uploadImage}
                      onOpenPicker={openPickerFor}
                    />
                    <div className="admin-grid-2">
                      <Field label="Lien HelloAsso">
                        <input
                          value={card.url}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const helloAssoActions = [...p.helloAssoActions];
                              helloAssoActions[idx] = {
                                ...helloAssoActions[idx],
                                url: e.target.value,
                              };
                              return { ...p, helloAssoActions };
                            })
                          }
                        />
                      </Field>
                      <Field label="Texte du lien">
                        <input
                          value={card.cta}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const helloAssoActions = [...p.helloAssoActions];
                              helloAssoActions[idx] = {
                                ...helloAssoActions[idx],
                                cta: e.target.value,
                              };
                              return { ...p, helloAssoActions };
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "contact" && (
            <div className="admin-panel">
              <h2>Page Contact</h2>
              <Field label="Titre Hero">
                <input
                  value={draft.contact.heroTitle}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      contact: { ...p.contact, heroTitle: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Sous-titre Hero">
                <textarea
                  rows={2}
                  value={draft.contact.heroLede}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      contact: { ...p.contact, heroLede: e.target.value },
                    }))
                  }
                />
              </Field>
              <div className="admin-grid-2">
                <Field label="Surtitre">
                  <input
                    value={draft.contact.eyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        contact: { ...p.contact, eyebrow: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Titre bloc coordonnées">
                  <input
                    value={draft.contact.title}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        contact: { ...p.contact, title: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Introduction coordonnées">
                <input
                  value={draft.contact.intro}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      contact: { ...p.contact, intro: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Titre lieu des activités">
                <input
                  value={draft.contact.venueTitle}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      contact: { ...p.contact, venueTitle: e.target.value },
                    }))
                  }
                />
              </Field>
              <LinesEditor
                label="Lignes d’adresse du lieu"
                items={draft.contact.venueLines}
                onChange={(venueLines) =>
                  updateDraft((p) => ({
                    ...p,
                    contact: { ...p.contact, venueLines },
                  }))
                }
              />
              <Field label="Titre siège social">
                <input
                  value={draft.contact.hqTitle}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      contact: { ...p.contact, hqTitle: e.target.value },
                    }))
                  }
                />
              </Field>
              <LinesEditor
                label="Lignes d’adresse du siège"
                items={draft.contact.hqLines}
                onChange={(hqLines) =>
                  updateDraft((p) => ({
                    ...p,
                    contact: { ...p.contact, hqLines },
                  }))
                }
              />
            </div>
          )}

          {section === "legal" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Mentions légales</h2>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => {
                    const sec: LegalSectionItem = {
                      eyebrow: "Section",
                      title: `${draft.legal.sections.length + 1}. Nouvelle rubrique`,
                      paragraphs: ["Contenu de la rubrique."],
                    };
                    updateDraft((p) => ({
                      ...p,
                      legal: {
                        ...p.legal,
                        sections: [...p.legal.sections, sec],
                      },
                    }));
                  }}
                >
                  <Plus size={15} /> Ajouter une rubrique
                </button>
              </div>
              <div className="admin-grid-2">
                <Field label="Titre Hero">
                  <input
                    value={draft.legal.heroTitle}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        legal: { ...p.legal, heroTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Sous-titre Hero">
                  <input
                    value={draft.legal.heroLede}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        legal: { ...p.legal, heroLede: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="admin-cards-stack">
                {draft.legal.sections.map((sec, idx) => (
                  <div key={idx} className="admin-subcard">
                    <div className="admin-subcard-head">
                      <strong>{sec.title}</strong>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            legal: {
                              ...p.legal,
                              sections: p.legal.sections.filter(
                                (_, i) => i !== idx,
                              ),
                            },
                          }))
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="admin-grid-2">
                      <Field label="Surtitre">
                        <input
                          value={sec.eyebrow}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const sections = [...p.legal.sections];
                              sections[idx] = {
                                ...sections[idx],
                                eyebrow: e.target.value,
                              };
                              return { ...p, legal: { ...p.legal, sections } };
                            })
                          }
                        />
                      </Field>
                      <Field label="Titre">
                        <input
                          value={sec.title}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const sections = [...p.legal.sections];
                              sections[idx] = {
                                ...sections[idx],
                                title: e.target.value,
                              };
                              return { ...p, legal: { ...p.legal, sections } };
                            })
                          }
                        />
                      </Field>
                    </div>
                    <LinesEditor
                      label="Paragraphes"
                      items={sec.paragraphs}
                      onChange={(paragraphs) =>
                        updateDraft((p) => {
                          const sections = [...p.legal.sections];
                          sections[idx] = { ...sections[idx], paragraphs };
                          return { ...p, legal: { ...p.legal, sections } };
                        })
                      }
                      multiline
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {mediaTargetCallback && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setMediaTargetCallback(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Choisir une image de la médiathèque</h3>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setMediaTargetCallback(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-search">
              <input
                type="search"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Filtrer par nom (ex: action-035, mallette, uploads)…"
              />
            </div>
            <div className="admin-media-grid">
              {filteredMedia.map((url) => (
                <button
                  key={url}
                  type="button"
                  className="admin-media-tile"
                  onClick={() => {
                    mediaTargetCallback(url);
                    setMediaTargetCallback(null);
                  }}
                >
                  <img src={url} alt="" loading="lazy" />
                  <span>{url.split("/").pop()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
