<h1 align="center">Guia configuração da plataforma</h1>

## Ambiente de configuração `./config`
O ambiente de configuração consiste em um diretório `public`, que irá sobrescrever o original durante o processo de build, e um arquivo TypeScript para personalizações específicas e definição de cores.

No processo de build, um script copia o diretório `public` da raiz para `dist/public`. Após isso, ele verifica se os arquivos `SVG`, `JSON`, `PNG` e `favicons` em `config/public` estão nos seus respectivos lugares, de acordo com o padrão original e nomeados corretamente. Se tudo estiver correto, os arquivos são sobrescritos na pasta `dist`.

## Logo SVG
Colocando o `SVG` da logo em `config/public/images` com o nome padrão `default_logo.svg` e definindo Logo em `localConfig` como `true` ele irá sobrescrever o original durante o processo de build.

## Favicon 
O favicon é composto por esses arquivos: `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `site.webmanifest`. Basta colocá-los em `config/public` com os respectivos nomes,e eles serão sobrescritos durante o processo de build

## Locales
Em locales, haverá uma pasta PT para português e outra EN para inglês. Nessa pasta, ficarão todos os arquivos `JSON` que serão sobrescritos.
#### Exemplo:
- `config/public/pt/footer.json` - Arquivo de sobrescrição:
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
- `diretórioRaiz/public/pt/footer.json` - Arquivo original:
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
- `dist/config/public/pt/footer.json`  - Arquivo que retorna no site após build: 
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
Durante o processo de build, ele verifica cada `keyTranslation` do `JSON` e, caso exista, sobrescreve o valor original. Dessa forma, se não for definido corretamente, será retornado o valor original.

## LocalConfig.example
`localConfig.schema.ts` e `tsconfig.json` são arquivos de configuração do ambiente.

### Colors
Caso sejam definidas no `localConfig` , elas serão renderizadas no site; caso contrário, retornará a cor definida no componente de `colors`. Não é obrigatório definir todas as cores, podendo ser apenas aquelas que você preferir, e elas devem ser em formato hexadecimal `#FFFFFF`.
- No momento, todas essas cores poderão ser personalizadas:
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

### Footer - Logo - Header - Home
Aqui personalizamos pontos específicos do site, como um array de links que retornam ícones de redes sociais clicáveis; links dos botões de Doação, Repositório e Estatuto; e a escolha de ativar ou não componentes, definindo `true` para aparecer e `false` para não. Definindo Logo como true ativa-se a sobrescrição usando o svg de `config/public/images`, ao contrário preserva a logo padrão da aletheia.
```
const localConfig: LocalConfig = {
    theme: {},
    Logo: true,
    footer: {
        socialMedias: [ "https://www.instagram.com","url","url","url"], //cada "string" é um icone de rede social
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
        affixCTA: true, //Defina se o botão flutuante aparece na home
    },
};
```