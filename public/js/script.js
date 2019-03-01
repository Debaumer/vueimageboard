//title and header
(function() {
    new Vue({
        el: "#app",
        data: {
            heading: "J board",
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            },
            items: [],
            modal: {
                index: null,
                show: false,
                url: null
            },
            comments: [
                {
                    username: "seamus",
                    comment: "yeehaw"
                },
                {
                    username: "barclay",
                    comment: "yeyah"
                }
            ]
        },
        methods: {
            upload: function(e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                //console.log(formData); this is always empty, but append does work
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            getImg: function(e) {
                this.form.file = e.target.files[0];
            },
            show: function(id) {
                var index = null;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].id == id) {
                        index = i;
                        console.log(index);
                        break;
                    }
                }
                this.modal.index = index;
                this.modal.url = this.items[index].url;
                this.modal.show = true;
                console.log(this.modal.url);
            },
            hide: function(e) {
                console.log(e); //currently returning undefined
                this.modal.show = false;
                this.modal.id = null;
            },
            getComments: function(id) {
                axios
                    .get("/get-comments", id)
                    .then(function(data) {
                        console.log(id);
                        console.log(data);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        },
        mounted: function() {},
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
    });

    Vue.component("img-wrap", {
        props: ["title", "description", "url", "username", "id", "timestamp"],
        data: function() {
            return {};
        },
        methods: {
            openmodal: function() {
                this.$emit("openmodal", this.id);
            }
        },
        template: `#img-wrap`
    });

    Vue.component("modal-wrap", {
        props: ["id", "comments", "url"],
        data: function() {
            return {};
        },
        methods: {
            closemodal: function(e) {
                console.log(this.comments);
                e.stopPropagation();
                this.$emit("closemodal");
            }
        },
        template: "#modal-wrap"
    });
})();
