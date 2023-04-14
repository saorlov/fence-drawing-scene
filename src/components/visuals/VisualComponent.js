import React from 'react';
import DrawContextLayer from "../../context/drawContext/DrawContextLayer";
import DrawCanvas from "./canvas/DrawCanvas";
import ShowScene from "./show-scene/ShowScene";
import CallbackForm from "./callback-form/CallbackForm";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import useWindowSize from "../../hooks/useWindowSize";

function VisualComponent() {

    const appViewport = useWindowSize()
    const ratio = appViewport.windowWidth > 450 ? 450 : 320

    return (
        <>
            <DrawContextLayer>
                <Tabs>
                    <TabList>
                        <Tab>Рисовать</Tab>
                        <Tab>Рисунок в 3D</Tab>
                        {/*<Tab>Three</Tab>*/}
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <DrawCanvas ratio={ratio} />
                        </TabPanel>
                        <TabPanel>
                            <ShowScene ratio={ratio} />
                        </TabPanel>
                        <TabPanel>
                            <CallbackForm />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </DrawContextLayer>
        </>
    );
}

export default VisualComponent;
