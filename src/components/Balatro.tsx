import React, { useEffect, useRef } from 'react';

interface BalatroProps {
  className?: string;
}

export default function Balatro({ className }: BalatroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;
    
    // Shader sources
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Authentic Balatro background plasma/distortion shader
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float time = u_time * 0.18; // Elegant, slow-moving speed

        // Center coordinates & aspect ratio correction
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        // Swirling vortex warp
        float r = length(p);
        float angle = atan(p.y, p.x);
        
        // Complex rotating waves resembling Balatro's actual engine
        float distortion = sin(r * 10.0 - time * 2.5) * 0.45;
        angle += distortion * (1.2 - smoothstep(0.0, 0.9, r));
        
        vec2 warpedP = vec2(cos(angle) * r, sin(angle) * r);

        // Multiple overlay layers of high-frequency sine-wave scrolls
        float wave1 = sin(warpedP.x * 5.0 + time) * cos(warpedP.y * 5.0 - time * 1.2);
        float wave2 = sin(warpedP.y * 10.0 + time * 1.8) * cos(warpedP.x * 10.0 + time * 0.6);
        float wave3 = sin((warpedP.x + warpedP.y) * 3.5 - time * 0.4);

        // Mix waves
        float pattern = wave1 * 0.35 + wave2 * 0.45 + wave3 * 0.2;

        // Programmer & Cyberpunk inspired dark-mode Balatro color palette
        // Dark, techy hues: very dark indigo background, code green, crimson/neon pink, cyber cyan
        vec3 colorBg = vec3(0.008, 0.008, 0.015);     // Dark deep obsidian void
        vec3 colorCyan = vec3(0.01, 0.15, 0.13);      // Digital dark pine / matrix cyber green
        vec3 colorPurple = vec3(0.05, 0.02, 0.12);    // Deep terminal purple
        vec3 colorAccent = vec3(0.0, 0.4, 0.28);      // Vivid code green glow

        // Blend the colors using our pattern and waves
        vec3 color = mix(colorBg, colorPurple, clamp(pattern * 1.8 + 0.6, 0.0, 1.0));
        color = mix(color, colorCyan, clamp(wave2 * 0.6 + 0.15, 0.0, 1.0));
        color += colorAccent * max(0.0, wave1 * 0.22); // Elegant glowing terminal highlights

        // Subtle digital noise grain to feel like a premium glowing screen
        float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color += vec3(noise * 0.012);

        // Rich vignette to enhance center focus & readability of text
        float vignette = 1.0 - r * 0.75;
        color *= clamp(vignette, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile and link shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry covering full screen
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform positions
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;
    let startTime = Date.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000.0;
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none select-none opacity-45 ${className}`} 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
