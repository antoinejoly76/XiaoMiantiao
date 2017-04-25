/* Get home page */

var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};

var requestOptions = {
    url: ""
}
module.exports.home = function(req, res) {
    res.render('home', {
        title: 'XiaoMiantiao - simple Chinese dictionary',
        pageHeader: {
            title: 'XiaoMiantiao',
            strapline: 'Simple Chinese dictionary using the MEAN stack',
            footercontent: 'All content © 2017 by Antoine Joly'
        }
    });
};

/* Get results page */

var renderResults = function(req, res, responseBody) {
    console.log(responseBody);
    res.render('results', {
        title: 'XiaoMiantiao - simple Chinese dictionary',
        pageHeader: {
            title: 'XiaoMiantiao',
            strapline: 'Simple Chinese dictionary using the MEAN stack',
            footercontent: 'All content © 2017 by Antoine Joly'
        },
        queryData: {
            nbresults: 3,
            timequery: 0.55
        },
    });
}

module.exports.results = function(req, res) {
    //     var requestOptions, path, reqpqarams;
    //     path = '/api/search/pinyin/';
    //     reqparams = req.searchparam;
    //     requestOptions = {
    //         url: apiOptions.server + path + reqparams,
    //         method: "GET",
    //         json: {}
    //     };
    //     request(requestOptions, function(err, response, body) {
    //        console.log(body);
    //         renderResults(req, res, body);
    //     });
    // }

    res.render('results', {
        title: 'XiaoMiantiao - simple Chinese dictionary',
        pageHeader: {
            title: 'XiaoMiantiao',
            strapline: 'Simple Chinese dictionary using the MEAN stack',
            footercontent: 'All content © 2017 by Antoine Joly'
        },
        queryData: {
            nbresults: 3,
            timequery: 0.55
        }});

}
