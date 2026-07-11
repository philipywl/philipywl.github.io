# Oliver Yeung Portfolio

This repository contains Oliver Yeung's bilingual English and Traditional Chinese portfolio website.

## Hosting and local preview

- Production hosting: GitHub Pages at `https://philipywl.github.io/`
- Local ChatGPT Sites/Vinext preview: `npm run dev`
- GitHub Pages static build: `npm run build:pages`
- Static output directory: `out/`

Install and validate the project with:

```sh
npm ci
npm run test --if-present
npm run build:pages
npm run verify:pages
npm run lint
```

The separate `npm run build` and `npm run test:sites` commands retain compatibility with the local Vinext/Sites workflow. Local Sites metadata belongs in the ignored, untracked `.openai/hosting.json` file and must not be committed.

## Privacy and media policy

- Never commit private information, private review notes, environment files, secrets, original photographs, or original media.
- Only parent-approved, metadata-stripped web image derivatives may be added to the public site.
- Videos must remain externally hosted on YouTube and embedded in the site. Do not commit original or generated video files to this repository or include them in `out/`.
- Keep `outputs/`, `work/`, `.openai/hosting.json`, build caches, and generated build directories outside Git.
