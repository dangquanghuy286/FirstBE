module.exports = (objectPagination, query, countProducts) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limit;

  const totalPage = Math.ceil(countProducts / objectPagination.limit);

  objectPagination.totalPage = totalPage;
  return objectPagination;
};
