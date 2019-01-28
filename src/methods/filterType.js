const sort = (arr = [], key) => {
    if (key !== "ALL") {
        return arr.filter(el => el.type === key)
    }
    return arr
}

export default sort;