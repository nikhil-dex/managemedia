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
  vec2 p = uv - 0.5;

  p.x *= 1.777;

  float time = u_time * 0.16;

  // Mouse position.
  vec2 mouse = u_mouse * 0.5;
  mouse.x *= 1.777;

  // ---------------------------------------------------------
  // Mouse-driven distortion
  // ---------------------------------------------------------

  vec2 toMouse = p - mouse;

  float mouseDistance = length(toMouse);

  float mouseInfluence = 1.0 - smoothstep(
    0.0,
    0.9,
    mouseDistance
  );

  // Flow direction around the cursor.
  vec2 flow = vec2(
    -toMouse.y,
    toMouse.x
  );

  flow *= mouseInfluence * 0.12;

  p += flow;

  // ---------------------------------------------------------
  // Organic distortion
  // ---------------------------------------------------------

  float distortionA = noise(
    p * 2.5 + vec2(time, -time * 0.6)
  );

  float distortionB = noise(
    p * 5.0 + vec2(-time * 0.5, time)
  );

  p += vec2(
    distortionA - 0.5,
    distortionB - 0.5
  ) * 0.10;

  // ---------------------------------------------------------
  // Flowing bands
  // ---------------------------------------------------------

  float bandA = sin(
    p.x * 7.0 +
    p.y * 3.0 +
    time * 2.0
  );

  float bandB = sin(
    p.x * 14.0 -
    p.y * 5.0 -
    time * 1.3
  );

  float bands =
    bandA * 0.65 +
    bandB * 0.35;

  bands = bands * 0.5 + 0.5;

  // ---------------------------------------------------------
  // Procedural field
  // ---------------------------------------------------------

  float n1 = noise(
    p * 2.2 +
    vec2(time * 0.7, -time * 0.4)
  );

  float n2 = noise(
    p * 5.5 -
    vec2(time * 0.4, time * 0.8)
  );

  float organic =
    n1 * 0.65 +
    n2 * 0.35;

  // ---------------------------------------------------------
  // Center atmosphere
  // ---------------------------------------------------------

  float centerGlow = 1.0 - smoothstep(
    0.0,
    0.95,
    length(p)
  );

  // ---------------------------------------------------------
  // Mouse energy
  // ---------------------------------------------------------

  float cursorEnergy = smoothstep(
    0.75,
    0.0,
    mouseDistance
  );

  // ---------------------------------------------------------
  // Combine
  // ---------------------------------------------------------

  float field =
    organic * 0.45 +
    bands * 0.20 +
    centerGlow * 0.25 +
    cursorEnergy * 0.35;

  // Slight scroll-driven movement.
  field += u_scroll * 0.08;

  // ---------------------------------------------------------
  // Colors
  // ---------------------------------------------------------

  vec3 background = vec3(
    0.003,
    0.006,
    0.005
  );

  vec3 deepGreen = vec3(
    0.015,
    0.075,
    0.022
  );

  vec3 lime = vec3(
    0.55,
    1.0,
    0.08
  );

  vec3 color = mix(
    background,
    deepGreen,
    field * 0.85
  );

  // Keep the bright accent controlled.
  float accent = smoothstep(
    0.58,
    0.95,
    field
  );

  color = mix(
    color,
    lime,
    accent * 0.18
  );

  // Cursor highlight.
  color += lime * cursorEnergy * 0.055;

  // Scroll fade.
  color *= 1.0 - u_scroll * 0.20;

  gl_FragColor = vec4(
    color,
    1.0
  );
}