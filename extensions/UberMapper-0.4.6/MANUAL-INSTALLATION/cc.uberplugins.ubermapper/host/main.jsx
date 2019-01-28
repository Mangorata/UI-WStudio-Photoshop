try {

    function getSize(_pathToExtFolder, _generateAboveShape) {
        var doc = app.activeDocument;
        var selectionBounds = hasSelection();

        if (selectionBounds == undefined) {
            var curLayer = app.activeDocument.activeLayer;
            if (_generateAboveShape == 'true' && !curLayer.isBackgroundLayer && curLayer.kind == LayerKind.SOLIDFILL && hasVectorMask(curLayer)) {
                makeSelectionFromShape();
                selectionBounds = hasSelection();
            } else {
                pastePlaceholder(_pathToExtFolder + "/img/placeholder.psd");
                transform(100);
                makeSelectionFromShape();
                deleteLayer();
                selectionBounds = hasSelection();
            }
        }

        return selectionBounds
    }

    function placeMap(_src, _s, _pathToExtFolder) {
        var psSelectionBounds, selectionBottom, selectionLeft, selectionTop, selectionRight;
        var _scale = parseFloat(_s);
        var img_google_pin = _pathToExtFolder + "/img/google_pin.png";
        var img_google_logo = _pathToExtFolder + "/img/google_logo.png";
        var img_google_control_zoom = _pathToExtFolder + "/img/google_control_zoom.png";
        var img_google_copyright = _pathToExtFolder + "/img/google_copyright.png";
        var doc = app.activeDocument;
        var mapLayers = [];

        if (_scale == 2) {
            img_google_pin = _pathToExtFolder + "/img/google_pin@2x.png";
            img_google_logo = _pathToExtFolder + "/img/google_logo@2x.png";
            img_google_control_zoom = _pathToExtFolder + "/img/google_control_zoom@2x.png";
            img_google_copyright = _pathToExtFolder + "/img/google_copyright@2x.png";
        }

        doc.suspendHistory('New Google Map', 'startScript()');

        function startScript() {
            pasteSmartObject(_src, 100);
            mapLayers.push(doc.activeLayer.id);
            setSelectionToTransparencyChannel();

            psSelectionBounds = app.activeDocument.selection.bounds;
            selectionLeft = psSelectionBounds[0].as('px');
            selectionTop = psSelectionBounds[1].as('px');
            selectionRight = psSelectionBounds[2].as('px');
            selectionBottom = psSelectionBounds[3].as('px');

            pasteSmartObject(img_google_pin, 100);
            mapLayers.push(doc.activeLayer.id);

            makeSelection({
                'top': selectionBottom - (25 * _scale),
                'right': selectionLeft + (70 * _scale),
                'bottom': selectionBottom - (1 * _scale),
                'left': selectionLeft + (5 * _scale)
            });

            pasteSmartObject(img_google_logo, 100);
            mapLayers.push(doc.activeLayer.id);

            makeSelection({
                'top': selectionBottom - (80 * _scale),
                'right': selectionRight - (8 * _scale),
                'bottom': selectionBottom - (22 * _scale),
                'left': selectionRight - (40 * _scale)
            });

            pasteSmartObject(img_google_control_zoom, 100);
            mapLayers.push(doc.activeLayer.id);

            makeSelection({
                'top': selectionBottom - (14 * _scale),
                'right': selectionRight,
                'bottom': selectionBottom,
                'left': selectionRight - (287 * _scale)
            });

            pasteSmartObject(img_google_copyright, 100);
            mapLayers.push(doc.activeLayer.id);


            selectLayersById(mapLayers);

            makeGroupFromActiveLayers("Google Map");
        }


    }

    function hasSelection() {
        try {
            var sel = app.activeDocument.selection.bounds
            return [sel[2].as('px') - sel[0].as('px'), sel[3].as('px') - sel[1].as('px')]
        } catch (e) {
            return undefined
        }
    }

    function pastePlaceholder(_placeholder) {
        var desc1 = new ActionDescriptor();
        desc1.putPath(charIDToTypeID('null'), new File(_placeholder));
        desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSAverage"));
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0);
        desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0);
        desc1.putObject(charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc2);
        desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), 100);
        desc1.putUnitDouble(charIDToTypeID('Hght'), charIDToTypeID('#Prc'), 100);
        desc1.putBoolean(charIDToTypeID('Lnkd'), false);
        desc1.putBoolean(stringIDToTypeID('unwrapLayers'), true);
        executeAction(charIDToTypeID('Plc '), desc1, DialogModes.NO);
    }

    function transform(_scale) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc1.putReference(charIDToTypeID('null'), ref1);
        desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSCorner0"));
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0);
        desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0);
        desc1.putObject(charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc2);
        desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), _scale);
        desc1.putUnitDouble(charIDToTypeID('Hght'), charIDToTypeID('#Prc'), _scale);
        desc1.putBoolean(charIDToTypeID('Lnkd'), false);
        desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID('Bcbc'));
        try {
            executeAction(charIDToTypeID('Trnf'), desc1, DialogModes.ALL);
        } catch (e) {
            executeAction(charIDToTypeID('Trnf'), desc1, DialogModes.NO);
        }
    }

    function pasteSmartObject(pathToFile, scale) {
        switchResizeDuringPlace(false);
        var desc1 = new ActionDescriptor();
        desc1.putPath(charIDToTypeID('null'), new File(pathToFile));
        desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSAverage"));
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0);
        desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0);
        desc1.putObject(charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc2);
        desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), scale);
        desc1.putUnitDouble(charIDToTypeID('Hght'), charIDToTypeID('#Prc'), scale);
        desc1.putBoolean(charIDToTypeID('Lnkd'), false);
        executeAction(charIDToTypeID('Plc '), desc1, DialogModes.NO);
        switchResizeDuringPlace(true);
    }

    function switchResizeDuringPlace(_bool) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('GnrP'));
        ref1.putEnumerated(charIDToTypeID('capp'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc1.putReference(charIDToTypeID('null'), ref1);
        var desc2 = new ActionDescriptor();
        desc2.putBoolean(stringIDToTypeID("resizePastePlace"), _bool);
        desc1.putObject(charIDToTypeID('T   '), charIDToTypeID('GnrP'), desc2);
        executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);
    }

    function setSelectionToTransparencyChannel() {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(charIDToTypeID('Chnl'), stringIDToTypeID("selection"));
        desc1.putReference(charIDToTypeID('null'), ref1);
        var ref2 = new ActionReference();
        ref2.putEnumerated(charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Trsp'));
        desc1.putReference(charIDToTypeID('T   '), ref2);
        executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);
    }

    function makeSelection(_bounds) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(charIDToTypeID('Chnl'), stringIDToTypeID("selection"));
        desc1.putReference(charIDToTypeID('null'), ref1);
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(charIDToTypeID('Top '), charIDToTypeID('#Pxl'), _bounds.top);
        desc2.putUnitDouble(charIDToTypeID('Left'), charIDToTypeID('#Pxl'), _bounds.left);
        desc2.putUnitDouble(charIDToTypeID('Btom'), charIDToTypeID('#Pxl'), _bounds.bottom);
        desc2.putUnitDouble(charIDToTypeID('Rght'), charIDToTypeID('#Pxl'), _bounds.right);
        desc1.putObject(charIDToTypeID('T   '), charIDToTypeID('Rctn'), desc2);
        executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);
    }

    function makeSelectionFromShape() {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(charIDToTypeID('Chnl'), stringIDToTypeID("selection"));
        desc1.putReference(charIDToTypeID('null'), ref1);
        var ref2 = new ActionReference();
        ref2.putEnumerated(charIDToTypeID('Path'), charIDToTypeID('Path'), stringIDToTypeID("vectorMask"));
        ref2.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc1.putReference(charIDToTypeID('T   '), ref2);
        desc1.putInteger(charIDToTypeID('Vrsn'), 1);
        desc1.putBoolean(stringIDToTypeID("vectorMaskParams"), true);
        executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);
    }

    function deleteLayer() {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc1.putReference(charIDToTypeID('null'), ref1);
        executeAction(charIDToTypeID('Dlt '), desc1, DialogModes.NO);
    }

    function makeGroupFromActiveLayers(_name) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putClass(stringIDToTypeID("layerSection"));
        desc1.putReference(charIDToTypeID('null'), ref1);
        var ref2 = new ActionReference();
        ref2.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc1.putReference(charIDToTypeID('From'), ref2);
        var desc2 = new ActionDescriptor();
        desc2.putString(charIDToTypeID('Nm  '), _name);
        desc1.putObject(charIDToTypeID('Usng'), stringIDToTypeID("layerSection"), desc2);
        desc1.putString(charIDToTypeID('Nm  '), _name);
        executeAction(charIDToTypeID('Mk  '), desc1, DialogModes.NO);
    }

    function selectLayersById(_arrayOfIds) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        for (var i = 0; i < _arrayOfIds.length; i++) {
            ref1.putIdentifier(charIDToTypeID('Lyr '), _arrayOfIds[i]);
        }
        desc1.putReference(charIDToTypeID('null'), ref1);
        desc1.putBoolean(charIDToTypeID('MkVs'), false);
        executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
    }

    function createClippingMask() {
        var desc3 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc3.putReference(charIDToTypeID("null"), ref1);
        executeAction(charIDToTypeID("GrpL"), desc3, DialogModes.NO);
    }

    function hasVectorMask(curLayer) {
        var lvm = true;
        var pmd;
        try {
            pmd = curLayer.vectorMaskDensity;
            curLayer.vectorMaskDensity = 50.0;
            curLayer.vectorMaskDensity = pmd;
        } catch (e) {
            lvm = false
        }
        return lvm;
    }

} catch (e) {
    alert(e.line + '\n' + e)
}