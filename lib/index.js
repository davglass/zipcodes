
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
    state = states.normalize(state.toUpperCase());

    //console.log('byname', city, state);

    var ret = [];
    
    codes.stateMap[state].forEach(function(zip) {
        var item = codes.codes[zip];
        if (city === item.city.toUpperCase()) {
            ret.push(item);
        }
    });

    return ret;
}

exports.lookupByName = byName;

var dist = function(zipA, zipB) {
    zipA = lookup(zipA);
    zipB = lookup(zipB);

    var distance = Math.sin(deg2rad(zipA.latitude)) 
                * Math.sin(deg2rad(zipB.latitude)) 
                + Math.cos(deg2rad(zipA.latitude)) 
                * Math.cos(deg2rad(zipB.latitude)) 
                * Math.cos(deg2rad(zipA.longitude - zipB.longitude)); 

    distance = (rad2deg(Math.acos(distance))) * 69.09;
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


var rad2deg = function(value) {
    value = Number(value);
    return (value * (180/Math.PI));
}
var deg2rad = function(value) {
    value = Number(value);
    return (value * (Math.PI/180));
}

exports.toMiles = function(kilos) {
    return Math.round(kilos / 1.609344);
};

exports.toKilometers = function(miles) {
    return Math.round(miles * 1.609344);
};
