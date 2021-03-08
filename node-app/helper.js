const get = require('lodash.get');

const htmlMetadataParser = require('html-metadata-parser');
const dataStore = require('./data-store');

const getDataStoreByReqType = (req) => {
  const { requestType } = req;
  return dataStore[requestType];
};

const getDataByReqType = (req) => {
  const dataStoreByReqType = getDataStoreByReqType(req);
  return dataStoreByReqType.data;
};

const getUrlDetails = (url) => new Promise((resolve) => {
  htmlMetadataParser.parser(url, function (err, body) {
    if (err) {
      console.log('th error is', err);
      resolve({ title: '', description: '', imgUrl: '', url });
    } else {
      console.log('The body is', body);
      const { title, description } = get(body, 'meta', {});
      const imgUrl = get(body, 'images[0].url', '');
      resolve({ title, description, imgUrl, url });
    }
  });
});

const getBookmarkPayload = async (req) => {
  const { body } = req;
  const urlDetiails = await getUrlDetails(body.url);
  return { ...urlDetiails, isFavourite: 0, tagName: null };
}

const getInsertPayload = async (req) => {
  const { requestType } = req;
  const { data, currentId } = getDataStoreByReqType(req);
  let result = {};
  if (requestType === 'bookmarks') {
    result = await getBookmarkPayload(req);
  } else {
    result = body;
  }
  result.id = currentId + 1;
  result.position = 0;
  const newData = data.map((obj) => ({ ...obj, position: obj.position + 1 }));
  newData.unshift(result);
  return { data: newData, currentId: currentId + 1 };
};

module.exports = {
  getDataByReqType,
  getDataStoreByReqType,
  getInsertPayload,
};
