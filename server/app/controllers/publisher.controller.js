const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save new Publisher
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not empty"));
  }

  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.create(req.body);
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while creating publisher")
    );
  }
};

// Retrieve (truy suất) all Pubshiers of a user from database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const publisherService = new PublisherService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await publisherService.findByName(name);
    } else {
      documents = await publisherService.find({});
    }
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while retrieving Publishers")
    );
  }

  return res.send(documents);
};

// Find a single Pubshier with an id
exports.findOne = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found!"));
    }
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, `An error retrieving Pubshier with id=${req.params.id}`)
    );
  }
};

// Update a Pubshier by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.update(req.params.id, req.body);
    if (document === null) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send({ message: "Publisher was updated successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `An error updating publisher with id=${req.params.id}`)
    );
  }
};

// Delete a Book with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.delete(req.params.id);
    if (document === null) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send({ message: "Publisher was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `Could not delete publisher with id=${req.params.id}`)
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const deleteCount = await publisherService.deleteAll();
    return res.send({
      message: `${deleteCount} publishers were deleted successfully!`,
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all publishers")
    );
  }
};
