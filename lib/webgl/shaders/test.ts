export const testVertexShader = `
precision highp float;

attribute vec2 a_position;

varying vec2 vUv;

void main() {
  vUv = a_position * 0.5 + 0.5;

  gl_Position = vec4(
    a_position,
    0.0,
    1.0
  );
}
`;

export const testFragmentShader = `
precision highp float;

uniform float u_time;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float wave = sin(
    uv.x * 8.0 +
    u_time * 0.8
  );

  float wave2 = cos(
    uv.y * 7.0 -
    u_time * 0.5
  );

  float value =
    0.5 +
    0.25 * wave +
    0.25 * wave2;

  vec3 color = mix(
    vec3(0.02, 0.02, 0.025),
    vec3(0.15, 0.25, 0.18),
    value
  );

  gl_FragColor = vec4(
    color,
    1.0
  );
}
`;