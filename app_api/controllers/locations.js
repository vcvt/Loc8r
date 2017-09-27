var mongoose = require('mongoose');
//mongoose.model(modelName, schema)
var Loc = mongoose.model('location');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};
var theEarth = (function () {
  var earthRadius = 6371; //km, miles is 3959

  var getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function (distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
});
module.exports.locationsListByDistance = function (req,res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type : "Point",
    coordinates: [lng, lat]
  };

  //spherical determines whether the search will be done based on a spherical object or a flat plane
  //num limits geonear results

  var geoOptions = {
    spherical : true,
    maxDistance: theEarth().getRadsFromDistance(maxDistance),
    num : 10
  };
  if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance){
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {"message" : "lng, lat and maxDistance query parameters are all required"});
    return;
  }
  Loc.geoNear(point, geoOptions, function (err, results, stats) {
    var locations;
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    if(err){
      console.log('geoNear error: ', err);
      sendJsonResponse(res, 404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      //假设我们的函数是一个流，正常情况下是顺序执行的，但是当遇到文件io，
      // 数据库读写这类任务的时候，node会从这个流程中新建一个分支来执行，而主流程还在继续进行，也就是说按我上面的写法
      // ，无论如何都会走到最后一句，res.json一个成功的结果，若写mongodb没问题，也就不会触发err，从而触发res来返回结果，
      // 自然不会有问题，但如果写数据库出现err，程序就会找到主流程中的回调方法，而回调中又有一个res.json，自然是多次调用res.json导致程序崩溃。
      sendJsonResponse(res, 200, locations);
    }
  });
};

var buildLocationList = function (req, res, results, stats) {
  var locations = [];
  results.forEach(function (doc) {
    locations.push(
      {
        distance: theEarth().getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      }
    )
  });
  return locations;
};
module.exports.locationsCreate = function (req,res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.spilt(","),
    coords: [parseFloat(req.body.lng), parseFloat(re.body.lat)],
    openingTimes: [
      {
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },
      {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }
    ]
  }, function (err, location) {
    if(err){
      sendJsonResponse(res, 400, err);
    }else {
      sendJsonResponse(res, 201, location);
    }
  })
};

module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function (err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {'message': "locationid not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
      })
  } else {
    sendJsonResponse(res, 404, {'message': 'No locationid in request'});
  }

};

module.exports.locationsUpdateOne = function (req,res) {
  if (!req.params.locationid){
    sendJsonResponse(res, 404, {"message" : "Not found, locationid is required"});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(function (err, location) {
      if(!location){
        sendJsonResponse(res, 404, {"message" : "locationid not foujnd"});
        return;
      } else if(err){
        sendJsonResponse(res, 400, err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.spilt(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openningTimes = [
        {
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },
        {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }
      ];
      location.save(function (err, location) {
        if(err){
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res ,200, location)
        }
      })
    });
};

module.exports.locationsDeleteOne = function (req,res) {
  var locationid = req.params.locationid;
  if (locationid){
    Loc
      .findByIdAndRemove(locationid)
      .exec(function (err, location) {
        if(err){
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 204, null);
      })
  } else {
    sendJsonResponse(res, 404, {"message" : "No locationid"})
  }
};