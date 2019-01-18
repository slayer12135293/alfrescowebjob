import React, { Component } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'

import './company-details.scss'


class CompanyDetails extends Component {
    render() {
        const { properties } = this.props
        return (
            <Accordion>
                <AccordionItem>
                    <AccordionItemTitle>
                        <div className="label">
                           Company name
                        </div>
                        <div className="text">
                            {properties["dts:companyName"]}
                        </div>                        
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:companyName"]}</p>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <div className="label">
                            Organization number
                        </div>
                        <div className="text">
                            {properties["dts:organisationNumber"]}
                        </div>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:organisationNumber"]}</p>
                    </AccordionItemBody>
                </AccordionItem>             
                <AccordionItem>
                    <AccordionItemTitle>
                        <div className="label">
                            Registration year
                        </div>
                        <div className="text">
                            {properties["dts:registrationYear"]}
                        </div>
                        
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <p>{properties["dts:registrationYear"]}</p>
                    </AccordionItemBody>
                </AccordionItem>             
            </Accordion>           
        )
    }
}

export default CompanyDetails