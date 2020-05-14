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
  yarn install
  ```
- To run in dev mode, you should run server and front separately:
  ``` sh
  yarn dev:server
  yarn dev:front
  ```
- Access http://localhost:1234 in your browser.

## Development DB

- Run seeder:
  ``` sh
  yarn seed
  ```
## Build to production

- The build step should be run as follow:
```
yarn build
```
