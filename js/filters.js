angular.module('legislatorFilters', [])
    .filter('toEmblem', function() {
        return function (input) {
            switch (input) {
                case 'KMT':
                    return 'img/kmt.svg';
                    break;
                case 'DPP':
                    return 'img/dpp.svg';
                    break;
                case 'TSU':
                    return 'img/tsu.png';
                    break;
                case 'PFP':
                    return 'img/pfp.svg';
                    break;
                case 'NSU':
                    return 'img/nsu.svg';
                    break;
                default:
                    return 'img/ic.svg';
                    break;
            }
        };
    })
    .filter('toTextLabel', function() {
        return function (input) {
            switch (input) {
                case 0:
                    return '不支持'
                    break;
                case 1:
                    return '支持'
                    break;
                case 2:
                    return '不表態'
                    break;
                default:
                    return '尚未表態';
                    break;
            }
        };
    })
    .filter('choiceClass', function() {
        return function (input) {
            switch (input) {
                case 0:
                case 1:
                case 2:
                    break;
                default:
                    return 'choice-unknown';
                    break;
            }
        };
    });

angular.module('stringFilters', [])
    .filter('strip', function() {
        return function (input, regexString) {
            var regex = new RegExp(regexString);
            return input.replace(regex, '');
        };
    });
