var myApp = angular.module('xmapp', []);


// Search related  shared functions and variables
myApp.factory('Fact', function() {
    return {
        searchtype: 'pinyin',
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
    resultsData.runSearch(Fact.searchparam, Fact.searchtype).async().then(function(d) {
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
        resultsData.runSearch(Fact.searchparam, Fact.searchtype).async().then(function(d) {
            $scope.Fact.results = d.data1;
            $scope.Fact.nbresults = d.data1.length;
            $scope.Fact.timequery = d.time1 / 1000;
            console.log(d);
        });
    }
}

var removeblanksFilter = function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
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

var StyleCtrl = function($scope) {
    $scope.class1 = "";
    $scope.class2 = "active";
    $scope.class3 = "";
    $scope.changeClass = function(btn) {
        console.log("CALLER " + btn + "BEFORE - class 1 " + $scope.class1 + " class2" + $scope.class2 + " class3" + $scope.class3)
        if (btn === 'btn1') {
            $scope.class1 = "active";
            $scope.class2 = "";
            $scope.class3 = "";
            $scope.Fact.searchtype = 'chinese';
        } else if (btn === 'btn2') {
            $scope.class2 = "active";
            $scope.class1 = "";
            $scope.class3 = "";
            $scope.Fact.searchtype = 'pinyin';
        } else if (btn === 'btn3') {
            $scope.class3 = "active";
            $scope.class1 = "";
            $scope.class2 = "";
            $scope.Fact.searchtype = 'english';
        }
        console.log("AFTER - class 1 " + $scope.class1 + " class2" + $scope.class2 + " class3" + $scope.class3)
    }
}


var resultsData = function($http) {
    this.runSearch = function(param, searchtype) {
        var myService = {
            async: function() {

                var promise = $http.get('/api/search/'+searchtype+'/' + param).then(function(response) {
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


    // console.log($scope.tabpics);
    FlickrsearchChinaPictures.runSearch().async().then(function(d) {

        for (i = 0; i < 10; i++) {
            if (checkPicOK(d.data[i])) {
                $scope.tabpics['pics'].push({
                    'url': 'https://farm' + d.data[i].farm + '.staticflickr.com/' + d.data[i].server + '/' + d.data[i].id + '_' + d.data[i].secret + '_n.jpg',
                    'title': d.data[i].title,
                    'id': d.data[i].id,
                    'isLandscape': ""
                });
                console.log("Pic " + i + "'s url is OK")
            } else {
                console.log("Pic " + i + "'s url is NOT OK")
                  $scope.tabpics['pics'].push(
                    {
                      'url': null,
                      'title': null,
                      'id': null,
                      'isLandscape': null,
                  });
            }

        }

        var number = 0;

        for (i = 0; i < 10; i++) {
            ValidateLandscapePictures.isLandscape($scope.tabpics['pics'][i].id).async().then(function(d) {
                // console.log($scope.tabpics['pics']);
                $scope.tabpics['pics'][number].isLandscape = d.isLandscape;
                number++;

                if (number == 10) {
                    finalise();
                }
            });
        }

    });





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
        if (i === pics.length) i--; // We went through 10 pictures and did not find any landscape. We send the last picture by default
        $scope.getChinaPicUrl = pics[i].url;
        $scope.getChinaPicTitle = pics[i].title;

    }

    function checkPicOK(pic) {
        if (pic) return true;
        else return false;
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
                        'data': [
                            response.data.photos.photo[randpic - 4],
                            response.data.photos.photo[randpic - 3],
                            response.data.photos.photo[randpic - 2],
                            response.data.photos.photo[randpic - 1],
                            response.data.photos.photo[randpic],
                            response.data.photos.photo[randpic + 1],
                            response.data.photos.photo[randpic + 2],
                            response.data.photos.photo[randpic + 3],
                            response.data.photos.photo[randpic + 4],
                            response.data.photos.photo[randpic + 5]
                        ]
                    };


                });

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
                if (!picId) return {
                    isLandscape: 'false'
                };

                var promise = $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ae08eba93a977d220945ff2d08f960bb&photo_id=' + picId + '&format=json&nojsoncallback=1').then(function(response) {
                    console.log(response.data);
                    console.log(response.data.sizes.size[4].width)
                    console.log(response.data.sizes.size[4].height)
                    var width = response.data.sizes.size[4].width;
                    var height = response.data.sizes.size[4].height;
                    if (response.data.stat === 'fail' )  return {
                            isLandscape: 'false'
                        };

                    if (width == 320 && height <= 240) { //We want a ratio of 1.5 or wider
                        console.log("is LAndscape")
                        return {
                            isLandscape: 'true'
                        }
                    } else {
                        console.log("is NOT  LAndscape")
                        return {
                            isLandscape: 'false'
                        }
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
    .controller('FlickrbuildPicCtrlv2', FlickrbuildPicCtrlv2).controller('StyleCtrl', StyleCtrl).filter('removeblanksFilter',removeblanksFilter);
