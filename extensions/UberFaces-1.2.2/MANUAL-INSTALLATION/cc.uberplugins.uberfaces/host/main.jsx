////////////////////////////////////////////
// Check opened documents
////////////////////////////////////////////
function doYouHaveDoc() {
    if (app.documents.length < 1) {
        return false;
    } else {
        return true;
    }
}

////////////////////////////////////////////
// Check selected marquee
////////////////////////////////////////////
function doYouHaveSelectedMarquee() {
    try {
        app.activeDocument.selection.bounds;
        return true;
    } catch (e) {
        return false;
    }
}

////////////////////////////////////////////
// Check background layer
////////////////////////////////////////////
function isBackgroundLayer() {
    return activeDocument.activeLayer.isBackgroundLayer;
}

////////////////////////////////////////////
// Check empty
////////////////////////////////////////////
function isEmpty() {
    var sb = app.activeDocument.activeLayer.bounds,
        sWidth = (Number(sb[2]) - Number(sb[0]));
    if (sWidth < 1) {
        return true;
    } else {
        return false;
    }
}

////////////////////////////////////////////
// Random number generator
////////////////////////////////////////////
function getRandomNumber(layersCount, min, max) {
    var res = [];
    for (var i = 0; i < layersCount; i++) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        res.push(Math.round(rand));
    }
    return res;
}

////////////////////////////////////////////
// Open file
////////////////////////////////////////////
function openF(imgPath) {
    open(File(imgPath));
}

////////////////////////////////////////////
// Translate image to layer position
////////////////////////////////////////////
function moveImageToLayer(sX, sY, imgX, imgY) {
    var deltaX = -1 * (imgX - sX) - 1,
        deltaY = -1 * (imgY - sY) - 1;
    app.activeDocument.activeLayer.translate(deltaX, deltaY);
}

////////////////////////////////////////////
// Apply clipping mask
////////////////////////////////////////////
function createClippingMask() {
    try {
        var idGrpL = charIDToTypeID("GrpL");
        var desc3 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref1 = new ActionReference();
        var idLyr = charIDToTypeID("Lyr ");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref1.putEnumerated(idLyr, idOrdn, idTrgt);
        desc3.putReference(idnull, ref1);
        executeAction(idGrpL, desc3, DialogModes.NO);
    } catch(e) {
        alert(e.line + '\n' + e);
    }
}

////////////////////////////////////////////
// Paste smart object
////////////////////////////////////////////
function pasteSmartObject(imgPath) {
    try {
        var idPlc = charIDToTypeID("Plc ");
        var desc3 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        desc3.putPath(idnull, new File(imgPath));
        var idFTcs = charIDToTypeID("FTcs");
        var idQCSt = charIDToTypeID("QCSt");
        var idQcszero = charIDToTypeID("Qcs0");
        desc3.putEnumerated(idFTcs, idQCSt, idQcszero);
        var idOfst = charIDToTypeID("Ofst");
        var desc4 = new ActionDescriptor();
        var idHrzn = charIDToTypeID("Hrzn");
        var idPxl = charIDToTypeID("#Pxl");
        desc4.putUnitDouble(idHrzn, idPxl, 0);
        var idVrtc = charIDToTypeID("Vrtc");
        var idPxl = charIDToTypeID("#Pxl");
        desc4.putUnitDouble(idVrtc, idPxl, 0);
        desc3.putObject(idOfst, idOfst, desc4);
        executeAction(idPlc, desc3, DialogModes.NO);
    } catch(e) {
        alert(e.line + '\n' + e);
    }
}

////////////////////////////////////////////
// Resize image to layer size
////////////////////////////////////////////
function resizeLayer(sWidth, sHeight) {
    try {
        
        var LB = app.activeDocument.activeLayer.bounds;
        var ww = LB[2].value - LB[0].value;
        var hh = LB[3].value - LB[1].value;
        var lWidth = 100 / ww;
        var lHeight = 100 / hh;
        var NewWidth = lWidth * sWidth;
        var NewHeight = lHeight * sHeight;

        // Plz, kill me for
        if (sWidth == sHeight) {
            if (hh > ww) {
                NewHeight = NewWidth;
            } else {
                NewWidth = NewHeight;
            }
        } else {
            if (sWidth > sHeight) {
                NewHeight = NewWidth;
            } else {
                NewWidth = NewHeight;
            }
        }
        app.activeDocument.activeLayer.resize(Number(NewWidth), Number(NewHeight), AnchorPosition.MIDDLECENTER);
    } catch(e) {
        alert(e.line + '\n' + e);
    }
}



////////////////////////////////////////////
// Get selected layers
////////////////////////////////////////////
function getSelectedLayers() {
    try {
        var lyrs = [];
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
        for (var i = 0; i < targetLayers.count; i++) {
            var lyr = new Object();
            var ref2 = new ActionReference();
            try {
                activeDocument.backgroundLayer;
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex());
                lyr.index = executeActionGet(ref2).getInteger(stringIDToTypeID("itemIndex")) - 1;
            } catch (o) {
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex() + 1);
                lyr.index = executeActionGet(ref2).getInteger(stringIDToTypeID("itemIndex"));
            }
		    lyr.id = executeActionGet(ref2).getInteger(stringIDToTypeID("layerID"));
            try {
                    var bounds = executeActionGet(ref2).getObjectValue(stringIDToTypeID("boundsNoEffects"));
                } catch (o) {
                    var bounds = executeActionGet(ref2).getObjectValue(stringIDToTypeID("bounds"));
                }
                lyr.top = bounds.getDouble(stringIDToTypeID("top"));
                lyr.right = bounds.getDouble(stringIDToTypeID("right"));
                lyr.bottom = bounds.getDouble(stringIDToTypeID("bottom"));
                lyr.left = bounds.getDouble(stringIDToTypeID("left"));
                try {
                    lyr.width = bounds.getDouble(stringIDToTypeID("width"));
                    lyr.height = bounds.getDouble(stringIDToTypeID("height"));
                } catch (e) {
                    lyr.width = bounds.getDouble(stringIDToTypeID("right")) - bounds.getDouble(stringIDToTypeID("left"));
                    lyr.height = bounds.getDouble(stringIDToTypeID("bottom")) - bounds.getDouble(stringIDToTypeID("top"));
                }
            lyrs.push(lyr);
        }
        return lyrs
    } catch (e) {
	  alert(e.line+'\n'+e);
	}
}

////////////////////////////////////////////
// Get count of images in the folder
////////////////////////////////////////////
function getPhotosCount(assetsPath, g) {
    try {
        var folder = new Folder(assetsPath + "/1000faces/" + g + "/");
        var files = folder.getFiles(/\.(jpg|tif|psd|bmp|gif|png|)$/i);
        return files.length;
    } catch(e){
        alert(e.line + '\n' + e);
    }
}


////////////////////////////////////////////
// Add single photo
////////////////////////////////////////////
function startSingle(imgPath) {
    try {
        function placePhoto() {
            if (doYouHaveSelectedMarquee() == true) {
                var sb = app.activeDocument.selection.bounds,
                    sWidth = (Number(sb[2]) - Number(sb[0])) + 2,
                    sHeight = (Number(sb[3]) - Number(sb[1])) + 2;
                pasteSmartObject(imgPath);
                resizeLayer(sWidth, sHeight);
            } else {
                pasteSmartObject(imgPath);
                resizeLayer(200, 200);
            }
        }
        if (doYouHaveDoc() == false) {
            openF(imgPath);
        } else {
            app.activeDocument.suspendHistory("Place userpic", "placePhoto()");
        }
    } catch(e) {
        alert(e.line + '\n' + e);
    }
}

function getArtboardsCount() {
    try {
        var theRef = new ActionReference();
        theRef.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID("artboards"));
        theRef.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        var getDescriptor = new ActionDescriptor();
        getDescriptor.putReference(stringIDToTypeID("null"), theRef);
        var abDesc = executeAction(charIDToTypeID("getd"), getDescriptor, DialogModes.NO).getObjectValue(stringIDToTypeID("artboards"));
        return abDesc.getList(stringIDToTypeID('list')).count;
    } catch (e) {
        return 0
    }
}

function selectLayerById(_id) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putIdentifier(charIDToTypeID('Lyr '), _id);
    desc1.putReference(charIDToTypeID('null'), ref1);
    desc1.putBoolean(charIDToTypeID('MkVs'), true);
    executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
}

function moveCurrentLayerToIndex(_lyrIndex) {
    var desc1 = new ActionDescriptor(), ref1 = new ActionReference(), ref2 = new ActionReference();
    ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc1.putReference(charIDToTypeID('null'), ref1);
    ref2.putIndex(charIDToTypeID('Lyr '), _lyrIndex);
    desc1.putReference(charIDToTypeID('T   '), ref2);
    executeAction(charIDToTypeID('move'), desc1, DialogModes.NO);
}

////////////////////////////////////////////
// Add any photos
////////////////////////////////////////////
function startMulti(selectedGender, imgPath, assetsPath) {
    var startRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    try {
        var randomImageId = [],
            groupedLayers = [],
            wc = (getPhotosCount(assetsPath, "women")) - 1,
            mc = (getPhotosCount(assetsPath, "men")) - 1,
            deltaIndex = 0,
            hasArtboards = getArtboardsCount();

        function placePhotos(groupedLayers, layersCount) {
            var randomMen = getRandomNumber(layersCount, 0, mc);
            var randomWomen = getRandomNumber(layersCount, 0, wc);
            
            for (var i = 0, l = layersCount; i < l; ++i) {
                
                selectLayerById(groupedLayers[i].id);

                if (app.activeDocument.activeLayer.kind == "LayerKind.SOLIDFILL" || app.activeDocument.activeLayer.kind == "LayerKind.NORMAL") {

                    if (isEmpty() == true || isBackgroundLayer() == true) {
                        pasteSmartObject(imgPath);
                        resizeLayer(200, 200);
                    } else {
                        var sb = app.activeDocument.activeLayer.bounds,
                            sX = Number(sb[0]),
                            sY = Number(sb[1]),
                            sWidth = (Number(sb[2]) - Number(sb[0])) + 2,
                            sHeight = (Number(sb[3]) - Number(sb[1])) + 2;
                        pasteSmartObject(imgPath);
                        resizeLayer(sWidth, sHeight);
                        var imgX = app.activeDocument.activeLayer.bounds[0],
                            imgY = app.activeDocument.activeLayer.bounds[1];
                        moveImageToLayer(sX, sY, imgX, imgY);
                        
                        if(hasArtboards) moveCurrentLayerToIndex(groupedLayers[i].index + deltaIndex);
                        deltaIndex++;
                        
                        createClippingMask();
                    }
                } else {
                    pasteSmartObject(imgPath);
                    resizeLayer(200, 200);
                }
                
                if (selectedGender == 'men') {
                    imgPath = assetsPath + "/1000faces/men/" + randomMen[i] + ".jpg";
                }
                if (selectedGender == 'women') {
                    imgPath = assetsPath + "/1000faces/women/" + randomWomen[i] + ".jpg";
                }
                if (selectedGender == 'both') {
                    var both = getRandomNumber(1, 0, 1);
                    if (both == 1) {
                        imgPath = assetsPath + "/1000faces/men/" + randomMen[i] + ".jpg";
                    } else {
                        imgPath = assetsPath + "/1000faces/women/" + randomWomen[i] + ".jpg";
                    }
                }
            }
        }

        if (doYouHaveDoc() == false) {
            openF(imgPath);
        } else {
            groupedLayers = getSelectedLayers();
            var layersCount = groupedLayers.length;
            app.activeDocument.suspendHistory("Place " + layersCount + " userpics", "placePhotos(groupedLayers, layersCount)");
        }
    } catch (e) {
        startSingle(imgPath);
        alert(e.line + '\n' + e);
    }
    app.preferences.rulerUnits = startRulerUnits;
}