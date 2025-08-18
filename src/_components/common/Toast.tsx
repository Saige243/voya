"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ToastHandler() {
  useEffect(() => {
    const url = new URL(window.location.href);
    let shouldReplace = false;

    const created = url.searchParams.get("created");
    const deleted = url.searchParams.get("deleted");
    const title = url.searchParams.get("title");

    if (created && title) {
      toast.success(`Trip "${title}" created successfully`);
      url.searchParams.delete("created");
      url.searchParams.delete("title");
      shouldReplace = true;
    }

    if (deleted) {
      toast.success("Trip deleted successfully");
      url.searchParams.delete("deleted");
      shouldReplace = true;
    }

    if (shouldReplace) {
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  return null;
}
