const express = require('express')
const router = express.Router()
const nfController = require('../controllers/notificationController.js')

router.get('/',nfController.getAll);

router.post('/',nfController.create);

// router.post('/admin',nfController.publish);

module.exports = router;