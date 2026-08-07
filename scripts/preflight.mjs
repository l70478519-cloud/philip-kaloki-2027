import fs from 'node:fs'
const required=['src/main.tsx','src/styles.css','src/vite-env.d.ts','server.mjs','vite.config.ts','public/robots.txt','public/sitemap.xml','public/assets/philip-kaloki-portrait-hero.webp','supabase/phase17_cms.sql', 'supabase/phase19_storage.sql', 'supabase/phase20_images.sql', 'supabase/phase21_gallery_social.sql', 'supabase/phase25_news_gallery_slide_context.sql', 'supabase/phase30_live_chat.sql', 'supabase/phase33_realtime_chat.sql']
let failed=false
for(const f of required){if(fs.existsSync(f))console.log(`✓ ${f}`);else{console.error(`✗ missing ${f}`);failed=true}}
const css=fs.readFileSync('src/styles.css','utf8');if(css.includes('\\n')){console.error('✗ literal \\n found in CSS');failed=true}else console.log('✓ CSS newline check')
const main=fs.readFileSync('src/main.tsx','utf8');if(!main.includes('...fallbackContent,...data'))console.warn('! fallback content merge marker not found')
if(failed)process.exit(1);console.log('Preflight passed.')
