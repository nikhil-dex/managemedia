precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(
    sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123
  );
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(
    mix(a, b, f.x),
    mix(c, d, f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv;

  /*
   * Flowing movement
   */
  vec2 flowUv = uv * 3.0;

  flowUv.x += u_time * 0.08;
  flowUv.y += sin(u_time * 0.4) * 0.15;

  /*
   * Mouse influence
   */
  vec2 mouse = u_mouse * 0.5 + 0.5;

  float mouseDistance = distance(uv, mouse);

  float mouseInfluence = smoothstep(
    0.65,
    0.0,
    mouseDistance
  );

  flowUv += vec2(
    mouseInfluence * 0.35,
    mouseInfluence * 0.2
  );

  /*
   * Organic noise
   */
  float n = noise(flowUv);

  /*
   * Scroll influence
   */
  float scrollWave = sin(
    uv.y * 8.0 +
    u_scroll * 8.0 +
    u_time * 0.5
  );

  n += scrollWave * 0.12;

  /*
   * Soft flowing bands
   */
  float bands = smoothstep(
    0.25,
    0.75,
    n
  );

  /*
   * ManageMedia green
   */
  vec3 green = vec3(
    0.85,
    1.0,
    0.0
  );

  float intensity = bands * 0.22;

  /*
   * Keep the effect atmospheric.
   */
  float edgeFade =
    smoothstep(0.0, 0.18, uv.x) *
    smoothstep(1.0, 0.82, uv.x) *
    smoothstep(0.0, 0.18, uv.y) *
    smoothstep(1.0, 0.82, uv.y);

  intensity *= edgeFade;

  gl_FragColor = vec4(
    green * intensity,
    intensity
  );
}