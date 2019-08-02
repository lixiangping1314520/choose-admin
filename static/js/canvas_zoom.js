(function (window, factory) {
    if (typeof define === "function" && define.amd) {
        //AMD
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        //CMD
        module.exports = factory();
    } else {
        //window
        window.CanvasZoom = factory();
    }
})(typeof window !== "undefined" ? window : this, function () {
    var CanvasZoom = function (options) {
        var that = this;
        if (!options || !options.canvas) {
            throw 'CanvasZoom constructor: missing arguments canvas';
        }
        if (!options || !options.mapInfo) {
            throw 'CanvasZoom constructor: missing arguments mapInfo';
        }
        this.options = {
            canvas: null,
            mapInfo: [],
            isFullPage: true,
            desktop: true,
            ratio: {
                x: options.canvas.width,
                y: options.canvas.height
            }
        }
        var mergeOptions = function (userOptions, options) {
            Object.keys(userOptions).forEach(function (key) {
                options[key] = userOptions[key];
            })
        }
        mergeOptions(options, this.options);
        CanvasZoom.prototype.marker = [];
        CanvasZoom.prototype.route = {};
        CanvasZoom.prototype.canvas = options.canvas;

        CanvasZoom.prototype.ctx = this.canvas.getContext("2d");
        var pageWidth = parseInt(this.canvas.getAttribute("width"));
        var pageHeight = parseInt(this.canvas.getAttribute("height"));
        var currentWidth = options.isFullPage ? window.screen.width : parseInt(this.canvas.getAttribute("width"));
        var currentHeight = options.isFullPage ? window.screen.height : parseInt(this.canvas.getAttribute("height"));
        CanvasZoom.prototype.currentWidth = currentWidth;
        CanvasZoom.prototype.currentHeight = currentHeight;
        // var currentWidth = document.documentElement.clientWidth;
        // var currentHeight = document.documentElement.clientHeight;
        CanvasZoom.prototype.scaleAdaption = 1;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        if (pageWidth < pageHeight) { //canvas.width < canvas.height
            CanvasZoom.prototype.scaleAdaption = currentHeight / pageHeight;
            if (pageWidth * this.scaleAdaption > currentWidth) {
                CanvasZoom.prototype.scaleAdaption = this.scaleAdaption * (currentWidth / (this.scaleAdaption * pageWidth));
            }
        } else { //canvas.width >= canvas.height
            CanvasZoom.prototype.scaleAdaption = currentWidth / pageWidth;
            if (pageHeight * this.scaleAdaption > currentHeight) {
                CanvasZoom.prototype.scaleAdaption = this.scaleAdaption * (currentHeight / (this.scaleAdaption * pageHeight));
            }
        }
        this.canvas.setAttribute("width", pageWidth * this.scaleAdaption);
        this.canvas.setAttribute("height", pageHeight * this.scaleAdaption);
        CanvasZoom.prototype.positionAdaption = {
            x: (parseInt(currentWidth) - parseInt(this.canvas.getAttribute("width"))) / 2,
            y: (parseInt(currentHeight) - parseInt(this.canvas.getAttribute("height"))) / 2
        };
        this.canvas.setAttribute("width", currentWidth);
        this.canvas.setAttribute("height", currentHeight);
        CanvasZoom.prototype.position = {
            x: 0,
            y: 0
        };

        CanvasZoom.prototype.scale = {
            x: 1,
            y: 1
        };

        CanvasZoom.prototype.focusPointer = {
            x: 0,
            y: 0
        }

        CanvasZoom.prototype.lastZoomScale = null;
        CanvasZoom.prototype.lastX = null;
        CanvasZoom.prototype.lastY = null;

        CanvasZoom.prototype.mdown = false; // desktop drag

        CanvasZoom.prototype.init = false;

        var baseMapXArr = [];
        var baseMapYArr = [];
        var baseMapMaxX = this.canvas.width;
        var baseMapMaxY = this.canvas.height;
        for (var m = 0; m < options.mapInfo.room.p.length; m++) {
            baseMapXArr.push(options.mapInfo.room.p[m].x);
            baseMapYArr.push(options.mapInfo.room.p[m].y);
        }
        baseMapMaxX = Math.max.apply(null, baseMapXArr);
        baseMapMaxY = Math.max.apply(null, baseMapYArr);
        CanvasZoom.prototype.baseMapRatioX = this.canvas.width / baseMapMaxX;
        CanvasZoom.prototype.baseMapRatioY = this.canvas.height / baseMapMaxY;

        this.checkRequestAnimationFrame();
        requestAnimationFrame(this.animate.bind(this));
        this.setEventListeners();
        this.initZoom = function (scaleX, scaleY, offsetX, offsetY) {
            this.drawRoom(scaleX, scaleY, offsetX, offsetY);
            this.drawModule(scaleX, scaleY, offsetX, offsetY);
        }
        this.setMarker = function (point, option) {
            point.point = JSON.parse(JSON.stringify(point || {}));
            point.x = point.x * this.canvas.width / this.options.ratio.x;
            point.y = point.y * this.canvas.height / this.options.ratio.y;
            point.option = option || {};
            this.marker.push(point);
        }
        this.setRoute = function (point, option) {
            var route = {};
            route.point = JSON.parse(JSON.stringify(point || []));
            for (var i = 0; i < route.point.length; i ++) {
                console.log(route.point)
                route.point[i].x = route.point[i].x * this.canvas.width / this.options.ratio.x;
                route.point[i].y = route.point[i].y * this.canvas.height / this.options.ratio.y;
            }
            route.option = option || {};
            this.route = route;
        }
        this.clearMarker = function () {
            this.marker = [];
        }
        this.removeMarker = function (point) {
            var equal = []
            for (var i = 0; i < this.marker.length; i++) {
                if (this.isObjectValueEqual(this.marker[i].point, point)) {
                    equal.push(this.marker[i]);
                }
            }
            for (var j = 0; j < equal.length; j++) {
                var index = this.marker.indexOf(equal[j]);
                this.marker.splice(index, 1);
            }
        }
        // initZoom();
    }

    CanvasZoom.prototype = {
        baseMapPointMaxMin: function (arr) {
            var XArr = [];
            var YArr = [];
            for (var m = 0; m < arr.length; m++) {
                XArr.push(arr[m].x);
                YArr.push(arr[m].y);
            }
            return {
                xMax: Math.max.apply(null, XArr),
                yMax: Math.max.apply(null, YArr),
                xMin: Math.min.apply(null, XArr),
                yMin: Math.min.apply(null, YArr)
            }
        },
        drawRoom: function (scaleX, scaleY, offsetX, offsetY) {
            this.ctx.beginPath();
            if (this.options.mapInfo.room.color) {
                this.ctx.fillStyle = this.options.mapInfo.room.color;
            }
            this.ctx.moveTo(this.options.mapInfo.room.p[0].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.room.p[0].y * this.baseMapRatioY * scaleY + offsetY);
            for (var a = 1; a < this.options.mapInfo.room.p.length; a++) {
                this.ctx.lineTo(this.options.mapInfo.room.p[a].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.room.p[a].y * this.baseMapRatioY * scaleY + offsetY);
            }
            this.ctx.lineTo(this.options.mapInfo.room.p[0].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.room.p[0].y * this.baseMapRatioY * scaleY + offsetY);
            this.ctx.font = "15px Helvetica";
            this.ctx.strokeStyle = "#666666";
            this.ctx.lineWidth = 1;
            this.ctx.strokeText(this.options.mapInfo.room.title, (this.options.mapInfo.room.p[0].x + this.canvas.width / this.baseMapRatioX / 2) * this.baseMapRatioX * scaleX + offsetX - this.ctx.measureText(this.options.mapInfo.room.title || '').width / 2, (this.options.mapInfo.room.p[0].y + this.canvas.height / this.baseMapRatioY / 2) * this.baseMapRatioY * scaleY + offsetY);
            this.ctx.textAlign = "center";
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
        },
        drawModule: function (scaleX, scaleY, offsetX, offsetY) {
            for (var i = 0; i < this.options.mapInfo.module.length; i++) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.options.mapInfo.module[i].color;
                this.ctx.moveTo(this.options.mapInfo.module[i].p[0].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.module[i].p[0].y * this.baseMapRatioY * scaleY + offsetY);
                for (var a = 1; a < this.options.mapInfo.module[i].p.length; a++) {
                    this.ctx.lineTo(this.options.mapInfo.module[i].p[a].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.module[i].p[a].y * this.baseMapRatioY * scaleY + offsetY);
                }
                this.ctx.lineTo(this.options.mapInfo.module[i].p[0].x * this.baseMapRatioX * scaleX + offsetX, this.options.mapInfo.module[i].p[0].y * this.baseMapRatioY * scaleY + offsetY);
                this.ctx.font = "15px Helvetica";
                this.ctx.strokeStyle = "#666666";
                this.ctx.lineWidth = 1;
                var basePoint = this.baseMapPointMaxMin(this.options.mapInfo.module[i].p);
                this.ctx.strokeText(this.options.mapInfo.module[i].title, (basePoint.xMin + (basePoint.xMax - basePoint.xMin) / 2)  * this.baseMapRatioX* scaleX + offsetX, (basePoint.yMin + (basePoint.yMax - basePoint.yMin) / 2) * this.baseMapRatioY * scaleY + offsetY);
                this.ctx.textAlign = "center";
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }
        },
        isObjectValueEqual: function (a, b) {
            // Of course, we can do it use for in 
            // Create arrays of property names
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);

            // If number of properties is different,
            // objects are not equivalent
            if (aProps.length != bProps.length) {
                return false;
            }

            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];

                // If values of same property are not equal,
                // objects are not equivalent
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }

            // If we made it this far, objects
            // are considered equivalent
            return true;
        },
        drawMarker: function (scaleX, scaleY, offsetX, offsetY) {
            for (var i = 0; i < this.marker.length; i++) {
                this.ctx.lineWidth = (this.marker[i].option.marker || {}).lineWidth || 1;
                this.ctx.strokeStyle = (this.marker[i].option.marker || {}).strokeStyle || '#333';
                this.ctx.fillStyle = (this.marker[i].option.marker || {}).fillStyle || '#333';
                this.ctx.beginPath();
                this.ctx.arc(this.marker[i].x * scaleX + offsetX, this.marker[i].y * scaleY + offsetY, (this.marker[i].option.marker || {}).R || 5, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
                if ((this.marker[i].option.label || {}).show) {
                    this.ctx.lineWidth = 1;
                    this.ctx.fillStyle = (this.marker[i].option.label || {}).fillStyle || '#eee';
                    this.ctx.strokeStyle = (this.marker[i].option.label || {}).strokeStyle || '#666';
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.marker[i].x * scaleX + offsetX - 10 - this.ctx.measureText(this.marker[i].name).width / 2, this.marker[i].y * scaleY + offsetY - 10);
                    this.ctx.lineTo(this.marker[i].x * scaleX + offsetX - 10 - this.ctx.measureText(this.marker[i].name).width / 2, this.marker[i].y * scaleY + offsetY - 30);
                    this.ctx.lineTo(this.marker[i].x * scaleX + offsetX + 10 + this.ctx.measureText(this.marker[i].name).width / 2, this.marker[i].y * scaleY + offsetY - 30);
                    this.ctx.lineTo(this.marker[i].x * scaleX + offsetX + 10 + this.ctx.measureText(this.marker[i].name).width / 2, this.marker[i].y * scaleY + offsetY - 10);
                    this.ctx.lineTo(this.marker[i].x * scaleX + offsetX - 10 - this.ctx.measureText(this.marker[i].name).width / 2, this.marker[i].y * scaleY + offsetY - 10);
                    this.ctx.stroke();
                    this.ctx.fill();
                    this.ctx.beginPath();
                    this.ctx.font = "15px Helvetica";
                    this.ctx.fillStyle = (this.marker[i].option.label || {}).textColor || '#111';
                    this.ctx.lineWidth = 1;
                    this.ctx.textAlign = "center";
                    this.ctx.fillText(this.marker[i].name, this.marker[i].x * scaleX + offsetX, this.marker[i].y * scaleY + offsetY - 15);

                }
            }
        },
        drawRoute: function (scaleX, scaleY, offsetX, offsetY) {
            if ((this.route.point || []).length) {
                for (var i = 0; i < this.route.point.length; i++) {
                    if (i !== this.route.point.length - 1) {
                        this.ctx.lineWidth = (this.route.option.line || {}).lineWidth || 1;
                        this.ctx.strokeStyle = (this.route.option.line || {}).strokeStyle || '#333';
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.route.point[i].x * scaleX + offsetX, this.route.point[i].y * scaleY + offsetY);
                        this.ctx.lineTo(this.route.point[i + 1].x * scaleX + offsetX, this.route.point[i + 1].y * scaleY + offsetY);
                        this.ctx.stroke();
                    }
                    if (this.route.option.marker.show) {
                        this.ctx.lineWidth = (this.route.option.marker || {}).lineWidth || 1;
                        this.ctx.strokeStyle = (this.route.option.marker || {}).strokeStyle || '#333';
                        this.ctx.fillStyle = (this.route.option.marker || {}).fillStyle || '#333';
                        this.ctx.beginPath();
                        this.ctx.arc(this.route.point[i].x * scaleX + offsetX, this.route.point[i].y * scaleY + offsetY, (this.route.option.marker || {}).R || 5, 0, 2 * Math.PI);
                        this.ctx.fill();
                        this.ctx.stroke();
                    }
                }
            }
        },
        initScalePostion: function () {
            this.scale.x = 1;
            this.scale.y = 1;
            this.position.x = 0;
            this.position.y = 0;
        },
        animate: function () {
            // set scale such as image cover all the canvas
            if (!this.init) {
                var scaleRatio = null;
                if (this.canvas.clientWidth > this.canvas.clientHeight) {
                    scaleRatio = this.scale.x;
                } else {
                    scaleRatio = this.scale.y;
                }
                this.scale.x = scaleRatio;
                this.scale.y = scaleRatio;
                CanvasZoom.prototype.init = true;
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // indoor map drawing function
            this.initZoom(this.scale.x * this.scaleAdaption, this.scale.y * this.scaleAdaption, this.position.x + this.positionAdaption.x, this.position.y + this.positionAdaption.y);
            this.drawMarker(this.scale.x * this.scaleAdaption, this.scale.y * this.scaleAdaption, this.position.x + this.positionAdaption.x, this.position.y + this.positionAdaption.y);
            this.drawRoute(this.scale.x * this.scaleAdaption, this.scale.y * this.scaleAdaption, this.position.x + this.positionAdaption.x, this.position.y + this.positionAdaption.y);
            requestAnimationFrame(this.animate.bind(this));
        },
        checkRequestAnimationFrame: function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        },
        enlargeMap: function () {
            var that = this;
            var clientWidth = this.currentWidth;
            var clientHeight = this.currentHeight;
            var counter = 0;
            var avarOffsetX = (clientWidth / 2) / (2.5 - 1);
            var avarOffsetY = (clientHeight / 2) / (2.5 - 1);
            a();

            function a() {
                if (that.scale.x < 2.5) {
                    that.scale.x += 0.03;
                    that.scale.y += 0.03;
                    that.position.x += -avarOffsetX * 0.03;
                    that.position.y += -avarOffsetY * 0.03;
                    counter++;
                    if (counter < 10) {
                        setTimeout(a, 0.001);
                    }
                } else {
                    that.position.x += -(2.5 - that.scale.x) * avarOffsetX;
                    that.position.y += -(2.5 - that.scale.y) * avarOffsetY;
                    that.scale.x = 2.5;
                    that.scale.y = 2.5;
                    // that.position.x = -(clientWidth / 2);
                    // that.position.y = -(clientHeight / 2);
                }
            }
        },
        narrowMap: function () {
            var that = this;
            var clientWidth = this.currentWidth;
            var clientHeight = this.currentHeight;
            var counter = 0;
            var avarOffsetX = (clientWidth / 2) / (2.5 - 1);
            var avarOffsetY = (clientHeight / 2) / (2.5 - 1);
            a();

            function a() {
                if (that.scale.x > 1) {
                    that.scale.x -= 0.03;
                    that.scale.y -= 0.03;
                    that.position.x -= -avarOffsetX * 0.03;
                    that.position.y -= -avarOffsetY * 0.03;
                    counter++;
                    if (counter < 10) {
                        setTimeout(a, 0.001);
                    }
                } else {
                    // that.position.x -= - (that.scale.x - 1) * avarOffsetX;
                    // that.position.y -= - (that.scale.y - 1) * avarOffsetY;
                    that.scale.x = 1;
                    that.scale.y = 1;
                    that.position.x = 0;
                    that.position.y = 0;
                }
            }
        },
        setEventListeners: function () {
            this.canvas.addEventListener('touchstart', function (e) {
                CanvasZoom.prototype.lastX = null;
                CanvasZoom.prototype.lastY = null;
                CanvasZoom.prototype.lastZoomScale = null;
            }.bind(this));
            this.canvas.addEventListener('touchmove', function (e) {
                e.preventDefault();

                if (e.targetTouches.length == 2) { // pinch
                    this.doZoom(this.gesturePinchZoom(e));
                } else if (e.targetTouches.length == 1) { // move
                    var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
                    var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;

                    this.doMove(relativeX, relativeY);
                }
            }.bind(this));

            if (this.options.desktop) {
                // keyboard+mouse
                window.addEventListener('keyup', function (e) {
                    if (e.keyCode == 187 || e.keyCode == 61) { // +
                        this.doZoom(15);
                    } else if (e.keyCode == 189 || e.keyCode == 54) { // -
                        this.doZoom(-15);
                    }
                }.bind(this));

                this.canvas.addEventListener('dblclick', function (e) {
                    e.preventDefault();
                    this.doZoom(55);
                }.bind(this));

                var mousewheelFunc = function (e) {
                    if (e.target == this.canvas) {
                        var direct = 0;
                        e = e || window.event;
                        e.preventDefault();
                        var direct = 0;
                        if (e.wheelDelta) {
                            if (e.wheelDelta > 0) {
                                this.doZoom(15);
                            } else if (e.wheelDelta < 0) {
                                this.doZoom(-15);
                            }
                        } else if (e.detail) {
                            if (e.detail > 0) {
                                this.doZoom(15);
                            } else if (e.detail < 0) {
                                this.doZoom(-15);
                            }
                        }
                    }
                }.bind(this)

                window.addEventListener('mousewheel', mousewheelFunc);
                // window.addEventListener('')

                window.addEventListener('mousedown', function (e) {
                    CanvasZoom.prototype.mdown = true;
                    CanvasZoom.prototype.lastX = null;
                    CanvasZoom.prototype.lastY = null;
                }.bind(this));

                window.addEventListener('mouseup', function (e) {
                    CanvasZoom.prototype.mdown = false;
                }.bind(this));

                window.addEventListener('mousemove', function (e) {
                    var relativeX = e.pageX - this.canvas.getBoundingClientRect().left;
                    var relativeY = e.pageY - this.canvas.getBoundingClientRect().top;

                    if (e.target == this.canvas && this.mdown) {
                        this.doMove(relativeX, relativeY);
                    }

                    if (relativeX <= 0 || relativeX >= this.canvas.clientWidth || relativeY <= 0 || relativeY >= this.canvas.clientHeight) {
                        CanvasZoom.prototype.mdown = false;
                    }
                }.bind(this));
            }
        },
        doZoom: function (zoom) {
            if (!zoom)
                return;
            // new scale
            var that = this;
            var clientWidth = this.currentWidth;
            var clientHeight = this.currentHeight;
            var avarOffsetX = (clientWidth / 2) / (2.5 - 1);
            var avarOffsetY = (clientHeight / 2) / (2.5 - 1);
            var currentScale = this.scale.x;
            var newScale = this.scale.x + zoom / 400;

            if (newScale > 1) {
                if (newScale > 2.5) {
                    newScale = 2.5;
                } else {
                    newScale = this.scale.x + zoom / 400;
                }
            } else {
                newScale = 1;
            }
            var deltaScale = newScale - currentScale;
            // var currentWidth = (this.canvas.width * this.scale.x);
            // var currentHeight = (this.canvas.height * this.scale.y);
            // var deltaWidth = this.canvas.width * deltaScale;
            // var deltaHeight = this.canvas.height * deltaScale;
            // var canvasmiddleX = this.focusPointer.x;
            // var canvasmiddleY = this.focusPointer.y;
            // var xonmap = (-this.position.x) + canvasmiddleX;
            // var yonmap = (-this.position.y) + canvasmiddleY;
            // var coefX = -xonmap / (currentWidth);
            // var coefY = -yonmap / (currentHeight);
            // var newPosX = this.position.x + deltaWidth * coefX;
            // var newPosY = this.position.y + deltaHeight * coefY;
            // // edges cases
            // var newWidth = currentWidth + deltaWidth;
            // var newHeight = currentHeight + deltaHeight;
            // if (newWidth < this.canvas.clientWidth)
            //     return;
            // if (newPosX > 0) {
            //     newPosX = 0;
            // }
            // if (newPosX + newWidth < this.canvas.clientWidth) {
            //     newPosX = this.canvas.clientWidth - newWidth;
            // }

            // if (newHeight < this.canvas.clientHeight)
            //     return;
            // if (newPosY > 0) {
            //     newPosY = 0;
            // }
            // if (newPosY + newHeight < this.canvas.clientHeight) {
            //     newPosY = this.canvas.clientHeight - newHeight;
            // }

            // finally affectations
            this.scale.x = newScale;
            this.scale.y = newScale;
            that.position.x += -deltaScale * avarOffsetX;
            that.position.y += -deltaScale * avarOffsetY;
            if (newScale === 1) {
                that.position.x = 0;
                that.position.y = 0;
            }
            // this.position.x = newPosX;
            // this.position.y = newPosY;
        },
        gesturePinchZoom: function (event) {
            var zoom = false;
            if (event.targetTouches.length >= 2) {
                var p1 = event.targetTouches[0];
                var p2 = event.targetTouches[1];
                this.focusPointer.x = (p1.pageX + p2.pageX) / 2;
                this.focusPointer.y = (p1.pageY + p2.pageY) / 2;
                var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); // euclidian
                if (this.lastZoomScale) {
                    zoom = zoomScale - this.lastZoomScale;
                }
                this.lastZoomScale = zoomScale;
            }
            return zoom;
        },
        doMove: function (relativeX, relativeY) {
            if (this.lastX && this.lastY) {
                var deltaX = relativeX - this.lastX;
                var deltaY = relativeY - this.lastY;

                var currentWidth = (this.canvas.clientWidth * this.scale.x);
                var currentHeight = (this.canvas.clientHeight * this.scale.y);

                this.position.x += deltaX;
                this.position.y += deltaY;

                // edge cases
                if (this.position.x > 0) {
                    this.position.x = 0;
                } else if (this.position.x + currentWidth < this.canvas.clientWidth) {
                    this.position.x = this.canvas.width - currentWidth;
                }
                if (this.position.y > 0) {
                    this.position.y = 0;
                } else if (this.position.y + currentHeight < this.canvas.clientHeight) {
                    this.position.y = this.canvas.height - currentHeight;
                }
            }
            CanvasZoom.prototype.lastX = relativeX;
            CanvasZoom.prototype.lastY = relativeY;
        }
    }
    // CanvasZoom.prototype.marker = [];
    return CanvasZoom;
})