const sort = (arr = [], key) => key !== "ALL" ? arr.filter(el => el.type === key) : arr;
export default sort;