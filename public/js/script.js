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
        el: "#uploadForm",
        data: {
            name: "hello",
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            }
        },
        methods: {
            upload: function(e) {
                console.log("upload started", "event: " + e, "this: ", this);
                console.log(this.form.description);
                e.preventDefault();
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.tile);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                //console.log(formData); this is always empty, but append does work
                axios.post("/upload", formData);
            },
            getImg: function(e) {
                this.form.file = e.target.files[0];
                console.log(this.form.file);
            }
        },
        created: function() {
            console.log("hello");
            console.log(this);
        }
    });
})();

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
                    self.items = resp.data;
                })
                .catch(function(err) {
                    console.log("ERROR", err);
                });
        }
        // created: ,
        // mounted: ,
    });
})();
