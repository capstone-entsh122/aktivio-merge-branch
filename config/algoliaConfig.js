const algoliasearch = require('algoliasearch');
const client = algoliasearch('XF4QR89Z7C', '583fee7b08443a9b7659ced340fc3e96');
const index = client.initIndex('communities');



module.exports = index;
