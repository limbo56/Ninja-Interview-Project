const sort = (arr = [], key) => {
    if (key === "LOW TO HIGH") {
        return arr.sort((a, b) => a.hdd_capacity - b.hdd_capacity)
    }
    else if (key === "HIGH TO LOW") {
        return arr.sort((a, b) => b.hdd_capacity - a.hdd_capacity)
    }
    return arr
}
export default sort;