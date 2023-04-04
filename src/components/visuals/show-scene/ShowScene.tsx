import {useContext, useRef,} from "react";
import React from 'react'
import {DrawContext} from "../../../context/Contexts";
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {TextureLoader} from "three";
import Lines from "./Lines";

const ShowScene = () => {

    const ctx = useContext(DrawContext)
    const cameraRef = useRef(null)
    const points = ctx.points
    const ratio = 450
    const colorMap = useLoader(TextureLoader, 'textures/Brick_Wall_009_COLOR.jpg')
    const pillarMaterial = <meshStandardMaterial map={colorMap} color={'pink'} />

    return (
        <div style={{width: "450px", height: "450px"}}>
            <Canvas>
                {
                    points.map((point, i) => {
                        return (
                            <mesh
                                key={i}
                                position={[
                                    (point[0] / ratio - .5) * 9,
                                    .3,
                                    (point[1] / ratio - .5) * 9,
                                ]}
                            >
                                <boxGeometry args={[.1, .6, .1]} />
                                {pillarMaterial}
                            </mesh>
                        )
                    })
                }
                <Lines />
                <mesh
                    rotation={[
                        -Math.PI * .5, 0, 0
                    ]}
                    position={[
                        0, 0, 0
                    ]}
                >
                    <planeGeometry args={[10, 10, 16, 16]} />
                    <meshStandardMaterial color={'green'} />
                </mesh>
                <OrbitControls enableDamping rotateSpeed={1} />
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    args={[75, 450 / 450, .1, 40]}
                    position={[0, 7, 10]}
                />
                {/*<axesHelper args={[5]} />*/}
                <pointLight position={[0, 5, 0]} intensity={.4} distance={10} color={0xffffff} />
                <ambientLight intensity={.4} />
            </Canvas>
        </div>
    )
};

export default ShowScene;
