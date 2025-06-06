<h1 align="center">Platform Configuration Guide</h1>

## Configuration Environment `./config`
The configuration environment consists of a `public` directory, which will overwrite the original during the build process, and a TypeScript file for specific customizations and color definitions.

In the build process, a script copies the root `public` directory to `dist/public`. After that, it checks if the `SVG`, `JSON`, `PNG` files and favicons in `config/public` are in their respective places, according to the original pattern and correctly named. If everything is correct, the files are overwritten in the `dist` folder.

## SVG logo
Placing the `SVG` logo in `config/public/images` with the default name `default_logo.svg` and defining Logo in `localConfig` as `true` will overwrite the original during the build process.

## Favicon 
The favicon consists of the following files: `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `site.webmanifest`. Just place them in `config/public` with the respective names, and they will be overwritten during the build process.

## Locales
In locales, there will be a PT folder for Portuguese and an EN folder for English. In this folder, all the `JSON` files to be overwritten will be stored.
#### Example:
- `config/public/pt/footer.json` - Overwrite file:
```
{
    "copyright": "AlumiaLab.org ©{{date}}",
    "contactEmail": "contato@alumialab.org",
    "platformInfoTittle": "Movimento Alumia Lab",
    "adressStreet": "Av teste teste, Nº 000",
    "adressZipcode":"0.000-000 - bairro - cidade/estado",
    "legalRegistration":"00.000.cnpj/0000-00" 
    "statuteUrlButton": "Urlstatutebutton.com"
}
```
- `rootDirectory/public/pt/footer.json` - Original file:
```
{
    "copyright": "AletheiaFact.org ©{{date}}",
    "creativeCommons": "Todo conteúdo dessa plataforma é licenciado através da licença ",
    "socialMedia": "Siga nossas redes sociais",
    "contactEmail": "contato@aletheiafact.org",
    "platformInfoTittle": "Movimento Aletheia Fact",
    "adressStreet": "Av Maria Ranieri, Nº 7-50",
    "adressZipcode":"17.055-175 - Parque Viaduto - Bauru/SP",
    "legalRegistration":"46.428.905/0001-68"
    "statuteUrlButton": "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
}
```
- `dist/config/public/pt/footer.json`  - File returned on the site after the build: 
```
{
    "copyright": "AlumiaLab.org ©{{date}}",
    "creativeCommons": "Todo conteúdo dessa plataforma é licenciado através da licença ",
    "socialMedia": "Siga nossas redes sociais",
    "contactEmail": "contato@alumialab.org",
    "platformInfoTittle": "Movimento Alumia Lab",
    "adressStreet": "Av teste teste, Nº 000",
    "adressZipcode":"00.000-000 - bairro - cidade/estado",
    "legalRegistration":"00.000.cnpj/0000-00"
    "statuteUrlButton": "Urlstatutebutton.com"
}
```
During the build process, it checks each `keyTranslation` of the `JSON`, and if it exists, it overwrites the original value. Thus, if it is not properly defined, the original value will be returned.

## LocalConfig.example
`localConfig.schema.ts` and `tsconfig.json` are configuration files for the environment.

### Colors
If defined in `localConfig`, they will be rendered on the site; otherwise, the color defined in the `colors` component will be returned. It is not mandatory to define all colors; you can choose only those you prefer, and they should be in hexadecimal format `#FFFFFF`.
- Currently, all these colors can be customized:
```
{
theme: {
        colors:{
            primary: "",
            secondary: "",
            tertiary: "",
            quartiary: "",
            lightPrimary: "",
            lightSecondary: "",
            lightTertiary: "",
            black: "",
            blackSecondary: "",
            blackTertiary: "",
            neutral: "",
            neutralSecondary: "",
            neutralTertiary: "",
            lightNeutral: "",
            lightNeutralSecondary: "",
            white: "",
            warning: "",
            shadow: "",
            logo: "",
            error: "",
            active: "",
            inactive: "",
                    }
               }
}
```

### Footer - Header - Home
Here, we customize specific points of the site, such as an array of links that return clickable social media icons; links for the Donation, Repository, and Statute buttons; and the option to enable or disable components by setting `true` to display and `false` to hide. Setting Logo to true enables overwriting using the svg from `config/public/images` otherwise, the default Aletheia logo is preserved.
```
const localConfig: LocalConfig = {
    theme: {},
    Logo: ,
    footer: {
        socialMedias: [ "https://www.instagram.com","url","url","url"], //each "string" is a social network icon
        showStatuteButton: {
            show: true,
        },
    },
    header: {
        donateButton: {
            show: true,
        },
    },
    home: {
        affixCTA: true, //Define whether the floating button appears on the home page
    },
};
```