function onLoaded() {
    var csInterface = new CSInterface();


    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

}

/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {

    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    
    var defaultFontFamily = appSkinInfo.baseFontFamily;
    
    document.body.bgColor = toHex(panelBackgroundColor);

    var styleId = "ppstyle";

    var csInterface = new CSInterface();

    var isPanelThemeLight = panelBackgroundColor.red > 127;
    var fontColor, disabledFontColor;
    var borderColor;
    var inputBackgroundColor;
    var gradientHighlightBg;
    if (isPanelThemeLight) {
        fontColor = "color: #000000;";
        disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
        borderColor = "border-color: " + reverseColor(panelBackgroundColor) + ";";
        inputBackgroundColor = "background-color: " + toHex(panelBackgroundColor, 54) + ";";
        addRule(styleId, "select", "background: url(../img/arr-b.png) center right no-repeat;");
        addRule(styleId, "input[type=checkbox]:checked + label:before", "background-image: url(../img/check-b.png);");
        addRule(styleId, "input[type=radio]:checked + label:before", "background-image: url(../img/radio-b.png);");
        addRule(styleId, "#input_location_submit", "background-image: url(../img/search-b.png);");
        addRule(styleId, "#settings", "background-image: url(../img/settings-b.png);");
        addRule(styleId, "body", "color: #505050;");
    } else {
        fontColor = "color: #ffffff;";
        disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
        borderColor = "border-color: " + reverseColor(panelBackgroundColor, -50) + ";";
        inputBackgroundColor = "background-color: " + toHex(panelBackgroundColor, -20) + ";";
        addRule(styleId, "select", "background: url(../img/arr-w.png) center right no-repeat;");
        addRule(styleId, "input[type=checkbox]:checked + label:before", "background-image: url(../img/check-w.png);");
        addRule(styleId, "input[type=radio]:checked + label:before", "background-image: url(../img/radio-w.png);");
        addRule(styleId, "#input_location_submit", "background-image: url(../img/search-w.png);");
        addRule(styleId, "#settings", "background-image: url(../img/settings-w.png);");
        addRule(styleId, "body", "color: #cbcbcb;");
    }

    addRule(styleId, "body, .info, .settings_pop, button, select, input[type=text], input[type=button], input[type=submit], input[type=number]", "background-color:" + toHex(panelBackgroundColor) + ";");
    addRule(styleId, "body, a, button, select, input[type=text], input[type=button], input[type=submit], input[type=number], label", fontColor);

    addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit], input[type=number], input[type=checkbox] + label:before, input[type=radio] + label:before, .tab", borderColor);
    
    
    addRule(styleId, "button, input[type=button], input[type=submit]", "border-color: " + reverseColor(panelBackgroundColor) + ";");
    
    addRule(styleId, ".tab.active, .tab:hover", "border-color: " + reverseColor(panelBackgroundColor) + ";");
    addRule(styleId, ".tab.active, .tab:hover, button:hover, input[type=button]:hover, input[type=submit]:hover", inputBackgroundColor);
    addRule(styleId, "[disabled]", disabledFontColor);

    addRule(styleId, "input[type=text], input[type=number], select, input[type=checkbox] + label:before, input[type=radio] + label:before", inputBackgroundColor);
//    addRule(styleId, "input[type=text]:focus, input[type=number]:focus", "background-color: #ffffff; outline:0; color: #000000;");
    addRule(styleId, "select:focus", "outline:0; color: #000000;  background: #ffffff url(../img/arr-b.png) center right no-repeat;");
    
    addRule(styleId, "html, body, input, button, select", 'font-family: "' + defaultFontFamily + '", ' + defaultFontFamily + ', Helvetica, Tahoma, Arial, sans-serif;')

}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);

    if (stylesheet) {
        stylesheet = stylesheet.sheet;
        if (stylesheet.addRule) {
            stylesheet.addRule(selector, rule);
        } else if (stylesheet.insertRule) {
            stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
        }
    }
}


function reverseColor(color, delta) {
    return toHex({
        red: Math.abs(255 - color.red),
        green: Math.abs(255 - color.green),
        blue: Math.abs(255 - color.blue)
    }, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with(color) {
            hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
}