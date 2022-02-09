const addPaginationParams = async (req, res, next) => {
  const { lastObjectId, limit } = req.query;
  console.log(req.query);
  req.paginationParams = {
    lastObjectId,
    limit: limit || 10,
  };

  next();
};

module.exports = addPaginationParams;
