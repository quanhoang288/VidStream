const addPaginationParams = async (req, res, next) => {
  const { lastObjectId, limit } = req.query;
  req.paginationParams = {
    lastObjectId,
    limit: parseInt(limit, 10) || 10,
  };

  next();
};

module.exports = addPaginationParams;
