import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@repo/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
            '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
            '@repo/ui-styles': path.resolve(__dirname, '../../packages/ui/src/styles'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            },
        },
    },
});
