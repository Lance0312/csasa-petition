var url = "https://csasa-petition.firebaseio.com/";

var app = angular.module('app', [
    'legislatorFilters',
    'stringFilters',
    'firebase'
]);

app.service('authService', ['$firebaseSimpleLogin',
    function($firebaseSimpleLogin) {
        var authRef = new Firebase(url + '/auth');

        return {
            getHandler: function () {
                return $firebaseSimpleLogin(authRef);
            },
            log: function (data) {
                return $firebase(authRef).$child('log').$add(data);
            }
        };
    }
]);

app.service('dataService', ['$firebase', function ($firebase) {
    var ref = new Firebase(url + '/data');
    return $firebase(ref);
}]);

app.controller('ChartCtrl', ['$scope', '$window', 'dataService',
    function ($scope, $window, dataService) {
        dataService.$on('value', function (d) {
            renderChart1(d.snapshot.value);

            angular.element($window).bind('resize', function () {
                renderChart1(d.snapshot.value);
            });
        });
    }
]);

app.controller('LegislatorListCtrl', ['$scope', 'authService', 'dataService',
    function ($scope, authService, dataService) {
        dataService.$bind($scope, 'legislators');

        $scope.auth = authService.getHandler();
        $scope.choose = function (id, choice) {
            if (typeof choice != 'undefined') {
                dataService.$child(id).$update({'choice': choice})
                    .then(function (result) {
                        authService.log({
                            user: $scope.auth.user,
                            legislator: id,
                            choice: choice,
                            timestamp: new Date().getTime()
                        });
                    }, function (error) {
                        if (error.code == 'PERMISSION_DENIED') {
                        }
                    });
            }
        };
    }
]);

app.controller('AuthCtrl', ['$scope', 'authService',
    function ($scope, authService) {
        $scope.auth = authService.getHandler();
        $scope.checkAuth = function () {
            $scope.auth.$getCurrentUser()
                .then(function (result) {
                    if (result === null) {
                        $('#auth-panel').modal('show');
                    }
                }, function (error) {
                });
        };
        $scope.login = function (provider, options) {
            $scope.auth.$login(provider, options);
            $('#auth-panel').modal('hide');
        };
        $scope.logout = function () {
            $scope.auth.$logout();
        };
        $scope.getAvatar = function () {
            if ($scope.auth.user === null) {
                return null;
            }
            switch ($scope.auth.user.provider) {
                case 'facebook':
                    return null;
                    break;
                case 'github':
                    return $scope.auth.user.avatar_url;
                    break;
                case 'google':
                    return $scope.auth.user.thirdPartyUserData.picture;
                    break;
                case 'twitter':
                    return $scope.auth.user.profile_image_url_https;
                    break;
                default:
                    return null;
                    break;
            }
        };
    }
]);

function checkKeyStrokes (first, second) {
    if (!first || !second) {
        return false;
    }

    if (first.length !== second.length) {
        return false;
    }

    first.forEach(function (element, index) {
        if (element !== second[index]) {
            return false;
        }
    });

    return true;
}

var passcodeQueue = [];
var ma_avatar = 'http://image.kmt.org.tw/people/20090606164842.jpg';

app.directive('ngPasscode', [function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if (passcodeQueue.length === 0) {
                setTimeout(function () { passcodeQueue = []; }, 1000);
            }

            passcodeQueue.push(event.which);

            if (checkKeyStrokes(passcodeQueue, [97, 97, 98, 98, 97, 98, 99])) {
                $('.party-KMT .avatar img')
                    .attr('width', 128)
                    .attr('src', ma_avatar);
            }
        });
    };
}]);
