import React, { Component } from 'react';
import './App.css';
import { Searchbar } from './Searchbar';
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
  getWeatherData = async (latitude, longitude, location) => {
    let response = await fetch('/api/weather?latitude=' + latitude + '&longitude=' + longitude + '&location=' + location);
    let body = await response.json();

    if (body.cod == 404) {
      console.log("error")
      throw Error(body.message);
    } else {
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