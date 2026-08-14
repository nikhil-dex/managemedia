"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import { ScrollRenderer } from "wtc-gl";

class WebGLStore {
  private renderer: ScrollRenderer | null = null;

  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => {
    return this.renderer;
  };

  setRenderer = (renderer: ScrollRenderer | null) => {
    this.renderer = renderer;

    this.listeners.forEach((listener) => {
      listener();
    });
  };
}

const webglStore = new WebGLStore();

const WebGLContext =
  createContext<WebGLStore | null>(null);

export function useWebGL() {
  const store = useContext(WebGLContext);

  if (!store) {
    throw new Error(
      "useWebGL must be used inside WebGLCanvas"
    );
  }

  const renderer = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => null
  );

  return {
    renderer,
  };
}

interface WebGLCanvasProps {
  children?: ReactNode;
}

export default function WebGLCanvas({
  children,
}: WebGLCanvasProps) {
  useEffect(() => {
    const supportsWebGLInteraction = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!supportsWebGLInteraction) {
    return;
  }
    const renderer = new ScrollRenderer({
      rendererProps: {
        antialias: true,
        premultipliedAlpha: true,
        alpha: true,
      },
    });

    renderer.canvas.classList.add(
      "mm-webgl-canvas"
    );

    document.body.appendChild(renderer.canvas);

    renderer.playing = true;

    webglStore.setRenderer(renderer);

    return () => {
      webglStore.setRenderer(null);

      renderer.playing = false;

      renderer.canvas.remove();

      renderer.destroy?.();
    };
  }, []);

  return (
    <WebGLContext.Provider value={webglStore}>
      {children}
    </WebGLContext.Provider>
  );
}