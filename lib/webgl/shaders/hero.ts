export const heroVertexShader = `
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

export const heroFragmentShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

varying vec2 vUv;


/* ---------------------------------------------------------
   Noise
--------------------------------------------------------- */

float hash(vec2 p) {
  return fract(
    sin(
      dot(
        p,
        vec2(127.1, 311.7)
      )
    ) * 43758.5453123
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


/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */

void main() {

  vec2 uv = vUv;

  /*
    Center coordinates.
  */
  vec2 p = uv - 0.5;

  float scroll = clamp(
  u_scroll,
  0.0,
  1.0
);

  /*
    Keep the effect visually consistent
    across different screen proportions.
  */
  float aspect = 1.0;

  p.x *= aspect;


  /*
    Mouse coordinates arrive in
    the range -1 → +1.

    Convert them into the same
    centered coordinate system.
  */
  vec2 mouse = u_mouse * 0.5;

  mouse.x *= aspect;


  /*
    Distance from the mouse.
  */
  float mouseDistance =
    distance(p, mouse);


  /*
    Soft mouse influence.

    The influence is intentionally
    broad and subtle.
  */
  float mouseInfluence =
    1.0 -
    smoothstep(
      0.0,
      0.65,
      mouseDistance
    );


  /*
    Organic animation.
  */
vec2 movement = vec2(
  u_time * 0.035 + scroll * 0.35,
  u_time * 0.018 - scroll * 0.18
);


  /*
    Let the mouse gently push
    the noise field.
  */
  vec2 distortedPosition =
    p +
    normalize(
      p - mouse + 0.0001
    ) *
    mouseInfluence *
    0.035;


  float n1 = noise(
    distortedPosition * 2.2 +
    movement
  );

  float n2 = noise(
    distortedPosition * 4.5 -
    movement * 1.4
  );

  float n3 = noise(
    distortedPosition * 8.0 +
    movement * 0.8
  );


  float organic =
    n1 * 0.55 +
    n2 * 0.30 +
    n3 * 0.15;


  /*
    Radial atmosphere.
  */
  float distanceFromCenter =
    length(p);

  float glow =
    1.0 -
    smoothstep(
      0.0,
      0.9,
      distanceFromCenter
    );


  /*
    Mouse creates a second
    soft atmospheric field.
  */
  float mouseGlow =
    mouseInfluence *
    0.45;


  float field =
    organic * 0.65 +
    glow * 0.35 +
    mouseGlow;


  /*
    ManageMedia palette.
  */
  vec3 background = vec3(
    0.018,
    0.018,
    0.016
  );

  vec3 darkGreen = vec3(
    0.035,
    0.075,
    0.035
  );

  vec3 lime = vec3(
    0.55,
    0.72,
    0.08
  );


  vec3 color = mix(
    background,
    darkGreen,
    field * 0.75
  );


  /*
    Controlled accent.
  */
  float accent =
    smoothstep(
      0.55,
      0.95,
      field
    );

  color = mix(
    color,
    lime,
    accent * 0.22
  );


  /*
    Extra mouse energy.

    This is deliberately weak.
  */
  color +=
    lime *
    mouseGlow *
    0.035;


  /*
    Subtle grain.
  */
  float grain = hash(
    uv * 800.0 +
    u_time
  );

  color +=
    (grain - 0.5) *
    0.012;

    float scrollFade =
  1.0 -
  smoothstep(
    0.55,
    1.0,
    scroll
  );

color *= scrollFade;

  gl_FragColor = vec4(
    color,
    1.0
  );
}
`;