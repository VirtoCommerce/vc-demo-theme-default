var storefrontApp = angular.module('storefrontApp');
storefrontApp.controller('searchBarController', ['$scope', '$timeout', '$window', 'catalogService', function ($scope, $timeout, $window, catalogService) {
    var timer;

    $scope.query = $window.searchQuery;

    $scope.getSuggestions = function () {
        if (!$scope.query) {
            return;
        }
        $timeout.cancel(timer);
        timer = $timeout(function () {
            $scope.searching = true;
            $scope.categorySuggestions = [];
            $scope.productSuggestions = [];
            var searchCriteria = {
                keyword: $scope.query,
                start: 0,
                pageSize: $window.suggestionsLimit,
                isFuzzySearch: true,
                sortBy: 'relevance'
            }
            catalogService.searchCategories(searchCriteria).then(function (response) {
                var categories = response.data.categories;
                if (categories.length > 5) {
                    searchCriteria.pageSize = $window.suggestionsLimit - 5;
                    $scope.categorySuggestions = _.first(categories, 5);
                } else {
                    searchCriteria.pageSize = $window.suggestionsLimit - categories.length;
                    $scope.categorySuggestions = categories;
                }
                catalogService.search(searchCriteria).then(function (searchResponse) {
                    var products = searchResponse.data.products;
                    $scope.productSuggestions = products;
                    $scope.searching = false;
                });
            });
        }, 300);
    }
}]);
