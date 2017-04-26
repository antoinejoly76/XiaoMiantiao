var myApp = angular.module('xmapp',['ui.bootstrap']);


// Search related  shared functions and variables
myApp.factory('Fact', function() {
  return {
    searchtype: 'pinyin',
    searchparam: '',
    results: [{}],
    timequery: 0,
    nbresults: 0,
    activeTab: ""
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

}

var navBarCtrl = function($scope, $location, Fact) {
  console.log(Fact.searchparam);
    $scope.Fact = Fact;
    var LOCALHOST= 'http://localhost:3000/';
    console.log($location.$$absUrl);
    if ($location.$$absUrl == LOCALHOST + 'results/')
          $scope.Fact.activeTab = "Search";
    else if ($location.$$absUrl == LOCALHOST + 'about/')
          $scope.Fact.activeTab = "About";
    else
          $scope.Fact.activeTab = "Home";
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

        var promise = $http.get('/api/search/' + searchtype + '/' + param).then(function(response) {
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
  var tabpics = {
    "pics": {}
  };
 var number = 0;

  // console.log($scope.tabpics);
  FlickrsearchChinaPictures.runSearch().async().then(function(d) {
    var keyind = 0;
    for (i = 0; i < 10; i++) {


      if (checkPicOK(d.data[i])) {
        tabpics['pics'][d.data[i].id] = {
          'url': 'https://farm' + d.data[i].farm + '.staticflickr.com/' + d.data[i].server + '/' + d.data[i].id + '_' + d.data[i].secret + '_n.jpg',
          'title': d.data[i].title,
          'id': d.data[i].id,
          'isLandscape': ''
        };

        var key = d.data[i].id;
        console.log("KEY IS " + key);
        ValidateLandscapePictures.isLandscape(tabpics['pics'][key].id).async().then(function(d) {
          // console.log($scope.tabpics['pics']);
          console.log("D ");
          console.log(d);
          console.log(tabpics['pics'][d.id]);
          console.log(d.isLandscape);
          tabpics['pics'][d.id].isLandscape = d.isLandscape;
          console.log(tabpics['pics'][d.id]);
          number++;
          console.log(number);
          finalise();

        });


        console.log("Pic " + i + "'s url is OK")
      } else {
        console.log("Pic " + i + "'s url is NOT OK")
        tabpics['pics']["invalid" + i] = {
          'url': null,
          'title': null,
          'id': null,
          'isLandscape': 'false'
        };
          number++;
            console.log(number);
      finalise();
        }




  };
  console.log(number);


});



  function finalise() {
    console.log(number);
    console.log("Fetching a landscape picture out of 10...");
   if (number == 10) {

    var pics = tabpics['pics'];
    var i = 0;
    var idkey = "";
    console.log("FINALISE  ----");
    console.log(pics);
    for (var key in pics) {
      var pic = pics[key];
      console.log(pic);
      if (pic.isLandscape == 'true') {
        console.log("Pic number" + i + " is Landscape... !")
        console.log("we will display pic" + i + " title is " + pic.title);
        console.log(pic.url);
        idkey = key;
        break;
      } else {
        console.log("Pic number" + i + "is not Landscape... !")
        i++;
        console.log("we continue");
      }

    }
    if (i === pics.length) i--; // We went through 10 pictures and did not find any landscape. We send the last picture by default

    $scope.getChinaPicUrl = pics[idkey].url;
    $scope.getChinaPicTitle = pics[idkey].title;

  } else {
    console.log("not ready yet");
  }
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
        console.log("the id in valid landscaoep service" + picId);
        if (picId === null) return {
          isLandscape: 'false'
        };

        var promise = $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ae08eba93a977d220945ff2d08f960bb&photo_id=' + picId + '&format=json&nojsoncallback=1').then(function(response) {
          console.log(response.data);
          console.log(response.data.sizes.size[4].width)
          console.log(response.data.sizes.size[4].height)
          var width = response.data.sizes.size[4].width;
          var height = response.data.sizes.size[4].height;
          if (response.data.stat === 'fail') return {
            id: null,
            isLandscape: 'false'
          };

          if (width == 320 && height <= 240) { //We want a ratio of 1.5 or wider
            console.log("is LAndscape")
            return {
              id: picId,
              isLandscape: 'true'
            }
          } else {
            console.log("is NOT  LAndscape")
            return {
                id: picId,
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

myApp.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

myApp.controller('navBarCtrl',navBarCtrl).controller('resultsListCtrl', resultsListCtrl).controller('inputSearchCtrl', inputSearchCtrl).controller('queryInfoCtrl', queryInfoCtrl).service('resultsData', resultsData).controller('FlickrbuildPicCtrl', FlickrbuildPicCtrl).service('ValidateLandscapePictures', ValidateLandscapePictures).service('FlickrsearchChinaPictures', FlickrsearchChinaPictures)
  .controller('FlickrbuildPicCtrlv2', FlickrbuildPicCtrlv2).controller('StyleCtrl', StyleCtrl).filter('removeblanksFilter', removeblanksFilter);
