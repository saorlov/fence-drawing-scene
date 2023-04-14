import {useRef} from "react";
import React from 'react'
import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import Lines from "./Lines";
import useWindowSize from "../../../hooks/useWindowSize";
import {SceneProps} from "../../../models/types";

const ShowScene = ({ratio}: SceneProps) => {

    const cameraRef = useRef(null)
    const appViewport = useWindowSize()
    const canvasWidth = appViewport.windowWidth && appViewport.windowWidth > 450 ? 450 : 320

    return (
        <div style={{width: ratio, height: ratio}}>
            <Canvas>
                <Lines ratio={ratio} />
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
                    args={[75, ratio / ratio, .1, 100]}
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
