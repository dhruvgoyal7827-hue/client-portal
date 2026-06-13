import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { getClientByFirebaseUid } from "../lib/api";

interface UseClientIdResult {
  clientMongoId: string | null;
  clientLoading: boolean;
  /** true when the backend returned 404 – account not yet provisioned */
  clientNotFound: boolean;
}

export function useClientId(): UseClientIdResult {
  const { user, loading: authLoading } = useAuth();
  const [clientMongoId, setClientMongoId] = useState<string | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientNotFound, setClientNotFound] = useState(false);

  useEffect(() => {
    // Wait until Firebase auth has resolved
    if (authLoading) return;

    if (!user) {
      setClientLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchClientId() {
      setClientLoading(true);
      setClientNotFound(false);
      console.log('[useClientId] fetching client for firebaseUid:', user!.uid);
      try {
        const client = await getClientByFirebaseUid(user!.uid);
        if (cancelled) return;

        if (!client) {
          // 404 – account not yet set up in MongoDB
          console.warn('[useClientId] client not found (404) — showing setup screen');
          setClientNotFound(true);
          setClientMongoId(null);
        } else {
          const id = client._id || client.id;
          console.log('[useClientId] ✅ resolved clientMongoId:', id, '| full client doc:', client);
          setClientMongoId(id);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[useClientId] ❌ unexpected error fetching client:", err);
        // Treat unexpected errors the same as not-found to avoid crashes
        setClientNotFound(true);
        setClientMongoId(null);
      } finally {
        if (!cancelled) setClientLoading(false);
      }
    }

    fetchClientId();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { clientMongoId, clientLoading, clientNotFound };
}
