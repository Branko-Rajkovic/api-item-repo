class FilterFeatures {
  constructor(filteredObject, reqQuery) {
    this.filteredObject = filteredObject;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryFilterFields = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryFilterFields[el]);

    const queryString = JSON.stringify(queryFilterFields).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.filteredObject = this.filteredObject.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      this.filteredObject = this.filteredObject.sort(this.reqQuery.sort);
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.filteredObject = this.filteredObject.select(fields);
    }

    return this;
  }

  paginate() {
    if (this.reqQuery.page) {
      const page = Number(this.reqQuery.page) || 1;
      const limit = Number(this.reqQuery.limit) || 3;
      const skip = (page - 1) * limit;

      this.filteredObject = this.filteredObject.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = FilterFeatures;
