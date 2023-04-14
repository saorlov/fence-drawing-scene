import { Stage, Layer, Shape, Circle, Text } from 'react-konva';
import {useState, useRef, useEffect, useContext} from "react";
import {DrawContext} from "../../../context/Contexts";
import disableScroll from 'disable-scroll';
import {divideLine, checkPoint} from './DrawFunctions'
import {Button, Box, ButtonGroup} from '@chakra-ui/react'
import useWindowSize from "../../../hooks/useWindowSize";

const DrawCanvas = (props) => {
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
    const [lastAction, setLastAction] = useState(null)
    const [recentlyAdded, setRecentlyAdded] = useState(false)
    const isDrawing = useRef(false);
    const pointRef = useRef(null)
    const [activityCounter, setActivityCounter] = useState(0)
    const interval = 3.5 * 17.4 // 1 : 1

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
        if (!isDrawing.current && tool === 'pen') {
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
                id: Date.now(),
                end: [nearestX, nearestY],
                points: divideLine(currentLine.points.start, [nearestX, nearestY], interval)
            }
        } else {
            newLine = {
                ...currentLine.points,
                id: Date.now(),
                end: [cursorPosition.x, cursorPosition.y],
                points: divideLine(currentLine.points.start, [cursorPosition.x, cursorPosition.y], interval)
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
        e.target.attrs.fill = 'blue'
        setActivityCounter(activityCounter + 1)

    }

    const handlePointHoverOut = (e) => {
        e.target.attrs.fill = 'white'
        setActivityCounter(activityCounter + 1)
    }

    const handleUndo = () => {
        if (lines.length) {
            const actions = [...lines]
            const lastAction = actions.pop()
            setLastAction({
                lines: lastAction,
                points: null
            })
            setLines(actions)
        }
    }

    const handleRedo = () => {
        if (!lastAction) return
        const actions = [...lines, lastAction.lines]
        setLines(actions)
        setLastAction(null)
    }

    const handleClear = () => {
        setLines([])
        setPoints([])
    }

    // const handleDragStart = (e) => {
    //     const id = e.target.attrs
    //     console.log(id)
    //     const items = lines.slice();
    //     const item = items.find((i) => i.id === id);
    //     const index = items.indexOf(item);
    //     // // remove from the list:
    //     // items.splice(index, 1);
    //     // // add to the top
    //     // items.push(item);
    //     // this.setState({
    //     //     items,
    //     // });
    // };
    // const onDragEnd = (e) => {
    //     const id = e.target.attrs.id
    //     const items = lines.slice();
    //     const item = items.find((i) => i.id === id);
    //     const index = items.indexOf(item);
    //     // update item position
    //     items[index] = {
    //         ...item,
    //         x: e.target.x(),
    //         y: e.target.y(),
    //     };
    //     this.setState({ items });
    // };

    return (
        <div >
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={'5'}
            >
                <Button
                    colorScheme='blackAlpha'
                    onClick={handleUndo}
                >
                    Отменить
                </Button>
                <Button
                    colorScheme='blackAlpha'
                    onClick={handleRedo}
                >
                    Вернуть
                </Button>
                <Button
                    colorScheme='blackAlpha'
                    onClick={handleClear}
                >
                    Очистить
                </Button>
            </Box>

            <Stage
                width={props.ratio}
                height={props.ratio}
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
                        <>
                            <Shape
                                sceneFunc={(context, shape) => {
                                    context.beginPath();
                                    for (let j = 0; j < line.points.length - 1; j++) {
                                        context.moveTo(line.points[j][0], line.points[j][1])
                                        context.lineTo(line.points[j + 1][0], line.points[j + 1][1])
                                    }
                                    context.closePath();
                                    context.fillStrokeShape(shape);
                                }}
                                // draggable={tool === 'move'}
                                key={i}
                                id={`${line.id}`}
                                // onDragStart={handleDragStart}
                                // onDragEnd={onDragEnd}
                                fill="#00D2FF"
                                stroke="black"
                                strokeWidth={5}
                            />
                            {line.points.map((point, j) => (
                                <Circle
                                    key={j}
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
                        </>

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
            <div>
                <div>
                    <div>
                        <span>Стоимость: </span><span>{ctx.cost.toFixed(2)}&nbsp;RUB</span>
                    </div>
                    <div>
                        <span>Общая длина забора: </span><span>{ctx.length.toFixed(2)}&nbsp;m</span>
                    </div>
                </div>
                {/*<div>*/}
                {/*    <select*/}
                {/*        value={tool}*/}
                {/*        onChange={(e) => {*/}
                {/*            setTool(e.target.value);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <option value="pen">Перо</option>*/}
                {/*        <option value="move">Переместить</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default DrawCanvas;
