var url = "data/mly-8.json";

var app = angular.module('app', ['legislatorFilters', 'stringFilters', 'firebase']);

app.controller('LegislatorListCtrl', function ($scope, $http, $firebase) {
    var dataRef = new Firebase('https://csasa-petition.firebaseio.com/');
    $scope.legislators = $firebase(dataRef);

    $scope.legislators.$on('loaded', function (data) {
        renderChart1(data);
    });

    $scope.choose = function (id, choice) {
        if (typeof choice != 'undefined') {
            $scope.legislators.$child(id).$update({'choice': choice});
        }
    };
});
