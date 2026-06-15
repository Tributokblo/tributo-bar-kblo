# tributo-bar-kblo — refactor & deployment notes

Esta branch contém uma refatoração para separar responsabilidades (CSS/JS externos), melhorar performance básica e preparar integração com Supabase.

O que foi feito
- styles.css criado e vinculado em index.html
- script.js extraído e modularizado (player, UI, storage demo)
- supabase-client.js adicionado como *scaffold seguro* — não contém chaves
- index.html atualizado: remoção dos estilos inline mais significativos, imagens com loading="lazy"

Próximos passos recomendados

1) Substituir localStorage por Supabase (ou outro backend)
   - Configure SUPABASE_URL e SUPABASE_ANON_KEY como variáveis de ambiente no seu provedor (Netlify, Vercel, etc.).
   - No deploy, injete essas variáveis no runtime (ex.: Vercel Environment Variables) e exponha para o browser via build-time injection. Alternativamente, implemente endpoints server-side para esconder a key.

2) Otimizar assets (imagens e áudio)
   - Recomendo gerar WebP para imagens: exemplo com ImageMagick:
     - convert bar.jpg -strip -resize 1600x -quality 75 bar.webp
     - convert kblo.jpg -strip -resize 800x -quality 75 kblo.webp
   - Converter áudio para OGG/MP3 com bitrate reduzido usando ffmpeg:
     - ffmpeg -i musica.mp3 -b:a 128k musica-128.mp3
   - Substitua os arquivos no repositório/servidor ou sirva versões otimizadas via CDN.

3) Deploy
   - Deploy estático simples (GitHub Pages, Netlify, Vercel). Para usar Supabase, configure variáveis no painel do provedor.

4) Segurança
   - NÃO coloque chaves privadas no código. Use variáveis de ambiente ou rotas server-side para operações sensíveis (inserção/exclusão).

Como testar localmente
- git fetch origin
- git checkout refactor/separate-concerns
- executar um servidor simples: `python -m http.server 8000` ou `npx http-server` e abrir http://localhost:8000

Se quiser que eu gere e substitua automaticamente versões otimizadas das imagens/áudio, autorize a substituição (eu posso gerar e commitar).