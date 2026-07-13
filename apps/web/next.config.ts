import type { NextConfig } from 'next';
import path from 'path';

const threeRoot = path.resolve(__dirname, '../../node_modules/three');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mtmg/shared',
    'react-globe.gl',
    'globe.gl',
    'three-globe',
    'three-render-objects',
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  webpack: (config) => {
    // Alias explícitos: NO mapear solo "three" a una carpeta
    // (rompe exports como three/webgpu). Forzar una sola copia + subpaths.
    config.resolve.alias = {
      ...config.resolve.alias,
      three$: path.join(threeRoot, 'build/three.module.js'),
      'three/webgpu': path.join(threeRoot, 'build/three.webgpu.js'),
      'three/tsl': path.join(threeRoot, 'build/three.tsl.js'),
      'three/addons': path.join(threeRoot, 'examples/jsm/Addons.js'),
      'three/examples/jsm': path.join(threeRoot, 'examples/jsm'),
    };
    return config;
  },
};

export default nextConfig;
