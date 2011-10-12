#!/usr/bin/env node

var path = require('path'),
    assert = require('assert');

var zipcodes = require(path.join(__dirname, '../', 'lib'));

assert.ok(zipcodes);
assert.ok(zipcodes.lookup);

var i = 1;

var marion = zipcodes.lookup(62959);
assert.equal(marion.city, 'Marion');

var hills = zipcodes.lookup(90210);
assert.equal(hills.city, 'Beverly Hills');

var dist = zipcodes.distance(62959, 90210);
assert.equal(dist, 1662);

var dist2 = zipcodes.distance(62959, 62959);
assert.equal(dist2, 0);

var dist3 = zipcodes.distance(62959, 63801);
assert.equal(dist3, 68);

var dist4 = zipcodes.distance(62959, 95014);
assert.equal(dist4, 1805);
assert.equal(zipcodes.toKilometers(dist4), 2905);
assert.equal(zipcodes.toMiles(zipcodes.toKilometers(dist4)), dist4);

var dist5 = zipcodes.distance(62959, 90210);
assert.equal(dist5, 1662);

var l = zipcodes.lookupByName('Marion', 'il');
assert.equal(l.length, 1);

var l = zipcodes.lookupByName('Marion', 'Illinois');
assert.equal(l.length, 1);

var l = zipcodes.lookupByName('Cupertino', 'CA');
assert.equal(l.length, 1);

var l = zipcodes.lookupByName('New York', 'New York');
assert.equal(l.length, 71);

var l = zipcodes.lookupByName('New York', 'NY');
assert.equal(l.length, 71);

var rad = zipcodes.radius(62959, 20);
assert.equal(rad.length, 35);

var rad = zipcodes.radius(95014, 50);
assert.equal(rad.length, 385);

console.log('Woot! All tests passed');
