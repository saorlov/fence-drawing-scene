import { Stage, Layer, Shape, Circle, Text } from 'react-konva';
import {useState, useRef, useEffect, useContext} from "react";
import {DrawContext} from "../../../context/Contexts";
import disableScroll from 'disable-scroll';

const divideLine = (point1, point2, interval) => {
    const parametricLine = (p1, p2, step) => {
        return [p1[0] + (p2[0] - p1[0]) * step, p1[1] + (p2[1] - p1[1]) * step]
    }

    const step = interval / ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** .5
    const points = []
    let i = 1
    points.push(point1)
    while (step * i < 1)  {
        points.push(parametricLine(point1, point2, step * i))
        i += 1
    }
    points.push(point2)
    return points
}

const checkPoint = (newPoint, points) => {
    for (let posKey of points) {
        let [x, y] = posKey
        const distance = ((x - newPoint[0]) ** 2 + (y - newPoint[1]) ** 2) ** .5
        if (distance <= 15) return false
    }
    return true
}

const DrawCanvas = () => {
    const ctx = useContext(DrawContext)
    const [tool, setTool] = useState('pen')
    const [currentLine, setCurrentLine] = useState({})
    const [startPosition, setStartPosition] = useState({
        x: undefined,
        y: undefined,
    })
    const [cursorPosition, setCursorPosition] = useState({
        x: undefined,
        y: undefined,
    })
    const points = ctx.points
    const setPoints = ctx.setPoints
    const lines = ctx.lines
    const setLines = ctx.setLines
    const [recentlyAdded, setRecentlyAdded] = useState(false)
    const isDrawing = useRef(false);
    const pointRef = useRef(null)
    const [activityCounter, setActivityCounter] = useState(0)
    const interval = 3.5 * 17

    useEffect(() => {
        if (recentlyAdded) {

            for (const line of lines) {
                const dividePoints = divideLine(line.start, line.end, interval)
                for (const dividePoint of dividePoints) {
                    if (checkPoint(dividePoint, points)) {
                        setPoints(prevState => {
                            return [...prevState, dividePoint]
                        })
                    }
                }
            }

            setRecentlyAdded(false)
        }
    }, [lines, recentlyAdded, setRecentlyAdded, points, setPoints, interval])

    const handleMouseDown = (e) => {
        if (!isDrawing.current) {
            disableScroll.on()
            isDrawing.current = true;
            const pos = e.target.getStage().getPointerPosition();
            for (let posKey of points) {
                let [x, y] = posKey
                const distance = ((x - pos.x) ** 2 + (y - pos.y) ** 2) ** .5
                if (distance <= 12) {
                    setStartPosition({
                        x: x,
                        y: y,
                    })
                    return
                }
            }
            setStartPosition({
                x: pos.x,
                y: pos.y,
            })
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        setCurrentLine({tool, points: {
                start: [startPosition.x, startPosition.y]
            }
        })
        setCursorPosition({
            x: e.target.getStage().getPointerPosition().x,
            y: e.target.getStage().getPointerPosition().y,
        })
    };

    const handleMouseUp = () => {
        disableScroll.off()
        isDrawing.current = false
        if (!cursorPosition.x) return
        let isNearest = false
        let nearestX
        let nearestY

        for (let posKey of points) {
            if (!isNearest) {
                let [x, y] = posKey
                const distance = ((x - cursorPosition.x) ** 2 + (y - cursorPosition.y) ** 2) ** .5
                if (distance <= 12) {
                    isNearest = true
                    nearestX = x
                    nearestY = y
                    break
                }
            }
        }

        let newLine

        if (isNearest) {
            newLine = {
                ...currentLine.points,
                end: [nearestX, nearestY],
            }
        } else {
            newLine = {
                ...currentLine.points,
                end: [cursorPosition.x, cursorPosition.y],
            }
        }
        setLines([...lines, newLine])
        setCurrentLine({})
        setCursorPosition({
            x: undefined,
            y: undefined,
        })
        setRecentlyAdded(true)

    }

    const handlePointHover = (e) => {
        e.target.attrs.fill = 'red'
        setActivityCounter(activityCounter + 1)

    }

    const handlePointHoverOut = (e) => {
        e.target.attrs.fill = 'white'
        setActivityCounter(activityCounter + 1)
    }

    return (
        <div >
            <Stage
                width={450}
                height={450}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <Layer>
                    <Text text="Область для рисования" x={5} y={30} />
                    {lines.map((line, i) => (
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(line.start[0], line.start[1]);
                                context.lineTo(line.end[0], line.end[1]);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            key = {i}
                            fill="#00D2FF"
                            stroke="black"
                            strokeWidth={5}
                        />
                    ))}
                    {points.map((point, i) => (
                        <Circle
                            key={i}
                            ref={pointRef}
                            onMouseEnter={handlePointHover}
                            onMouseLeave={handlePointHoverOut}
                            x={point[0]}
                            y={point[1]}
                            radius={4}
                            stroke={"black"}
                            strokeWidth={2}
                            fill="white"
                        />
                    ))}
                    {
                        currentLine.points &&
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(currentLine.points.start[0], currentLine.points.start[1]);
                                context.lineTo(cursorPosition.x, cursorPosition.y);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill="#00D2FF"
                            stroke="black"
                            strokeWidth={5}
                        />
                    }
                </Layer>
            </Stage>
            {/*<select*/}
            {/*    value={tool}*/}
            {/*    onChange={(e) => {*/}
            {/*        setTool(e.target.value);*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <option value="pen">Pen</option>*/}
            {/*    <option value="eraser">Eraser</option>*/}
            {/*</select>*/}
            <div>
                <span>Cost: </span><span>{ctx.cost.toFixed(2)}&nbsp;RUB</span>
            </div>
            <div>
                <span>Fence Length: </span><span>{ctx.length.toFixed(2)}&nbsp;m</span>
            </div>
        </div>
    );
};

export default DrawCanvas;
