export default {
  data() {
    return {
    }
  },
  inject: ["API"],
  methods: {
    latitude(){
      if(this.API.geolocation?.latitude)
        return `${(Math.abs(this.API.geolocation.latitude) + "").replace(".", "'")}`
    },
    latitudeLetter(){
      if(this.API.geolocation?.latitude){
        if(this.API.geolocation.latitude >= 0)
          return "N";
        else
          return "W";
      }
    },
    longitude(){
      if(this.API.geolocation?.longitude)
        return `${(Math.abs(this.API.geolocation.longitude) + "").replace(".", "'")}`
    },
    longitudeLetter(){
      if(this.API.geolocation?.longitude){
        if(this.API.geolocation.longitude >= 0)
          return "E";
        else
          return "W";
      }
    },
  },
  template: `<div class="geolocator">
      <div class="geolocation-container" v-if="API.geolocation?.city && API.geolocation?.region">
        <div class="city">{{API.geolocation.city}}</div><div class="region">{{API.geolocation.region}}</div>
      </div>
      <div class="geolocation-container" v-else-if="API.geolocation?.latitude && API.geolocation?.longitude">
        <div class="coords-container">
          <div class="latitude" style="display: flex;"><div>{{latitude()}}</div> <div class="latitude-letter">{{latitudeLetter()}}</div></div>
          <div class="longitude" style="display: flex;"><div>{{longitude()}}</div> <div class="longitude-letter">{{longitudeLetter()}}</div></div>
        </div>
        <div v-if="API.geolocation?.region" class="region">{{API.geolocation.region}}</div>
      </div>
    </div>`
}