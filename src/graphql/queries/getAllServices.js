const Service = require('../../models/service');

const getAllServices = async () => {
  return await Service.find().populate('creatorId', 'email').populate('lastEditorId', 'email');
};

module.exports = { getAllServices };
