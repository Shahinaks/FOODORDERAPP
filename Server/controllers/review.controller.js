import Review from '../models/Review.model.js';

export const createReview = async (req, res) => {
  try {
    const { menuItem, rating, comment } = req.body;

    const existing = await Review.findOne({ user: req.user._id, menuItem });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted for this item' });
    }

    const review = await Review.create({
      user: req.user._id,
      menuItem,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review' });
  }
};

export const getReviewsByMenuItem = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user menuItem');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
