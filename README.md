<h1 align="center">Aletheia</h1>

<p align="center">Plataforma de análise de discursos de personalidades públicas e combate a Fake News.</p>

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
- To run in dev mode
  ``` sh
  yarn dev
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
