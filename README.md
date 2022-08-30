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
        },
        "role": {
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
- If you want to check if it is the right id, at the same url paste after /schemas the /<schema_id> contaning the id that you just copied. 

#### Making The Changes On Your Code:
- First you gonna have to change the ``authentication_type: `` to ory on your config.yaml and config.seed.yaml.
- Now take SDK Configuration url and paste on ``url: `` in both pages config.yaml, config.seed.yaml and on ``ORY_SDK_URL=`` in your .env too. 
- Now Paste the acess token that you saved on ``access_token: `` in your config.yaml and config.seed.yaml.
- Do the same as above but now with the id that you saved and paste it on ``schema_id: ``. 

#### Setting up your own UI to make the right redirects:
- Go to User Interface on Ory Console and rewrite these fields: Login UI with http://localhost:3000/login and Settings UI with http://localhost:3000/profile. 

#### Enable your TOTP Authenticator App:
- On ory console go into Two-Factor authentication section and enable TOTP Authenticator Apps, then save it.


## MongoDB Atlas Search

#### Creating indexes
- On mongoDB cloud go into Database > Your Cluster
- Once you select your cluster goes into the tab Search
- Here you can see all your created search indexes
- Click on CREATE INDEX button
- Select the Visual Editor configuration method and click in Next button
- Name your index, select the collection and click in Next button
- Create your own configurations by clicking on Refine Your Index
- Disable Dynamic Mapping and click in Add Field button in Fields Mapping
- Select your field name, disable dynamic mapping and click in Add Data Type button
- Select your data type and change the configs if you want to
- Add another data type if you want to click in the Add another data type icon
- Save your changes
- Review your new search index and click in Create Search Index button

#### Using Mongo DB Atlas
- Replace your ``connection_uri`` with your MongoDB atlas connection URI in config.yaml
- Bellow of ``connection_uri`` add ``atlas`` field with a true boolean