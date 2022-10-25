import {baseLayerLuminance} from "./bundles/fluent-web-components.js";

import WeatherBg from "./components/weather-background.js";
import Timer from "./components/timer.js";
import Geolocator from "./components/geolocator.js";

import Loader from "./components/loader.js";

const { createApp, ref } = Vue;

window.App = createApp({
  data() {
    return {
      API: {
        geolocation: null
      },
      loaded: (async function () {
        await this.setGeolocation();
      }.bind(this))()
    }
  },
  provide(){
    return {
      API: ref(this.API),
      loaded: this.loaded
    }
  },
  mounted(){
    this.setColorMode("light");
  },
  methods: {
    setColorMode: async function(colorMode){
      if(colorMode === "light"){
        baseLayerLuminance.setValueFor(document.body, 0.91);
      } 
      else if(colorMode === "dark"){
        baseLayerLuminance.setValueFor(document.body, 0.13);
      }
      else throw new Error("Invalid color mode");
    },
    setGeolocation: async function(){
      await window.UserInfo.setGeolocationByGeoAPI();
      this.API.geolocation = window.UserInfo.geolocation;
    }
  }
});

App.config.unwrapInjectedRef = true;

App.component('loader', Loader);

App.component('weather-background', WeatherBg);
App.component('timer', Timer);
App.component('geolocator', Geolocator);

App.mount('#app');
