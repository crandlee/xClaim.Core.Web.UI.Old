System.register(['@angular/core', '../../appsettings', 'angular2-cookie/core', 'rxjs/add/operator/take', '../logging/logging.service', '../service/busy.service'], function(exports_1, context_1) {
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
    var core_1, appsettings_1, core_2, logging_service_1, busy_service_1;
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
            },
            function (busy_service_1_1) {
                busy_service_1 = busy_service_1_1;
            }],
        execute: function() {
            SecurityService = (function () {
                function SecurityService(cookieService, loggingService, busyService) {
                    this.cookieService = cookieService;
                    this.loggingService = loggingService;
                    this.busyService = busyService;
                    //Make sure to always create these appSettings new because injecting them creates a circular reference at the moment
                    this.appSettings = new appsettings_1.AppSettings();
                    this.storage = localStorage;
                    this.classTrace = this.loggingService.getTraceFunction("SecurityService");
                    if (this.retrieve("xc.IsAuthorized") !== "") {
                        this.HasAdminRole = this.retrieve("xc.HasAdminRole");
                        this.IsAuthorized = this.retrieve("xc.IsAuthorized");
                    }
                }
                SecurityService.prototype.GetToken = function () {
                    var trace = this.classTrace("getToken");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var ret = this.retrieve("xc.authorizationData");
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                SecurityService.prototype.ResetAuthorizationData = function () {
                    var trace = this.classTrace("ResetAuthorizationData");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    this.store("xc.authorizationData", "");
                    this.store("xc.authorizationDataIdToken", "");
                    this.IsAuthorized = false;
                    this.HasAdminRole = false;
                    this.store("xc.HasAdminRole", false);
                    this.store("xc.IsAuthorized", false);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                };
                SecurityService.prototype.SetAuthorizationData = function (token, id_token) {
                    var trace = this.classTrace("SetAuthorizationData");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    if (this.retrieve("xc.authorizationData") !== "") {
                        this.store("xc.authorizationData", "");
                    }
                    this.store("xc.authorizationData", token);
                    this.store("xc.authorizationDataIdToken", id_token);
                    this.IsAuthorized = true;
                    this.store("xc.IsAuthorized", true);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                };
                SecurityService.prototype.requestNewScopeAuthorization = function (scopes) {
                    var trace = this.classTrace("requestNewScopeAuthorization");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    //Replace initial Hub Scopes with the proper scopes that the user will use
                    //throughout the session
                    this.Authorize(scopes);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                };
                SecurityService.prototype.Authorize = function (scopes) {
                    var trace = this.classTrace("Authorize");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    this.ResetAuthorizationData();
                    this.busyService.notifyBusy(true);
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
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    window.location.href = url;
                };
                SecurityService.prototype.retrieveTokensFromUrlHash = function () {
                    var trace = this.classTrace("retrieveTokensFromUrlHash");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    //Attempt to retrieve tokens from hash        
                    var hash = window.location.hash.substr(1);
                    var ret = hash.split('&').reduce(function (res, item) {
                        var parts = item.split('=');
                        res[parts[0]] = parts[1];
                        return res;
                    }, {});
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                SecurityService.prototype.getUtcNowTicks = function () {
                    return Math.floor(new Date().getTime() / 1000);
                };
                SecurityService.prototype.isTokenExpired = function (token) {
                    var trace = this.classTrace("isTokenExpired");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var dataToken = this.getDataFromToken(token);
                    var ret = false;
                    this.loggingService.debug('Checking for token expiration');
                    if (!dataToken.exp || isNaN(parseInt(dataToken.exp)) || this.getUtcNowTicks() >= parseInt(dataToken.exp)) {
                        this.loggingService.debug('Token is expired.  Cannot continue authorization');
                        ret = true;
                    }
                    else {
                        ret = false;
                    }
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                SecurityService.prototype.isCookieTokenValid = function (token, id_token) {
                    var trace = this.classTrace("isCookieTokenValid");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    this.loggingService.debug('Found token and id token in cookies. Continuing check');
                    if (this.isTokenExpired(token)) {
                        this.ResetAuthorizationData();
                        this.loggingService.warn('Could not validate authorization.  New login is required.', null, { noToast: true });
                        trace(logging_service_1.TraceMethodPosition.Exit);
                        return false;
                    }
                    else {
                        this.SetAuthorizationData(token, id_token);
                        this.loggingService.success('Authorization complete and valid (cookie)', { noToast: true });
                        trace(logging_service_1.TraceMethodPosition.Exit);
                        return true;
                    }
                    ;
                };
                SecurityService.prototype.isHashResultValid = function (error, state, access_token, id_token) {
                    var trace = this.classTrace("isHashResultValid");
                    trace(logging_service_1.TraceMethodPosition.Entry);
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
                                    trace(logging_service_1.TraceMethodPosition.Entry);
                                    return true;
                                }
                            }
                        }
                    }
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return false;
                };
                SecurityService.prototype.checkAuthorized = function () {
                    var trace = this.classTrace("checkAuthorized");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    this.loggingService.debug('Checking for valid authorization');
                    //If stored in cookies then get tokens from there
                    var token = this.cookieService.get("xc.authorizationData");
                    var id_token = this.cookieService.get("xc.authorizationDataIdToken");
                    if (token && id_token) {
                        trace(logging_service_1.TraceMethodPosition.Exit);
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
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return this.IsAuthorized;
                };
                SecurityService.prototype.getUserName = function () {
                    var trace = this.classTrace("getUserName");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var id_token = this.cookieService.get("xc.authorizationDataIdToken");
                    if (id_token) {
                        var dataIdToken = this.getDataFromToken(id_token);
                        if (dataIdToken) {
                            trace(logging_service_1.TraceMethodPosition.Exit);
                            return dataIdToken.given_name;
                        }
                    }
                    trace(logging_service_1.TraceMethodPosition.Exit);
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
                    var trace = this.classTrace("Logoff");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    this.ResetAuthorizationData();
                    // var authServer = this._appSettings.IdentityServerEndpoint;
                    // var authorizationUrl = `${authServer}/connect/endsession`;
                    // var url =
                    //     authorizationUrl + "?" +
                    //     `post_logout_redirect_uri=${this._appSettings.ApiRedirectOnLogout}`;
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    // window.location.href = url;
                };
                SecurityService.prototype.urlBase64Decode = function (str) {
                    var trace = this.classTrace("urlBase64Decode");
                    trace(logging_service_1.TraceMethodPosition.Entry);
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
                    var ret = window.atob(output);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                SecurityService.prototype.getDataFromToken = function (token) {
                    var trace = this.classTrace("getDataFromToken");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var data = {};
                    if (typeof token !== 'undefined') {
                        var encoded = token.split('.')[1];
                        data = JSON.parse(this.urlBase64Decode(encoded));
                    }
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return data;
                };
                SecurityService.prototype.retrieve = function (key) {
                    var trace = this.classTrace("retrieve");
                    trace(logging_service_1.TraceMethodPosition.Entry, key);
                    //Check memory
                    var item = this.storage.getItem(key);
                    if (item && item !== 'undefined') {
                        return JSON.parse(this.storage.getItem(key));
                    }
                    //Check cookie
                    var cookieVal = this.cookieService.get(key);
                    if (cookieVal) {
                        trace(logging_service_1.TraceMethodPosition.Exit);
                        return JSON.parse(cookieVal);
                    }
                    trace(logging_service_1.TraceMethodPosition.Exit, key);
                    return;
                };
                SecurityService.prototype.store = function (key, value) {
                    var trace = this.classTrace("store");
                    trace(logging_service_1.TraceMethodPosition.Entry, key);
                    this.storage.setItem(key, JSON.stringify(value));
                    this.cookieService.remove(key);
                    if (value)
                        this.cookieService.put(key, value);
                    trace(logging_service_1.TraceMethodPosition.Exit, key);
                };
                SecurityService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_2.CookieService, logging_service_1.LoggingService, busy_service_1.BusyService])
                ], SecurityService);
                return SecurityService;
            }());
            exports_1("SecurityService", SecurityService);
        }
    }
});
//# sourceMappingURL=security.service.js.map