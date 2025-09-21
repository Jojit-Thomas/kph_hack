"use client";

import { useStore } from "@/components/StoreProvider";
import { Button } from "@/components/ui/button";
import axios from "@/config/axios";
import { Check, Copy, Link as LinkIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NoStoreOnboarding() {
  const router = useRouter();
  const { refreshStores } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPublishedUrl(null);
    try {
      const res = await axios.post("/store", { name, description });
      const store = res.data as { handle: string; name: string };
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${base}/store/${store.handle}`;
      setPublishedUrl(url);
      // refresh context
      await refreshStores();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    if (!publishedUrl) return;
    await navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Create your first store</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No stores found for your account. Create one to get a public link you can share.
        </p>

        <form onSubmit={createStore} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Store name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Threads"
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you sell?"
              rows={3}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Create store
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/stores")}>Manage later</Button>
          </div>
        </form>

        {publishedUrl && (
          <div className="mt-6 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LinkIcon className="size-4" />
              Published URL
            </div>
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded-md bg-muted px-2 py-1 text-sm">{publishedUrl}</code>
              <Button variant="outline" size="sm" onClick={copyUrl}>
                {copied ? <Check className="mr-1 size-4" /> : <Copy className="mr-1 size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button size="sm" onClick={() => router.push("/admin/products/create")}>Add products</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
