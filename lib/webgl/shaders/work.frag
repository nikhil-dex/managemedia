precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(
    sin(dot(p, vec2(127.1, 311.7))) *
    43758.5453123
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
   * Mouse position
   */
  vec2 mouse = u_mouse * 0.5 + 0.5;

  float mouseDistance = distance(
    uv,
    mouse
  );

  /*
   * Local mouse ripple
   */
  float ripple = exp(
    -mouseDistance * 12.0
  );

  float wave = sin(
    mouseDistance * 32.0 -
    u_time * 4.0
  );

  /*
   * Organic movement
   */
  vec2 flowUv = uv * 5.0;

  flowUv.x += u_time * 0.12;
  flowUv.y += sin(u_time * 0.35) * 0.1;

  flowUv += vec2(
    ripple * wave * 0.08
  );

  float n = noise(flowUv);

  /*
   * Fine grid distortion
   */
  vec2 gridUv = uv * 18.0;

  gridUv += vec2(
    n * 0.35,
    n * 0.2
  );

  float gridX = abs(
    fract(gridUv.x) - 0.5
  );

  float gridY = abs(
    fract(gridUv.y) - 0.5
  );

  float grid = 1.0 -
    smoothstep(
      0.0,
      0.045,
      min(gridX, gridY)
    );

  /*
   * Mouse disturbance strengthens grid.
   */
  float distortion =
    grid *
    (0.22 + ripple * 0.8);

  /*
   * Scroll movement
   */
  distortion +=
    sin(
      uv.y * 20.0 +
      u_scroll * 10.0 +
      u_time
    ) * 0.025;

  /*
   * ManageMedia green.
   */
  vec3 green = vec3(
    0.85,
    1.0,
    0.0
  );

  /*
   * Fade around edges.
   */
  float edge =
    smoothstep(0.0, 0.08, uv.x) *
    smoothstep(1.0, 0.92, uv.x) *
    smoothstep(0.0, 0.08, uv.y) *
    smoothstep(1.0, 0.92, uv.y);

  float alpha =
    distortion *
    0.22 *
    edge;

  gl_FragColor = vec4(
    green * alpha,
    alpha
  );
}