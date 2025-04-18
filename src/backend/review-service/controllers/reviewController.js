const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { audiobookId, userId, rating, comment } = req.body;
  try {
    const review = new Review({ audiobookId, userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

exports.getReviewsByContent = async (req, res) => {
  try {
    const reviews = await Review.find({ audiobookId: req.params.audiobookId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.getReviewSummary = async (req, res) => {
  try {
    const audiobookId = req.params.audiobookId;
    const reviews = await Review.find({ audiobookId });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    res.json({
      audiobookId,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get review summary' });
  }
};
