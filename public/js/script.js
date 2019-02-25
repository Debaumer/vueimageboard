var hello = "this is my greeting";

(function() {
  new Vue({
    el: "#title",
    data: {
      heading: "J board"
    }
  });
})(hello);

(function() {
  new Vue({
    el: "#board",
    data: {
      items: []
    }
    // created: ,
    // mounted: ,
  })
})();
