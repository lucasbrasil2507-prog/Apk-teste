# Brisol Teste Final → APK

## Opção 1 — Capacitor + Android Studio (recomendado)

### No seu PC (Windows / Mac / Linux)

1. Instale:
   - Node.js (https://nodejs.org)
   - Android Studio (https://developer.android.com/studio)

2. Abra o terminal na pasta deste projeto e rode:

```bash
npm install
npx cap add android
npx cap sync
npx cap open android
```

3. No Android Studio:
   - Aguarde o Gradle sincronizar
   - Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Quando terminar, clique em **locate** e pegue o arquivo `.apk`

4. Transfira o APK para o celular e instale (ative “Fontes desconhecidas” se pedir).

### Observações importantes
- A tela de login é **demo local**. O saldo/resgate tenta falar com `https://brisol.top`.
- Sem token (`AUTH_HEADER` no `www/app.js`) o servidor tende a recusar (401/403).
- Para colar o token: edite `www/app.js` → linha `const AUTH_HEADER = "";` → depois rode de novo `npx cap sync`.

---

## Opção 2 — Conversor online (mais rápido, menos controle)

Sites como:
- https://www.webview-gold.com (pago)
- AppsGeyser / WebIntoApp / Website 2 APK

Você sobe a pasta `www` ou um ZIP do site e gera o APK.
Atenção: muitos inserem anúncios ou pedem conta.

---

## Opção 3 — Só testar no celular sem APK

1. Suba a pasta `www` em qualquer hospedagem gratuita (Netlify, Vercel, GitHub Pages) ou use um servidor local.
2. Abra o link no Chrome do celular.
3. Menu → “Adicionar à tela inicial” (vira um ícone quase como app).

---

## Estrutura deste pacote

```
Brisol_APK/
├── COMO_GERAR_APK.md      ← este arquivo
├── package.json
├── capacitor.config.json
└── www/
    ├── index.html
    ├── app.js             ← endpoints + AUTH_HEADER
    └── style.css
```

ID de teste: 67507  
Saldo inicial: 15  
Recompensa: +500  
Contador: 60 s  
Endpoints: /getBalanceInfo e /receiveReward
