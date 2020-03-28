Parse.initialize("vis_exercise_app", "vis_exercise_app");
Parse.serverURL = 'http://visexercise.hkustvis.org/parse'
export var collection = {
    pool: [],
    poolsize: 199,
    static: {},
    init: function() {
        collection.getTouchable();
        collection.getBrowser();
        collection.getOS();
    },
    accumulation(localevent) {
        let track = collection.defAttributes(localevent)
        for (var key in localevent) {
            if (typeof(localevent[key]) != "object") {
                track[key] = localevent[key];
            }
        }
        collection.pool.push(new Parse.Object("bbs", track))
        if (collection.pool.length >= collection.poolsize) {
            collection.submitData(collection.pool);
            collection.pool = []
        }
    },
    submitData(parseObjList) {
        Parse.Object.saveAll(parseObjList)
            .then(function() {
                console.log("Success");
            })
            .catch(function(e) {
                alert("Error saving test object!" + e.message);
            });
    },
    defAttributes(localevent) {
        let track = {}
        track['d_path'] = collection.getElementPathByEvent(localevent);
        // track['d_userid'] = collection.static.userID;
        track['d_osVersion'] = collection.static.OS;
        track['d_browser'] = collection.static.Browser;
        track['d_hastouch'] = collection.static.hasTouch;
        track['d_timestamp'] = (new Date()).getTime();
        track["d_source"] = localevent.view.location.href;
        track["d_clientWidth"] = localevent.srcElement.clientWidth;
        track["d_clientHeight"] = localevent.srcElement.clientHeight;
        return track;
    },
    getTouchable: function() {
        collection.hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
    },
    getElementPathByEvent: function(event) {
        var target = event.target;
        var pathstr = "";
        pathstr = "," + target.tagName + "#" + target.id + "." + target.classList.value.replace(/ /g, ".") + pathstr;
        for (; target.parentElement != null;) {
            target = target.parentElement;
            pathstr = "," + target.tagName + "#" + target.id + "." + target.classList.value.replace(/ /g, ".") + pathstr;
        }
        return pathstr.slice(1);
    },
    getOS: function() {
        collection.static.OS = navigator.appVersion.match(/\(.+?\)/)[0].replace(/[\(\)]/g, "");
    },
    getBrowser: function() {
        /* Browser name */
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        collection.Browser = M.join(' ');
    }
}
collection.init()