Parse.initialize("vis_exercise_app", "vis_exercise_app");
Parse.serverURL = 'http://visexercise.hkustvis.org/parse'

var dataRecorder = {
    userID: window.userID || userid,
    userAgent: window.navigator.userAgent,
    hasTouch: null,
    OS: navigator.appVersion.match(/\(.+?\)/)[0].replace(/[\(\)]/g, ""),
    Browser: null,
    token: null,
    count: 0,
    framepool: [],
    init: function() {
        dataRecorder.getToken();
        // dataRecorder.getUserId();
        dataRecorder.getTouchable();
        dataRecorder.getBrowser();
    },
    track: function(localevent) {
        /* Collect and send data */
        var track = {};
        track['userid'] = dataRecorder.userID;
        track['osVersion'] = dataRecorder.OS;
        track['browser'] = dataRecorder.Browser;
        track['hastouch'] = dataRecorder.hasTouch;
        track['d_timestamp'] = (new Date()).getTime();
        if (Object.keys(localevent).length > 3) {
            track['d_path'] = dataRecorder.getElementPathByEvent(localevent);
            track["d_source"] = localevent.view.location.href;
            track["d_clientWidth"] = localevent.srcElement.clientWidth;
            track["d_clientHeight"] = localevent.srcElement.clientHeight;
        }
        for (var key in localevent) {
            if (typeof(localevent[key]) != "object") {
                track[key] = localevent[key];
            }
        }
        if (dataRecorder.count == 0) {
            dataRecorder.framepool = [];
        }
        dataRecorder.framepool.push(new Parse.Object("Test_0511", track))
        dataRecorder.count++;
        if (dataRecorder.count > 199) {
            dataRecorder.count = 0;
            dataRecorder.submitData(dataRecorder.framepool);
        }
    },
    submitData: function(parseObjList) {
        Parse.Object.saveAll(parseObjList)
            .then(function(parseObjList) {
                console.log("Success");
            })
            .catch(function(e) {
                alert("Error saving test object!" + e.message);
            });
    },
    getTouchable: function() {
        dataRecorder.hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
    },
    getUserId: function() {
        dataRecorder.userID = window.userID || userid;
    },
    getElementPathByEvent: function(event) {
        if (!event.target) {
            return " "
        }
        var target = event.target;
        var pathstr = "";
        pathstr = "," + target.tagName + "#" + target.id + "." + target.classList.value.replace(/ /g, ".") + pathstr;
        for (; target.parentElement != null;) {
            target = target.parentElement;
            pathstr = "," + target.tagName + "#" + target.id + "." + target.classList.value.replace(/ /g, ".") + pathstr;
        }
        return pathstr.slice(1);
    },
    getToken: function() {
        var metas = document.getElementsByTagName("meta");
        for (var i = 0; i < metas.length; i++) {
            if (metas[i].name == "csrf-token") {
                dataRecorder.token = metas[i].content
                return;
            }
        }
    },
    getBrowser: function() {
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
        dataRecorder.Browser = M.join(' ');
    },
}
dataRecorder.init();
window.addEventListener('unload', function(event) {
    dataRecorder.submitData();
});

var eventLoader = {
    windowFrames: {},
    definedEvents: {
        handleMouseMove: function(event) {
            dataRecorder.track(event)
        },
        handleMouseDown: function(event) {
            dataRecorder.track(event)
        },
        handleMouseUp: function(event) {
            dataRecorder.track(event)
        },
        handleMouseEnter: function(event) {
            dataRecorder.track(event)
        },
        handleMouseLeave: function(event) {
            dataRecorder.track(event)
        },
        handleMouseOut: function(event) {
            dataRecorder.track(event)
        },
        handleMouseClick: function(event) {
            if (!"result" in event) {
                dataRecorder.track(event)
            }
        }
    },
    init: function() {
        // eventLoader.windowFrames[window.location.href] = { "window": window, "document": document, "Y": 0, "X": 0 };
        eventLoader.iframeCheckStart()
            // console.log("load1")
    },
    iframeCheckStart: function() {
        // console.log("load2")
        // setTimeout(() => {
        eventLoader.iframeCheck(window, document);
        // eventLoader.iframeCheckStart();
        // }, 200)
    },
    iframeCheck: function(win, doc) {
        /* Check if iframe exists in a new document*/
        if (win.location && win.location.href && win.location.href.indexOf("http") >= 0) {
            let localFrames = doc.getElementsByTagName("iframe");
            if (!eventLoader.windowFrames[win.location.href]) {
                eventLoader.initWindowEvent(win);
                eventLoader.windowFrames[win.location.href] = {}
                eventLoader.windowFrames[win.location.href]["window"] = win;
                eventLoader.windowFrames[win.location.href]["document"] = doc;
            }
            for (var i = 0; i < localFrames.length; i++) {
                if (localFrames[i].contentWindow && localFrames[i].contentWindow.location.href) {
                    /*  Check if iframe has loaded, if exist, deal with window content */
                    eventLoader.iframeCheck(localFrames[i].contentWindow, localFrames[i].contentDocument)
                }
            }
        }
    },
    initWindowEvent: function(win) {
        /* Add events, collect interaction data */
        win.onmousemove = eventLoader.definedEvents.handleMouseMove;
        win.onclick = eventLoader.definedEvents.handleMouseClick;
        win.onmousedown = eventLoader.definedEvents.handleMouseDown;
        win.onmouseup = eventLoader.definedEvents.handleMouseUp;
        // win.onmousemove = _.throttle(eventLoader.definedEvents.handleMouseMove, 50);
        // win.onclick = _.throttle(eventLoader.definedEvents.handleMouseClick, 50);
        // win.onmousedown = _.throttle(eventLoader.definedEvents.handleMouseDown, 50);
        // win.onmouseup = _.throttle(eventLoader.definedEvents.handleMouseUp, 50);
    }
}
eventLoader.init();