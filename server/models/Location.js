const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let LocModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const LocSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  x: {
    type: Number,
    required: true,
  },

  z: {
    type: Number,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

LocSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  x: doc.x,
  z: doc.z,
});

LocSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LocModel.find(search).select('name x z').lean().exec(callback);
};

LocModel = mongoose.model('Location', LocSchema);

module.exports.LocModel = LocModel;
module.exports.LocSchema = LocSchema;
