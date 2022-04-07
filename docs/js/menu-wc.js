'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">aletheia documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-7490a5da07b36d0be03fa1f1af799c7c29f50dd40cd74c889c90b2e343a6a2187e577f09e7fecd41ba91f27abce6d70c4360446479f8ee849c0e360e8371506d"' : 'data-target="#xs-injectables-links-module-AuthModule-7490a5da07b36d0be03fa1f1af799c7c29f50dd40cd74c889c90b2e343a6a2187e577f09e7fecd41ba91f27abce6d70c4360446479f8ee849c0e360e8371506d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-7490a5da07b36d0be03fa1f1af799c7c29f50dd40cd74c889c90b2e343a6a2187e577f09e7fecd41ba91f27abce6d70c4360446479f8ee849c0e360e8371506d"' :
                                        'id="xs-injectables-links-module-AuthModule-7490a5da07b36d0be03fa1f1af799c7c29f50dd40cd74c889c90b2e343a6a2187e577f09e7fecd41ba91f27abce6d70c4360446479f8ee849c0e360e8371506d"' }>
                                        <li class="link">
                                            <a href="injectables/LocalSerializer.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalSerializer</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClaimModule.html" data-type="entity-link" >ClaimModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' : 'data-target="#xs-controllers-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' :
                                            'id="xs-controllers-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' : 'data-target="#xs-injectables-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' :
                                        'id="xs-injectables-links-module-ClaimModule-ce3031e35b3ac652da1cb0d029ea78c88c3cbe5f6f4bb80a82eb296dd210d696708e893d717ed0196d41fcdc5bbede264939f6467899a1d76c9ed4ac79fcf463"' }>
                                        <li class="link">
                                            <a href="injectables/ClaimService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClaimReviewModule.html" data-type="entity-link" >ClaimReviewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' : 'data-target="#xs-controllers-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' :
                                            'id="xs-controllers-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' : 'data-target="#xs-injectables-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' :
                                        'id="xs-injectables-links-module-ClaimReviewModule-25cf8c16f1953af1b8e546a984650b33cd10546c7c3811e6e667aff17c83bf349818319d5114e1b89e55cfb9865d713c2855ee8c0e3b0359b15e55b7faceaf30"' }>
                                        <li class="link">
                                            <a href="injectables/ClaimReviewService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UtilService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UtilService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClaimRevisionModule.html" data-type="entity-link" >ClaimRevisionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimRevisionModule-6db252e294faa70e72adbcb07d0c5c23fb35382b58a824390c567506f64d4b5ad569cf7f4ed1572e32df3e04551bfc5343fe73953c45c86c7fe275a01d0b39d5"' : 'data-target="#xs-injectables-links-module-ClaimRevisionModule-6db252e294faa70e72adbcb07d0c5c23fb35382b58a824390c567506f64d4b5ad569cf7f4ed1572e32df3e04551bfc5343fe73953c45c86c7fe275a01d0b39d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimRevisionModule-6db252e294faa70e72adbcb07d0c5c23fb35382b58a824390c567506f64d4b5ad569cf7f4ed1572e32df3e04551bfc5343fe73953c45c86c7fe275a01d0b39d5"' :
                                        'id="xs-injectables-links-module-ClaimRevisionModule-6db252e294faa70e72adbcb07d0c5c23fb35382b58a824390c567506f64d4b5ad569cf7f4ed1572e32df3e04551bfc5343fe73953c45c86c7fe275a01d0b39d5"' }>
                                        <li class="link">
                                            <a href="injectables/ClaimRevisionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimRevisionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EmailModule-a02f601106443e19bab134c56793a0ff0fd02c2c3df4b4080b6aab07a8164bca9c58de193925f3b4ceecfa73b198d74f3b85a817d88e5b4d2a65e4d4ed53694c"' : 'data-target="#xs-injectables-links-module-EmailModule-a02f601106443e19bab134c56793a0ff0fd02c2c3df4b4080b6aab07a8164bca9c58de193925f3b4ceecfa73b198d74f3b85a817d88e5b4d2a65e4d4ed53694c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailModule-a02f601106443e19bab134c56793a0ff0fd02c2c3df4b4080b6aab07a8164bca9c58de193925f3b4ceecfa73b198d74f3b85a817d88e5b4d2a65e4d4ed53694c"' :
                                        'id="xs-injectables-links-module-EmailModule-a02f601106443e19bab134c56793a0ff0fd02c2c3df4b4080b6aab07a8164bca9c58de193925f3b4ceecfa73b198d74f3b85a817d88e5b4d2a65e4d4ed53694c"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HistoryModule.html" data-type="entity-link" >HistoryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HistoryModule-a4c2d56d4ca2df302d1beec952b6a19f0132fea432628f0283aace748c5c312c4b4940c9c5fe4b6b02e05c36d583b33a41b8e0cc39faf7d9570164b38f0b5048"' : 'data-target="#xs-injectables-links-module-HistoryModule-a4c2d56d4ca2df302d1beec952b6a19f0132fea432628f0283aace748c5c312c4b4940c9c5fe4b6b02e05c36d583b33a41b8e0cc39faf7d9570164b38f0b5048"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HistoryModule-a4c2d56d4ca2df302d1beec952b6a19f0132fea432628f0283aace748c5c312c4b4940c9c5fe4b6b02e05c36d583b33a41b8e0cc39faf7d9570164b38f0b5048"' :
                                        'id="xs-injectables-links-module-HistoryModule-a4c2d56d4ca2df302d1beec952b6a19f0132fea432628f0283aace748c5c312c4b4940c9c5fe4b6b02e05c36d583b33a41b8e0cc39faf7d9570164b38f0b5048"' }>
                                        <li class="link">
                                            <a href="injectables/HistoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HomeModule-a8751f43eb41ad21458fa45184975fe4a6be5f5c5f5cdea338e9140f3290069487aecc1dc2b182e42422f50036e389170697f75f2d298fd858cfe59dae09e6c4"' : 'data-target="#xs-controllers-links-module-HomeModule-a8751f43eb41ad21458fa45184975fe4a6be5f5c5f5cdea338e9140f3290069487aecc1dc2b182e42422f50036e389170697f75f2d298fd858cfe59dae09e6c4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HomeModule-a8751f43eb41ad21458fa45184975fe4a6be5f5c5f5cdea338e9140f3290069487aecc1dc2b182e42422f50036e389170697f75f2d298fd858cfe59dae09e6c4"' :
                                            'id="xs-controllers-links-module-HomeModule-a8751f43eb41ad21458fa45184975fe4a6be5f5c5f5cdea338e9140f3290069487aecc1dc2b182e42422f50036e389170697f75f2d298fd858cfe59dae09e6c4"' }>
                                            <li class="link">
                                                <a href="controllers/HomeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParserModule.html" data-type="entity-link" >ParserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParserModule-296cdd0f37837b3c2526f5218511454ea097eceec36f53b75aa9185bd93767ea0f4700de67240927f1b93e31c24e9997908825758e328efb5cfa304c11a4beb9"' : 'data-target="#xs-injectables-links-module-ParserModule-296cdd0f37837b3c2526f5218511454ea097eceec36f53b75aa9185bd93767ea0f4700de67240927f1b93e31c24e9997908825758e328efb5cfa304c11a4beb9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParserModule-296cdd0f37837b3c2526f5218511454ea097eceec36f53b75aa9185bd93767ea0f4700de67240927f1b93e31c24e9997908825758e328efb5cfa304c11a4beb9"' :
                                        'id="xs-injectables-links-module-ParserModule-296cdd0f37837b3c2526f5218511454ea097eceec36f53b75aa9185bd93767ea0f4700de67240927f1b93e31c24e9997908825758e328efb5cfa304c11a4beb9"' }>
                                        <li class="link">
                                            <a href="injectables/ParserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PersonalityModule.html" data-type="entity-link" >PersonalityModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' : 'data-target="#xs-controllers-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' :
                                            'id="xs-controllers-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' }>
                                            <li class="link">
                                                <a href="controllers/PersonalityController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalityController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' : 'data-target="#xs-injectables-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' :
                                        'id="xs-injectables-links-module-PersonalityModule-4d005411f2c1e062650b450815c3a60708022a8550fe4d829fe25792309c335e482cf5461b605180929a7bcfb1dd2be9071f67506f6445179db7a4196624f35a"' }>
                                        <li class="link">
                                            <a href="injectables/PersonalityService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalityService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UtilService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UtilService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SitemapModule.html" data-type="entity-link" >SitemapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' : 'data-target="#xs-controllers-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' :
                                            'id="xs-controllers-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' }>
                                            <li class="link">
                                                <a href="controllers/SitemapController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SitemapController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' : 'data-target="#xs-injectables-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' :
                                        'id="xs-injectables-links-module-SitemapModule-214fafefb5b281ad84ecd4695259499e29475d121f25ce26732d79e36e873d1434419d873d97fda333ccbbcb69396166e31d65bba46d76f023d84f20359b1671"' }>
                                        <li class="link">
                                            <a href="injectables/SitemapService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SitemapService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SourceModule.html" data-type="entity-link" >SourceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' : 'data-target="#xs-controllers-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' :
                                            'id="xs-controllers-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' }>
                                            <li class="link">
                                                <a href="controllers/SourceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' : 'data-target="#xs-injectables-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' :
                                        'id="xs-injectables-links-module-SourceModule-8be76b5bb0d98b2ed76c42cd81b91a6a84fd66e326b07a904dd432d567933ccb30c4cff3f299f0e31ab593fc12d33887c8dbf3883d0699b11495f507f25e3f15"' }>
                                        <li class="link">
                                            <a href="injectables/SourceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatsModule.html" data-type="entity-link" >StatsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' : 'data-target="#xs-controllers-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' :
                                            'id="xs-controllers-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' }>
                                            <li class="link">
                                                <a href="controllers/StatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' : 'data-target="#xs-injectables-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' :
                                        'id="xs-injectables-links-module-StatsModule-dc7c9cda67dc692cb12451139a9d6f4c85e51e234ab8090cfa4d50b6705d085b2f3a4a8ee693fbd222748ac5fc08ea847c0902d3c37344dfe34d5dddf9fa10f5"' }>
                                        <li class="link">
                                            <a href="injectables/StatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' : 'data-target="#xs-controllers-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' :
                                            'id="xs-controllers-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' : 'data-target="#xs-injectables-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' :
                                        'id="xs-injectables-links-module-UsersModule-ababee4b3a0eb9704954c37f94ae505c5b02e3cb5e5e6dd9e844c898a49630f68d61c2e457922bba51800c2ca4d767eac559e756a494988863e03a5de4e3c74a"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ViewModule.html" data-type="entity-link" >ViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' : 'data-target="#xs-controllers-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' :
                                            'id="xs-controllers-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' }>
                                            <li class="link">
                                                <a href="controllers/ViewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' : 'data-target="#xs-injectables-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' :
                                        'id="xs-injectables-links-module-ViewModule-b9b1522886ec0712fc5009fa4f934ab11fa423d78efe97a1d226cc1d6234c50a4389d73d2b24806eb8a61139374a6b3b0df8a0ec45bebf71e8f89ab0c531fa4d"' }>
                                        <li class="link">
                                            <a href="injectables/ViewService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WikidataModule.html" data-type="entity-link" >WikidataModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-WikidataModule-ce84182d6a48d4bc67f2f9517e17f625571f4c616f80a4dedc5f119810ca36eb21ea9bc2d937a7a7bf0eaaf352f912e7818d65344191b0a67a1496e7fad61863"' : 'data-target="#xs-injectables-links-module-WikidataModule-ce84182d6a48d4bc67f2f9517e17f625571f4c616f80a4dedc5f119810ca36eb21ea9bc2d937a7a7bf0eaaf352f912e7818d65344191b0a67a1496e7fad61863"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WikidataModule-ce84182d6a48d4bc67f2f9517e17f625571f4c616f80a4dedc5f119810ca36eb21ea9bc2d937a7a7bf0eaaf352f912e7818d65344191b0a67a1496e7fad61863"' :
                                        'id="xs-injectables-links-module-WikidataModule-ce84182d6a48d4bc67f2f9517e17f625571f4c616f80a4dedc5f119810ca36eb21ea9bc2d937a7a7bf0eaaf352f912e7818d65344191b0a67a1496e7fad61863"' }>
                                        <li class="link">
                                            <a href="injectables/WikidataService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WikidataService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/RootController.html" data-type="entity-link" >RootController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Claim.html" data-type="entity-link" >Claim</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClaimReview.html" data-type="entity-link" >ClaimReview</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClaimRevision.html" data-type="entity-link" >ClaimRevision</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateClaimDTO.html" data-type="entity-link" >CreateClaimDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateClaimReview.html" data-type="entity-link" >CreateClaimReview</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePersonality.html" data-type="entity-link" >CreatePersonality</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetClaimsByHashDTO.html" data-type="entity-link" >GetClaimsByHashDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetClaimsDTO.html" data-type="entity-link" >GetClaimsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPersonalities.html" data-type="entity-link" >GetPersonalities</a>
                            </li>
                            <li class="link">
                                <a href="classes/History.html" data-type="entity-link" >History</a>
                            </li>
                            <li class="link">
                                <a href="classes/Logger.html" data-type="entity-link" >Logger</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundFilter.html" data-type="entity-link" >NotFoundFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Personality.html" data-type="entity-link" >Personality</a>
                            </li>
                            <li class="link">
                                <a href="classes/Source.html" data-type="entity-link" >Source</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateClaimDTO.html" data-type="entity-link" >UpdateClaimDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/WikidataCache.html" data-type="entity-link" >WikidataCache</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/SessionGuard.html" data-type="entity-link" >SessionGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/UserDocument.html" data-type="entity-link" >UserDocument</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});