importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js');

var isFirebase = true || "fasle";

var config = {
    apiKey: "AIzaSyCLQ_OuvTKdWvqEFz2lr0Or3hkuuElJFTY" ,
    authDomain:"testprojegor.firebaseapp.com",
    databaseURL: "https://testprojegor.firebaseio.com",
    projectId: "testprojegor",
    storageBucket: "testprojegor.appspot.com",
    messagingSenderId: "1097077474911" 
};
firebase.initializeApp(config);

self.addEventListener('install', function(event) {
    console.log("Install service worker script");
});

self.addEventListener('fetch', function(event) {
    console.log("Fetch service worker script");
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(
    function (payload) {
        console.log("On message: ", payload);
        var title = payload.data.title;
        var notificationOptions = {
            body: payload.data.message,
            icon: payload.data.icon,
            click_action: payload.data.action
        };
        return self.registration.showNotification(title, options);
    }
);


if (!isFirebase) {
self.addEventListener('push', function(event) {
    // console.log('Push-notification has been received');
    // console.log(event);
    event.waitUntil(
        self.registration.pushManager.getSubscription().then(function(subscription) {
            var provider = ""
            if ('userAgent' in navigator) {
                var browser = detectBrowser(navigator.userAgent);
                if (browser && browser.name) {
                    provider = browser.name;
                }
            }
            return fetch(getAKServerPushContentGetSubscriptionLink(), {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify({
                    'provider': provider,
                    'endpoint': subscription.endpoint,
                    'resource_token': "i7UodZgh3fL-c99861b55eb332f1",
                })
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.error('Error on getting push content');
                    console.error(response.status);
                    throw new Error();
                }

                return response.json().then(function(data) {
                    if (data.error) {
                        console.error('The server returns an error');
                        console.error(data.error);
                        throw new Error();
                    }

                    var title = data.data.title;
                    var body = data.data.body;
                    var icon = data.data.icon;
                    var tag = data.data.tag;
                    var data = data.data.data;

                    return self.registration.showNotification(title, {
                        body: body,
                        icon: icon,
                        tag: tag,
                        data: data
                    });
                });
            })
            .catch(function(err) {
                console.error('Unable to receive data from server');
                console.error(err);
            })
        })
    );
  });
}

self.addEventListener('notificationclick', function(event) {
    // console.log('User has clicked in the notification');
    // console.log(event.notification.tag);
    if (event.notification.tag === 'user_visible_auto_notification' || !event.notification.data) {
        return;
    }
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function(clientList) {
            var provider = ""
            if ('userAgent' in navigator) {
                var browser = detectBrowser(navigator.userAgent);
                if (browser && browser.name) {
                    provider = browser.name;
                }
            }
            var url = event.notification.data;
            url = url + "?provider=" + provider;
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );

});

var detectBrowserVersion = function(userAgent, regexp) {
    var browserVersionSlice = userAgent.match(regexp);
    var browserVersion = "";
    if (browserVersionSlice && browserVersionSlice.length > 1) {
        browserVersion = browserVersionSlice[1];
    }
    return browserVersion;
};

var detectBrowser = function(userAgent) {
    var commonVersion = detectBrowserVersion(userAgent, /version\/(\d+(\.\d+)?)/i);
    var edgeVersion = detectBrowserVersion(userAgent, /edge\/(\d+(\.\d+)?)/i);
    var iVersion = detectBrowserVersion(userAgent, /(ipod|iphone|ipad)/i).toLowerCase();
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
            version: commonVersion || detectBrowserVersion(userAgent, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
        };
    } else if (/opr|opios/i.test(userAgent)) {
        browser = {
            name: "Opera",
            opera: true,
            version: detectBrowserVersion(userAgent, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || commonVersion
        };
    } else if (/SamsungBrowser/i.test(userAgent)) {
        browser = {
            name: "Samsung Internet for Android",
            samsungBrowser: true,
            version: commonVersion || detectBrowserVersion(userAgent, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
        };
    } else if (/coast/i.test(userAgent)) {
        browser = {
            name: "Opera Coast",
            coast: true,
            version: commonVersion || detectBrowserVersion(userAgent, /(?:coast)[\s\/](\d+(\.\d+)?)/i)
        };
    } else if (/yabrowser/i.test(userAgent)) {
        browser = {
            name: "Yandex Browser",
            yandexbrowser: true,
            version: commonVersion || detectBrowserVersion(userAgent, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
        };
    } else if (/ucbrowser/i.test(userAgent)) {
        browser = {
            name: "UC Browser",
            ucbrowser: true,
            version: detectBrowserVersion(userAgent, /(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
        };
    } else if (/mxios/i.test(userAgent)) {
        browser = {
            name: "Maxthon",
            maxthon: true,
            version: detectBrowserVersion(userAgent, /(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
        };
    } else if (/epiphany/i.test(userAgent)) {
        browser = {
            name: "Epiphany",
            epiphany: true,
            version: detectBrowserVersion(userAgent, /(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
        };
    } else if (/puffin/i.test(userAgent)) {
        browser = {
            name: "Puffin",
            puffin: true,
            version: detectBrowserVersion(userAgent, /(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
        };
    } else if(/sleipnir/i.test(userAgent)) {
        browser = {
            name: "Sleipnir",
            sleipnir: true,
            version: detectBrowserVersion(userAgent, /(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
        };
    } else if(/k-meleon/i.test(userAgent)) {
        browser = {
            name: "K-Meleon",
            kMeleon: true,
            version: detectBrowserVersion(userAgent, /(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
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
            browser.version = detectBrowserVersion(userAgent, /iemobile\/(\d+(\.\d+)?)/i);
        }
    } else if(/msie|trident/i.test(userAgent)) {
        browser = {
            name: "Internet Explorer",
            msie: true,
            version: detectBrowserVersion(userAgent, /(?:msie |rv:)(\d+(\.\d+)?)/i)
        };
    } else if(/CrOS/.test(userAgent)) {
        browser = {
            name: "Chrome",
            chromeos: true,
            chromeBook: true,
            chrome: true,
            version: detectBrowserVersion(userAgent, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
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
            version: detectBrowserVersion(userAgent, /vivaldi\/(\d+(\.\d+)?)/i) || commonVersion
        };
    } else if(isSailfish) {
        browser = {
            name: "Sailfish",
            sailfish: true,
            version: detectBrowserVersion(userAgent, /sailfish\s?browser\/(\d+(\.\d+)?)/i)
        };
    } else if(/seamonkey\//i.test(userAgent)) {
        browser = {
            name: "SeaMonkey",
            seamonkey: true,
            version: detectBrowserVersion(userAgent, /seamonkey\/(\d+(\.\d+)?)/i)
        };
    } else if(/firefox|iceweasel|fxios/i.test(userAgent)) {
        browser = {
            name: "Firefox",
            firefox: true,
            version: detectBrowserVersion(userAgent, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
        };
        if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(userAgent)) {
            browser.firefoxos = true;
        }
    } else if(isSilk) {
        browser = {
            name: "Amazon Silk",
            silk: true,
            version: detectBrowserVersion(userAgent, /silk\/(\d+(\.\d+)?)/i)
        };
    } else if(/phantom/i.test(userAgent)) {
        browser = {
            name: "PhantomJS",
            phantom: true,
            version: detectBrowserVersion(userAgent, /phantomjs\/(\d+(\.\d+)?)/i)
        };
    } else if(/slimerjs/i.test(userAgent)) {
        browser = {
            name: "SlimerJS",
            slimer: true,
            version: detectBrowserVersion(userAgent, /slimerjs\/(\d+(\.\d+)?)/i)
        };
    } else if(/blackberry|\bbb\d+/i.test(userAgent) || /rim\stablet/i.test(userAgent)) {
        browser = {
            name: "BlackBerry",
            blackberry: true,
            version: commonVersion || detectBrowserVersion(userAgent, /blackberry[\d]+\/(\d+(\.\d+)?)/i)
        };
    } else if(isWebHPW) {
        browser = {
            name: "WebOS",
            webos: true,
            version: commonVersion || detectBrowserVersion(userAgent, /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
        };
        if (/touchpad\//i.test(userAgent)) {
            browser.touchpad = true;
        }
    } else if(/bada/i.test(userAgent)) {
        browser = {
            name: "Bada",
            bada: true,
            version: detectBrowserVersion(userAgent, /dolfin\/(\d+(\.\d+)?)/i)
        };
    } else if(isTizen) {
        browser = {
            name: "Tizen",
            tizen: true,
            version: detectBrowserVersion(userAgent, /(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || commonVersion
        };
    } else if (/qupzilla/i.test(userAgent)) {
        browser = {
            name: "QupZilla",
            qupzilla: true,
            version: detectBrowserVersion(userAgent, /(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || commonVersion
        };
    } else if (/chromium/i.test(userAgent)) {
        browser = {
            name: "Chromium",
            chromium: true,
            version: detectBrowserVersion(userAgent, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || commonVersion
        };
    } else if (/chrome|crios|crmo/i.test(userAgent)) {
        browser = {
            name: "Chrome",
            chrome: true,
            version: detectBrowserVersion(userAgent, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
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
            version: detectBrowserVersion(userAgent, /googlebot\/(\d+(\.\d+))/i) || commonVersion
        };
    } else {
        var browserVersionSlice = userAgent.match(/^(.*)\/(.*) /);
        var browserVersion = "";
        if (browserVersionSlice && browserVersionSlice.length > 1) {
            browserVersion = browserVersionSlice[2];
        }
        browser = {
            name: detectBrowserVersion(userAgent, /^(.*)\/(.*) /),
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
        browser.version = browser.version || detectBrowserVersion(userAgent, /gecko\/(\d+(\.\d+)?)/i);

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
        osVersion = detectBrowserVersion(userAgent, /windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (iVersion) {
        osVersion = detectBrowserVersion(userAgent, /os (\d+([_\s]\d+)*) like mac os x/i);
        osVersion = osVersion.replace(/[_\s]/g, ".");
    } else if (isAndroid) {
        osVersion = detectBrowserVersion(userAgent, /android[ \/-](\d+(\.\d+)*)/i);
    } else if (browser.webos) {
        osVersion = detectBrowserVersion(userAgent, /(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (browser.blackberry) {
        osVersion = detectBrowserVersion(userAgent, /rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (browser.bada) {
        osVersion = detectBrowserVersion(userAgent, /bada\/(\d+(\.\d+)*)/i);
    } else if (browser.tizen) {
        osVersion = detectBrowserVersion(userAgent, /tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
        browser.osversion = osVersion;
    }

    return browser;
};

var getAKServerLink = function() {
    return "https://" + "ssl.egor.local";
}

var getAKServerPushContentGetSubscriptionLink = function() {
    return getAKServerLink() + "/push" + "/content" + "/get";
}
