const express = require('express')
const router = express.Router()
const sbController = require('../controllers/subscriptionController.js')

router.get('/',sbController.getAll);

router.get('/:email',sbController.getByEmail);

router.post('/',sbController.create);

module.exports = router;