var myApp = angular.module('xmapp', []);


// Search related  shared functions and variables
myApp.factory('Fact', function() {
    return {
        searchparam: 'chi',
        results: [{}],
        timequery: 0,
        nbresults: 0
    }
});

myApp.factory('logTimeTaken', [function() {
    var logTimeTaken = {
        request: function(config) {
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function(response) {
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return logTimeTaken;
}]);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('logTimeTaken');
}]);

// Three controllers for search and one service to call the REST API

var queryInfoCtrl = function(resultsData, $scope, Fact) {
    $scope.Fact = Fact;
}

var resultsListCtrl = function(resultsData, $scope, Fact) {
    $scope.Fact = Fact;
    console.log(Fact.searchparam)
    resultsData.runSearch(Fact.searchparam).async().then(function(d) {
        $scope.Fact.results = d.data1;
        $scope.Fact.nbresults = d.data1.length;
        $scope.Fact.timequery = d.time1 / 1000;
        console.log(d);
    });
}

var inputSearchCtrl = function(resultsData, $scope, Fact) {
    $scope.Fact = Fact;
    console.log(Fact.searchparam)
    $scope.newSearch = function() {
        resultsData.runSearch(Fact.searchparam).async().then(function(d) {
            $scope.Fact.results = d.data1;
            $scope.Fact.nbresults = d.data1.length;
            $scope.Fact.timequery = d.time1 / 1000;
            console.log(d);
        });
    }
}



var FlickrbuildPicCtrl = function(FlickrsearchChinaPictures, ValidateLandscapePictures, $scope) {
    var picid;
    FlickrsearchChinaPictures.runSearch().async().then(function(d) {
        $scope.getChinaPicUrl = 'https://farm' + d.data.farm + '.staticflickr.com/' + d.data.server + '/' + d.data.id + '_' + d.data.secret + '_z.jpg';
        console.log($scope.getChinaPicUrl);
        $scope.getChinaPicTitle = d.data.title;
        picid = d.data.id;


        ValidateLandscapePictures.isLandscape(picid).async().then(function(d) {
            console.log(d.isLandscape);
        });
    });

};


var resultsData = function($http) {
    this.runSearch = function(param) {
        var myService = {
            async: function() {
                var promise = $http.get('/api/search/pinyin/' + param).then(function(response) {

                    return {
                        data1: response.data,
                        time1: response.config.responseTimestamp - response.config.requestTimestamp
                    };
                });
                return promise;
            }
        };
        return myService;
    }
}


var FlickrbuildPicCtrlv2 = function(FlickrsearchChinaPictures, ValidateLandscapePictures, $scope) {

    var promises = [];
    var i;
    $scope.tabpics = {
        "pics": []
    };

    for (i = 0; i < 10; i++) {
        console.log($scope.tabpics);
        FlickrsearchChinaPictures.runSearch().async().then(function(d) {


            $scope.tabpics['pics'].push({
                'url': 'https://farm' + d.data.farm + '.staticflickr.com/' + d.data.server + '/' + d.data.id + '_' + d.data.secret + '_n.jpg',
                'title': d.data.title,
                'id': d.data.id,
                'isLandscape': ""
            });;
            var number = $scope.tabpics['pics'].length;
            console.log(number);
            // $scope.tabpics['pics'][length].url = 'https://farm' + d.data.farm + '.staticflickr.com/' + d.data.server + '/' + d.data.id + '_' + d.data.secret + '_z.jpg';
            // $scope.tabpics['pics'][length].title = d.data.title
            // $scope.tabpics['pics'][length].id = d.data.id;

            ValidateLandscapePictures.isLandscape($scope.tabpics['pics'][number - 1].id).async().then(function(d) {
                $scope.tabpics['pics'][number - 1].isLandscape = d.isLandscape;
                if (number == 10) {
                    finalise();
                }
            });




        });
    }

    function finalise() {

        console.log("Fetching a landscape picture out of 10...");

        var pics = $scope.tabpics['pics'];
        console.log(pics.length);

        for (i = 0; i < pics.length; i++) {
            var pic = pics[i];
            console.log(pic);
            if (pic.isLandscape == 'true') {
                console.log("Pic number" + i + " is Landscape... !")
                console.log("we will display pic" + i + " title is " + pic.title);
                break;
            } else {
                console.log("Pic number" + i + "is not Landscape... !")
                console.log("we continue");
            }

        }

        $scope.getChinaPicUrl = pics[i].url;
        $scope.getChinaPicTitle = pics[i].title;

    }

}



var FlickrsearchChinaPictures = function($http) {
    this.runSearch = function() {
        var myService = {
            async: function() {
                var randpage = Math.floor(Math.random() * 700) + 1; // There are 1492 pages of 100 pictures each with china tag
                var randpic = Math.floor(Math.random() * 100) + 1; // There are 1492 pages of 100 pictures each with china tag

                var promise = $http.get('https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=ae08eba93a977d220945ff2d08f960bb&group_id=531365%40N20&page=' + randpage + '&format=json&nojsoncallback=1').then(function(response) {
                    console.log("page" + randpage + " - pic " + randpic);
                    console.log(response.data.photos.photo[randpic]);
                    return {
                        // data: response.data.photos.photo[randpic-1]
                        // data2: response.data.photos.photo[randpic-2]
                        data: response.data.photos.photo[randpic]
                        // data4: response.data.photos.photo[randpic+1]
                        // data5: response.data.photos.photo[randpic+2]
                    };
                })

                return promise;
            }

        };
        return myService;
    }
}

var ValidateLandscapePictures = function($http) {
    this.isLandscape = function(picId) {
        var myService = {
            async: function() {
                console.log(picId);
                var promise = $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ae08eba93a977d220945ff2d08f960bb&photo_id=' + picId + '&format=json&nojsoncallback=1').then(function(response) {
                    console.log(response.data);
                    console.log(response.data.sizes.size[4].width)
                    console.log(response.data.sizes.size[4].height)
                    var width = response.data.sizes.size[4].width;
                    var height = response.data.sizes.size[4].height;
                    if (width = 320 && height <= 215) //We want a ratio of 1.5 or wider
                        return {
                            isLandscape: 'true'
                        }
                    else
                        return {
                            isLandscape: 'false'
                        }
                });
                return promise;
            }
        };
        return myService;
    }
}


// Three controllers for search and one service to call the REST API



myApp.controller('resultsListCtrl', resultsListCtrl).controller('inputSearchCtrl', inputSearchCtrl).controller('queryInfoCtrl', queryInfoCtrl).service('resultsData', resultsData).controller('FlickrbuildPicCtrl', FlickrbuildPicCtrl).service('ValidateLandscapePictures', ValidateLandscapePictures).service('FlickrsearchChinaPictures', FlickrsearchChinaPictures)
    .controller('FlickrbuildPicCtrlv2', FlickrbuildPicCtrlv2)
