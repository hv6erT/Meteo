import weatherOptions from "./weather-options.js";

export default {
  data() {
    return {
      isLoaded: false,
      hours: null
    }
  },
  inject: ["API", "loadPromise"],
  extends: weatherOptions,
  props: ["width", "height"],
  mounted(){
    this.setHours();    
    
    this.loadPromise.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },
  methods: {
    setHours(){
      const date = new Date(this.API.ISODateString());
      
      const hours = [];

      if(this.API.ISODayDateString(date) === this.API.ISODayDateString(new Date())){
        date.setHours(Math.max(1, (date.getHours() - 2)));
        
        for(let i = 0; i <= 8; i++){   
          hours.push(this.API.ISODateString(date));
          if(date.getHours() === 0)
            break; 
          
          date.setHours(date.getHours() + 1);  
        }
      }
      else{
        date.setHours(1);
        
        for(let i = 0; i <= 23; i++){   
          hours.push(this.API.ISODateString(date));          
          date.setHours(date.getHours() + 1);  
        }
      }

      this.hours = hours;
    },
    nodeClass(hour){
      if(this.API.ISODateString(new Date()) === this.API.ISODateString(new Date(hour)))
          return 'active-forecast';
      else return 'inactive-forecast';
    },
    date(date){
      return date.substring((date.lastIndexOf("T")+1));
    },
    temperature(hour){
      const temperature = this.API.weather(hour).temperature_2m;
      if(temperature === undefined)
        return "N/A";
      else 
        return `${Math.round(temperature)}°`;
    }
  },
  watch: {
    "API.data.date": function(){
      this.setHours();
    }
  },
  template: `<div class="day-forecast">
    <div v-if="isLoaded === true" class="day-forecast-container">
      <div class="day-forecast-wrapper">
        <div class="day-forecast-content-wrapper">
          <fluent-card v-for="hour in hours" :style="{width: width, height: height}" :class="[nodeClass(hour)]">
            <span class="date">{{date(hour)}}</span>
            <img class="weather-img" :src="weatherImgSrc(API.weather(hour))" alt="weatherText(API.weather(hour))">
            <span class="temperature">{{temperature(hour)}}</span>
          </fluent-card>
        </div>
      </div>
    </div>
    <div v-else class="day-forecast-container">
      <div class="day-forecast-wrapper">
        <div class="day-forecast-content-wrapper">
          <fluent-skeleton v-for="hour in hours" shimmer="true" :style="{width: width, height: height}" :class="[nodeClass(hour)]"></fluent-skeleton>
        </div>
      </div>
    </div>
  </div>`
}
