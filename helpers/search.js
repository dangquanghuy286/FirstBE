module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };
  if (query.keyword) {
    objectSearch.keyword = query.keyword.trim(); //trim() la ham loai bo khoang trang
    const regex = new RegExp(objectSearch.keyword, "i"); //i là để không phân biệt chữ hoa chữ thường
    objectSearch.regex = regex;
  }
  return objectSearch;
};
