import React, {Component} from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';
import './Map.css'

const style ={
  width: '40%',
  height:'30%'
}
export class MapComponent extends Component {
    constructor(props){
        super(props)

    this.state = {
            origin: this.props.start_loc,
            destination:this.props.end_loc,
            tripName: this.props.trip_name,
            startDate: this.props.start_date,
            endDate: this.props.endDate,
            distance:'',
            duration:''
            
          }
          this.calculateDistance = this.calculateDistance.bind(this);
    }

    componentWillReceiveProps(newProps){
        this.setState({
            origin: newProps.starting_loc,
            destination:newProps.end_loc,
            tripName: newProps.trip_name,
            startDate: newProps.start_date,
            endDate: newProps.endDate,
        })
    }

  onButtonClick=(e)=>
  { 
    if(this.state.origin){
    console.log("loaded")
    this.calculateDistance()
    this.getDirections()
    }
    else{
        console.log("loading . . .")
    }
  }
  getDirections=()=>
  {
    var request = {
    origin: this.state.origin,
    destination: this.state.destination,
    travelMode: 'DRIVING'
    };
  this.directionsService.route(request, (result, status)=> {
    if (status === 'OK') {
      this.directionsDisplay.setDirections(result);
    }
    else
    {
        window.alert('Directions request failed due to ' + status);
    }
  });
  }
  calculateDistance=()=>
  {
    const {google} = this.props;
    var service = new google.maps.DistanceMatrixService;
       service.getDistanceMatrix({
         origins: [this.state.origin],
         destinations: [this.state.destination],
         travelMode: 'DRIVING',
         unitSystem: google.maps.UnitSystem.IMPERIAL,
         avoidHighways: false,
         avoidTolls: false
       }, (response, status)=> {
         if (status !== 'OK') {
           alert('Error was: ' + status);
         } else {
           console.log(response);
           this.setState({distance:response.rows[0].elements[0].distance.text})
           this.setState({duration: response.rows[0].elements[0].duration.text})
           console.log(this.state.duration)
           console.log(this.state.distance)
         }
       });
  }
  componentDidMount=()=> {
    this.google = this.props.google

  }
  onMapReady=(mapProps, map)=>
  {
    this.map = map
    const {google} = this.props;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(map)
  }
render() {
  if (!this.props.loaded) {
      return (<div>Loading...</div>)
    }
    return (
      <div>
        <div className = "ButtonContainer">
       
          <button className = "DirectionsButton"onClick = {()=>this.onButtonClick()}> Get Directions</button>
        </div>
  <div className = "MapBody">
    <div className = "MapContainer">
      <Map google={this.props.google}
       initialCenter={{
            lat: 39.5,
            lng: -98.35
          }}
          zoom={3}
          style ={style} 
          onReady={this.onMapReady}>
      </Map>
      </div>
      <div className = "distAndTime">
        <label className = "Distance">Distance: 
          <div className = "Info">{this.state.distance}</div>
        </label>
        <label className = "Time">Travel Time: 
          <div className = "Info">{this.state.duration}</div>
        </label>
    </div>
    </div>
    <div className = "LowerBox">
      <button className = "CreateTrip">CreateTrip</button>
    </div>
  </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyA6CPBW4zwuXvVkmZSIFQaNjeuVQML9HtI',
  version: '3'
})(MapComponent)