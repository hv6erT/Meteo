export default {
  data() {
    return {
      currentDate: new Date()
    }
  },
  mounted: async function () {
    setInterval(function () {
      this.currentDate = new Date()
    }.bind(this), 5000);
  },
  methods: {
    time(){
      let hours = (this.currentDate.getHours() === 0)? 24 : this.currentDate.getHours();
      hours = (hours > 9)? hours : ( "0" + hours);
      
      let minutes = (this.currentDate.getMinutes() > 9)? this.currentDate.getMinutes() : ( "0" + this.currentDate.getMinutes());
      
      return `${hours}:${minutes}`;
    },
    daytime(){
      return `${(this.currentDate.getHours() <= 12)? "AM" : "PM"}`;
    },
    date(){
      let day = this.currentDate.getDate();
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.currentDate.getMonth()];
      let year = this.currentDate.getFullYear();

      let weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.currentDate.getDay()];
      
      return `${weekDay}, ${day} ${month}, ${year}`;
    }
  },
  template: `<div class="timer">
      <div class="timer-container">
        <div class="clock-container" style="display: flex;"><div class="time">{{time()}}</div><div class="daytime">{{daytime()}}</div></div>
        <div class="date-container">{{date()}}</div>
      </div>
    </div>`
}