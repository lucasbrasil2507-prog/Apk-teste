# Gerar o APK pelo celular (GitHub Actions)

## Passo a passo

1. **Crie um repositório** no GitHub (pode ser privado).
   - Entre em github.com → New repository
   - Nome sugerido: `brisol-teste`
   - Deixe vazio (sem README)

2. **Envie os arquivos deste ZIP** para o repositório.
   - No celular: use o app **GitHub** ou o site no Chrome
   - Ou use **Working Copy** / **MGit** / upload pelo navegador
   - Importante: mantenha a pasta `.github/workflows/build-apk.yml`

   Pelo navegador (mais simples no celular):
   - Abra o repositório → Add file → Upload files
   - Envie **todos** os arquivos e pastas (incluindo `.github`)
   - Commit changes

3. Abra a aba **Actions**

4. Selecione o workflow **Build Brisol APK**

5. Toque em **Run workflow** → **Run workflow**

6. Aguarde ficar verde (cerca de 3–8 minutos na primeira vez)

7. Entre na execução concluída

8. Em **Artifacts**, baixe **Brisol-APK**

9. Extraia o ZIP → instale o **app-debug.apk**
   - Ative “Instalar apps de fontes desconhecidas” se o Android pedir

## Estrutura que deve estar no repositório

```
.brisol/
├── .github/workflows/build-apk.yml
├── www/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── package.json
├── capacitor.config.json
├── GITHUB_APK.md
└── COMO_GERAR_APK.md
```

## Token (opcional)

Edite `www/app.js` no GitHub:

```js
const AUTH_HEADER = "Bearer SEU_TOKEN";
```

Depois rode o workflow de novo (Actions → Run workflow).

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Actions não aparece | Confirme que `.github/workflows/build-apk.yml` foi enviado |
| Build vermelho | Abra o log do job e me envie a mensagem de erro |
| Artifact não aparece | O build falhou — veja o log |
| APK não instala | Ative fontes desconhecidas; use o arquivo `app-debug.apk` |
