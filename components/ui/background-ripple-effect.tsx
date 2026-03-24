"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type BackgroundRippleEffectProps = {
  rows?: number;
  cols?: number;
  cellSize?: number;
};

const RIBBON_CONFIG = {
  background: "",

  colors: [
    "#9B6BFF",
    "#F14DAA",
    "#FFA200",
    "#37D3C7",
    "#FF4D5A",
    "#A6FF3B",
    "#8FA3A6",
  ],

  speed: 0.01,
  tilt: 0.9,

  geometryWidth: 1,
  geometryHeight: 1,

  alphaStrength: 3.0,
  colorStrength: 1.0,

  colorFlowX: 0.8,
  colorFlowY: 0.8,
  colorFlowTime: 0.05,

  scaleXMin: 2.5,
  scaleXFactor: 4.2,
  scaleYMin: 5.5,
  scaleYFactor: 2.8,

  positionX: 0,
  positionY: 0,
};

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const normalized = hex.replace("#", "").trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const num = parseInt(full, 16);

  return new THREE.Vector3(
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  );
};

export const BackgroundRippleEffect = ({
  rows = 20,
  cols = 100,
  cellSize = 25,
}: BackgroundRippleEffectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ribbon: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    let animationFrameId = 0;

    const colors = RIBBON_CONFIG.colors.map(hexToVec3);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setClearColor(RIBBON_CONFIG.background, 0);
    container.appendChild(renderer.domElement);

    ribbon = new THREE.Mesh(
      new THREE.PlaneGeometry(
        RIBBON_CONFIG.geometryWidth,
        RIBBON_CONFIG.geometryHeight,
        128,
        128,
      ),
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },

          uColor1: { value: colors[0] },
          uColor2: { value: colors[1] },
          uColor3: { value: colors[2] },
          uColor4: { value: colors[3] },
          uColor5: { value: colors[4] },
          uColor6: { value: colors[5] },
          uColor7: { value: colors[6] },

          uTilt: { value: RIBBON_CONFIG.tilt },
          uColorFlowX: { value: RIBBON_CONFIG.colorFlowX },
          uColorFlowY: { value: RIBBON_CONFIG.colorFlowY },
          uColorFlowTime: { value: RIBBON_CONFIG.colorFlowTime },
          uAlphaStrength: { value: RIBBON_CONFIG.alphaStrength },
          uColorStrength: { value: RIBBON_CONFIG.colorStrength },
        },
        vertexShader: `
          varying vec3 vEC;
          uniform float time;
          uniform float uTilt;

          float iqhash(float n) {
            return fract(sin(n) * 43758.5453);
          }

          float noise(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            float n = p.x + p.y * 57.0 + 113.0 * p.z;
            return mix(
              mix(
                mix(iqhash(n), iqhash(n + 1.0), f.x),
                mix(iqhash(n + 57.0), iqhash(n + 58.0), f.x),
                f.y
              ),
              mix(
                mix(iqhash(n + 113.0), iqhash(n + 114.0), f.x),
                mix(iqhash(n + 170.0), iqhash(n + 171.0), f.x),
                f.y
              ),
              f.z
            );
          }

          float xmb_noise2(vec3 x) {
            return cos(x.z * 4.0) * cos(x.z + time / 10.0 + x.x);
          }

          void main() {
            vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vec3 v = vec3(pos.x, 0.0, pos.y);
            vec3 v2 = v;
            vec3 v3 = v;

            v.y = xmb_noise2(v2) / 8.0;

            v3.x -= time / 5.0;
            v3.x /= 4.0;

            v3.z -= time / 10.0;
            v3.y -= time / 100.0;

            v.z -= noise(v3 * 7.0) / 15.0;
            v.y -= noise(v3 * 7.0) / 15.0 + cos(v.x * 2.0 - time / 2.0) / 5.0 - 0.3;

            vEC = v;
            gl_Position = vec4(v.y + v.x * uTilt, v.x, v.z, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform vec3 uColor4;
          uniform vec3 uColor5;
          uniform vec3 uColor6;
          uniform vec3 uColor7;
          uniform float uColorFlowX;
          uniform float uColorFlowY;
          uniform float uColorFlowTime;
          uniform float uAlphaStrength;
          uniform float uColorStrength;

          varying vec3 vEC;

          vec3 palette(float t) {
            t = fract(t) * 7.0;

            if (t < 1.0) return mix(uColor1, uColor2, t);
            else if (t < 2.0) return mix(uColor2, uColor3, t - 1.0);
            else if (t < 3.0) return mix(uColor3, uColor4, t - 2.0);
            else if (t < 4.0) return mix(uColor4, uColor5, t - 3.0);
            else if (t < 5.0) return mix(uColor5, uColor6, t - 4.0);
            else if (t < 6.0) return mix(uColor6, uColor7, t - 5.0);
            return mix(uColor7, uColor1, t - 6.0);
          }

          void main() {
            const vec3 up = vec3(0.0, 0.0, 1.0);
            vec3 x = dFdx(vEC);
            vec3 y = dFdy(vEC);
            vec3 normal = normalize(cross(x, y));

            float c = 1.0 - dot(normal, up);
            c = (1.0 - cos(c * c)) / 3.0;

            float t = vEC.x * uColorFlowX + vEC.y * uColorFlowY + time * uColorFlowTime;
            vec3 color = min(palette(t) * uColorStrength, 1.0);

            gl_FragColor = vec4(color, min(c * uAlphaStrength, 1.0));
          }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: false,
        }),
    );

    scene.add(ribbon);

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const aspect = width / height;

      const scaleX = Math.max(
        RIBBON_CONFIG.scaleXMin,
        aspect * RIBBON_CONFIG.scaleXFactor,
      );
      const scaleY = Math.max(
        RIBBON_CONFIG.scaleYMin,
        aspect * RIBBON_CONFIG.scaleYFactor,
      );

      ribbon.scale.set(scaleX, scaleY, 1);
      ribbon.position.set(RIBBON_CONFIG.positionX, RIBBON_CONFIG.positionY, 0);
    };

    const animate = () => {
      ribbon.material.uniforms.time.value += RIBBON_CONFIG.speed;
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);

      ribbon.geometry.dispose();
      ribbon.material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ background: RIBBON_CONFIG.background }}
    />
  );
};
