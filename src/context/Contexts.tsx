import { createContext } from "react";
import {InitialDrawCtxValue} from "../models/types";

const drawContextInitials: InitialDrawCtxValue = {
    points: [],
    setPoints: () => {},
    lines: [],
    setLines: () => {},
    cost: 0,
    length: 0
}

export const DrawContext = createContext(drawContextInitials)
