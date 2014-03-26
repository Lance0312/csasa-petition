var url = "data/mly-8.json";

angular.module('app', ['legislatorFilters', 'stringFilters'])
    .controller('LegislatorListCtrl', function ($scope, $http) {
        $http.get(url).success(function(data) {
            $scope.legislators = data;
        });
    });
