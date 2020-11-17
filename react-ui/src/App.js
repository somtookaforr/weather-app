import React from 'react';
import './App.css';
import { WeatherData } from './components/WeatherData'
import {StatusData} from './components/StatusData'
// import AbortController from "abort-controller";
const AbortController = require('abort-controller');



class App extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      status: 'init',
      isLoaded: false,
      weatherData: null
    }
  }

  abortController = new AbortController();
  controllerSignal = this.abortController.signal;
  
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
  
  
  getWeatherData = async (lat, lon, location) => {
    const weatherApi = await fetch('/api/weather?latitude=' + lat + '&longitude=' + lon + '&location=' + location);
     fetch(weatherApi, { signal: this.controllerSignal })
     .then(response => response.json())
     .then(
      (result) => {
        console.log(result);
        const { name } = result;
        const { country } = result.sys;
        const { temp, temp_min, temp_max, feels_like, humidity } = result.main;
        const { description, icon } = result.weather[0];
        const { speed, deg } = result.wind;
  
        this.setState({
          status: 'success',
          isLoaded: true,
          weatherData: {
            name,
            country,
            description,
            icon,
            temp: temp.toFixed(1),
            feels_like: feels_like.toFixed(1),
            temp_min: temp_min.toFixed(1),
            temp_max: temp_max.toFixed(1),
            speed,
            deg,
            humidity
          }
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
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


  componentWillUnmount() {
    this.abortController.abort();
  }

  componentDidMount() {
    // this.getWeatherData();
    // this.weatherInit();
    if(localStorage.getItem('location-allowed')) {
      this.weatherInit();
    } else {
      return;
    }
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