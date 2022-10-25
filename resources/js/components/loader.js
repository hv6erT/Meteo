export default {
  data() {
    return {
      isLoaded: false
    }
  },
  inject: ["loaded"],
  mounted(){
    this.loaded.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },     
  template: `<div class="loader">
      <div v-if="isLoaded === false" class="loader-container" style="position: fixed; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <fluent-progress-ring></fluent-progress-ring>
      </div>
      <div v-else class="loader-container">
        <slot></slot>
      </div>
    </div>`
}