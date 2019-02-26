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
        },
        created: function() {
            var self = this;
            axios
                .get("/imgpath")
                .then(function(resp) {
                    console.log(resp.data);
                    self.items = resp.data;
                    console.log(self.items);
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
        // created: ,
        // mounted: ,
    });
})();
