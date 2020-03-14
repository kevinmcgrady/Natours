const Tour = require('../models/Tour');
const { catchAsync } = require('../middleware/errorMiddleware');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review raring user',
  });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
