/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    var csInterface = new CSInterface();
    var extPath = encodeURI(csInterface.getSystemPath(SystemPath.EXTENSION));

    /* Persistent mode */
    var eventPersistent = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
    eventPersistent.extensionId = csInterface.getExtensionID();
    csInterface.dispatchEvent(eventPersistent);

    /* UI */
    var loader = $("#loader");
    var btn_update = $("#btn_update");
    var input_location = $("#input_location");
    var input_width = $("#input_width");
    var input_height = $("#input_height");
    var input_zoom = $("#input_zoom");
    var input_zoom_slider = $("#input_zoom_slider");
    var checkbox_retina = $('#checkbox_retina');
    var checkbox_shape = $('#checkbox_shape');
    
    $(document).on('click', '.version', function(e){
        e.preventDefault;
        csInterface.openURLInDefaultBrowser('http://uberplugins.cc/');
    });
    
    $(document).on('click', '#apply_settings', function (e) {
        e.preventDefault;
        toggleSettingsPopup();
    });

    $(document).on('click', '#settings', function (e) {
        e.preventDefault;
        toggleSettingsPopup();
    });

    function toggleSettingsPopup() {
        if ($('.settings_pop').hasClass('jump2') == false) {
            $('.settings_pop').removeClass('unjump2');
            $('.settings_pop').addClass('jump2');
        } else {
            $('.settings_pop').removeClass('jump2');
            $('.settings_pop').addClass('unjump2');
        }
    }

    /* Maps */
    var MapCounts = 1;
    var MapsArray = [];
    var MapCountsH = 1;
    var MapCountsV = 1;
    var centerFixW = 0;
    var centerFixH = 0;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var imagesLoaded = 0;


    setTimeout(function () {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDYg_65_UsnysoINx0Nx5j4uuX-4uveqOc&libraries=places&callback=initMap";
        document.body.appendChild(script);
    }, 1000);

    input_zoom.change(function (e) {
        input_zoom_slider.val(input_zoom.val());
    });

    input_zoom_slider.on("input change", function () {
        input_zoom.val(input_zoom_slider.val());
    });

    btn_update.on("click", function (e) {
        e.preventDefault();

        MapCounts = 1;
        MapsArray = [];
        MapCountsH = 1;
        MapCountsV = 1;
        centerFixW = 0;
        centerFixH = 0;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        imagesLoaded = 0;

        btn_update.addClass("progress");
        loader.addClass("show");
        var generateAboveShape = checkbox_shape.is(':checked');

        csInterface.evalScript("getSize('" + extPath + "', '" + generateAboveShape + "')", function (data) {
            var data = data.split(",");
            var isRetina = checkbox_retina.is(':checked');
            var scale = 1;
            
            var selectionWidth = Math.ceil(parseFloat(data[0]));
            var selectionHeight = Math.ceil(parseFloat(data[1]));
            
            if (isRetina) {
                scale = 2;
            }
            
            getGoogleMap(selectionWidth, selectionHeight, scale, function (pathToFile) {
                csInterface.evalScript("placeMap('" + pathToFile + "', '" + scale + "', '" + extPath + "')");
                btn_update.removeClass("progress");
                loader.removeClass("show");
            });
            /*} else {
                getMapQuest(selectionWidth, selectionHeight, mapLocation, mapZoom, function (pathToFile) {
                    csInterface.evalScript("placeMap('" + pathToFile + "', 100)");
                    btn_update.removeClass("progress");
                    loader.removeClass("show");
                });
            }*/
        });

    });

    function getGoogleMap(sw, sh, scale, callback) {
        var mapSettings = {
            "key": "AIzaSyDYg_65_UsnysoINx0Nx5j4uuX-4uveqOc",
            "width": 640,
            "height": 640,
            "zoom": map_work.getZoom()
        };

        if (sw > 2560) sw = 2560;
        if (sh > 1230) sh = 1230;

        var bounds = map_work.getBounds();
        var topLeftLatitude = bounds.f.b;
        var topLeftLongitude = bounds.b.b;
        var bottomRightLatitude = bounds.f.f;
        var bottomRightLongitude = bounds.b.f;

        var newWidth = parseFloat(input_width.val());
        var newHeight = parseFloat(input_height.val());
        if (isNaN(newWidth)) {
            newWidth = sw;
        }
        if (isNaN(newHeight)) {
            newHeight = sh;
        }
        if (newWidth > 0 && newWidth <= 2560) {
            mapSettings.width = newWidth;
        }
        if (newHeight > 0 && newHeight <= 1230) {
            mapSettings.height = newHeight;
        }

        calcMaps({
            tl: [topLeftLatitude, topLeftLongitude],
            cc: [(bottomRightLatitude + (topLeftLatitude - bottomRightLatitude) / 2), (topLeftLongitude + (bottomRightLongitude - topLeftLongitude) / 2)],
            br: [bottomRightLatitude, bottomRightLongitude]
        }, {
            w: mapSettings.width,
            h: mapSettings.height
        }, mapSettings.zoom, scale, function (file) {
            callback(file);
        });
    }

    function calcMaps(_coord, _imgSize, _zoom, _scale, _callback) {
        var defaultSize = 640;
        var MapStepV = 0;
        var MapStepH = 0;

        canvas.height = _imgSize.h;
        canvas.width = _imgSize.w;

        MapCountsH = Math.ceil(_imgSize.w / defaultSize) + 1;
        MapCountsV = 2;
        MapCounts = MapCountsH * MapCountsV;

        centerFixW = ((MapCountsH * (640*_scale)) - _imgSize.w / _scale) / 2;
        centerFixH = ((MapCountsV * (615*_scale)) - _imgSize.h / _scale) / 2;

        function getRightStep(_a, _b) {
            if (_a < 0 && _b < 0 || _a > 0 && _b > 0) {
                return Math.abs(Math.abs(_a) - Math.abs(_b));
            } else {
                return Math.abs(Math.abs(_a) + Math.abs(_b));
            }
        }

        MapStepH = getRightStep(_coord.tl[1], _coord.br[1]);
        MapStepV = getRightStep(_coord.tl[0], _coord.br[0]);

        var tmpv = MapStepV / (640*_scale) * (25*_scale);

        MapStepV = MapStepV - tmpv;

        console.log('MapStepH = ' + MapStepH)
        console.log('MapStepV = ' + MapStepV)
        console.log('MapStepV2 = ' + ((Math.abs(_coord.tl[0]) - Math.abs(_coord.br[0])) / 2))

        var mostLeftLng = 0;
        var mostTopLat = 0;

        if (MapCountsH % 2 == 1) {
            mostLeftLng = _coord.cc[1] - MapStepH * Math.ceil(MapCountsH / 2);
        } else {
            mostLeftLng = _coord.cc[1] - MapStepH * Math.floor(MapCountsH / 2) - (MapStepH / 2);
        }

        if (MapCountsV % 2 == 1) {
            mostTopLat = _coord.cc[0] + MapStepV * Math.floor(MapCountsV / 2);
        } else {
            mostTopLat = _coord.cc[0] + MapStepV * Math.floor(MapCountsV / 2) - (MapStepV / 2);
        }

        var MultiplierH = -1;
        var MultiplierV = -1;
        if (MapCountsH > 1) {
            var row = -1;
        } else {
            var row = 0;
        }

        for (var m = 0; m < (MapCountsV + 1); m++) {
            MapsArray.push([]);
        }

        for (var i = 1; i <= MapCounts; i++) {
            MultiplierH++
            if (i % MapCountsH == 1) {
                MultiplierV++
                MultiplierH = 1;
                row++
            }
            var curLat = mostTopLat - (MapStepV * MultiplierV);
            var curLng = mostLeftLng + (MapStepH * MultiplierH);
            var curImg = loadImage('https://maps.googleapis.com/maps/api/staticmap?center=' + curLat + ',' + curLng + '&zoom=' + _zoom + '&size=640x640&scale=' + _scale + '&maptype=roadmap&key=AIzaSyDYg_65_UsnysoINx0Nx5j4uuX-4uveqOc&format=jpg&visual_refresh=true', addToCanvas, row, _coord.cc[0], _coord.cc[1])

        }

        function addToCanvas(cclat) {
            imagesLoaded++;
            if (imagesLoaded == MapCounts) {
                for (var i = 0; i < MapsArray.length; i++) {
                    for (var ii = 0; ii < MapsArray[i].length; ii++) {
                        ctx.drawImage(MapsArray[i][ii], ((ii * (640*_scale)) - centerFixW), ((i * (615*_scale)) - centerFixH));
                    }
                    if (i == (MapsArray.length - 1)) {
                        var base64Img = canvas.toDataURL('image/jpeg');
                        canvas = null;
                        base64Img = base64Img.substr(22); // Fix image preview
                        var pathToFile = createTempFolder() + "ubermapper_last_map.jpg"
                        window.cep.fs.writeFile(pathToFile, base64Img, cep.encoding.Base64);
                        _callback(pathToFile);
                    }
                }
            }
        }

        function loadImage(src, onloadf, row, cclat, cclng) {
            var img = new Image();
            img.onload = function () {
                onloadf(cclat)
            }
            img.src = src;
            MapsArray[row].push(img);
            return img;
        }
    }

    function createTempFolder() {
        var tmpFolder = '/tmp/uberplugins/'; - 1 < window.navigator.platform.toLowerCase().indexOf('win') && (tmpFolder = csInterface.getSystemPath(SystemPath.USER_DATA) + '/../Local/Temp/uberplugins/');
        window.cep.fs.makedir(tmpFolder);
        return tmpFolder;
    }

}());