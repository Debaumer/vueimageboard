var hello = "this is my greeting";

(function() {
  new Vue({
    el: '#main',
    data: {
        cities: [],
        heading: "My First Vue Application"
    },

    mounted: function() {
      // runs when HTML has loaded but right before the script.js has loaded
      // this is the best place to make ajax requests
      var self = this;
      axios.get('/get-cities').then(function(resp){
        console.log(resp.data);
        console.log("this: in the then segment of axios ", self);
        self.cities = resp.data;
      }).catch(function(err){
        console.log(err);
      });
      console.log('mount up laddies');
      console.log(hello);
    },
    methods: {
      //every function that responds to an event in here, all (and only) event handlers go here
      clicker: function(e) { //must be same name as applied in index.html
        // console.log("you've done it", e);
        this.cities.push({ //when this is console logged it still runs but
          name: 'Perth',  //also logs a number, the length of the array, (or the index)???
          country: 'Mostly'
        })
        console.log(String.fromCharCode(66,66,66));
      }
    }
});
})(hello);
