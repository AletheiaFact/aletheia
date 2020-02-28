<h1 align="center">Aletheia</h1>

<p align="center">Plataforma de análise de discursos de personalidades públicas e combate a Fake News.</p>

<p align="center">
  <a href="https://lerna.js.org" target="_blank" rel="nofollow noopener"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" /></a>
</p>

## Instalação

- Fork this repo and clone it locally:
  ``` sh
  git clone https://github.com/<your-username>/aletheia
  cd aletheia
  ```
- Startup Mongo DB via Docker:
  ``` sh
  docker-compose up -d
  ```
- Install packages:
  ``` sh
  yarn bootstrap
  ```
- Run in dev mode:
  ``` sh
  yarn dev
  ```
- Access http://localhost:1234 in your browser.

## Setup for development

- Go to the server package and run seed:
  ``` sh
  cd packages/server
  yarn seed
  ```
