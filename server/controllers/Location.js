const models = require('../models');

const { Location } = models;

const makerPage = (req, res) => {
  Location.LocModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), locs: docs });
  });
};
const makeLocation = (req, res) => {
  if (!req.body.name || !req.body.x || !req.body.z) {
    return res.status(400).json({ error: 'Both name and x and z coordinates are required' });
  }
  const locData = {
    name: req.body.name,
    x: req.body.x,
    z: req.body.z,
    owner: req.session.account._id,
  };

  const newLocation = new Location.LocModel(locData);

  const locPromise = newLocation.save();

  locPromise.then(() => res.json({ redirect: '/maker' }));

  locPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return locPromise;
};

const getLocations = (request, response) => {
  const req = request;
  const res = response;

  return Location.LocModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ locs: docs });
  });
};

// delete location
const deleteLocation = (request, response) => {
  const req = request;
  const res = response;

  return Location.LocModel.findByOwner(req.session.account._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return Location.LocModel.deleteOne({ _id: req.body.location_id }, (err1) => {
      if (err1) {
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ action: 'success!' });
    });
  });
};

module.exports.makerPage = makerPage;
module.exports.getLocations = getLocations;
module.exports.make = makeLocation;
module.exports.deleteLocation = deleteLocation;
