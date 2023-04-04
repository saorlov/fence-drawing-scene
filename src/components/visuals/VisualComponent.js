import React from 'react';
import DrawContextLayer from "../../context/drawContext/DrawContextLayer";
import DrawCanvas from "./canvas/DrawCanvas";
import ShowScene from "./show-scene/ShowScene";
import CallbackForm from "./callback-form/CallbackForm";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

function VisualComponent(props) {
    return (
        <>
            <DrawContextLayer>
                <Tabs>
                    <TabList>
                        <Tab>One</Tab>
                        <Tab>Two</Tab>
                        <Tab>Three</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <DrawCanvas />
                        </TabPanel>
                        <TabPanel>
                            <ShowScene />
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