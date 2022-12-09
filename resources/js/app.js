import {baseLayerLuminance} from "./bundles/fluent-web-components.js";

import Timer from "./components/timer.js";
import Geosearcher from "./components/geosearcher.js"
import Weather from "./components/weather.js"
import Forecast from "./components/forecast.js"
import DayForecast from "./components/day-forecast.js"
import Widget from "./components/widget.js"

import Loader from "./components/loader.js";

const { createApp, ref } = Vue;

window.App = createApp({
  data() {
    return {
      API: {
        data: {
          geolocation: null,
          weather: null,
          date: null
        },
        methods: {
          setGeolocation: this.setGeolocation,
          setDate: this.setDate,
          setWeather: this.setWeather
        },
        weather: this.weather,
        dailyWeather: this.dailyWeather,
        dailyWeatherWithoutHours: this.dailyWeatherWithoutHours,
        adaptiveWeather: this.adaptiveWeather,
        ISODateString: this.ISODateString,
        ISODayDateString: this.ISODayDateString
      },
      loadPromise: (async function () {
        await this.setGeolocation();
        await this.setDate(new Date());
        await this.setWeather();
      }.bind(this))()
    }
  },
  provide(){
    return {
      API: ref(this.API),
      loadPromise: this.loadPromise,
    }
  },
  mounted(){
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      this.setColorMode("dark");
    else
      this.setColorMode("light");
    
    setInterval(function () {
      this.setDate(new Date());
    }.bind(this), 1800000);
  },
  methods: {
    setColorMode: async function(colorMode){
      if(colorMode === "light"){
        baseLayerLuminance.setValueFor(document.body, 0.95);
        document.getElementById("app").className = "theme-light";
      } 
      else if(colorMode === "dark"){
        baseLayerLuminance.setValueFor(document.body, 0.13);
        document.getElementById("app").className = "theme-dark";
      }
      else throw new Error("Invalid color mode");
    },
    getColorMode(){
      const luminance = baseLayerLuminance.getValueFor(document.body);

      if(luminance >= 0.5)
        return "light";
      else return "dark";
    },
    setColorModeByDOMEvent: async function(event){
      const target = event.target;

      target.checked? this.setColorMode("dark") : this.setColorMode("light");
    },
    setGeolocation: async function(){
      await window.UserInfo.setGeolocationByGeoAPI();
      this.API.data.geolocation = window.UserInfo.geolocation;
    },
    setDate: async function(date){
      await window.UserInfo.setDate(date);
      this.API.data.date = window.UserInfo.date;
    },
    setWeather: async function(){
      if(!this.API.data?.geolocation)
        throw new Error("Geolocation has not been set");

      try{
        await window.WeatherInfo.setWeatherByMetheoAPI(this.API.data.geolocation);
        this.API.data.weather = window.WeatherInfo.weather;
      }catch(error){
        
      }
    },
    ISODateString(currentDate = this.API.data.date){
      let currentDateString;
        
      const minutes = currentDate.getMinutes();        
      if(minutes > 30){
        const hours = currentDate.getHours();
        currentDate.setHours((hours + 1));
      }
                    
      currentDate.setMinutes(0);
                    
      currentDateString = currentDate.toISOString();
      currentDateString = currentDateString.substring(0, currentDateString.lastIndexOf(":"));
        
      return currentDateString;
    },
    ISODayDateString(currentDate = this.API.data.date){
      const fullDate = this.ISODateString(currentDate);
      return fullDate.substring(0, fullDate.lastIndexOf("T"));
    },
    //returns complete weather for specific hour and day
    weather(date = this.API.data.date){
      if(!(date instanceof Date))
        date = new Date(date);
      
      const ISODate = this.ISODateString(date);
      const ISODateWithoutHours = ISODate.substring(0, ISODate.lastIndexOf("T"));
        
      let weather = {};
  
      //daily weather
      {
        const keys = Object.keys(this.API.data.weather.daily).filter(item => item !== "time");
        const time = this.API.data.weather.daily.time;
  
        const index = time.indexOf(ISODateWithoutHours);
  
        for(const key of keys)
          weather[key] = this.API.data.weather.daily[key][index];
      }
      //hourly
      {
        const keys = Object.keys(this.API.data.weather.hourly).filter(item => item !== "time");
        const time = this.API.data.weather.hourly.time;
  
        const index = time.indexOf(ISODate);
  
        for(const key of keys)
          weather[key] = this.API.data.weather.hourly[key][index];
      }
        
      if(ISODate === this.ISODateString(new Date()))
        weather = {...weather, ...this.API.data.weather.current_weather};
  
      return weather;
    },
    //return specific weather only for today, else return cumulative data
    adaptiveWeather(date = this.API.data.date){
      if(!(date instanceof Date))
        date = new Date(date);
      
      if(this.ISODayDateString(new Date()) === this.ISODayDateString(date))
        return this.weather(date);
      else
        return {...this.dailyWeather(date), ...this.dailyWeatherWithoutHours(date)};
    },
    //return cumulative weather for specific day
    dailyWeather(date = this.API.data.date){
      if(!(date instanceof Date))
        date = new Date(date);
      
      const ISODate = this.ISODateString(date);
      const ISODateWithoutHours = ISODate.substring(0, ISODate.lastIndexOf("T"));

      let weather = {};

      //daily weather
      {
        const keys = Object.keys(this.API.data.weather.daily).filter(item => item !== "time");
        const time = this.API.data.weather.daily.time;
  
        const index = time.indexOf(ISODateWithoutHours);
  
        for(const key of keys)
          weather[key] = this.API.data.weather.daily[key][index];
      }
      //hourly
      {
        const keys = Object.keys(this.API.data.weather.hourly).filter(item => item !== "time");
        const time = this.API.data.weather.hourly.time;
  
        const indexes = [];

        for(let i = 0; i <= 23; i++){
          let t = i + "";

          if(i <= 9)
            t = "0" + t;
          
          let index = time.indexOf(`${ISODateWithoutHours}T${t}:00`);

          indexes.push(index);
        }
  
        for(const key of keys){
          const values = [];

          for(let index of indexes){
            values.push(this.API.data.weather.hourly[key][index]);
          }
          
          weather[key] = values;
        }
      }

      return weather;
    },
    //return cumulative weather for specif date. Include only data that is not hourly
    dailyWeatherWithoutHours(date = this.API.data.date){
      if(!(date instanceof Date))
        date = new Date(date);
      
      const ISODate = this.ISODateString(date);
      const ISODateWithoutHours = ISODate.substring(0, ISODate.lastIndexOf("T"));

      let weather = {};

      //daily weather
      {
        const keys = Object.keys(this.API.data.weather.daily).filter(item => item !== "time");
        const time = this.API.data.weather.daily.time;
  
        const index = time.indexOf(ISODateWithoutHours);
  
        for(const key of keys)
          weather[key] = this.API.data.weather.daily[key][index];
      }
      return weather;
    }
  }
});

App.config.unwrapInjectedRef = true;

App.component('loader', Loader);

App.component('timer', Timer);
App.component('geosearcher', Geosearcher);
App.component('weather', Weather);
App.component('forecast', Forecast);
App.component('day-forecast', DayForecast);
App.component('widget', Widget);

App.mount('#app');
