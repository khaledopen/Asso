import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SiteContent,
} from "../data/siteContent";

interface ContentContextValue {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  refreshContent: () => Promise<void>;
  loadingRemote: boolean;
}

const ContentContext = createContext<ContentContextValue>({
  content: DEFAULT_SITE_CONTENT,
  setContent: () => undefined,
  refreshContent: async () => undefined,
  loadingRemote: false,
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loadingRemote, setLoadingRemote] = useState(true);

  const refreshContent = useCallback(async () => {
    setLoadingRemote(true);
    try {
      const apiRes = await fetch(`/api/content?t=${Date.now()}`, {
        cache: "no-store",
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const apiJson = (await apiRes.json().catch(() => null)) as {
          ok?: boolean;
          content?: Partial<SiteContent>;
        } | null;
        if (apiJson?.ok && apiJson.content) {
          setContentState(mergeSiteContent(apiJson.content));
          setLoadingRemote(false);
          return;
        }
      }

      const staticRes = await fetch(`/content.json?t=${Date.now()}`, {
        cache: "no-store",
      }).catch(() => null);

      if (staticRes && staticRes.ok) {
        const staticJson = (await staticRes
          .json()
          .catch(() => null)) as Partial<SiteContent> | null;
        if (staticJson) {
          setContentState(mergeSiteContent(staticJson));
        }
      }
    } finally {
      setLoadingRemote(false);
    }
  }, []);

  useEffect(() => {
    void refreshContent();
  }, [refreshContent]);

  const setContent = useCallback((next: SiteContent) => {
    setContentState(mergeSiteContent(next));
  }, []);

  return (
    <ContentContext.Provider
      value={{ content, setContent, refreshContent, loadingRemote }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(ContentContext);
}
