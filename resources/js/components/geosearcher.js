export default {
  data(){
    return {
      
    }
  },
  inject: ["API"],
  methods: {
    latitude(){
      if(this.API.data.geolocation?.latitude)
        return `${(Math.abs(this.API.data.geolocation.latitude) + "").replace(".", "'")}`
    },
    latitudeLetter(){
      if(this.API.data.geolocation?.latitude){
        if(this.API.data.geolocation.latitude >= 0)
          return "N";
        else
          return "W";
      }
    },
    longitude(){
      if(this.API.data.geolocation?.longitude)
        return `${(Math.abs(this.API.data.geolocation.longitude) + "").replace(".", "'")}`
    },
    longitudeLetter(){
      if(this.API.data.geolocation?.longitude){
        if(this.API.data.geolocation.longitude >= 0)
          return "E";
        else
          return "W";
      }
    },
  },
  template: `<div class="geosearcher">
    <div class="geosearcher-container">
      <div class="label-container" style="display: flex; gap: 5px;">
        <span class="fluent-icons-Location"></span>
        <span v-if="API?.data.geolocation?.city && API?.data.geolocation?.region">{{API.data.geolocation.city}}, {{API.data.geolocation.region}}</span>
        <span v-else-if="API?.data.geolocation?.latitude && API?.data.geolocation?.longitude">{{latitude()}} {{latitudeLetter()}}, {{longitude()}} {{longitudeLetter()}}</span>
        <span v-else>Location</span>
      </div>
      <fluent-search placeholder="Search location..."></fluent-search>
    </div>
  </div>`
}