"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Content stays visible without JavaScript. Only offscreen items wait for reveal.
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const registered = new Set<HTMLElement>();
    let intersection: IntersectionObserver | undefined;
    let mutation: MutationObserver | undefined;
    let frame = 0;
    let pageAnimation: Animation | undefined;

    const clear = () => {
      intersection?.disconnect();
      mutation?.disconnect();
      cancelAnimationFrame(frame);
      pageAnimation?.cancel();
      for (const element of registered) {
        delete element.dataset.motionState;
        element.style.removeProperty("--reveal-delay");
      }
      registered.clear();
    };

    const start = () => {
      clear();
      if (preference.matches) return;
      intersection = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.motionState = "visible";
          intersection?.unobserve(element);
        }
      }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

      const register = () => {
        for (const element of document.querySelectorAll<HTMLElement>("main [data-reveal], main [data-reveal-group] > *")) {
          if (registered.has(element)) continue;
          const bounds = element.getBoundingClientRect();
          if (!bounds.width || !bounds.height) continue;
          registered.add(element);
          const position = element.parentElement?.hasAttribute("data-reveal-group")
            ? Array.from(element.parentElement.children).indexOf(element) : 0;
          element.style.setProperty("--reveal-delay", `${Math.min(position, 5) * 45}ms`);
          if (bounds.top < window.innerHeight - 24 && bounds.bottom > 0) {
            element.dataset.motionState = "visible";
          } else {
            element.dataset.motionState = "pending";
            intersection?.observe(element);
          }
        }
      };

      register();
      mutation = new MutationObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(register);
      });
      mutation.observe(document.body, { childList: true, subtree: true });
      pageAnimation = document.querySelector("main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    };

    start();
    preference.addEventListener("change", start);
    return () => { clear(); preference.removeEventListener("change", start); };
  }, [pathname]);

  return null;
}
