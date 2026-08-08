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

import { getSceneElement } from "@/lib/webgl/getSceneElement";

export default function WebGLScene() {
  const { renderer } = useWebGL();

  useEffect(() => {
    if (!renderer) {
      return;
    }

    const { gl } = renderer;

const element = getSceneElement(
  "[data-webgl-scene]"
);

if (!element) {
  return;
}

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
     * Uniforms
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
     * Mesh
     * -----------------------------------------------------
     */

    new Mesh(gl, {
      geometry: new Triangle(gl),

      program: new Program(gl, {
        vertex: heroVertexShader,

        fragment: heroFragmentShader,

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
        (event.clientX / window.innerWidth) * 2 -
        1;

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
    };

const updateScroll = () => {
  const rect = element.getBoundingClientRect();

  const progress =
    -rect.top /
    Math.max(window.innerHeight, 1);

  uScroll.value = Math.max(
    0,
    Math.min(1, progress)
  );
};

window.addEventListener(
  "scroll",
  updateScroll,
  { passive: true }
);

updateScroll();

    renderer.addScene(scene);


    /*
     * -----------------------------------------------------
     * Cleanup
     * -----------------------------------------------------
     */

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      window.removeEventListener(
  "scroll",
  updateScroll
);

      renderer.removeScene?.(scene);
    };
  }, [renderer]);

  return null;
}