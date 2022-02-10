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
                                            'data-target="#controllers-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' : 'data-target="#xs-controllers-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' :
                                            'id="xs-controllers-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' : 'data-target="#xs-injectables-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' :
                                        'id="xs-injectables-links-module-ClaimModule-ce918621b670d4387b718fbdd923e13bd4f9f76c46782351233c516d9d70fa722f3207aeb851bf49c7f4d955cbb9b3dfd8a72e460e9a169101b9648b41ea001a"' }>
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
                                            'data-target="#controllers-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' : 'data-target="#xs-controllers-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' :
                                            'id="xs-controllers-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' }>
                                            <li class="link">
                                                <a href="controllers/ClaimReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClaimReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' : 'data-target="#xs-injectables-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' :
                                        'id="xs-injectables-links-module-ClaimReviewModule-0f6eefa566a37b6d8781d31f64835edf1b34911a4978d7b1d6b9078fd2ae97b4772ef6ea2e9cc2fd90e175922fa540a16796527d540afc4e82213ef4dc8a6d92"' }>
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
                                            'data-target="#controllers-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' : 'data-target="#xs-controllers-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' :
                                            'id="xs-controllers-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' }>
                                            <li class="link">
                                                <a href="controllers/PersonalityController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalityController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' : 'data-target="#xs-injectables-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' :
                                        'id="xs-injectables-links-module-PersonalityModule-9101708a5307a2683d795f22b7e7018aea4bf21c48c2458306040592ced401abc458992fcc064e98d5d0cebafea2d8531a23c6d85ed10dc5cec103bf09bbf221"' }>
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
                                <a href="modules/SourceModule.html" data-type="entity-link" >SourceModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SourceModule-0f9257ccdc1301b4203d8df59687162d5477f257d5eb312c50a7a0165c13d74a69c071cbfab2dafd12b9c08af4e65e77312dac32c58500a85585c25e7b689062"' : 'data-target="#xs-injectables-links-module-SourceModule-0f9257ccdc1301b4203d8df59687162d5477f257d5eb312c50a7a0165c13d74a69c071cbfab2dafd12b9c08af4e65e77312dac32c58500a85585c25e7b689062"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SourceModule-0f9257ccdc1301b4203d8df59687162d5477f257d5eb312c50a7a0165c13d74a69c071cbfab2dafd12b9c08af4e65e77312dac32c58500a85585c25e7b689062"' :
                                        'id="xs-injectables-links-module-SourceModule-0f9257ccdc1301b4203d8df59687162d5477f257d5eb312c50a7a0165c13d74a69c071cbfab2dafd12b9c08af4e65e77312dac32c58500a85585c25e7b689062"' }>
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
                                            'data-target="#controllers-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' : 'data-target="#xs-controllers-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' :
                                            'id="xs-controllers-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' }>
                                            <li class="link">
                                                <a href="controllers/WikidataController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WikidataController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' : 'data-target="#xs-injectables-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' :
                                        'id="xs-injectables-links-module-WikidataModule-79a8465b32daa974420b900e4920e8962913dbf8c8ef40bbae6f895cc998e3cb07b3a95337449ca31993c82739e63c5ada3665342a10bbc67b480166732e0346"' }>
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
                                <a href="classes/Logger.html" data-type="entity-link" >Logger</a>
                            </li>
                            <li class="link">
                                <a href="classes/Personality.html" data-type="entity-link" >Personality</a>
                            </li>
                            <li class="link">
                                <a href="classes/Source.html" data-type="entity-link" >Source</a>
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