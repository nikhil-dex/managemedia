precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);

  float pulse = 0.5 + 0.5 * sin(u_time);

  vec3 base = vec3(0.015, 0.018, 0.02);
  vec3 accent = vec3(0.2, 1.0, 0.45);

  float glow = smoothstep(
    0.65,
    0.0,
    distance(uv, vec2(0.5))
  );

  vec3 color = mix(
    base,
    accent * 0.12,
    glow * (0.7 + pulse * 0.3)
  );

  gl_FragColor = vec4(color, 1.0);
}