import weatherOptions from "./weather-options.js";

export default {
  data() {
    const days = [];
  
    const date = new Date();
    date.setDate(date.getDate() - 2);
    
    for(let i = 0; i < 9; i++){
      days.push(this.API.ISODateString(date));
      date.setDate(date.getDate() + 1);
    }
    return {
      isLoaded: false,
      days: days
    }
  },
  inject: ["API", "loadPromise"],
  extends: weatherOptions,
  props: ["width", "height"],
  mounted(){
    this.loadPromise.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },
  methods: {
    nodeClass(day){
    if(this.API.ISODayDateString() === this.API.ISODayDateString(new Date(day)))
        return 'active-forecast';
      
      if(this.API.ISODayDateString(new Date()) === this.API.ISODayDateString(new Date(day)))
        return 'today-forecast';
      else if (new Date(day) > new Date())
        return 'future-forecast';
      else if(new Date(day) < new Date())
        return 'past-forecast';
    },
    temperature(day){
      const temperature = this.API.dailyWeatherWithoutHours(day).temperature_2m_max;

      if(temperature === undefined)
        return "N/A";
      else 
        return `${Math.round(temperature)}°`;
    },
    weekDay(day){
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(day).getDay()];
    },
    scrollBack(){
      this.$el.querySelector(".forecast-wrapper").scrollBy({left: (-1.1)*parseInt(this.width), behavior: 'smooth'});
    },
    scrollForward(){
      this.$el.querySelector(".forecast-wrapper").scrollBy({left: (1.1)*parseInt(this.width), behavior: 'smooth'});
    },
    handleTouchMove(event){
      const xUp = event.touches[0].clientX;                                    
      const yUp = event.touches[0].clientY;
  
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;
                                                                           
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
          if ( xDiff > 0 ) {
              this.scrollForward();
          } else {
              this.scrollBack();
          }                       
      }
    }
  },
  template: `<div class="forecast">
    <div v-if="isLoaded === true" class="forecast-container">
      <fluent-flipper class="flipper" direction="previous" @click="scrollBack()" @touchmove="handleTouchMove()"></fluent-flipper>
      <div class="forecast-wrapper">
        <div class="forecast-content-wrapper">
          <fluent-card v-for="day in days" @click="API.methods.setDate(new Date(day))" :style="{width: width, height: height}" :class="[nodeClass(day)]">
            <img class="weather-img" :src="weatherImgSrc(API.dailyWeatherWithoutHours(day))" alt="weatherText(API.dailyWeatherWithoutHours(day))">
            <span class="day">{{weekDay(day)}}</span>
            <span class="temperature">{{temperature(day)}}</span>
          </fluent-card>
        </div>
      </div>
      <fluent-flipper class="flipper" direction="next" @click="scrollForward()" @touchmove="handleTouchMove()"></fluent-flipper>
    </div>
    <div v-else class="forecast-container">
      <fluent-flipper class="flipper" direction="previous"></fluent-flipper>
      <div class="forecast-wrapper">
        <div class="forecast-content-wrapper">
          <fluent-skeleton v-for="day in days" shimmer="true" :style="{width: width, height: height}" :class="[nodeClass(day)]"></fluent-skeleton>
        </div>
      </div>
      <fluent-flipper class="flipper" direction="next"></fluent-flipper>
    </div>
  </div>`
}
