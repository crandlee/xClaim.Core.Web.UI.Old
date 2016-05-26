System.register(['@angular/core', '../../appsettings', 'angular2-cookie/core', 'rxjs/add/operator/take', '../logging/logging.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, appsettings_1, core_2, logging_service_1;
    var SecurityService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (appsettings_1_1) {
                appsettings_1 = appsettings_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (_1) {},
            function (logging_service_1_1) {
                logging_service_1 = logging_service_1_1;
            }],
        execute: function() {
            SecurityService = (function () {
                function SecurityService(cookieService, loggingService) {
                    this.cookieService = cookieService;
                    this.loggingService = loggingService;
                    //Make sure to always create these appSettings new because injecting them creates a circular reference at the moment
                    this.appSettings = new appsettings_1.AppSettings();
                    this.storage = localStorage;
                    if (this.retrieve("xc.IsAuthorized") !== "") {
                        this.HasAdminRole = this.retrieve("xc.HasAdminRole");
                        this.IsAuthorized = this.retrieve("xc.IsAuthorized");
                    }
                }
                SecurityService.prototype.GetToken = function () {
                    return this.retrieve("xc.authorizationData");
                };
                SecurityService.prototype.ResetAuthorizationData = function () {
                    this.store("xc.authorizationData", "");
                    this.store("xc.authorizationDataIdToken", "");
                    this.IsAuthorized = false;
                    this.HasAdminRole = false;
                    this.store("xc.HasAdminRole", false);
                    this.store("xc.IsAuthorized", false);
                };
                SecurityService.prototype.SetAuthorizationData = function (token, id_token) {
                    if (this.retrieve("xc.authorizationData") !== "") {
                        this.store("xc.authorizationData", "");
                    }
                    this.store("xc.authorizationData", token);
                    this.store("xc.authorizationDataIdToken", id_token);
                    this.IsAuthorized = true;
                    this.store("xc.IsAuthorized", true);
                };
                SecurityService.prototype.requestNewScopeAuthorization = function (scopes) {
                    //Replace initial Hub Scopes with the proper scopes that the user will use
                    //throughout the session
                    this.Authorize(scopes);
                };
                SecurityService.prototype.Authorize = function (scopes) {
                    this.ResetAuthorizationData();
                    var authServer = this.appSettings.IdentityServerEndpoint;
                    var authorizationUrl = authServer + "/connect/authorize";
                    var client_id = this.appSettings.ApiClientId;
                    var redirect_uri = this.appSettings.ApiRedirectOnLogin;
                    var response_type = this.appSettings.ResponseType;
                    var scopeRequest = scopes || this.appSettings.HubScopes;
                    var nonce = "N" + Math.random() + "" + Date.now();
                    var state = Date.now() + "" + Math.random();
                    this.loggingService.debug("Begin authorization, requesting scopes [" + scopeRequest + "]");
                    this.store("xc.authStateControl", state);
                    this.store("xc.authNonce", nonce);
                    //this.loggingService.debug("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));
                    var url = authorizationUrl + "?" +
                        "response_type=" + encodeURI(response_type) + "&" +
                        "client_id=" + encodeURI(client_id) + "&" +
                        "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                        "scope=" + encodeURI(scopeRequest) + "&" +
                        "nonce=" + encodeURI(nonce) + "&" +
                        "state=" + encodeURI(state);
                    window.location.href = url;
                };
                SecurityService.prototype.retrieveTokensFromUrlHash = function () {
                    //Attempt to retrieve tokens from hash        
                    var hash = window.location.hash.substr(1);
                    return hash.split('&').reduce(function (res, item) {
                        var parts = item.split('=');
                        res[parts[0]] = parts[1];
                        return res;
                    }, {});
                };
                SecurityService.prototype.getUtcNowTicks = function () {
                    return Math.floor(new Date().getTime() / 1000);
                };
                SecurityService.prototype.isTokenExpired = function (token) {
                    var dataToken = this.getDataFromToken(token);
                    this.loggingService.debug('Checking for token expiration');
                    if (!dataToken.exp || isNaN(parseInt(dataToken.exp)) || this.getUtcNowTicks() >= parseInt(dataToken.exp)) {
                        this.loggingService.debug('Token is expired.  Cannot continue authorization');
                        return true;
                    }
                    return false;
                };
                SecurityService.prototype.isCookieTokenValid = function (token, id_token) {
                    this.loggingService.debug('Found token and id token in cookies. Continuing check');
                    if (this.isTokenExpired(token)) {
                        this.ResetAuthorizationData();
                        this.loggingService.warn('Could not validate authorization.  New login is required.', null, { noToast: true });
                        return false;
                    }
                    else {
                        this.SetAuthorizationData(token, id_token);
                        this.loggingService.success('Authorization complete and valid (cookie)', { noToast: true });
                        return true;
                    }
                    ;
                };
                SecurityService.prototype.isHashResultValid = function (error, state, access_token, id_token) {
                    if (!error) {
                        if (!state || state == this.retrieve("xc.authStateControl")) {
                            if (access_token && id_token) {
                                this.loggingService.debug("Retrieved token and id token in hash. Continuing check.");
                                var dataIdToken = this.getDataFromToken(id_token);
                                if (this.isTokenExpired(access_token))
                                    return false;
                                // validate nonce
                                if (dataIdToken.nonce == this.retrieve("xc.authNonce")) {
                                    this.store("xc.authNonce", "");
                                    this.store("xc.authStateControl", "");
                                    this.loggingService.success('Authorization Successful', { noToast: true });
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                };
                SecurityService.prototype.checkAuthorized = function () {
                    this.loggingService.debug('Checking for valid authorization');
                    //If stored in cookies then get tokens from there
                    var token = this.cookieService.get("xc.authorizationData");
                    var id_token = this.cookieService.get("xc.authorizationDataIdToken");
                    if (token && id_token) {
                        return this.isCookieTokenValid(token, id_token);
                    }
                    //Check hash for tokens
                    this.ResetAuthorizationData();
                    var hashResult = this.retrieveTokensFromUrlHash();
                    if (this.isHashResultValid(hashResult.error, hashResult.state, hashResult.access_token, hashResult.id_token)) {
                        this.SetAuthorizationData(hashResult.access_token, hashResult.id_token);
                        this.loggingService.success('Authorization complete and valid (hash)', { noToast: true });
                    }
                    else {
                        this.ResetAuthorizationData();
                        this.loggingService.warn('No valid authorization found', null, { noToast: true });
                    }
                    return this.IsAuthorized;
                };
                SecurityService.prototype.getUserName = function () {
                    var id_token = this.cookieService.get("xc.authorizationDataIdToken");
                    if (id_token) {
                        var dataIdToken = this.getDataFromToken(id_token);
                        if (dataIdToken)
                            return dataIdToken.given_name;
                    }
                    return "";
                };
                SecurityService.prototype.getCurrentScopes = function () {
                    var token = this.cookieService.get("xc.authorizationData");
                    if (token) {
                        var accessToken = this.getDataFromToken(token);
                        if (accessToken)
                            return accessToken.scope.join(" ");
                    }
                    return "";
                };
                SecurityService.prototype.Logoff = function () {
                    this.ResetAuthorizationData();
                    // var authServer = this._appSettings.IdentityServerEndpoint;
                    // var authorizationUrl = `${authServer}/connect/endsession`;
                    // var url =
                    //     authorizationUrl + "?" +
                    //     `post_logout_redirect_uri=${this._appSettings.ApiRedirectOnLogout}`;
                    // window.location.href = url;
                };
                SecurityService.prototype.urlBase64Decode = function (str) {
                    var output = str.replace('-', '+').replace('_', '/');
                    switch (output.length % 4) {
                        case 0:
                            break;
                        case 2:
                            output += '==';
                            break;
                        case 3:
                            output += '=';
                            break;
                        default:
                            throw 'Illegal base64url string!';
                    }
                    return window.atob(output);
                };
                SecurityService.prototype.getDataFromToken = function (token) {
                    var data = {};
                    if (typeof token !== 'undefined') {
                        var encoded = token.split('.')[1];
                        data = JSON.parse(this.urlBase64Decode(encoded));
                    }
                    return data;
                };
                SecurityService.prototype.retrieve = function (key) {
                    //Check memory
                    var item = this.storage.getItem(key);
                    if (item && item !== 'undefined') {
                        return JSON.parse(this.storage.getItem(key));
                    }
                    //Check cookie
                    var cookieVal = this.cookieService.get(key);
                    if (cookieVal) {
                        return JSON.parse(cookieVal);
                    }
                    return;
                };
                SecurityService.prototype.store = function (key, value) {
                    this.storage.setItem(key, JSON.stringify(value));
                    this.cookieService.remove(key);
                    if (value)
                        this.cookieService.put(key, value);
                };
                SecurityService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_2.CookieService, logging_service_1.LoggingService])
                ], SecurityService);
                return SecurityService;
            }());
            exports_1("SecurityService", SecurityService);
        }
    }
});
//# sourceMappingURL=security.service.js.map