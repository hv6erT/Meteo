export default{
  methods: {
    weatherText(weather){     
      let text;

      switch(weather.weathercode){
        case 0:
          text = "Sunny";
          break;
        case 1:
          text = "Mainly clear sky";
          break;
        case 2:
          text = "Partly cloudy";
          break;
        case 3: 
          text = "Overcast";
          break;
        case 45:
          text = "Fog";
          break;
        case 48:
          text = "Rime fog";
          break;
        case 51:
          text = "Light drizzle";
          break;
        case 53:
          text = "Moderate drizzle";
          break;
        case 55:
          text = "Dense drizzle";
          break;
        case 56:
          text = "Light freezing drizzle";
          break;
        case 57:
          text = "Intensive freezing drizzle";
          break;
        case 61:
          text = "Slight intensive rain";
          break;
        case 63:
          text = "Moderate rain";
          break;
        case 65:
          text = "Heavy rain";
          break;
        case 66:
          text = "Light freezing rain";
          break;
        case 67:
          text = "Heavy freezing rain";
          break;
        default: 
          text = "N/A";
          break;
      }
      return text;
    },
    weatherImgSrc(weather){
      let src = "img/weather/";

      switch(weather.weathercode){
        case 0:
        case 1:
          src += "clear-day.svg";
          break;
        case 2:
          src += "partly-cloudy-day.svg";
          break;
        case 3:
          src += "overcast.svg";
          break;
        case 45:
          src += "mist.svg";
          break;
        case 48:
          src += "fog.svg";
          break;
        case 51:
          src += "partly-cloudy-day-drizzle.svg";
          break;
        case 53:
        case 55:
          src += "drizzle.svg";
          break;
        case 56:
        case 57:
          src += "sleet.svg";
          break;
        case 61:
          src += "partly-cloudy-day-rain.svg";
          break;
        case 66:
          src += "partly-cloudy-night-rain.svg";
          break;
        case 63:
        case 65:
        case 67:
          src += "rain.svg";
          break;
        default:
          src += "not-available.svg";
          break;
      }
      return src;
    }
  }
}