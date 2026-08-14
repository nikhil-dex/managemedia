"use client";

import { useEffect } from "react";

import {
  Drawable,
  Mesh,
  Program,
  ScrollScene,
  Triangle,
  Uniform,
} from "wtc-gl";

import { useWebGL } from "./WebGLCanvas";

import {
  heroFragmentShader,
  heroVertexShader,
} from "@/lib/webgl/shaders/hero";

import {
  servicesFragmentShader,
  servicesVertexShader,
} from "@/lib/webgl/shaders/services";

import {
  workFragmentShader,
  workVertexShader,
} from "@/lib/webgl/shaders/work";

export default function WebGLScene() {
  const { renderer } = useWebGL();

  useEffect(() => {
    if (!renderer) {
      return;
    }

    const { gl } = renderer;

    const sceneElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-webgl-scene]"
      )
    );

    if (!sceneElements.length) {
      return;
    }

    const scenes: ScrollScene[] = [];

    sceneElements.forEach((element) => {
      const sceneType =
        element.dataset.webglScene;

      /*
       * -----------------------------------------------------
       * Scene
       * -----------------------------------------------------
       */

      const drawable = new Drawable(gl);

      const scene = new ScrollScene({
        element,
        scene: drawable,
      });

      /*
       * -----------------------------------------------------
       * Shared uniforms
       * -----------------------------------------------------
       */

      const uTime = new Uniform({
        name: "u_time",
        value: 0,
        kind: "float",
      });

      const uMouse = new Uniform({
        name: "u_mouse",
        value: [0, 0],
        kind: "float_vec2",
      });

      const uScroll = new Uniform({
        name: "u_scroll",
        value: 0,
        kind: "float",
      });

      /*
       * -----------------------------------------------------
       * Select shader
       * -----------------------------------------------------
       */

const vertexShader =
  sceneType === "services"
    ? servicesVertexShader
    : sceneType === "work"
      ? workVertexShader
      : heroVertexShader;

const fragmentShader =
  sceneType === "services"
    ? servicesFragmentShader
    : sceneType === "work"
      ? workFragmentShader
      : heroFragmentShader;
      /*
       * -----------------------------------------------------
       * Mesh
       * -----------------------------------------------------
       */

      new Mesh(gl, {
        geometry: new Triangle(gl),

        program: new Program(gl, {
          vertex: vertexShader,
          fragment: fragmentShader,

          uniforms: {
            ...scene.uniforms,
            u_time: uTime,
            u_mouse: uMouse,
            u_scroll: uScroll,
          },

          transparent: true,
        }),
      }).setParent(drawable);

      /*
       * -----------------------------------------------------
       * Mouse
       * -----------------------------------------------------
       */

      const handlePointerMove = (
        event: PointerEvent
      ) => {
        const x =
          (event.clientX / window.innerWidth) * 2 - 1;

        const y =
          1 -
          (event.clientY / window.innerHeight) * 2;

        uMouse.value = [x, y];
      };

      window.addEventListener(
        "pointermove",
        handlePointerMove,
        { passive: true }
      );

      /*
       * -----------------------------------------------------
       * Render
       * -----------------------------------------------------
       */

      scene.onBeforeRender = (delta) => {
        const currentTime =
          uTime.value as number;

        uTime.value =
          currentTime +
          delta * 0.001;

        const rect =
          element.getBoundingClientRect();

        const progress =
          -rect.top /
          Math.max(window.innerHeight, 1);

        uScroll.value = Math.max(
          0,
          Math.min(1, progress)
        );
      };

      renderer.addScene(scene);

      scenes.push(scene);

      /*
       * Store cleanup function on the scene.
       *
       * This lets us remove the pointer listener
       * when the component unmounts.
       */
      (
        scene as ScrollScene & {
          __mmCleanup?: () => void;
        }
      ).__mmCleanup = () => {
        window.removeEventListener(
          "pointermove",
          handlePointerMove
        );
      };
    });

    /*
     * -----------------------------------------------------
     * Cleanup
     * -----------------------------------------------------
     */

    return () => {
      scenes.forEach((scene) => {
        const sceneWithCleanup =
          scene as ScrollScene & {
            __mmCleanup?: () => void;
          };

        sceneWithCleanup.__mmCleanup?.();

        renderer.removeScene?.(scene);
      });
    };
  }, [renderer]);

  return null;
}