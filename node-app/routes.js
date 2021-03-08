const router = require('express').Router();

const { setRequestType } = require('./middleware');
const apis = require('./api');

router.get('/:type(tags|bookmarks)', setRequestType, apis.getAll);
router.post('/:type(bookmarks)', setRequestType, apis.post);
router.put('/:type(bookmarks)', setRequestType, apis.put);
router.put('/:type(bookmarks)/:index', setRequestType, apis.updateByIndex);

module.exports = router;
