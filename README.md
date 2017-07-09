Zip Code Lookups
================
SP2:TODO update this build status
[![Build Status](https://travis-ci.org/davglass/zipcodes.svg?branch=master)](https://travis-ci.org/davglass/zipcodes)

This is a fork of [davglass' excellent zipcode lookup project](https://github.com/davglass/zipcodes).  

A localized (flatfile) zipcode lookup.

Zipcode data was taken from here: http://federalgovernmentzipcodes.us/free-zipcode-database-Primary.csv

It was then transformed into a JSON object and then wrapped with some helper methods.

Differences
-----------
I only wanted the Primary data from the federalgovernmentzipcodes.us website.  I also only need a city and state lookup so I removed the distance functionality
found in his project.  Finally, I do not need the Canada data so I removed that from the repo as well. 

Usage
-----
    var zipcodes = require('zipcodes');

Zipcode Lookup
--------------

    var hills = zipcodes.lookup(90210);  

    { 
        zip: '90210',  
        city: 'Beverly Hills',  
        state: 'CA'   
    }


Lookup By Name
--------------

    var l = zipcodes.lookupByName('Concord', 'NH');
    
    //Always returns an array, since cities can have multiple zip codes
    [ 
        { 
            zip: '03301',
            city: 'Concord',
            state: 'NH' 
        },
        { 
            zip: '03302',
            city: 'Concord',
            state: 'NH' 
        },
        { 
            zip: '03303',
            city: 'Concord',
            state: 'NH' 
        } ,
        { 
            zip: '03305',
            city: 'Concord',
            state: 'NH' 
        } 
     ]


Development
-----------
SP2:TODO - describe how to run the scripts from the command line

The original CSV file that I am using for this data is not included in this repo, but I did wrap up
the best way to get the data and how to convert it into the format that this module uses.

To develop with this module, just `make` it and it will fetch the latest zipcodes and reprocess them.

    make

To just fetch and process the zipcodes:

    make codes

To run the very simple test suite:

    make tests
