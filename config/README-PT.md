<h1 align="center">Guia configuração da plataforma</h1>

## Ambiente de configuração `./config`
O ambiente de configuração consiste em um diretório `public`, que irá sobrescrever o original durante o processo de build, e um arquivo TypeScript para personalizações específicas e definição de cores.

No processo de build, um script copia o diretório `public` da raiz para `dist/public`. Após isso, ele verifica se os arquivos `SVG`, `JSON`, `PNG` e `favicons` em `config/public` estão nos seus respectivos lugares, de acordo com o padrão original e nomeados corretamente. Se tudo estiver correto, os arquivos são sobrescritos na pasta `dist`.

## Logo SVG
Colocando o `SVG` da logo em `config/public/images` com o nome padrão `logo1_white.svg`, ele irá sobrescrever o original durante o processo de build.

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
            bluePrimary: "",
            blueSecondary: "",
            blueTertiary: "",
            blueQuartiary: "",
            grayPrimary: "",
            graySecondary: "",
            grayTertiary: "",
            lightGray: "",
            lightGraySecondary: "",
            lightBluePrimary: "",
            lightBlueMain: "",
            lightBlueSecondary: "",
            white: "",
            blackPrimary: "",
            blackSecondary: "",
            blackTertiary: "",
            lightYellow: "",
            logoWhite: "",
            redText: "",
            warning: "",
            active: "",
            inactive: ""
                    }
               }
}
```

### Footer - Header - Home
Aqui personalizamos pontos específicos do site, como um array de links que retornam ícones de redes sociais clicáveis; links dos botões de Doação, Repositório e Estatuto; e a escolha de exibir ou não componentes, definindo `true` para aparecer e `false` para não.
```
const localConfig: LocalConfig = {
    theme: {},
    footer: {
        socialMedias: [ "https://www.instagram.com","url","url","url"], //cada "string" é um icone de rede social
        showStatuteButton: {
            show: true,
            redirectUrl: "https://acessarestatuto.com",  //Altera o link do botão de estatuto
        },
        repositoryUrl: "https://github.com/alumialab/alumia", //altera link de repositório
    },
    header: {
        donateButton: {
            show: true,
            redirectUrl: "doaçãoalumia.com", //Altera os links dos botões de doação
        },
    },
    home: {
        affixCTA: true, //Defina se o botão flutuante aparece na home
    },
};
```