import weatherOptions from "./weather-options.js";

export default {
  data(){
    return {
      isLoaded: false,
      isReloading: false
    }
  },
  inject: ["API", "loadPromise"],
  extends: weatherOptions,
  props: ["type", "width", "height"],
  mounted(){    
    this.loadPromise.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },
  methods: {
    temperature(){
      const weather = this.API.weather();
      return `${Math.round(weather.temperature_2m ?? weather.temperature_2m_max)}°`;
    },
    wind(){
      const weather = this.API.weather();
      return `${weather.windspeed ?? weather.windspeed_10m_max} km/h`;
    },
    precipitation(){
      return `${this.API.weather().precipitation_sum} mm`;
    },
    day(){
      const todayDate = new Date();
      const yesterdayDate = new Date(new Date().setDate(todayDate.getDate() - 1));
      const tommorowDate = new Date(new Date().setDate(todayDate.getDate() + 1));
      
      let day = this.API.data.date.getDate();
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.API.data.date.getMonth()];
      let weekDay;
      
      if(this.API.ISODayDateString(todayDate) === this.API.ISODayDateString(this.API.data.date))
        weekDay = "Today";
      else if(this.API.ISODayDateString(yesterdayDate) === this.API.ISODayDateString(this.API.data.date))
        weekDay = "Yesterday";
      else if(this.API.ISODayDateString(tommorowDate) === this.API.ISODayDateString(this.API.data.date))
        weekDay = "Tommorow";
      else
        weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.API.data.date.getDay()];
      
      return `${weekDay}, ${day} ${month}`;
    },
    img(){
      const weather = (this.API.ISODayDateString(new Date()) === this.API.ISODayDateString(this.API.data.date))? this.API.weather() : this.API.dailyWeatherWithoutHours();
      return this.weatherImgSrc(weather);
    },
    text(){
      const weather = (this.API.ISODayDateString(new Date()) === this.API.ISODayDateString(this.API.data.date))? this.API.weather() : this.API.dailyWeatherWithoutHours();
      return this.weatherText(weather);
    },
    reload: async function(){
      if(this.isReloading === true)
        return;
        
      this.isReloading = true;
      await this.API.methods.setWeather();
      this.isReloading = false;
    }
  },
  template: `<div class="weather" :style="{width: width, height: height}">
    <div v-if="isLoaded === true" class="weather-container">
      <fluent-card :style="{width: width, height: height}">
        <div class="weather-wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="weather-top-bar">
            <fluent-button class="weather-reload-button" appearance="lightweight" @click="reload()">
              <div v-if="isReloading === false" style="display: flex; justify-content: center; align-items: center;"><span class="fluent-icons-ArrowCounterclockwise"></span></div>
              <div v-else style="display: flex; justify-content: center; align-items: center; animation: spin 1.5s linear infinite;"><span class="fluent-icons-ArrowSync"></span></div>
            </fluent-button>
          </div>
          <img :src="img()" :alt="text()" class="weather-img"/>
          <span class="day">{{day()}}</span>
          <span class="temperature">{{temperature()}}</span>
          <span class="weather-text">{{text()}}</span>
          <div class="weather-info">
            <div class="wind" style="display: flex; gap: 5px;">
              <span class="fluent-icons-WeatherSqualls"></span>
              <span>Wind</span>
              <span>|</span>
              <span>{{wind()}}</span>
            </div>
            <div class="precipitation" style="display: flex; gap: 5px;">
              <span class="fluent-icons-Drop"></span>
              <span>Precipitation </span>
              <span>|</span>
              <span>{{precipitation()}}</span>
            </div>
          </div>
        </div>
      </fluent-card>
    </div>
    <div v-else class="weather-container">
      <fluent-skeleton shimmer="true" :style="{width: width, height: height}"></fluent-skeleton>
    </div>
  </div>`
}