window.UserInfo = class{
  static #geolocation = null;
  static geolocation = null;
  static date = null;
  static async setGeolocationByGeoAPI(){
    if(UserInfo.#geolocation !== null){
      UserInfo.geolocation = UserInfo.#geolocation;
      return;
    }
    
    UserInfo.geolocation = {};
    
    if ('geolocation' in navigator) {     
      const geolocation = await new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      UserInfo.geolocation = {...UserInfo.geolocation, ...{
        latitude: geolocation.coords.latitude.toFixed(1),
        longitude: geolocation.coords.longitude.toFixed(1)
      }};
      
    }
    
    if(Intl.DateTimeFormat().resolvedOptions().timeZone){
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      UserInfo.geolocation = {...UserInfo.geolocation, ...{
        region: timezone.substring(0, timezone.indexOf("/"))
      }};
    }
    
    if(Object.keys(UserInfo.geolocation).length === 0)
      UserInfo.geolocation = null;
    else
      UserInfo.#geolocation = UserInfo.geolocation;
  }
  static async setCustomGeolocationByCityName(cityName){
    
  }
  static setDate(date){
    if(date instanceof Date)
      UserInfo.date = date;
  }
}

window.WeatherInfo = class{
  static weather = null;
  static async setWeatherByMetheoAPI(geolocation){
    if(!geolocation)
        throw new Error("Geolocation param is required");
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${geolocation.latitude}&longitude=${geolocation.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,snowfall,rain,weathercode,surface_pressure,dewpoint_2m,cloudcover&daily=weathercode,temperature_2m_max,rain_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,precipitation_sum,sunrise,sunset&current_weather=true&timezone=auto&past_days=2`;

    const response = await fetch(url);

    if(response.ok === true){
      WeatherInfo.weather = await response.json();
    }
    else
      console.error(response.status);
  }
}