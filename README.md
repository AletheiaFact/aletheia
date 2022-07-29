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
- Access http://localhost:3000 in your browser.

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
## Configuring Ory 

#### Taking What You Need:
- Create an account and a project on https://console.ory.sh/login.
- Copy the SDK Configuration url and save it.
- Scroll down in the same page and create a Personal Access Tokens, copy the acess token that gonna show up on the bottom of your screen and save it.
- Go to Identity Schema and click on Customize Identity Schema then change the actual schema to the code below and click Update after the change:
```
{
  "$id": "https://schemas.ory.sh/presets/kratos/identity.email.schema.json",
  "title": "Person",
  "type": "object",
  "properties": {
    "traits": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "title": "E-Mail",
          "ory.sh/kratos": {
            "credentials": {
              "password": {
                "identifier": true
              },
              "webauthn": {
                "identifier": true
              },
              "totp": {
                "account_name": true
              }
            },
            "recovery": {
              "via": "email"
            },
            "verification": {
              "via": "email"
            }
          },
          "maxLength": 320
        },
        "user_id": {
          "type": "string"
        }
      },
      "required": [
        "email",
        "user_id"
      ],
      "additionalProperties": false
    }
  }
}
```
- Go to SDK Configuration url that you saved and add /schemas in the end of the url then copy the first id on the page and save it.

#### Making The Changes On Your Code:
- First you gonna have to change the ``authentication_type: `` to ory on your config.yaml and config.seed.yaml.
- Now take SDK Configuration url and paste on ``url: `` in both pages config.yaml, config.seed.yaml and on ``ORY_SDK_URL=`` in your .env too. 
- Now Paste the acess token that you saved on ``access_token: `` in your config.yaml and congig.seed.yaml.
- Do the same as above but now with the id that you saved and paste it on ``schema_id: ``. 

#### Setting up your own UI to make the right redirects:
- Go to User Interface on Ory Console and rewrite these fields: Login UI with http://localhost:3000/login and Settings UI with http://localhost:3000/profile. 

#### Enable your TOTP Authenticator App:
- On ory console go into Two-Factor authentication section and enable TOTP Authenticator Apps, then save it.
