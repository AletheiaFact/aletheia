<h1 align="center">Aletheia</h1>

<p align="center">Plataforma de análise de discursos de personalidades públicas e combate a Fake News.</p>

<p align="center">
  <a href="https://lerna.js.org" target="_blank" rel="nofollow noopener"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" /></a>
</p>

## Instalação

- Executar um fork deste repositório e clonar localmente:
  ``` sh
  git clone https://github.com/<your-username>/aletheia
  cd aletheia
  ```
- Executar o Mongo DB via Docker:
  ``` sh
  docker-compose up -d
  ```
- Instalar os pacotes do projeto:
  ``` sh
  yarn
  yarn bootstrap
  ```
- Iniciar o ambiente de desenvolvimento:
  ``` sh
  yarn start
  ```
- Acessar a URL http://localhost:3001 no navegador.
