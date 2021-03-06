class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.totalPages;
  }

  static totalPages() {
    return this.totalPages;
  }

  filter() {
    // Filtering
    // /api/v1/tours?duration=5
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    // /api/v1/tours?duration[gte]=5
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt"lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    // Searching
    // /api/v1/tours?search=The
    if (this.queryString.search) {
      const search = this.queryString.search;
      var searchRegex = new RegExp(search, 'i');
      this.query = this.query.find({ name: searchRegex }, null);
    }

    return this;
  }

  sort() {
    // Sorting
    // /api/v1/tours?sort=price
    // /api/v1/tours?sort=-price
    // /api/v1/tours?sort=price,ratingsAverage
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // Field Limiting
    // /api/v1/tours?fields=duration,price,name
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // Pagination
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 6;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
