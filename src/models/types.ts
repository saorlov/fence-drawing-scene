import {Dispatch, SetStateAction} from "react";

export type FencePoint = Array<number>

export interface FenceLine {
    start: FencePoint,
    end: FencePoint,
}

export interface InitialDrawCtxValue {
    points: Array<FencePoint>,
    setPoints: Dispatch<SetStateAction<FencePoint[]>>,
    lines: FenceLine[],
    setLines: Dispatch<SetStateAction<FenceLine[]>>,
    cost: number,
    length: number,
}

export interface CtxProps {
    children: string | JSX.Element | JSX.Element[] | '() => JSX.Element'
}
