import { defineConfig } from 'vite'
import { weddingForPath } from './src/content.js'
import { renderInvitationHtml } from './src/invitation-html.js'
export default defineConfig({
  // Đặt BASE_PATH=/thang-quynh-wedding/ khi build trên GitHub Pages.
  base: process.env.BASE_PATH || '/',
  plugins: [{
    name: 'wedding-invitation-prefixes',
    enforce: 'post',
    // Vite giữ originalUrl khi fallback /nha-gai/ về index.html trong development.
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        if (context.server) return renderInvitationHtml(html, weddingForPath(new URL(context.originalUrl || context.path, 'http://localhost').pathname))
      },
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const index = bundle['index.html']
        const template = index.source
        index.source = renderInvitationHtml(template, weddingForPath('/'))
        for (const prefix of ['nha-trai', 'nha-gai']) {
          this.emitFile({ type: 'asset', fileName: `${prefix}/index.html`, source: renderInvitationHtml(template, weddingForPath(`/${prefix}/`)) })
        }
      },
    },
  }],
})
