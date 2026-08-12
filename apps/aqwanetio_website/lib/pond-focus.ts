import { useEffect } from "react";

const POND_FOCUS_EVENT = "aqw:pond-focus";

export function focusPond(pondId: string) {
  window.dispatchEvent(new CustomEvent(POND_FOCUS_EVENT, { detail: { pondId } }));
}

export function usePondFocus(cb: (pondId: string) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      cb((e as CustomEvent<{ pondId: string }>).detail.pondId);
    };
    window.addEventListener(POND_FOCUS_EVENT, handler);
    return () => window.removeEventListener(POND_FOCUS_EVENT, handler);
  }, [cb]);
}
