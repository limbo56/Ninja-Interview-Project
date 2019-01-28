const sort = (arr = [], key) => key.length >= 0 ? arr.filter(el => el.system_name.toLowerCase().includes(key.toLowerCase())) : arr;
export default sort;