import React, {useContext} from 'react';
import {FencePoint} from "../../../models/types";
import * as THREE from "three";
import {DrawContext} from "../../../context/Contexts";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

const normalizePoint = (a: number) => {
    return (a / 450 - .5) * 9
}

const buildFence = (points: FencePoint[], i: number, material: ReactJSXElement) => {

    const geometry = new THREE.BufferGeometry()
    const pointsArray = new Float32Array([
        normalizePoint(points[0][0]), 0, normalizePoint(points[0][1]),
        normalizePoint(points[0][0]), .5, normalizePoint(points[0][1]),
        normalizePoint(points[1][0]), 0, normalizePoint(points[1][1]),

        normalizePoint(points[1][0]), 0, normalizePoint(points[1][1]),
        normalizePoint(points[1][0]), .5, normalizePoint(points[1][1]),
        normalizePoint(points[0][0]), .5, normalizePoint(points[0][1]),
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3))
    geometry.computeVertexNormals()

    return (
        <mesh
            key={i}
            geometry={geometry}
        >
            {material}
        </mesh>
    )
}

const Lines = () => {

    const ctx = useContext(DrawContext)
    const lines = ctx.lines

    const material = <meshBasicMaterial color={'gray'} side={2} wireframe={false} />

    const meshes = lines.map((line,i) => {
        return buildFence([line.start, line.end], i, material)
    })

    return (
        <>
            {meshes.map(m => m)}
        </>
    );
}

export default Lines;
