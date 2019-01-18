import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon} from 'google-maps-react'
import './map-container.scss'
import AsyncImage from '../../components/common/asyncImage/asyncImage'

class MapContainer extends Component {
    constructor(props){
        super(props);
        this.state={
            allEstates: [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            estateLinkUrl:'',
            imgSrc:'',
            bounds:null,

        }
      }
    componentDidMount(){
        const {items, useBounds=true} = this.props
        this.setState({
            allEstates: items
        })    
        let targetBounds = new google.maps.LatLngBounds()
       
        if(useBounds && items.length > 0){
            for (var i = 0; i < items.length; i++) {
                targetBounds.extend({lat: parseFloat(items[i].entry.properties["dts:lat-long"].split(',')[0]), lng: parseFloat(items[i].entry.properties["dts:lat-long"].split(',')[1])})
            }
            this.setState({
                bounds:targetBounds
            })
        }

    }


    componentDidUpdate(previousProps, previousState){
        const {items} = this.props
        if(previousState.allEstates !== this.props.items){
            this.setState({
                allEstates: items
            })
        }
    }

    _onMarkerClick = (props, marker) =>{
        const{ siteName } = this.props
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            estateLinkUrl:`/${props.itemObj.portfolioName}/${props.itemObj.portfolioId}/${props.itemObj.entry.name}/${props.itemObj.entry.id}/estate`,
            imgSrc:`${siteName}/documentLibrary/${props.itemObj.portfolioName}/${props.itemObj.entry.name}`
        })
    }   
     

    _onMapClicked = ()=> {
        if (this.state.showingInfoWindow) {
            this.setState({
              showingInfoWindow: false,
              activeMarker: null
            })
          }
    }

    render() {
        const {
            allEstates, 
            showingInfoWindow, 
            activeMarker, 
            selectedPlace, 
            estateLinkUrl, 
            imgSrc,    
            bounds,              
        } = this.state
        const { 
            zoomLevel, 
            centerAroundCurrentLocation, 
            centerObj, 
            mapType, 
            hasLinkToEstate=true,
            showImg=true,
            ticket,
            polygonCoords,
            } = this.props


        /*global google*/
        /*eslint no-undef: ["error", { "typeof": true }] */
        const _markerIcon = {
            url: '/svg/icons8-location.svg', 
            scaledSize: new google.maps.Size(64,64),
        }   
        
        
        return ( 
            <div className="map-container">   
                              
                <Map 
                    google={this.props.google}                     
                    centerAroundCurrentLocation={centerAroundCurrentLocation}
                    initialCenter={centerObj}
                    onClick={this._onMapClicked}
                    mapType={mapType}
                    streetViewControl={false}
                    gestureHandling={'greedy'}                    
                    zoom={zoomLevel} 
                    bounds={bounds}
                    mapTypeControl={false}
                    > 
                        { 
                            allEstates.length>0 ? allEstates.map(estate => {

                                if(estate.entry.properties["dts:lat-long"] !== undefined){
                                    return (
                                        <Marker
                                            title={estate.entry.name}
                                            name={estate.entry.properties["dts:address"]}
                                            position={{lat: estate.entry.properties["dts:lat-long"].split(',')[0], lng:estate.entry.properties["dts:lat-long"].split(',')[1]}} 
                                            key= {estate.entry.id}
                                            onClick={this._onMarkerClick}
                                            itemObj={estate}
                                            icon={_markerIcon}
                                            />)
                                }
                            

                            }): null
                        }   

                        {
                            polygonCoords?
                            <Polygon
                                paths={polygonCoords}
                                strokeColor="#0000FF"
                                strokeOpacity={0.8}
                                strokeWeight={2}
                                fillColor="#0000FF"
                                fillOpacity={0.35} />

                            :null
                        } 
                        
                        

                        <InfoWindow
                                marker={activeMarker}
                                visible={showingInfoWindow}>
                                    <div className="map-info-container">
                                        {
                                            imgSrc!=='' && showImg ?
                                            <AsyncImage imgPath={imgSrc} ticket={ticket} className="map-info-box-img"/> 
                                            : null 
                                        }
                                        
                                        <h3>{selectedPlace.title}</h3>
                                        <h4>
                                            {selectedPlace.name} <br/>

                                            {/* {selectedPlace.itemObj.entry.properties["dts:squareMetersString"]} m<sup>2</sup>  &#183;  Typkod {selectedPlace.itemObj.entry.properties["dts:typeCode"]}  */}
                                        </h4>
                                        {
                                            hasLinkToEstate && estateLinkUrl !== ''?
                                            <a className="link-text" href={estateLinkUrl}> 
                                                Go to property
                                            </a>   
                                            :null
                                        }
                                        
                                    </div>
                        </InfoWindow>           
            
                </Map>   
            </div>
            
        )
    }
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyBFqta9jVIkGpZgKkhn2pwkSSFFXTZTdsY'
  })(MapContainer)