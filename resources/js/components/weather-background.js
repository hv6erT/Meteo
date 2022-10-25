export default {
  data() {
    return {
      imageKey: null,
      images: null
    }
  },
  inject: ["API"],
  mounted: async function() {
    await this.chooseImage();
    await this.loaded;
  },
  methods: {
    chooseImage: async function(){ 
      if(this.images === null){        
        const url = '../json/images.json';
  
        const response = await fetch(url);
        if(response.ok){
          this.images = JSON.parse(await response.text());
        }
        else{
          console.error(response.status);
          return;
        }
      }
      
      const keys = Object.keys(this.images);
      
      return this.imageKey = keys[(Math.floor(Math.random() * keys.length))];
    }
  },
  template: `<div class="weather-background">
      <div v-if="this.imageKey === null" class="background" style="width: 100%; height: 100%;">
        <slot></slot>
      </div>
      <div v-else class="background" style="width: 100%; height: 100%;" :style="{ 'background-image': 'url(' + imageKey + ')' }">
        <slot></slot>
        <div class="info-container">
          <fluent-badge appearance="neutral">{{images[imageKey].city}}</fluent-badge>
          <fluent-badge appearance="neutral">{{images[imageKey].region}}</fluent-badge>
        </div>
      </div>
    </div>`
}