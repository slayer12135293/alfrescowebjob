import React, { Component } from 'react'

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'

import './technical-details.scss'

class TechnicalDetails extends Component {    
    render() {
        const { properties } = this.props
        return (
            <Accordion>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Heating </h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:Heating"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Cooling</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:cooling"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Facade</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:facade"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Foundation</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:foundation"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Frame</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:frame"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Main structure</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:mainStructure"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Shelter</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:shelter"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Ventilation</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:ventilation"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Windows</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:windows"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h4>Roof</h4>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:yttertak"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
            </Accordion>           
        )
    }
}

export default TechnicalDetails