// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());

//   return {
//     plugins: [
//       react(),
//       tailwindcss(),
//       VitePWA({
//         registerType: "autoUpdate",
//         includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
//         manifest: {
//           name: "PWA React App",
//           short_name: "PWA React",
//           description: "My Progressive Web App using Vite and React",
//           theme_color: "#ffffff",
//           background_color: "#ffffff",
//           display: "standalone",
//           scope: "/",
//           start_url: "/",
//           icons: [
//             {
//               src: "pwa-192x192.png",
//               sizes: "192x192",
//               type: "image/png",
//             },
//             {
//               src: "pwa-512x512.png",
//               sizes: "512x512",
//               type: "image/png",
//             },
//             {
//               src: "pwa-512x512.png",
//               sizes: "512x512",
//               type: "image/png",
//               purpose: "any maskable",
//             },
//           ],
//         },
//       }),
//     ],
//     server: {
//       proxy: {
//         "/api": {
//           target: env.VITE_API_DOMAIN,
//           changeOrigin: true,
//           secure: false,
//         },
//         "/ws": {
//           target: env.VITE_BASE_URL,
//           ws: true,
//           changeOrigin: true,
//         },
//       },
//     },
//     define: {
//       global: "window",
//     },
//   };
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr(),           // SVG를 React 컴포넌트로 임포트
      tailwindcss(),    // Tailwind CSS
      VitePWA({   // PWA 설정
        strategies: 'generateSW',
        filename: 'service-worker.js',      
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        includeAssets: ['**/*'],      // 모든 에셋 캐싱
        manifest: false,              // manifest 파일 비활성화
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
        }
      })
    ],
    build: {
      // 청크 크기 경고 한도를 1000 kB로 설정
      chunkSizeWarningLimit: 1500,  // 기본값은 500
    },
    server: {
      proxy: {
        '/ws': {
          target: env.VITE_BASE_URL,
          ws: true,
          changeOrigin: true,
        },
      },
      https: {
        key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
      },
      host: "localhost",
      port: 3001
    },
    define: {
      global: "window",
    },
    preview: {
      port: 3000,    // 원하는 포트로 변경
      strictPort: true  // 포트가 사용 중이면 즉시 에러로 종료 (선택)
    }
  };
});
