const sort = (arr = [], key) => {
    if (key.length >= 0) {
        var newarr = arr.filter(el => el.system_name.toLowerCase().includes(key.toLowerCase()))
        return newarr
    }
    return arr
}

export default sort;