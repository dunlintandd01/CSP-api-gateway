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
                    <a href="index.html" data-type="index-link">project-name documentation</a>
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
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' : 'data-target="#xs-controllers-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' :
                                            'id="xs-controllers-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' : 'data-target="#xs-injectables-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' :
                                        'id="xs-injectables-links-module-AuthModule-2abfa8e8b2d79189a98946d07183e657"' }>
                                        <li class="link">
                                            <a href="injectables/AdminStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AdminStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MemberStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MemberStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GameModule.html" data-type="entity-link">GameModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' : 'data-target="#xs-controllers-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' :
                                            'id="xs-controllers-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' }>
                                            <li class="link">
                                                <a href="controllers/GameAdminController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GameAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/GameController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GameController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' : 'data-target="#xs-injectables-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' :
                                        'id="xs-injectables-links-module-GameModule-5a1d79cddac88898137a2bbfa61996a0"' }>
                                        <li class="link">
                                            <a href="injectables/GameService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GameService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link">HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HealthModule-43c0d9e5026b23738e01d629eada2a82"' : 'data-target="#xs-controllers-links-module-HealthModule-43c0d9e5026b23738e01d629eada2a82"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-43c0d9e5026b23738e01d629eada2a82"' :
                                            'id="xs-controllers-links-module-HealthModule-43c0d9e5026b23738e01d629eada2a82"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LotteryModule.html" data-type="entity-link">LotteryModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OperationLogModule.html" data-type="entity-link">OperationLogModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PlayerModule.html" data-type="entity-link">PlayerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/QuizModule.html" data-type="entity-link">QuizModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link">RedisModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ThirdPartyModule.html" data-type="entity-link">ThirdPartyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ThirdPartyModule-0178bc427574d5386ffbe4a667f45ea3"' : 'data-target="#xs-injectables-links-module-ThirdPartyModule-0178bc427574d5386ffbe4a667f45ea3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThirdPartyModule-0178bc427574d5386ffbe4a667f45ea3"' :
                                        'id="xs-injectables-links-module-ThirdPartyModule-0178bc427574d5386ffbe4a667f45ea3"' }>
                                        <li class="link">
                                            <a href="injectables/PointsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PointsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/S3Service.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>S3Service</a>
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
                                    <a href="controllers/AuthController.html" data-type="entity-link">AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GameAdminController.html" data-type="entity-link">GameAdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GameController.html" data-type="entity-link">GameController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HealthController.html" data-type="entity-link">HealthController</a>
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
                                <a href="classes/AdminLoginRequestDto.html" data-type="entity-link">AdminLoginRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllExceptionFilter.html" data-type="entity-link">AllExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGameReq.html" data-type="entity-link">CreateGameReq</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventBusSDKService.html" data-type="entity-link">EventBusSDKService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Game.html" data-type="entity-link">Game</a>
                            </li>
                            <li class="link">
                                <a href="classes/GameDto.html" data-type="entity-link">GameDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Operation.html" data-type="entity-link">Operation</a>
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
                                    <a href="injectables/AdminAuthGuard.html" data-type="entity-link">AdminAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminAuthGuard-1.html" data-type="entity-link">AdminAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminStrategy.html" data-type="entity-link">AdminStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameService.html" data-type="entity-link">GameService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link">LoggingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberStrategy.html" data-type="entity-link">MemberStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PointsService.html" data-type="entity-link">PointsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/S3Service.html" data-type="entity-link">S3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link">ValidationPipe</a>
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
                                <a href="interfaces/RedisModuleAsyncOptions.html" data-type="entity-link">RedisModuleAsyncOptions</a>
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