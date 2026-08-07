import fs from 'node:fs'
const required=['src/main.tsx','src/styles.css','server.mjs','public/robots.txt','public/sitemap.xml','public/assets/philip-kaloki-portrait-hero.webp','data/content.json']
let ok=true
for(const file of required){if(!fs.existsSync(file)){console.error(`Missing: ${file}`);ok=false}else console.log(`✓ ${file}`)}
const css=fs.readFileSync('src/styles.css','utf8')
if(css.includes('\\n')){console.error('styles.css contains literal \\n characters');ok=false}else console.log('✓ CSS newline check')
if(!ok)process.exit(1)
console.log('Preflight passed.')
