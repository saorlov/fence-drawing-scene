import React, {useContext} from 'react';
import {FencePoint, SceneProps} from "../../../models/types";
import * as THREE from "three";
import {DrawContext} from "../../../context/Contexts";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {TextureLoader} from "three";
import {useLoader} from "@react-three/fiber";

const normalizePoint = (a: number, ratio: number) => {
    return (a / ratio - .5) * 9
}

const buildFence = (points: FencePoint[], i: number, material: ReactJSXElement, ratio: number) => {

    const geometry = new THREE.BufferGeometry()
    const pointsArray = new Float32Array([
        normalizePoint(points[0][0], ratio), 0, normalizePoint(points[0][1], ratio),
        normalizePoint(points[0][0], ratio), .5 * ratio / 450, normalizePoint(points[0][1], ratio),
        normalizePoint(points[1][0], ratio), 0, normalizePoint(points[1][1], ratio),

        normalizePoint(points[1][0], ratio), 0, normalizePoint(points[1][1], ratio),
        normalizePoint(points[1][0], ratio), .5 * ratio / 450, normalizePoint(points[1][1], ratio),
        normalizePoint(points[0][0], ratio), .5 * ratio / 450, normalizePoint(points[0][1], ratio),
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

const Lines = ({ratio}: SceneProps) => {

    const colorMap = useLoader(TextureLoader, 'textures/Brick_Wall_009_COLOR.jpg')
    const ctx = useContext(DrawContext)
    const lines = ctx.lines

    const material = <meshBasicMaterial color={'gray'} side={2} wireframe={false} />
    const pillarMaterial = <meshStandardMaterial map={colorMap} color={'pink'} />

    const meshes = lines.map((line,i) => {
        return (
            <>
                {buildFence([line.start, line.end], i, material, ratio)}
                {
                    line.points.map((point, i) => {
                        return (
                            <mesh
                                key={i}
                                position={[
                                    (point[0] / ratio - .5) * 9,
                                    .3  * ratio / 450,
                                    (point[1] / ratio - .5) * 9,
                                ]}
                            >
                                <boxGeometry args={[.1, .6, .1]} />
                                {pillarMaterial}
                            </mesh>
                        )
                    })
                }
            </>
        )
    })

    return (
        <>
            { meshes.map(m => m) }
        </>
    );
}

export default Lines;
