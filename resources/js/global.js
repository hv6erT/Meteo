window.UserInfo = class{
  static geolocation = null;
  static async setGeolocationByGeoAPI(){
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
  }
  static async setCustomGeolocationByCityName(cityName){
    
  }
}

window.WeatherInfo = class{
  static weather = null;
  static async setWeatherByMetheoAPI(geolocation){
    if(!geolocation)
        throw new Error("Geolocation param is required");
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${geolocation.latitude}&longitude=${geolocation.longitude}&hourly=temperature_2m,rain,weathercode,windspeed_10m&daily=weathercode,temperature_2m_min,rain_sum&current_weather=true&timezone=auto`;

    const response = await fetch(url);

    if(response.ok === true){
      WeatherInfo.weather = await response.json();
    }
    else
      console.error(response.status);
    
  }
}
