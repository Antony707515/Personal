const fs = require('fs');
const { getDataByReqType, getInsertPayload, getDataStoreByReqType } = require('./helper');

class Apis {
  getAll(req, res, next) {
    try {
      const data = getDataByReqType(req);
      res.status(200).send({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async post(req, res, next) {
    try {
      const { requestType } = req;
      const result = await getInsertPayload(req);
      fs.writeFile(`./data-store/${requestType}.json`, JSON.stringify(result), (err) => {
        const data = getDataByReqType(req);
        res.status(200).send({ success: true, data });
      });
    } catch (error) {
      next(error);
    }
  }

  async put(req, res, next) {
    try {
      const { requestType, body } = req;
      const { data } = body;
      const { currentId } = getDataStoreByReqType(req);
      fs.writeFile(`./data-store/${requestType}.json`, JSON.stringify({ data, currentId }), (err) => {
        res.status(200).send({ success: true, data: {} });
      });
    } catch (error) {
      next(error);
    }
  }

  async updateByIndex(req, res, next) {
    try {
      const { requestType, params, body } = req;
      console.log('the req, typ', requestType)
      const { currentId, data } = getDataStoreByReqType(req);
      const newData = [...data];
      newData[Number(params.index)] = body.data;
      fs.writeFile(`./data-store/${requestType}.json`, JSON.stringify({ data: newData, currentId }), (err) => {
        res.status(200).send({ success: true, data: {} });
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Apis();
