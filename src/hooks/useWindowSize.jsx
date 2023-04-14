import {useEffect, useState} from "react";

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        windowWidth: undefined,
        windowHeight: undefined,
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return windowSize
}

export default useWindowSize
