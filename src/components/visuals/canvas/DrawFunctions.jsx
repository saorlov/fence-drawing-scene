export const divideLine = (point1, point2, interval) => {
    const parametricLine = (p1, p2, step) => {
        return [p1[0] + (p2[0] - p1[0]) * step, p1[1] + (p2[1] - p1[1]) * step]
    }

    const step = interval / ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** .5
    const points = []
    let i = 1

    points.push(point1)
    while (step * i < 1)  {
        const newPoint = parametricLine(point1, point2, step * i)
        if (checkPoint(newPoint, points)) points.push(newPoint)
        i += 1
    }
    points.push(point2)
    return points
}

export const checkPoint = (newPoint, points) => {
    for (let posKey of points) {
        let [x, y] = posKey
        const distance = ((x - newPoint[0]) ** 2 + (y - newPoint[1]) ** 2) ** .5
        if (distance <= 15) return false
    }
    return true
}
