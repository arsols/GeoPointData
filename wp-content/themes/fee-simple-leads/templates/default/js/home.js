/** Home Page Locations Auto-Complete  */

$(document).ready(function() {
    initAffiliateCookie();
    initSelect2();
});

function initAffiliateCookie() {
    var affRef = $('#aff-ref').val();
    if (affRef) {
        Cookies.set("affwp_ref", affRef);
    }
}

function initSelect2() {
    $('#locations').select2({
        templateResult: formatLocation,
        placeholder: "   Enter City, County or Zip code",
        minimumInputLength: 3,
        multiple: true,
        closeOnSelect: false,
        width: '100%',
        ajax: {
            url: config.DO_ROOT_URL + '/data-origination/location',
            data: function (params) {
              var query = {
                  keyword: params.term
              }
              return query;
            },
            processResults: function(data) {
            return {
                results: jQuery.map(data.results, function(item, index) {
                    return {
                        'id': item.type + '|' + item.code,
                        'text': item.display,
                        'type': item.type
                    };
                })
            };
            },
            dataType: 'json',
            delay: 250,
            cache: true
        }
    });
}
  
function formatLocation (location) {
    if (!location.id) {
        return location.text;
    }
    var $location = $('<div class="location-container"><span class="location-text">' + location.text + '</span> <span class = "location-type">' + locationLabel(location.type) + '</span></div>');
    return $location;
};
  
function locationLabel(key) {
    if (key == 'CITY') {
        return 'CITY';
    } else if (key == 'COUNTY') {
        return 'COUNTY';
    } else if (key == 'ZIP_CODE') {
        return 'ZIP CODE';
    }
    return '';
}