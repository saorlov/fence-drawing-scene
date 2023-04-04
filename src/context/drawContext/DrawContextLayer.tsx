import {useEffect, useState} from "react";
import { DrawContext } from "../Contexts";
import {CtxProps, FenceLine, FencePoint, InitialDrawCtxValue} from "../../models/types";

function DrawContextLayer({ children }: CtxProps) {

    const [points, setPoints] = useState<FencePoint[]>([])
    const [lines, setLines] = useState<FenceLine[]>([])
    const [cost, setCost] = useState(0)
    const [length, setLength] = useState(0)

    useEffect(() => {
        let length = 0
        for (const line of lines) {
            length += (((line.start[0] - line.end[0]) ** 2 + (line.start[1] - line.end[1]) ** 2) ** .5) / 155 * 9
        }
        const cost = length * 1000
        setLength(length)
        setCost(cost)
    }, [lines, setCost])

    const init: InitialDrawCtxValue = {
        points: points,
        setPoints: setPoints,
        lines: lines,
        setLines: setLines,
        cost: cost,
        length: length
    }

    return (
        <>
            <DrawContext.Provider value={init}>
                {children}
            </DrawContext.Provider>
        </>
    )
}

export default DrawContextLayer;
