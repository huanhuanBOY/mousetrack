setTimeout(function() {
    var script3 = document.createElement('script');
    script3.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js"
    document.body.appendChild(script3);
    var script = document.createElement('script');
    script.text = `
        var screenshot = function(ele) {
            html2canvas(ele).then(canvas => {
                document.body.appendChild(canvas)
                var a = document.createElement('a');
                a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                let n = window.location.href.split("/")
                let name = n[n.length-2]
                a.download = name + '.jpg';
                a.click();
            });
        }
        let svglist = document.getElementsByTagName("svg");
        if (svglist) {
            for (let i = 0; i < svglist.length; i++) {
                let elelist = svglist[i].querySelectorAll("*")
                let checkstyle = ["alignment-baseline", "baseline-shift", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cursor", "direction", "display", "dominant-baseline", "enable-background", "fill", "fill-opacity", "fill-rule", "filter", "flood-color", "flood-opacity", "font-size", "font-size-adjust", "font-stretch", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "image-rendering", "kerning", "letter-spacing", "lighting-color", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "overflow", "pointer-events", "shape-rendering", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-anchor", "text-decoration", "text-rendering", "transform", "unicode-bidi", "vector-effect", "visibility", "word-spacing", "writing-mode"]
                elelist.forEach(element => {
                    let newsty = ""
                    checkstyle.forEach(sty => {
                        if (window.getComputedStyle(element)[sty] && window.getComputedStyle(element)[sty].length > 0) {
                            newsty += sty + ":" + window.getComputedStyle(element)[sty] + ";"
                        }
                    })
                    element.style = newsty
                });
            }
        }
    `
    document.body.appendChild(script);
}, 500);