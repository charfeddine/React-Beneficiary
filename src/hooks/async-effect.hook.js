import { useEffect } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export const useAsyncEffect = (effect, dependencies) => {
  useEffect(() => {
    if (typeof effect === "function") {
      effect();
    } else if (effect?.mount && effect?.unmount) {
      effect.mount();
      return effect.unmount;
    }
  }, dependencies);
};
