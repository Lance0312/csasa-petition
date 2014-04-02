var url = "data/mly-8.json";

var app = angular.module('app', ['legislatorFilters', 'stringFilters', 'firebase']);

app.service('authService', function($firebase, $firebaseSimpleLogin) {
    var authRef = new Firebase('https://csasa-petition.firebaseio.com/auth');

    return {
        getHandler: function () {
            return $firebaseSimpleLogin(authRef);
        },
        log: function (data) {
            return $firebase(authRef).$child('log').$add(data);
        }
    };
});

app.controller('LegislatorListCtrl', function ($scope, $http, $firebase, authService) {
    var dataRef = new Firebase('https://csasa-petition.firebaseio.com/data');
    $scope.legislators = $firebase(dataRef);

    $scope.legislators.$on('value', function (data) {
        renderChart1(data.snapshot.value);
    });

    $scope.auth = authService.getHandler();
    $scope.choose = function (id, choice) {
        if (typeof choice != 'undefined') {
            $scope.legislators.$child(id).$update({'choice': choice})
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
});

app.controller('AuthCtrl', function ($scope, authService) {
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
});
