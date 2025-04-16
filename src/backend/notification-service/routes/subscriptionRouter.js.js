const express = require('express')
const router = express.Router()
const sbController = require('../controllers/notificationController.js')

router.get('/',sbController.getAll);

router.get('/:email',sbController.getAll);

router.post('/',sbController.create);

module.exports = router;