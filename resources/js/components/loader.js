export default {
  data() {
    return {
      isLoaded: false
    }
  },
  inject: ["loadPromise"],
  mounted(){
    this.loadPromise.then(function(){
      this.isLoaded = true;
    }.bind(this));
  },     
  template: `<div class="loader">
      <div v-if="isLoaded === false" class="loader-container" style="position: fixed; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <fluent-progress-ring class="ring"></fluent-progress-ring>
          <fluent-anchor class="text" style="margin-top: 40vh; position: fixed;" appearance="lightweight">Loading...</fluent-anchor>
        </div>
      </div>
      <div v-else class="loader-container">
        <slot></slot>
      </div>
    </div>`
}