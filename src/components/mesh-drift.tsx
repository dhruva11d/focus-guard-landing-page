"use client";

import { useEffect, useRef } from "react";

/*
 * Mesh Drift. Five drifting points each carry a colour; every pixel is the
 * inverse-distance-weighted average of all five. Pointer movement raises a
 * smoothed intensity uniform: the field warps harder and one point is drawn
 * toward the cursor, then relaxes when the pointer rests or leaves.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_t;
uniform float u_int;
uniform vec2 u_ptr;

// ---- shared preamble: hashed value noise, fbm, domain warp ----
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++){
    v += a * vnoise(p);
    p = p * 2.02 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return v;
}
vec2 warp(vec2 p, float t, float amt){
  vec2 q = vec2(fbm(p + t * 0.05), fbm(p + vec2(5.2, 1.3) - t * 0.04));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.03),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.03));
  return p + amt * (r - 0.5);
}

// ---- Mesh Drift body ----
const vec3 GROUND = vec3(0.8627, 0.8627, 0.8471); // #DCDCD8
const vec3 PEACH  = vec3(0.9608, 0.7804, 0.7216); // #F5C7B8
const vec3 MIST   = vec3(0.7882, 0.8471, 0.9412); // #C9D8F0

float wt(vec2 p, vec2 c){
  float d = distance(p, c);
  float w = 1.0 / (d * d + 0.035);
  return w * w;
}

void main(){
  float asp = u_res.x / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  vec2 ptr = vec2((u_ptr.x - 0.5) * asp, u_ptr.y - 0.5);
  float t = u_t;

  p = warp(p * 1.6, t, 0.28 + 0.55 * u_int) / 1.6;

  vec2 c1 = vec2(sin(t * 0.13) * 0.55 * asp, cos(t * 0.11) * 0.38);
  vec2 c2 = vec2(cos(t * 0.09 + 1.7) * 0.60 * asp, sin(t * 0.15 + 0.6) * 0.40);
  vec2 c3 = vec2(sin(t * 0.07 + 3.1) * 0.50 * asp, sin(t * 0.12 + 2.2) * 0.42);
  vec2 c4 = vec2(cos(t * 0.10 + 4.4) * 0.58 * asp, cos(t * 0.08 + 1.1) * 0.36);
  vec2 c5 = mix(vec2(sin(t * 0.06 + 5.0) * 0.45 * asp, cos(t * 0.14 + 3.3) * 0.40), ptr, u_int * 0.85);

  float w1 = wt(p, c1), w2 = wt(p, c2), w3 = wt(p, c3), w4 = wt(p, c4), w5 = wt(p, c5);
  vec3 col = (GROUND * w1 + PEACH * w2 + GROUND * w3 + MIST * w4 + MIST * w5) / (w1 + w2 + w3 + w4 + w5);

  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0; // dither: no banding
  gl_FragColor = vec4(col, 1.0);
}
`;

export function MeshDrift() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.hidden = true; // the fallback panel behind it shows instead
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.hidden = true;
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.hidden = true;
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uInt = gl.getUniformLocation(prog, "u_int");
    const uPtr = gl.getUniformLocation(prog, "u_ptr");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let intensity = 0;
    let target = 0;
    const ptr = { x: 0.5, y: 0.5 };
    const ptrTarget = { x: 0.5, y: 0.5 };
    let idle: ReturnType<typeof setTimeout> | undefined;
    let t = 14;
    let last = performance.now();
    let raf = 0;

    const resize = () => {
      // A soft gradient doesn't need full resolution.
      const scale = window.innerWidth < 700 ? 0.4 : 0.55;
      canvas.width = Math.max(2, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(2, Math.floor(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uInt, intensity);
      gl.uniform2f(uPtr, ptr.x, ptr.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      intensity += (target - intensity) * 0.05;
      ptr.x += (ptrTarget.x - ptr.x) * 0.08;
      ptr.y += (ptrTarget.y - ptr.y) * 0.08;
      t += dt * (1 + intensity * 0.9);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      ptrTarget.x = e.clientX / window.innerWidth;
      ptrTarget.y = 1 - e.clientY / window.innerHeight;
      target = 1;
      clearTimeout(idle);
      idle = setTimeout(() => (target = 0), 700);
    };
    const onLeave = () => (target = 0);

    resize();
    draw();
    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <>
      <div className="mesh-fallback" aria-hidden="true" />
      <canvas ref={ref} className="mesh-canvas" aria-hidden="true" />
    </>
  );
}
