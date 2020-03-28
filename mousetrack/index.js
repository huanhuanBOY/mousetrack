import { collection } from './collection.js';
export var mousetrack = {
    config: {
        ele: null,
        events: ["mousemove", "mousedown", "mouseleave", "mouseenter", "mouseup", "mouseover", "mouseout", "mousewheel"],
    },
    init() {
        if (window.location.href.indexOf("in-class-exercise") > 0) {
            mousetrack.setElement();
            window.addEventListener('unload', function(event) {
                collection.submitData();
            });
        }
    },
    setElement() {
        if (document.getElementsByClassName("cooked") && document.getElementsByClassName("cooked")[0]) {
            mousetrack.config.ele = document.getElementsByClassName("cooked")[0];
            document.getElementsByClassName("cooked")[0].addEventListener("click", function(e) {
                if (document.getElementsByClassName("mfp-img").length > 0) {
                    mousetrack.addEvents(document.getElementsByClassName("mfp-img")[0])
                }
            })
            mousetrack.addEvents(mousetrack.config.ele)
        } else {
            setTimeout(mousetrack.setElement, 200);
        }
    },
    throttle(callback, limit) {
        var tick = false;
        return function() {
            if (!tick) {
                callback.call();
                tick = true;
                setTimeout(function() {
                    tick = false;
                }, limit);
            }
        }
    },
    addEvents(localelement) {
        mousetrack.config.events.forEach(element => {
            if (typeof(element) == "string") {
                localelement.addEventListener(element, function(e) {
                    collection.accumulation(e)
                })
            } else {
                localelement.addEventListener(element, mousetrack.throttle(function(e) {
                    collection.accumulation(e)
                }, element[1]));
            }
        });
    }
}
mousetrack.init()