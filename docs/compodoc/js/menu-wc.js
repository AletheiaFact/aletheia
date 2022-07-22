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
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
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
                                <a href="modules/CaptchaModule.html" data-type="entity-link" >CaptchaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CaptchaModule-927cd6c5a73ae535a0692731e81357da886e10c4b48bd1a7986b66bb6148f5f9f6edf720ca406cf417fc9a480215ffc55117cc1f694bb21ce503f15ce4cf335e"' : 'data-target="#xs-injectables-links-module-CaptchaModule-927cd6c5a73ae535a0692731e81357da886e10c4b48bd1a7986b66bb6148f5f9f6edf720ca406cf417fc9a480215ffc55117cc1f694bb21ce503f15ce4cf335e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CaptchaModule-927cd6c5a73ae535a0692731e81357da886e10c4b48bd1a7986b66bb6148f5f9f6edf720ca406cf417fc9a480215ffc55117cc1f694bb21ce503f15ce4cf335e"' :
                                        'id="xs-injectables-links-module-CaptchaModule-927cd6c5a73ae535a0692731e81357da886e10c4b48bd1a7986b66bb6148f5f9f6edf720ca406cf417fc9a480215ffc55117cc1f694bb21ce503f15ce4cf335e"' }>
                                        <li class="link">
                                            <a href="injectables/CaptchaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CaptchaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClaimModule.html" data-type="entity-link" >ClaimModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' : 'data-target="#xs-controllers-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' :
                                            'id="xs-controllers-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' : 'data-target="#xs-injectables-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' :
                                        'id="xs-injectables-links-module-ClaimModule-78b71265a8f4d67638a1d27f80b172308ca8745704db39309bd6b196c0ca78f9199703a4ba35c2943586485bf6fcb118d722ba6585e0e3227a8a984be3f22ca8"' }>
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
                                            'data-target="#controllers-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' : 'data-target="#xs-controllers-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' :
                                            'id="xs-controllers-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' : 'data-target="#xs-injectables-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' :
                                        'id="xs-injectables-links-module-ClaimReviewModule-e980adc4db1a81271b1811f9d09e93675febd99c0d789c7971ebf6d9f4bd84e8f6618b32b160a19d4d89477ddb47eb027120503005d3ed4a5db3c89b9fde2f1a"' }>
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
                                <a href="modules/ClaimReviewTaskModule.html" data-type="entity-link" >ClaimReviewTaskModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' : 'data-target="#xs-controllers-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' :
                                            'id="xs-controllers-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' : 'data-target="#xs-injectables-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' :
                                        'id="xs-injectables-links-module-ClaimReviewTaskModule-70a420e8768b8e8c0bba0578e104f51fea089f8f1b6d1aa1ee91e00fe10ae12a6a0c26c1fda372b4b287d9541c90007bde0df4f8db992b64b5c2ac2803521ac0"' }>
                                        <li class="link">
                                            <a href="injectables/ClaimReviewTaskService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewTaskService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClaimRevisionModule.html" data-type="entity-link" >ClaimRevisionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimRevisionModule-5ff76ee211a6a194a37c26bf8190c49334b5a7c42224825ef9cea50e719759b400a0d45228ba7835b0f77f4831ba0c21e0980263328cbbabde3ac2aff652e16d"' : 'data-target="#xs-injectables-links-module-ClaimRevisionModule-5ff76ee211a6a194a37c26bf8190c49334b5a7c42224825ef9cea50e719759b400a0d45228ba7835b0f77f4831ba0c21e0980263328cbbabde3ac2aff652e16d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimRevisionModule-5ff76ee211a6a194a37c26bf8190c49334b5a7c42224825ef9cea50e719759b400a0d45228ba7835b0f77f4831ba0c21e0980263328cbbabde3ac2aff652e16d"' :
                                        'id="xs-injectables-links-module-ClaimRevisionModule-5ff76ee211a6a194a37c26bf8190c49334b5a7c42224825ef9cea50e719759b400a0d45228ba7835b0f77f4831ba0c21e0980263328cbbabde3ac2aff652e16d"' }>
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
                                            'data-target="#controllers-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' : 'data-target="#xs-controllers-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' :
                                            'id="xs-controllers-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' }>
                                            <li class="link">
                                                <a href="controllers/HistoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' : 'data-target="#xs-injectables-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' :
                                        'id="xs-injectables-links-module-HistoryModule-2f0635066319ec61a972dbf2d889d4c861675ad83856eaf301ccaf57d95b36e0b8d1b5129d519dd4f477aa09bca9169a9b27ed9e6be273c721881bcc7e1ad6dc"' }>
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
                                <a href="modules/OryModule.html" data-type="entity-link" >OryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' : 'data-target="#xs-controllers-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' :
                                            'id="xs-controllers-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' }>
                                            <li class="link">
                                                <a href="controllers/OryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' : 'data-target="#xs-injectables-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' :
                                        'id="xs-injectables-links-module-OryModule-c351001bd01e42e09ad71ab4f2416e0cf5b7395881092ce32c872b64f76f1d88278909f9477a72b3e42b197b362d486ad0907cc957ff4cabb44c577ec0a1e28d"' }>
                                        <li class="link">
                                            <a href="injectables/OryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParagraphModule.html" data-type="entity-link" >ParagraphModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParagraphModule-84127feb549fafe378e6a8aafb6999cc8cafcbd55c37ca439d88523b408abef5acf1dcf60546d37c1f09b7c391459b45ced56719fa5112910a96f4061a743063"' : 'data-target="#xs-injectables-links-module-ParagraphModule-84127feb549fafe378e6a8aafb6999cc8cafcbd55c37ca439d88523b408abef5acf1dcf60546d37c1f09b7c391459b45ced56719fa5112910a96f4061a743063"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParagraphModule-84127feb549fafe378e6a8aafb6999cc8cafcbd55c37ca439d88523b408abef5acf1dcf60546d37c1f09b7c391459b45ced56719fa5112910a96f4061a743063"' :
                                        'id="xs-injectables-links-module-ParagraphModule-84127feb549fafe378e6a8aafb6999cc8cafcbd55c37ca439d88523b408abef5acf1dcf60546d37c1f09b7c391459b45ced56719fa5112910a96f4061a743063"' }>
                                        <li class="link">
                                            <a href="injectables/ParagraphService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParagraphService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParserModule.html" data-type="entity-link" >ParserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParserModule-7b2d01fa20451483a9d8c605f20e3c3dbbf6b439a86c7d8a0e9dfa7c9aacd7f04346d6c815566d52a5da423ee87144bf063d2498cfb59cbb1485f85f9d911703"' : 'data-target="#xs-injectables-links-module-ParserModule-7b2d01fa20451483a9d8c605f20e3c3dbbf6b439a86c7d8a0e9dfa7c9aacd7f04346d6c815566d52a5da423ee87144bf063d2498cfb59cbb1485f85f9d911703"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParserModule-7b2d01fa20451483a9d8c605f20e3c3dbbf6b439a86c7d8a0e9dfa7c9aacd7f04346d6c815566d52a5da423ee87144bf063d2498cfb59cbb1485f85f9d911703"' :
                                        'id="xs-injectables-links-module-ParserModule-7b2d01fa20451483a9d8c605f20e3c3dbbf6b439a86c7d8a0e9dfa7c9aacd7f04346d6c815566d52a5da423ee87144bf063d2498cfb59cbb1485f85f9d911703"' }>
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
                                <a href="modules/ReportModule.html" data-type="entity-link" >ReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' : 'data-target="#xs-controllers-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' :
                                            'id="xs-controllers-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' }>
                                            <li class="link">
                                                <a href="controllers/ReportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' : 'data-target="#xs-injectables-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' :
                                        'id="xs-injectables-links-module-ReportModule-f01c01b262f5a157e36836e906ae66c7700917d7749621d43e2e2b72500885c7d3944eab9bee4e406f36c8ba1b17051c6127614e0fff51cb7eec144dd09c66ca"' }>
                                        <li class="link">
                                            <a href="injectables/ReportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SentenceModule.html" data-type="entity-link" >SentenceModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SentenceModule-64ff31cf6f696aad2cdf621571e7e76d3e81f0447b355381a4eb422363210afd09ead9b76aed5cb8a7d975a0bc54cb35880f49c130c05b75c056d0bd0d025669"' : 'data-target="#xs-injectables-links-module-SentenceModule-64ff31cf6f696aad2cdf621571e7e76d3e81f0447b355381a4eb422363210afd09ead9b76aed5cb8a7d975a0bc54cb35880f49c130c05b75c056d0bd0d025669"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SentenceModule-64ff31cf6f696aad2cdf621571e7e76d3e81f0447b355381a4eb422363210afd09ead9b76aed5cb8a7d975a0bc54cb35880f49c130c05b75c056d0bd0d025669"' :
                                        'id="xs-injectables-links-module-SentenceModule-64ff31cf6f696aad2cdf621571e7e76d3e81f0447b355381a4eb422363210afd09ead9b76aed5cb8a7d975a0bc54cb35880f49c130c05b75c056d0bd0d025669"' }>
                                        <li class="link">
                                            <a href="injectables/SentenceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SentenceService</a>
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
                                <a href="modules/SpeechModule.html" data-type="entity-link" >SpeechModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SpeechModule-5e7e74961974407c2cf051fa01031fa7927f64393d5ad81494faccc946490d5d3db39b9fb5bd9e21c74a54d041221ad2dc3547f88a403e1ebc19272e57b7a849"' : 'data-target="#xs-injectables-links-module-SpeechModule-5e7e74961974407c2cf051fa01031fa7927f64393d5ad81494faccc946490d5d3db39b9fb5bd9e21c74a54d041221ad2dc3547f88a403e1ebc19272e57b7a849"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SpeechModule-5e7e74961974407c2cf051fa01031fa7927f64393d5ad81494faccc946490d5d3db39b9fb5bd9e21c74a54d041221ad2dc3547f88a403e1ebc19272e57b7a849"' :
                                        'id="xs-injectables-links-module-SpeechModule-5e7e74961974407c2cf051fa01031fa7927f64393d5ad81494faccc946490d5d3db39b9fb5bd9e21c74a54d041221ad2dc3547f88a403e1ebc19272e57b7a849"' }>
                                        <li class="link">
                                            <a href="injectables/SpeechService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpeechService</a>
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
                                            'data-target="#controllers-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' : 'data-target="#xs-controllers-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' :
                                            'id="xs-controllers-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' : 'data-target="#xs-injectables-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' :
                                        'id="xs-injectables-links-module-UsersModule-d2b6d3a41859e7d746338460d8e9a30bb7ecafe4973912a1b9704bcf25a5dba3eccefe5064affc09b27cb13fc0ad5988240fb82d447fc3b1a3ec6740e1adbf70"' }>
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
                                            'data-target="#controllers-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' : 'data-target="#xs-controllers-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' :
                                            'id="xs-controllers-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' }>
                                            <li class="link">
                                                <a href="controllers/ViewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' : 'data-target="#xs-injectables-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' :
                                        'id="xs-injectables-links-module-ViewModule-f818c629f4ab700af8c07de774abb92c0c7270c147c1f0ee14f2e7d2b6b394d6c02bab679167456be6251f8036540c5ffb6acbd7d74ebecd51c79dbbc4a6312d"' }>
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
                                    <a href="controllers/OryController.html" data-type="entity-link" >OryController</a>
                                </li>
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
                                <a href="classes/ClaimReviewTask.html" data-type="entity-link" >ClaimReviewTask</a>
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
                                <a href="classes/CreateClaimReviewTaskDTO.html" data-type="entity-link" >CreateClaimReviewTaskDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePersonality.html" data-type="entity-link" >CreatePersonality</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetClaimsDTO.html" data-type="entity-link" >GetClaimsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPersonalities.html" data-type="entity-link" >GetPersonalities</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTasksDTO.html" data-type="entity-link" >GetTasksDTO</a>
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
                                <a href="classes/Paragraph.html" data-type="entity-link" >Paragraph</a>
                            </li>
                            <li class="link">
                                <a href="classes/Personality.html" data-type="entity-link" >Personality</a>
                            </li>
                            <li class="link">
                                <a href="classes/Report.html" data-type="entity-link" >Report</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sentence.html" data-type="entity-link" >Sentence</a>
                            </li>
                            <li class="link">
                                <a href="classes/Source.html" data-type="entity-link" >Source</a>
                            </li>
                            <li class="link">
                                <a href="classes/Speech.html" data-type="entity-link" >Speech</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateClaimDTO.html" data-type="entity-link" >UpdateClaimDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateClaimReviewTaskDTO.html" data-type="entity-link" >UpdateClaimReviewTaskDTO</a>
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
                                    <a href="injectables/DisableBodyParserMiddleware.html" data-type="entity-link" >DisableBodyParserMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GetLanguageMiddleware.html" data-type="entity-link" >GetLanguageMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JsonBodyMiddleware.html" data-type="entity-link" >JsonBodyMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerMiddleware.html" data-type="entity-link" >LoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OryService.html" data-type="entity-link" >OryService</a>
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