
const codesUS = require('./codes'),
    states = require('./states');

exports.states = states;
exports.codes = codesUS.codes;

const lookup = function(zip) {
    return codesUS.codes[zip];
};

exports.lookup = lookup;

const byName = function(city, state) {
    city = city.toUpperCase();

    const ret = [];
    
    byState(state).forEach(function(item) {
        if (city === item.city.toUpperCase()) {
            ret.push(item);
        }
    });

    return ret;
};

exports.lookupByName = byName;

const byState = function(state) {
    state = states.normalize(state.toUpperCase());

    const ret = [];

    if(!codesUS.stateMap[state]){
        return ret;
    }
    
    codesUS.stateMap[state].forEach(function(zip) {
        ret.push(codesUS.codes[zip]);
    });

    return ret;
};

exports.lookupByState = byState;
