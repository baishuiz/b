Air.Module('utility.query', function(require) {
    var query = {
        getQuerys: function (url) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
            while(match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            return params;
        },
        getQueryString: function (url) {
            var queryObj = query.getQuerys(url);
            var queryString = [];
            for (var key in queryObj) {
                queryString.push(key + '=' + queryObj[key]);
            }
            return queryString.length ? ('?' + queryString.join('&')) : '';
        }
    };

    return query;
});
