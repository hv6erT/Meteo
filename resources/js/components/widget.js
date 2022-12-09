export default {
  data() {
    return {
      isLoaded: false
    }
  },
  inject: ["API", "loadPromise"],
  props: ["type", "width", "height"],
  mounted(){
    this.loadPromise.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },  
  methods: {
    average(array){
      if(array instanceof Array){
        const sum = array.reduce((a, b) => a + b, 0);
        return sum/array.length;
      }
      else
        throw new Error("Invalid value as a param of function");
    },
    sunrise(){
      const sunriseDate = new Date(this.API.weather().sunrise);
      let sunriseHour = sunriseDate.getHours();

      if(sunriseHour === 0)
        sunriseHour = 12;
      else if(sunriseHour > 12)
        sunriseHour = sunriseHour - 12;

      let sunriseMinutes = sunriseDate.getMinutes();

      if(sunriseMinutes <= 9)
        sunriseMinutes = "0" + sunriseMinutes;
      
      return `${sunriseHour}:${sunriseMinutes} AM`;
    },
    sunset(){
      const sunsetDate = new Date(this.API.weather().sunset);
      let sunsetHour = sunsetDate.getHours();

      if(sunsetHour === 0)
        sunsetHour = 12;
      else if(sunsetHour > 12)
        sunsetHour = sunsetHour - 12;

      let sunsetMinutes = sunsetDate.getMinutes();

      if(sunsetMinutes <= 9)
        sunsetMinutes = "0" + sunsetMinutes;
      
      return `${sunsetHour}:${sunsetMinutes} PM`;
    },
    rain(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date())){
        const dailyRain = this.API.dailyWeather().rain;
  
        for(let i = new Date().getHours(); i < dailyRain.length; i++){
          if(dailyRain[i] !== 0){
            if(new Date().getHours() === i){
              for(let y = (i+1); y < dailyRain.length; y++){
                if(dailyRain[y] === 0){
                  const hour = (y <= 9)? `0${y}` : y;
                  return `Ends at ${hour}:00`
                }
              }
            }
            else{
              const hour = (i <= 9)? `0${i}` : i;
              return `Starts at ${hour}:00`
            }
          }
        }
      }
      
      return `${this.API.dailyWeatherWithoutHours().rain_sum} mm`
    },
    snow(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date())){
        const dailySnow = this.API.dailyWeather().snowfall;
  
        for(let i = new Date().getHours(); i < dailySnow.length; i++){
          if(dailySnow[i] !== 0){
            if(new Date().getHours() === i){
              for(let y = (i+1); y < dailySnow.length; y++){
                if(dailySnow[y] === 0){
                  const hour = (y <= 9)? `0${y}` : y;
                  return `Ends at ${hour}:00`
                }
              }
            }
            else{
              const hour = (i <= 9)? `0${i}` : i;
              return `Starts at ${hour}:00`
            }
          }
        }
      }
      
      return `${this.API.dailyWeatherWithoutHours().snowfall_sum} cm`
    },
    apparentTemperature(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date()))
        return `${Math.round(this.API.weather().apparent_temperature)} °C`;
      else
        return `${Math.round(this.average(this.API.dailyWeather().apparent_temperature))} °C`;
    },
    windSpeed(){
      return `${this.API.dailyWeatherWithoutHours().windspeed_10m_max} km/h`;
    },
    windGusts(){
      return `${this.API.dailyWeatherWithoutHours().windgusts_10m_max} km/h`;
    },
    windDirection(){
      return `${this.API.dailyWeatherWithoutHours().winddirection_10m_dominant} °`;
    },
    pressure(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date()))
        return `${Math.round(this.API.weather().surface_pressure)} hPa`;
      else
        return `${Math.round(this.average(this.API.dailyWeather().surface_pressure))} hPa`;
    },
    dewpoint(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date()))
        return `${Math.round(this.API.weather().dewpoint_2m)} °C`;
      else
        return `${Math.round(this.average(this.API.dailyWeather().dewpoint_2m))} °C`;
    },
    cloudcover(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date()))
        return `${Math.round(this.API.weather().cloudcover)} %`;
      else
        return `${Math.round(this.average(this.API.dailyWeather().cloudcover))} %`;
    },
    humidity(){
      if(this.API.ISODayDateString(this.API.data.date) === this.API.ISODayDateString(new Date()))
        return `${Math.round(this.API.weather().relativehumidity_2m)} %`;
      else
        return `${Math.round(this.average(this.API.dailyWeather().relativehumidity_2m))} %`;
    }
  },
  template: `<div class="widget" :type="type" :style="{width: width, height: height}">
    <div v-if="isLoaded === true" class="widget-container">
      <fluent-card :style="{width: width, height: height}">
        <div v-if="type === 'sunrise' || type === 'sunset' " class="widget-wrapper">
          <div class="sunrise">
            <span class="fluent-icons-WeatherSunny icon"></span>
            <div class="widget-content">
              <span class="widget-text">Sunrise</span>
              <span class="widget-info">{{sunrise()}}</span>
            </div>
          </div>
          <div class="sunset">
            <span class="fluent-icons-WeatherMoon icon"></span>
            <div class="widget-content">
              <span class="widget-text">Sunset</span>
              <span class="widget-info">{{sunset()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'precipitations'" class="widget-wrapper">
          <div class="rain">
            <span class="fluent-icons-WeatherRain icon"></span>
            <div class="widget-content">
              <span class="widget-text">Rain</span>
              <span class="widget-info">{{rain()}}</span>
            </div>
          </div>
          <div class="snow">
            <span class="fluent-icons-WeatherSnowflake icon"></span>
            <div class="widget-content">
              <span class="widget-text">Snow</span>
              <span class="widget-info">{{snow()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'apparent-temperature'" class="widget-wrapper">
          <div class="apparent-temperature">
            <span class="fluent-icons-Temperature icon"></span>
            <div class="widget-content">
              <span class="widget-text">Apparent temperature</span>
              <span class="widget-info">{{apparentTemperature()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'pressure'" class="widget-wrapper">
          <div class="surface-pressure">
            <span class="fluent-icons-Cloud icon"></span>
            <div class="widget-content">
              <span class="widget-text">Pressure</span>
              <span class="widget-info">{{pressure()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'dewpoint'" class="widget-wrapper">
          <div class="dewpoint">
            <span class="fluent-icons-WeatherFog icon"></span>
            <div class="widget-content">
              <span class="widget-text">Dewpoint</span>
              <span class="widget-info">{{dewpoint()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'cloudcover'" class="widget-wrapper">
          <div class="cloudcover">
            <span class="fluent-icons-WeatherCloudy icon"></span>
            <div class="widget-content">
              <span class="widget-text">Cloudcover</span>
              <span class="widget-info">{{cloudcover()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'humidity'" class="widget-wrapper">
          <div class="humidity">
            <span class="fluent-icons-WeatherHaze icon"></span>
            <div class="widget-content">
              <span class="widget-text">Humidity</span>
              <span class="widget-info">{{humidity()}}</span>
            </div>
          </div>
        </div>
        <div v-if="type === 'wind'" class="widget-wrapper">
          <div class="wind-speed">
            <span class="fluent-icons-WeatherSqualls icon"></span>
            <div class="widget-content">
              <span class="widget-text">Wind speed</span>
              <span class="widget-info">{{windSpeed()}}</span>
            </div>
          </div>
          <div class="wind-gusts">
            <span class="fluent-icons-CompassNorthwest icon"></span>
            <div class="widget-content">
              <span class="widget-text">Wind gusts</span>
              <span class="widget-info">{{windGusts()}}</span>
            </div>
          </div>
          <div class="wind-direction">
            <span class="fluent-icons-TopSpeed icon"></span>
            <div class="widget-content">
              <span class="widget-text">Wind direction</span>
              <span class="widget-info">{{windDirection()}}</span>
            </div>
          </div>
        </div>
      </fluent-card>
    </div>
    <div v-else class="widget-container">
      <fluent-skeleton shimmer="true" :style="{width: width, height: height}"></fluent-skeleton>
    </div>
  </div>`
}