"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UseUnsavedChangesGuardOptions {
  isDirty: boolean;
}

export function useUnsavedChangesGuard({
  isDirty,
}: UseUnsavedChangesGuardOptions) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const clearPendingNavigation = useCallback(() => {
    setIsDialogOpen(false);
    setPendingHref(null);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (!pendingHref) {
      clearPendingNavigation();
      return;
    }

    const nextUrl = new URL(pendingHref, window.location.origin);
    const nextRoute = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    clearPendingNavigation();
    router.push(nextRoute);
  }, [clearPendingNavigation, pendingHref, router]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty || isDialogOpen) {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      if (anchor.dataset.bypassUnsavedGuard === "true") {
        return;
      }

      const destination = new URL(anchor.href, window.location.origin);
      if (destination.origin !== window.location.origin) {
        return;
      }

      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = `${destination.pathname}${destination.search}${destination.hash}`;
      if (current === next) {
        return;
      }

      event.preventDefault();
      setPendingHref(destination.href);
      setIsDialogOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDialogOpen, isDirty]);

  return {
    isDialogOpen,
    confirmNavigation,
    cancelNavigation: clearPendingNavigation,
  };
}
