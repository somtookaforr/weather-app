import React, { Component } from 'react';
import './App.css';
// import { Info } from './Info';
// import { Searchbar } from './Searchbar';
import { WeatherData } from './components/WeatherData'
import {StatusData} from './components/StatusData'



export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'init',
      isLoaded: false,
      weatherData: null
    };
    this.changeLocation = this.changeLocation.bind(this); //'this' in the changeLocation func is referring to the App component
  }

  // fetch weather
  callWeatherApi = async (latitude, longitude, location) => {
    let response = await fetch('/api/weather?latitude=' + latitude + '&longitude=' + longitude + '&location=' + location);
    let body = await response.json();

    if (body.cod == 404) {
      console.log("error")
      throw Error(body.message);
    } else {
      console.log(body.message) 
      this.callUnsplashApi(body.name)
      this.setState({
        errorText: "",
        data: body,
        loading: false
      })
      return body;
    }
  };

  // 4. Grab location from Searchbar and then callWeatherApi
  changeLocation(location) {
    this.setState({
      location: location
    }, () => {
      this.callWeatherApi("latitude", "longitude", this.state.location)
        .then(res => this.setState({ response: res.express }))
        .catch(err =>
          this.setState({
            errorText: "city does not exist",
          }),
          console.log(this.state.errorText)

        );
    });
   }

   weatherInit = () => {
    const success = (position) => {
      this.setState({status: 'fetching'});
      localStorage.setItem('location-allowed', true);
      this.getWeatherData(position.coords.latitude, position.coords.longitude);
    }
  
    const error = () => {
      this.setState({status: 'unable'});
      localStorage.removeItem('location-allowed');
      alert('Unable to retrieve location.');
    }
  
    if (navigator.geolocation) {
      this.setState({status: 'fetching'});
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      this.setState({status: 'unsupported'});
      alert('Your browser does not support location tracking, or permission is denied.');
    }
  }

  // 2. callWeatherApi with cached coords
  setCoordsFromLocalStorage(cachedLat, cachedLon) {
    this.setState({
      latitude: cachedLat,
      longitude: cachedLon
    }, () => {
      this.callWeatherApi(this.state.latitude, this.state.longitude, "geo")
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
    });
  }

  // 1. When component mounts, set cached variables, if lat exists then callWeatherApi, if not then get lat and lon and callWeatherApi
  componentDidMount() {

    let cachedLat = localStorage.getItem('latitude');
    let cachedLon = localStorage.getItem('longitude');

    // checks to see if a lat already exists. If so, then no need to getCoords()
    cachedLat ? this.setCoordsFromLocalStorage(cachedLat, cachedLon) : this.getCoords();

  }

  returnActiveView = (status) => {
    switch(status) {
      case 'init':
        return(
          <button 
          className='btn-main' 
          onClick={this.onClick}
          >
            Get My Location
          </button>
        );
      case 'success':
        return <WeatherData data={this.state.weatherData} />;
      default:
        return <StatusData status={status} />;
    }
  }
  onClick = () => {
    this.weatherInit();
  }

render() {
  return (        
    <div className='App'>
    <div className='container'>
      {/* <WeatherData data={this.state.weatherData}/> */}
      {this.returnActiveView(this.state.status)}
    </div>
    </div>
  );
}
}

export default App;