import { useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "./scrollLock";

export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [isLocked]);
}
