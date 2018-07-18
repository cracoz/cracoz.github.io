
// akPushConfig = {
//     ResourceToken: 'resource-token',
//     ServerHost: 'server-host',
//     ServerApplePushAPI: 'server-apple-push-api',
//     SafariWebsitePushID: 'safari-website-push-id',
//     ServiceWorkerPath: '/service-worker.js'
//     IsTest: "false", // string
// };

var AKPush = function(akPushConfig) {
    this.akPushConfig = akPushConfig || {};
    this.akPushConfig.ResourceToken = this.akPushConfig.ResourceToken || 'i7UodZgh3fL-c99861b55eb332f1'
    this.akPushConfig.ServerHost = this.akPushConfig.ServerHost || 'ssl.egor.local';
    this.akPushConfig.SafariWebsitePushID = this.akPushConfig.SafariWebsitePushID || '';
    this.akPushConfig.ServerApplePushAPI = this.akPushConfig.ServerApplePushAPI || 'https://egor.local/api/v1.1/ap';
    this.akPushConfig.ServiceWorkerPath = this.akPushConfig.ServiceWorkerPath || '/service-worker.js';
    this.akPushConfig.IsTest = this.akPushConfig.IsTest || "false";

    this.Provider = "";

    var that = this;

    this.detectBrowserVersion = function(userAgent, regexp) {
        var browserVersionSlice = userAgent.match(regexp);
        var browserVersion = "";
        if (browserVersionSlice && browserVersionSlice.length > 1) {
            browserVersion = browserVersionSlice[1];
        }
        return browserVersion;
    };

    this.detectBrowser = function(userAgent) {
        var commonVersion = that.detectBrowserVersion(userAgent, /version\/(\d+(\.\d+)?)/i);
        var edgeVersion = that.detectBrowserVersion(userAgent, /edge\/(\d+(\.\d+)?)/i);
        var iVersion = that.detectBrowserVersion(userAgent, /(ipod|iphone|ipad)/i).toLowerCase();
        var isSailfish = /sailfish/i.test(userAgent);
        var isTizen = /tizen/i.test(userAgent);
        var isWebHPW = /(web|hpw)os/i.test(userAgent);
        var isAndroid = !/like android/i.test(userAgent) && /android/i.test(userAgent);
        var isSilk = /silk/i.test(userAgent);
        var isMacintosh = !iVersion && !isSilk && /macintosh/i.test(userAgent);
        var isXBox = /xbox/i.test(userAgent);
        var isWindowsPhone = /windows phone/i.test(userAgent);
        var isWindows = (/SamsungBrowser/i.test(userAgent), !isWindowsPhone && /windows/i.test(userAgent));
        var isLinux = !isAndroid && !isSailfish && !isTizen && !isWebHPW && /linux/i.test(userAgent)

        var browser = {};
        if (/opera/i.test(userAgent)) {
            browser = {
                name: "Opera",
                opera: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
            };
        } else if (/opr|opios/i.test(userAgent)) {
            browser = {
                name: "Opera",
                opera: true,
                version: that.detectBrowserVersion(userAgent, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || commonVersion
            };
        } else if (/SamsungBrowser/i.test(userAgent)) {
            browser = {
                name: "Samsung Internet for Android",
                samsungBrowser: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
            };
        } else if (/coast/i.test(userAgent)) {
            browser = {
                name: "Opera Coast",
                coast: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /(?:coast)[\s\/](\d+(\.\d+)?)/i)
            };
        } else if (/yabrowser/i.test(userAgent)) {
            browser = {
                name: "Yandex Browser",
                yandexbrowser: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
            };
        } else if (/ucbrowser/i.test(userAgent)) {
            browser = {
                name: "UC Browser",
                ucbrowser: true,
                version: that.detectBrowserVersion(userAgent, /(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
            };
        } else if (/mxios/i.test(userAgent)) {
            browser = {
                name: "Maxthon",
                maxthon: true,
                version: that.detectBrowserVersion(userAgent, /(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
            };
        } else if (/epiphany/i.test(userAgent)) {
            browser = {
                name: "Epiphany",
                epiphany: true,
                version: that.detectBrowserVersion(userAgent, /(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
            };
        } else if (/puffin/i.test(userAgent)) {
            browser = {
                name: "Puffin",
                puffin: true,
                version: that.detectBrowserVersion(userAgent, /(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
            };
        } else if(/sleipnir/i.test(userAgent)) {
            browser = {
                name: "Sleipnir",
                sleipnir: true,
                version: that.detectBrowserVersion(userAgent, /(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
            };
        } else if(/k-meleon/i.test(userAgent)) {
            browser = {
                name: "K-Meleon",
                kMeleon: true,
                version: that.detectBrowserVersion(userAgent, /(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
            };
        } else if(/windows phone/i.test(userAgent)) {
            browser = {
                name: "Windows Phone",
                windowsphone: true
            };
            if (edgeVersion) {
                browser.msedge = true;
                browser.version = edgeVersion;
            } else {
                browser.msie = true;
                browser.version = that.detectBrowserVersion(userAgent, /iemobile\/(\d+(\.\d+)?)/i);
            }
        } else if(/msie|trident/i.test(userAgent)) {
            browser = {
                name: "Internet Explorer",
                msie: true,
                version: that.detectBrowserVersion(userAgent, /(?:msie |rv:)(\d+(\.\d+)?)/i)
            };
        } else if(/CrOS/.test(userAgent)) {
            browser = {
                name: "Chrome",
                chromeos: true,
                chromeBook: true,
                chrome: true,
                version: that.detectBrowserVersion(userAgent, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            };
        } else if (/chrome.+? edge/i.test(userAgent)) {
            browser = {
                name: "Microsoft Edge",
                msedge: true,
                version: b
            };
        } else if (/vivaldi/i.test(userAgent)) {
            browser = {
                name: "Vivaldi",
                vivaldi: true,
                version: that.detectBrowserVersion(userAgent, /vivaldi\/(\d+(\.\d+)?)/i) || commonVersion
            };
        } else if(isSailfish) {
            browser = {
                name: "Sailfish",
                sailfish: true,
                version: that.detectBrowserVersion(userAgent, /sailfish\s?browser\/(\d+(\.\d+)?)/i)
            };
        } else if(/seamonkey\//i.test(userAgent)) {
            browser = {
                name: "SeaMonkey",
                seamonkey: true,
                version: that.detectBrowserVersion(userAgent, /seamonkey\/(\d+(\.\d+)?)/i)
            };
        } else if(/firefox|iceweasel|fxios/i.test(userAgent)) {
            browser = {
                name: "Firefox",
                firefox: true,
                version: that.detectBrowserVersion(userAgent, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
            };
            if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(userAgent)) {
                browser.firefoxos = true;
            }
        } else if(isSilk) {
            browser = {
                name: "Amazon Silk",
                silk: true,
                version: that.detectBrowserVersion(userAgent, /silk\/(\d+(\.\d+)?)/i)
            };
        } else if(/phantom/i.test(userAgent)) {
            browser = {
                name: "PhantomJS",
                phantom: true,
                version: that.detectBrowserVersion(userAgent, /phantomjs\/(\d+(\.\d+)?)/i)
            };
        } else if(/slimerjs/i.test(userAgent)) {
            browser = {
                name: "SlimerJS",
                slimer: true,
                version: that.detectBrowserVersion(userAgent, /slimerjs\/(\d+(\.\d+)?)/i)
            };
        } else if(/blackberry|\bbb\d+/i.test(userAgent) || /rim\stablet/i.test(userAgent)) {
            browser = {
                name: "BlackBerry",
                blackberry: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /blackberry[\d]+\/(\d+(\.\d+)?)/i)
            };
        } else if(isWebHPW) {
            browser = {
                name: "WebOS",
                webos: true,
                version: commonVersion || that.detectBrowserVersion(userAgent, /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
            };
            if (/touchpad\//i.test(userAgent)) {
                browser.touchpad = true;
            }
        } else if(/bada/i.test(userAgent)) {
            browser = {
                name: "Bada",
                bada: true,
                version: that.detectBrowserVersion(userAgent, /dolfin\/(\d+(\.\d+)?)/i)
            };
        } else if(isTizen) {
            browser = {
                name: "Tizen",
                tizen: true,
                version: that.detectBrowserVersion(userAgent, /(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || commonVersion
            };
        } else if (/qupzilla/i.test(userAgent)) {
            browser = {
                name: "QupZilla",
                qupzilla: true,
                version: that.detectBrowserVersion(userAgent, /(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || commonVersion
            };
        } else if (/chromium/i.test(userAgent)) {
            browser = {
                name: "Chromium",
                chromium: true,
                version: that.detectBrowserVersion(userAgent, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || commonVersion
            };
        } else if (/chrome|crios|crmo/i.test(userAgent)) {
            browser = {
                name: "Chrome",
                chrome: true,
                version: that.detectBrowserVersion(userAgent, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            };
        } else if(isAndroid) {
            browser = {
                name: "Android",
                version: commonVersion
            };
        } else if(/safari|applewebkit/i.test(userAgent)) {
            browser = {
                name: "Safari",
                safari: true
            };
            if (commonVersion) {
                browser.version = commonVersion;
            }
        } else if(iVersion) {
            browser = {
                name: "iphone" == i ? "iPhone" : "ipad" == i ? "iPad" : "iPod"
            };
            if (commonVersion) {
                browser.version = commonVersion;
            }
        } else if(/googlebot/i.test(userAgent)) {
            browser = {
                name: "Googlebot",
                googlebot: true,
                version: that.detectBrowserVersion(userAgent, /googlebot\/(\d+(\.\d+))/i) || commonVersion
            };
        } else {
            var browserVersionSlice = userAgent.match(/^(.*)\/(.*) /);
            var browserVersion = "";
            if (browserVersionSlice && browserVersionSlice.length > 1) {
                browserVersion = browserVersionSlice[2];
            }
            browser = {
                name: that.detectBrowserVersion(userAgent, /^(.*)\/(.*) /),
                version: browserVersion
            };
        }

        if (!browser.msedge && /(apple)?webkit/i.test(userAgent)) {
            if (/(apple)?webkit\/537\.36/i.test(userAgent)) {
                browser.name = browser.name || "Blink";
                browser.blink = true;
            } else {
                browser.name = browser.name || "Webkit";
                browser.webkit = true;
            }
            if (!browser.version && commonVersion) {
                browser.version = commonVersion;
            }
        } else if (!browser.opera && /gecko\//i.test(userAgent)) {
            browser.name = browser.name || "Gecko";
            browser.gecko = true;
            browser.version = browser.version || that.detectBrowserVersion(userAgent, /gecko\/(\d+(\.\d+)?)/i);

        }

        if (browser.msedge || !isAndroid && !browser.silk) {
            if (iVersion) {
                browser[iVersion] = true;
                browser.ios = true;
            } else if (isMacintosh) {
                browser.mac = true;
            } else if (isXBox) {
                browser.xbox = true;
            } else if (isWindows) {
                browser.windows = true;
            } else if (isLinux) {
                browser.linux = true;
            }
        } else {
            browser.android = true;
        }

        var osVersion = "";
        if (browser.windowsphone) {
            osVersion = that.detectBrowserVersion(userAgent, /windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
        } else if (iVersion) {
            osVersion = that.detectBrowserVersion(userAgent, /os (\d+([_\s]\d+)*) like mac os x/i);
            osVersion = osVersion.replace(/[_\s]/g, ".");
        } else if (isAndroid) {
            osVersion = that.detectBrowserVersion(userAgent, /android[ \/-](\d+(\.\d+)*)/i);
        } else if (browser.webos) {
            osVersion = that.detectBrowserVersion(userAgent, /(?:web|hpw)os\/(\d+(\.\d+)*)/i);
        } else if (browser.blackberry) {
            osVersion = that.detectBrowserVersion(userAgent, /rim\stablet\sos\s(\d+(\.\d+)*)/i);
        } else if (browser.bada) {
            osVersion = that.detectBrowserVersion(userAgent, /bada\/(\d+(\.\d+)*)/i);
        } else if (browser.tizen) {
            osVersion = that.detectBrowserVersion(userAgent, /tizen[\/\s](\d+(\.\d+)*)/i);
        }
        if (osVersion) {
            browser.osversion = osVersion;
        }

        return browser;
    };

    this._getAKServerLink = function() {
        return "https://" + that.akPushConfig.ServerHost;
    }

    this._getAKServerSaveSubscriptionLink = function() {
        return that._getAKServerLink() + "/pixel" + "?" + "_push_pix" + "=" + "/push" + "/subscription" + "/save";
    }

    this._getAKServerDeleteSubscriptionLink = function() {
        return that._getAKServerLink() + "/pixel" + "?" + "_push_pix" + "=" + "/push" + "/subscription" + "/delete";
    }

    this._getAKServerSetCookieLink = function() {
        return that._getAKServerLink() + "/pixel" + "?" + "_push_pix" + "=" + "/set_cookie_only";
    }

    this.sendSubscriptionToServerForSave = function(subscription, match, update, customData) {
        fetch(that._getAKServerSaveSubscriptionLink(), {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(Object.assign({}, customData || {}, {
                'provider': that.Provider,
                'endpoint': subscription.endpoint,
                'resource_token': that.akPushConfig.ResourceToken,
                'match': JSON.stringify(match || {}),
                'update': JSON.stringify(update || {}),
            })),
        })
    };

    this.sendSubscriptionToServerForDelete = function(subscription, match, update, customData) {
        fetch(that._getAKServerDeleteSubscriptionLink(), {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(Object.assign({}, customData || {}, {
                'provider': that.Provider,
                'endpoint': subscription.endpoint,
                'resource_token': that.akPushConfig.ResourceToken,
                'match': JSON.stringify(match || {}),
                'update': JSON.stringify(update || {}),
            })),
        })
    };

    this.setCookieOnly = function(callback) {
        fetch(that._getAKServerSetCookieLink(), {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify({'resource_token': that.akPushConfig.ResourceToken}),
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if ('cookie_id' in data) {
                callback(data['cookie_id']);
            } else {
                console.error('Invalid response for set cookie: ' + data);
            }
        })
        .catch(function(err) {
            console.error('Unable to set cookie');
            console.error(err);
        });
    }


    this.subscribe = function(match, update, customData) {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription) {
                that.sendSubscriptionToServerForSave(subscription, match, update, customData);
            })
            .catch(function(err) {
                if (Notification.permission === 'denied') {
                    console.log('User turned off notifications');
                } else {
                    console.error('Unable to subscribe');
                    console.error(err);
                }
            });
        });
    };

    this.subscribeWithoutBackend = function(callback) { // callback(subscription)
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription) {
                if (typeof callback === 'function') {
                    callback(subscription);
                }
            })
            .catch(function(err) {
                if (Notification.permission === 'denied') {
                    console.log('User turned off notifications');
                } else {
                    console.error('Unable to subscribe');
                    console.error(err);
                }
            });
        });
    };

    this.unsubscribe = function(match, update, customData) {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                if (!subscription) {
                    return;
                }
                that.sendSubscriptionToServerForDelete(subscription, match, update, customData);
                subscription.unsubscribe().then(function(successful) {
                }).catch(function(err) {
                    console.error('Error on unsubscribe trying');
                    console.error(err);
                });
            })
            .catch(function(err) {
                console.error('Unable to unsubscribe');
                console.error(err);
            });
        });
    };

    // Only for Firefox, Chrome and after service worker registration
    this.initialiseState = function(match, update, customData) {
        if ('showNotification' in ServiceWorkerRegistration.prototype) {
            if (Notification.permission !== 'denied') {
                if ('PushManager' in window) {
                    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                        serviceWorkerRegistration.pushManager.getSubscription()
                        .then(function(subscription) {
                            if (!subscription) {
                                that.subscribe(match, update, customData);
                                return;
                            }
                        })
                        .catch(function(err) {
                            console.error('Error on getting subscription data');
                            console.error(err);
                        });
                    });
                } else {
                    console.error('Push-notification is not supported by the browser');
                    return;
                }
            } else {
                console.log('User turned off notifications');
                return;
            }
        } else {
            console.error('Notifications is not supported');
            return;
        }
    };

    // Only for Safari
    this.checkSafariRemotePermission = function(permissionData, match, update, cookieId, customData, callback) { // callback(deviceToken)
        if (permissionData.permission === 'default') {
            window.safari.pushNotification.requestPermission(
                that.akPushConfig.ServerApplePushAPI,
                that.akPushConfig.SafariWebsitePushID,
                Object.assign({}, customData || {}, {
                    'resource_token': that.akPushConfig.ResourceToken,
                    'cookie_id': cookieId,
                    'match': JSON.stringify(match || {}),
                    'update': JSON.stringify(update || {}),
                    'is_test': that.akPushConfig.IsTest,
                }),
                function(permissionData) {
                    that.checkSafariRemotePermission(permissionData, match, update, cookieId, customData, callback);
                }
            );
        }
        else if (permissionData.permission === 'denied') {
            // The user said no.
        }
        else if (permissionData.permission === 'granted') {
            // The web service URL is a valid push provider, and the user said yes.
            // permissionData.deviceToken is now available to use.
            if (typeof callback === 'function') {
                callback(permissionData.deviceToken);
            }
        }
    };

    this._checkingSubscription = function(callback) {
        if (that.Provider === "Chrome" || that.Provider === "Firefox") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register(that.akPushConfig.ServiceWorkerPath)
                .then(function(serviceWorkerRegistration) {
                    serviceWorkerRegistration.pushManager.getSubscription()
                    .then(function(subscription) {
                        if (!subscription) {
                            that.subscribeWithoutBackend(callback);
                            return;
                        } else {
                            if (typeof callback === 'function') {
                                callback(subscription);
                            }
                        }
                    })
                    .catch(function(err) {
                        console.error('Error on getting subscription data');
                        console.error(err);
                    });
                });
            }
        } else if (that.Provider === "Safari" || ('safari' in window && 'pushNotification' in window.safari) ) {
            var permissionData = window.safari.pushNotification.permission(that.akPushConfig.SafariWebsitePushID);
            that.checkSafariRemotePermission(permissionData, {}, {}, "", {}, callback);
        } else {
            console.error("The browser is not supported")
        }
    }

    this.checkingSubscription = function(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            that._checkingSubscription(callback);
        } else {
            window.addEventListener('load', function() {
                akPush._checkingSubscription(callback);
            });
        }
    };

    this._initSubscription = function(match, update, customData) {
        if (that.Provider === "Chrome" || that.Provider === "Firefox") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register(that.akPushConfig.ServiceWorkerPath)
                .then(function() {
                    that.initialiseState(match, update, customData);
                });
            }
        } else if (that.Provider === "Safari" || ('safari' in window && 'pushNotification' in window.safari) ) {
            that.setCookieOnly(function(cookie_id) {
                var permissionData = window.safari.pushNotification.permission(that.akPushConfig.SafariWebsitePushID);
                that.checkSafariRemotePermission(permissionData, match, update, cookie_id, customData);
            });
        } else {
            console.error("The browser is not supported")
        }
    }

    // Use this!
    this.initSubscription = function(match, update, customData) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            that._initSubscription(match, update, customData);
        } else {
            window.addEventListener('load', function() {
                akPush._initSubscription(match, update, customData);
            });
        }
    };

    if ('userAgent' in navigator) {
        var browser = this.detectBrowser(navigator.userAgent);
        if (browser && browser.name) {
            this.Provider = browser.name;
        }
    }
};

// Usage
// try {
//     var akPush = new AKPush()
//     akPush.initSubscription() // Show push subscribe browser popup
//     // ...
// } catch (e) {
//     // ...
// }
