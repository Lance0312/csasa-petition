var url = "data/mly-8.json";

function getEmblem(partyCode) {
    switch (partyCode) {
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

function getChoice(choiceCode) {
    switch (choiceCode) {
        case '0':
            return '不支持'
            break;
        case '1':
            return '支持'
            break;
        case '2':
            return '不表態'
            break;
        default:
            return '尚未表態';
            break;
    }
};

function createElement(data) {
    var div = document.createElement('div');
    div.addClassName('legislator-slot col-xs-3 col-md-2');

    var avatarDiv = document.createElement('div');
    avatarDiv.addClassName('avatar');
    var avatarImg = document.createElement('img');
    avatarImg.src = data.avatar + '?size=large';
    avatarImg.alt = data.name;
    avatarDiv.appendChild(avatarImg);

    var emblemDiv = document.createElement('div');
    emblemDiv.addClassName('emblem col-md-4');
    var emblemImg = document.createElement('img');
    emblemImg.src = getEmblem(data.party);
    emblemImg.width = 32;
    emblemImg.height = 32;
    emblemDiv.appendChild(emblemImg);

    var nameDiv = document.createElement('div');
    nameDiv.addClassName('name');
    nameDiv.update(data.name);

    var tmpDiv = document.createElement('div');
    tmpDiv.addClassName('col-md-10 col-md-offset-1 row');
    var identityDiv = document.createElement('div');
    identityDiv.addClassName('identity row');

    var choiceDiv = document.createElement('div');
    choiceDiv.addClassName('choice');
    choiceDiv.update(getChoice(data.choice));

    div.appendChild(avatarDiv);
    tmpDiv.appendChild(emblemDiv);
    tmpDiv.appendChild(nameDiv);
    identityDiv.appendChild(tmpDiv);
    div.appendChild(identityDiv);
    div.appendChild(choiceDiv);

    return div;
};

new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
        var data = transport.responseText.evalJSON();
        data.forEach(function(entry) {
            var div = createElement(entry);
            $('legislator-list').insert(div);
        });
    },
});
