const AppError = require('./../utils/appError');
const FilterFeatures = require('./../utils/filterFeatures');

exports.deleteOne = (Model) => {
  return async (req, res, next) => {
    try {
      const deletedDocument = await Model.findByIdAndDelete(req.params.id);

      if (!deletedDocument) {
        return next(
          new AppError(`No document found with id ${req.params.id}!`, 404)
        );
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.updateOne = (Model) => {
  return async (req, res, next) => {
    try {
      const updatedDocument = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedDocument) {
        return next(
          new AppError(`No document found with id ${req.params.id}!`, 404)
        );
      }

      res.status(200).json({
        status: 'success',
        data: {
          updatedDocument,
        },
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.createOne = (Model) => {
  return (exports.createItem = async (req, res, next) => {
    try {
      const newDocument = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: { item: newDocument },
      });
    } catch (err) {
      next(err);
    }
  });
};

exports.getOne = (Model) => {
  return async (req, res, next) => {
    try {
      const requestedDocument = await Model.findById(req.params.id);

      if (!requestedDocument) {
        return next(
          new AppError(`No document found with id ${req.params.id}!`, 404)
        );
      }

      res.status(200).json({
        status: 'success',
        data: {
          requestedDocument,
        },
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.getAll = (Model) => {
  return async (req, res, next) => {
    try {
      //for nested reviews on item route
      let reviewFilter = {};
      if (req.params.itemId) {
        reviewFilter = { aboutItem: req.params.itemId };
      }

      const filterFeatures = new FilterFeatures(
        Model.find(reviewFilter),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const documents = await filterFeatures.filteredObject;

      res.status(200).json({
        status: 'success',
        results: documents.length,
        data: {
          documents,
        },
      });
    } catch (err) {
      next(err);
    }
  };
};
