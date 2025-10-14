const express = require('express');

const router = express.Router();
const multer = require('multer');
const upload = multer();
const controller = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// All review routes require authentication
router.post('/review', auth, upload.single('file'), controller.handleReview);
router.get('/reports', auth, controller.getReports);
router.get('/reports/:id', auth, controller.getReportById);

module.exports = router;
