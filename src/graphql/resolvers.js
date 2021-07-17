const { GraphQLUpload } = require('graphql-upload');

const mutations = require('./mutations');
const queries = require('./queries');

module.exports = { Mutation: { ...mutations }, Query: { ...queries }, Upload: GraphQLUpload };
