
var codes = require('./codes'),
    states = require('./states');

exports.states = states;
exports.codes = codes.codes;

var lookup = function(zip) {
    return codes.codes[zip];
};

exports.lookup = lookup;

var byName = function(city, state) {
    city = city.toUpperCase();

    var ret = [];
    
    byState(state).forEach(function(item) {
        if (city === item.city.toUpperCase()) {
            ret.push(item);
        }
    });

    return ret;
}

exports.lookupByName = byName;

var byState = function(state) {
    state = states.normalize(state.toUpperCase());

    var ret = [];

    if(!codes.stateMap[state]){
        return ret;
    }
    
    codes.stateMap[state].forEach(function(zip) {
        ret.push(codes.codes[zip]);
    });

    return ret;
}

exports.lookupByState = byState;

var dist = function(zipA, zipB) {
    zipA = lookup(zipA);
    zipB = lookup(zipB);
    if (!zipA || !zipB) {
        return null;
    }
    
    var zipALatitudeRadians = deg2rad(zipA.latitude);
    var zipBLatitudeRadians = deg2rad(zipB.latitude);

    var distance = Math.sin(zipALatitudeRadians) 
                * Math.sin(zipBLatitudeRadians) 
                + Math.cos(zipALatitudeRadians) 
                * Math.cos(zipBLatitudeRadians) 
                * Math.cos(deg2rad(zipA.longitude - zipB.longitude)); 

    distance = Math.acos(distance) * 3958.56540656;
    return Math.round(distance);
};

exports.distance = dist;


//This is SLLOOOOWWWWW
exports.radius = function(zip, miles, full) {
    var ret = [], i, d;
    
    for (i in codes.codes) {
        if (dist(zip, i) <= miles) {
            ret.push(((full) ? codes.codes[i] : i));
        }
    }

    return ret;
};


var deg2rad = function(value) {
    return value * 0.017453292519943295;
}

exports.toMiles = function(kilos) {
    return Math.round(kilos / 1.609344);
};

exports.toKilometers = function(miles) {
    return Math.round(miles * 1.609344);
};
