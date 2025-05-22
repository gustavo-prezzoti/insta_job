import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage } from 'http';

// Custom interface for the request with body
interface RequestWithBody extends IncomingMessage {
  body?: any;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/auth': {
        target: 'https://systemsrvdsv.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/user': {
        target: 'https://systemsrvdsv.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/instagram': {
        target: 'https://systemsrvdsv.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const request = req as RequestWithBody;
            console.log('Proxying:', request.method, request.url);
            
            // Fix for content-length issues
            if (request.body) {
              const bodyData = JSON.stringify(request.body);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });
        }
      },
      '/schedule': {
        target: 'https://systemsrvdsv.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
