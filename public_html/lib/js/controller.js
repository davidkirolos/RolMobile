var mediaControllers = angular.module('mediaControllers', []);

mediaControllers.factory('myService', function () {
    var savedData = {};
    function set(data) {
        savedData = data;
    }


    return {
        set: function set(data) {
            savedData = data;
        },
        get: function get() {
            return savedData;
        }
    }

});

mediaControllers.controller('MenuController', ['$scope', '$http', '$routeParams', 'myService', function ($scope, $http, $routeParams, myService) {
        $http.get('lib/data/menus.json?v=1').success(function (data) {
            $scope.Menus = data;
        });

        $scope.setMainCategoryId = function (value) {
            myService.set({mainCategoryId: value});
        };
    }]);

mediaControllers.controller('MediaListController', ['$scope', '$http', '$routeParams', 'myService', '$location', function ($scope, $http, $routeParams, myService, $location) {



//        var mainCategoryId = $routeParams.mainCategoryId;
        var mainCategoryId = myService.get().mainCategoryId;
        if (mainCategoryId == null) {
            $location.path("#/menu");
        }
        //  We'll load our list of Customers from our JSON Web Service into this variable
        $scope.subCategories = null;

        //  When the user selects a "Customer" from our MasterView list, we'll set the following variable.
        $scope.selectedSubCategory = null;

        $http.get('&id=' + mainCategoryId).success(function (data) {
            $scope.subCategories = data;
            $scope.subCategoriesOrder = '-RowNum';

        });


        $scope.loadMedia = function (val) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to load the media.
            alert(val.Location);

        };

        $scope.loadPlayList = function (val) {
            alert(val.Id);
        };




    }]);

mediaControllers.controller('DetailsController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $http.get('js/data.json').success(function (data) {
            $scope.artists = data;
            $scope.whichItem = $routeParams.itemId;

            if ($routeParams.itemId > 0) {
                $scope.prevItem = Number($routeParams.itemId) - 1;
            } else {
                $scope.prevItem = $scope.artists.length - 1;
            }

            if ($routeParams.itemId < $scope.artists.length - 1) {
                $scope.nextItem = Number($routeParams.itemId) + 1;
            } else {
                $scope.nextItem = 0;
            }

        });
    }]);