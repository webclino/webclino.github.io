var watchID;

function appInit() {
    getLocation();
   // getOrienation();
}

appInit();
//EventListner Bindings to the UI

function initUI() {
    var lockerbuttons = document.getElementsByClassName("lockerbutton");
    for (var i = 0; i < lockerbuttons.length; i++)
        lockerbuttons[i].addEventListener("click", toggleLocks);
    document.getElementById("editLatLon").addEventListener("click", toggleLocation);
}

initUI();

//Location Functions

function toggleLocation() {

    if (document.querySelector("#editLatLon i").innerHTML === "location_off") {
        getLocation();
        console.log("getlocation");
        notification.MaterialSnackbar.showSnackbar({
            message: "WebClino is tracking your device's GPS Location "
        });
    }
    if (document.querySelector("#editLatLon i").innerHTML === "location_on") {
        stopLocation();
        console.log("stoplocation");
        document.getElementById("Accpl").innerHTML = "Location not taken from device";
        document.getElementById("Accln").innerHTML = "Location not taken from device";
        notification.MaterialSnackbar.showSnackbar({
            message: "WebClino has stopped tracking your device's GPS Location"
        });
    }
    toggleEditLoc();
}


function showLocError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("Accpl").innerHTML = "User denied the request for Geolocation.";
            document.getElementById("Accln").innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("Accpl").innerHTML = "Location information is unavailable.";
            document.getElementById("Accln").innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("Accpl").innerHTML = "The request to get user location timed out.";
            document.getElementById("Accln").innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("Accpl").innerHTML = "An unknown error occurred.";
            document.getElementById("Accln").innerHTML = "An unknown error occurred.";
            break;
    }
}

function showPosition(position) {

    document.getElementById("Planelat").parentNode.classList.add("is-dirty");
    document.getElementById("Planelon").parentNode.classList.add("is-dirty");
    document.getElementById("Linelat").parentNode.classList.add("is-dirty");
    document.getElementById("Linelon").parentNode.classList.add("is-dirty");

    document.getElementById("Planelat").value = position.coords.latitude;
    document.getElementById("Planelon").value = position.coords.longitude;
    document.getElementById("Linelat").value = position.coords.latitude;
    document.getElementById("Linelon").value = position.coords.longitude;
    document.getElementById("Accpl").innerHTML = position.coords.accuracy;
    document.getElementById("Accln").innerHTML = position.coords.accuracy;
}

function getLocation() {
    var options = {
        enableHighAccuracy: true, // Hint to try to use true GPS instead of other location proxies like WiFi or cell towers
        timeout: 50000, // Maximum number of milliseconds to wait before timing out
        maximumAge: Infinity // Maximum of milliseconds since last position fix
    };
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(showPosition, showLocError, options)
    } else {
        document.getElementById("Accpn").innerHTML = "Geolocation is not supported by this browser.";
        document.getElementById("Accln").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function stopLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchID);
    }
}


//Orienation Functions
var gn = new GyroNorm();

var args = {
    frequency: 50, // ( How often the object sends the values - milliseconds )
    gravityNormalized: true, // ( If the garvity related values to be normalized )
    orientationBase: GyroNorm.WORLD, // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
    decimalCount: 2, // ( How many digits after the decimal point will there be in the return values )
    logger: null, // ( Function to be called to log messages from gyronorm.js )
    screenAdjusted: false // ( If set to true it will return screen adjusted values. )
};

var gn = new GyroNorm();



gn.init(args).then(function () {
    gn.start(function (data) {
        // Process:
        // data.do.alpha    ( deviceorientation event alpha value )
        // data.do.beta     ( deviceorientation event beta value )
        // data.do.gamma    ( deviceorientation event gamma value )
        // data.do.absolute ( deviceorientation event absolute value )

        // data.dm.x        ( devicemotion event acceleration x value )
        // data.dm.y        ( devicemotion event acceleration y value )
        // data.dm.z        ( devicemotion event acceleration z value )

        // data.dm.gx       ( devicemotion event accelerationIncludingGravity x value )
        // data.dm.gy       ( devicemotion event accelerationIncludingGravity y value )
        // data.dm.gz       ( devicemotion event accelerationIncludingGravity z value )

        // data.dm.alpha    ( devicemotion event rotationRate alpha value )
        // data.dm.beta     ( devicemotion event rotationRate beta value )
        // data.dm.gamma    ( devicemotion event rotationRate gamma value )
        deviceOrientationHandler(data.do.alpha, data.do.beta, data.do.gamma);
    });
}).catch(function (e) {
    // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
});

function getOrienation() {
    if (window.DeviceOrientationEvent) {
        //document.getElementById("doEvent").innerHTML = "DeviceOrientation";
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function (eventData) {
            // gamma is the left-to-right tilt in degrees, where right is positive
            var gamma = eventData.gamma;

            // beta is the front-to-back tilt in degrees, where front is positive
            var beta = eventData.beta;

            // alpha is the compass direction the device is facing in degrees
            var alpha = eventData.alpha;
            //console.log(eventData.absolute);
            // call our orientation event handler

            //deviceOrientationHandler(alpha, beta, gamma);
        }, false);
    } else {
        //	document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
    }
}

//degree to radian torad(degree)
function torad(degrees) {
    return degrees * Math.PI / 180;
}
//radian to degree todeg(radian)
function todeg(radians) {
    return radians * 180 / Math.PI;
}

function boundToRange(number, min, max) {
    if (number < min) {
        return min;
    }
    if (number > max) {
        return max;
    }
    return number;
}
var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function getRotationMatrix(alpha, beta, gamma) {

    var _x = beta ? torad(beta) : 0; // beta value
    var _y = gamma ? torad(gamma) : 0; // gamma value
    var _z = alpha ? torad(alpha) : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    //
    // ZXY rotation matrix construction.
    //

    var m11 = cZ * cY - sZ * sX * sY;
    var m12 = -cX * sZ;
    var m13 = cY * sZ * sX + cZ * sY;

    var m21 = cY * sZ + cZ * sX * sY;
    var m22 = cZ * cX;
    var m23 = sZ * sY - cZ * cY * sX;

    var m31 = -cX * sY;
    var m32 = sX;
    var m33 = cX * cY;

    return [
            [m11, m12, m13],
            [m21, m22, m23],
            [m31, m32, m33]
            ];

};

function deviceOrientationHandler(alpha, beta, gamma) {
    var R = getRotationMatrix(alpha, beta, gamma);

    var head = todeg(Math.atan2((R[0][1] - R[1][0]), (R[0][0] + R[1][1])));
    if (head < 0) head += 360;
    var dip = Math.round(todeg(Math.acos(R[2][2]))),
        off = 0;

    if (dip > 90) {
        off = 180;
        dip = 180 - dip;
    };
    var strike = head + 90 + off > 360 ? Math.round((head + 90 + off) % 360) : Math.round(head + 90 + off);

    off = 180;


    var plunge_X = todeg(Math.asin(R[2][0] / Math.sqrt(R[2][0] * R[2][0] + R[2][1] * R[2][1] + R[2][2] * R[2][2])));
    var plunge_Y = todeg(Math.asin(R[2][1] / Math.sqrt(R[2][0] * R[2][0] + R[2][1] * R[2][1] + R[2][2] * R[2][2])));
    var plunge = Math.floor(plunge_Y);
    if (plunge > 90) {
        off = 0;
        plunge = 180 - plunge;
    };
    var bcy = boundToRange(plunge_Y / 10, -4.5, 4.5);
    var bcx = boundToRange(plunge_X / 10, -4.5, 4.5);
    if (plunge_X * plunge_X + plunge_Y * plunge_Y >= 45 * 45) {

        bcx = 4.5 * Math.cos(Math.atan2(plunge_Y, plunge_X));
        bcy = 4.5 * Math.sin(Math.atan2(plunge_Y, plunge_X));
    }

    document.getElementById("gammaT").innerHTML = plunge_X + ",\n" + plunge_Y;

    document.getElementById("bubble").setAttribute("cx", 16 + bcx);
    document.getElementById("bubble").setAttribute("cy", 16 - bcy);

    var trend = head + off > 360 ? Math.round((head + off) % 360) : Math.round(head + off);

    // read http://stackoverflow.com/questions/15649684/how-should-i-calculate-azimuth-pitch-orientation-when-my-android-device-isnt
    var north = 360 - head;
    document.getElementById("compass").setAttribute("transform", "rotate(" + north + " 16 16)");
    document.getElementById("heading").innerHTML = Math.round(head) + "&deg;";

    document.getElementById("strike").parentNode.classList.add("is-dirty");
    document.getElementById("strike").value = strike;
    document.getElementById("dip").parentNode.classList.add("is-dirty");
    document.getElementById("dip").value = dip;

    document.getElementById("trend").parentNode.classList.add("is-dirty");
    document.getElementById("trend").value = trend;
    document.getElementById("plunge").parentNode.classList.add("is-dirty");
    document.getElementById("plunge").value = plunge;
}
