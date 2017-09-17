/* GET 'home' page*/
module.exports.homelist = function (req, res) {
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
      sidebar:  "Looking for wifi and a seat? Loc8r helps you find" +
      " places to work when out and about. Perhaps with, cake or a pint? Let Loc8rhelp you find the place you're looking for.",
      locations: [{
            name: 'Starcups',
            address: '123 Hige Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
            distance: '100m'
        }, {
            name: 'Cafe Hero',
            address: '123 Hige Street, Reading, RG6 1PS',
            rating: 4,
            facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
            distance: '100m'
        }, {
            name: 'Starcups',
            address: '123 Hige Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
            distance: '100m'
        }, {
            name: 'Starcups',
            address: '123 Hige Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
            distance: '100m'
        }, {
            name: 'Starcups',
            address: '123 Hige Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
            distance: '100m'
        }]
    });
};
/* GET 'Location info' page*/
module.exports.locationInfo = function (req, res) {
    res.render('location-info', {title: 'Location Info'});
};

/* GET 'Add review' page */
module.exports.addReview = function (req, res) {
    res.render('location-review-form', {title: 'Add review'});
};