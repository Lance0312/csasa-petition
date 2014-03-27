var url = "data/mly-8.json";

angular.module('app', ['legislatorFilters', 'stringFilters', 'firebase'])
    .controller('LegislatorListCtrl', function ($scope, $http, $firebase) {
        var dataRef = new Firebase('https://csasa-petition.firebaseio.com/');
        $scope.legislators = $firebase(dataRef);

        $scope.legislators.$on('loaded', function (data) {
            renderChart1(data);
        });
    });
