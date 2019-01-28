//store settings
var _settings              = {};
_settings.os               = "iOS";
_settings.documentDensity  = "1x";

var densities              = {};
densities.ios              = {};
densities.ios.list         = ["1x","2x"];
//document resolution [os.list array position]
densities.ios.selected     = 0;
//output [os.list array positions]
//densities.ios.output       = [0,1];

//document resolution [array position]
densities.android          = {};
densities.android.list     = ["M"];
//array position
densities.android.selected = 0;
//output [os.list array positions]
//densities.android.output       = [1,2,3,4];

var outputFileTypes = ["png","jpg","svg"];


//this is only used by the UI to switch on / off the button
function switchOS() 
{
	var target = document.getElementById( "switch_os" );

	if ( target.getAttribute('class').toString() == "hswitch l" )
    {
        //set settings OS specific values
        _settings.os              = "android";
        _settings.documentDensity = densities.android.list[densities.android.selected];

        //update UI
        document.getElementById( "iosSettings" ).classList.remove('show');
        document.getElementById( "iosSettings" ).classList.add('hide');
        document.getElementById( "androidSettings" ).classList.remove('hide');
        document.getElementById( "androidSettings" ).classList.add('show');
        setHSwitch( "switch_os", "ios_lbl", "android_lbl", "r" );
    }
    else
    {
        //set settings OS specific values
        _settings.os              = "iOS";
        _settings.documentDensity = densities.ios.list[densities.ios.selected];

        //update UI
        document.getElementById( "androidSettings" ).classList.remove('show');
        document.getElementById( "androidSettings" ).classList.add('hide');
        document.getElementById( "iosSettings" ).classList.remove('hide');
        document.getElementById( "iosSettings" ).classList.add('show');
        setHSwitch( "switch_os", "ios_lbl", "android_lbl", "l" );   
    }
}

//Set hSwitch appearence
function setHSwitch( target_id, l_lbl_id, r_lbl_id, status ) 
{

	var target      = document.getElementById( target_id );
	var l_label     = document.getElementById( l_lbl_id );
	var r_label     = document.getElementById( r_lbl_id );

	var targetClassStatus = "hswitch " + status.toString();
	target.setAttribute( 'class', targetClassStatus );

	//switch the label focus
	if ( status == "l" ) {
		l_label.setAttribute( 'class', 'l on' ); 
		r_label.setAttribute( 'class', 'r off' ); 
	}
	else {
		l_label.setAttribute( 'class', 'l off' ); 
		r_label.setAttribute( 'class', 'r on' ); 
	}
}

function editSwitchSettings( argId ) {
	try 
    {
        var targetSwitch = document.getElementById(argId);
        if ( targetSwitch.getAttribute('class').toString() == "switch on" )
        {
            _settings[argId] = "off";
            targetSwitch.setAttribute('class',"switch off");
        }
        else
        {
            _settings[argId] = "on";
            targetSwitch.setAttribute('class',"switch on");   
        }
    }
    catch (e)
    {
    	alert( "Ooops. Something went wrong. Please try again.");
    }
}

function switchTargetValue( target ) {
	try {
		var argId = target.getAttribute('id').toString();
		var prevStatus = target.classList.contains('on');

		if( prevStatus === true ) {
			//settings
			_settings[argId] = "off";

			//UI
			target.classList.remove('on');
			target.classList.add('off');
		} else {
			//settings
			_settings[argId] = "on";

			//UI
			target.classList.remove('off');
			target.classList.add('on');
		}
    }
    catch (e) {
    	alert( "Ooops. Something went wrong. Please try again.");
    }

}

function setOutputFileType( os, target ) {
    var direction = target.getAttribute('class').toString();

    function findArrPos( str ) {
        var pos = -1;
        for ( var i = 0; i < outputFileTypes.length; i++ ) {
            if ( str == outputFileTypes[i] ) {
                pos = i;
                break;
            }
        }
        return pos;
    }
    var targetValueId = "";
    
    if ( os == "iOS" ) {
        targetValueId = "ios_output_file_type";
    } else {
        targetValueId = "android_output_file_type";
    }
    var oftStr = document.getElementById(targetValueId).innerHTML;
 
    var currArrPos        = findArrPos( oftStr );
    var nextArrPos;
    if ( direction == "next" ) {
        nextArrPos        = currArrPos + 1;
    } else {
        nextArrPos        = currArrPos - 1;
    }
    if ( nextArrPos >= outputFileTypes.length ) {
        nextArrPos = 0;
    }
    else if ( nextArrPos < 0 ) {
        nextArrPos = ( outputFileTypes.length - 1 );
    }
    document.getElementById(targetValueId).innerHTML = outputFileTypes[nextArrPos];
}

function setCurrentDensity( os, target ) {
	var direction = target.getAttribute('class').toString();

    function findArrPos( os, densityStr ) {
        var pos = -1;
        if ( os == "iOS" ) {
            for ( var i = 0; i < densities.ios.list.length; i++ ) {
                if ( densityStr == densities.ios.list[i] ) {
                    pos = i;
                    break;
                }
            }
        } else {
            for ( var i = 0; i < densities.android.list.length; i++ ) {
                if ( densityStr == densities.android.list[i] ) {
                    pos = i;
                    break;
                }
            }
        }
        return pos;
    }
    //ios
	if ( os == "iOS" ) {  
        var currentDensityStr = document.getElementById("current_density_ios").innerHTML;
        var currArrPos        = findArrPos( "iOS", currentDensityStr );
        var nextArrPos;
        if ( direction == "next" ) {
            nextArrPos        = currArrPos + 1;
        } else {
            nextArrPos        = currArrPos - 1;
        }
        if ( nextArrPos >= densities.ios.list.length ) {
            nextArrPos = 0;
        }
        else if ( nextArrPos < 0 ) {
            nextArrPos = ( densities.ios.list.length - 1 );
        }
        document.getElementById("current_density_ios").innerHTML = densities.ios.list[nextArrPos];
        densities.ios.selected     = nextArrPos;
        _settings.documentDensity  = densities.ios.list[nextArrPos];
	} 
    //android
    else {
        var currentDensityStr = document.getElementById("current_density_android").innerHTML;
        var currArrPos        = findArrPos( "android", currentDensityStr );
        var nextArrPos;
        if ( direction == "next" ) {
            nextArrPos        = currArrPos + 1;
        } else {
            nextArrPos        = currArrPos - 1;
        }
        if ( nextArrPos >= densities.android.list.length ) {
            nextArrPos = 0;
        }
        else if ( nextArrPos < 0 ) {
            nextArrPos = ( densities.android.list.length - 1 );
        }
        document.getElementById("current_density_android").innerHTML = densities.android.list[nextArrPos];
        densities.android.selected = nextArrPos;
        _settings.documentDensity  = densities.android.list[nextArrPos];
	}
}

function getOutputResolutions() {
    var myResolutions = [];
    switch( _settings.os ) {
        case "android":
            if ( document.getElementById("density_l").classList.contains('on') ) {
                myResolutions.push(0);
            }
            if ( document.getElementById("density_m").classList.contains('on') ) {
                myResolutions.push(1);
            }
            if ( document.getElementById("density_h").classList.contains('on') ) {
                myResolutions.push(2);
            }
            if ( document.getElementById("density_x").classList.contains('on') ) {
                myResolutions.push(3);
            }
            if ( document.getElementById("density_xx").classList.contains('on') ) {
                myResolutions.push(4);
            }
        break;
        case "iOS":
            if ( document.getElementById("density_@1x").classList.contains('on') ) {
                myResolutions.push(0);
            }
            if ( document.getElementById("density_@2x").classList.contains('on') ) {
                myResolutions.push(1);
            }
            if ( document.getElementById("density_@3x").classList.contains('on') ) {
                myResolutions.push(2);
            }
        break;
    }
    return myResolutions;  
}

function getDuplicateLayers() {
    var duplicateLayersSwitchVal = "";
    switch( _settings.os ) {
        case "android":
            if ( document.getElementById("duplicate_layers_android").classList.contains('on') ) {
                duplicateLayersSwitchVal = "on";
            } else {
                duplicateLayersSwitchVal = "off";
            }
        break;
        case "iOS":
            if ( document.getElementById("duplicate_layers_ios").classList.contains('on') ) {
                duplicateLayersSwitchVal = "on";
            } else {
                duplicateLayersSwitchVal = "off";
            }
        break;
    }
    return duplicateLayersSwitchVal;
}

//manage call to jsx action -> Oven()
function jsxcall_oven() {
    
    //fetch output resolutions values from switch buttons.
    var outRes = getOutputResolutions();

    //obviously we need at least 1 resolution as output..
    if ( outRes.length == 0 ) {
        return;
    }
    var outResStr = "";
    for ( var i = 0; i < outRes.length; i++ ) {
        outResStr += outRes[i];
        if ( i != ( outRes.length - 1 ) )  {
            outResStr += ",";
        }    
    }

    //get output file type
    var outputFileType = "." + document.getElementById( _settings.os.toLowerCase() + "_output_file_type" ).innerHTML;

    //get duplicateLayers switch value
    var duplicateLayers = getDuplicateLayers();
    
    var paramStr = _settings.os + ";" + _settings.documentDensity + ";" + outResStr + ";" + outputFileType + ";" + duplicateLayers;

    //alert( "$._ext_OVEN.run('" + paramStr + "')" );

    evalScript("$._ext_OVEN.run('" + paramStr + "')");
}