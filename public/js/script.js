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
                id: null,
                index: null,
                show: false
            },
            comments: [],
            newcomment: {
                username: "",
                comment: ""
            }
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
                        console.log("resp data", resp.data);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            getImg: function(e) {
                this.form.file = e.target.files[0];
            },
            show: function(id) {
                this.modal.id = id;
                var index = null;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].id == id) {
                        index = i;
                        break;
                    }
                }
                this.modal.index = index;
                this.modal.url = this.items[index].url;
                this.modal.show = true;
            },
            hide: function() {
                this.modal.show = false;
                this.modal.id = null;
                this.modal.id = null;
            },
            switch: function(arg) {
                if (arg == 1) {
                    console.log("right");
                } else if (arg == -1) {
                    //TODO:
                    //if this.items[0] == undefined go to last
                    // or maybe if it tries to set the index to -1 handle in the same way
                    console.log("left");
                }
            },
            showstate: function() {
                console.log(this.form);
                console.log(this.newcomment.comment);
            },
            insertcomment: function(e, username, comment) {
                this.newcomment.username = username;
                this.newcomment.comment = comment;
                var formData = new FormData();
                formData.append("id", this.modal.id);
                formData.append("comment", this.newcomment.comment);
                formData.append("username", this.newcomment.username);
                axios
                    .post("/insert-comment", formData)
                    .then(function(resp) {
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            getcomments: function(id) {
                var form = new FormData();
                form.append("id", id);
                axios
                    .get("/get-comments", form)
                    .then(function(resp) {
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        },
        mounted: function() {
            console.log(this.newcomment);
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
    });

    Vue.component("img-wrap", {
        props: ["title", "description", "url", "username", "id", "timestamp"],
        methods: {
            openmodal: function() {
                this.$emit("openmodal", this.id);
            }
        },
        template: `#img-wrap`
    });

    Vue.component("modal-wrap", {
        props: ["id", "url", "title", "username", "description", "timestamp"],
        methods: {
            closemodal: function(e) {
                this.$emit("closemodal", e);
            },
            loginput: function(e) {
                // console.log(e.target.name);
                // console.log(e.target.value);
                this.$emit("input", e.target.name, e.target.value);
            },
            insertcomment: function(e, username, comment) {
                this.$emit("insertcomment", e, username, comment);
            }
        },
        // mounted: function() {
        //     console.log("i'm here and happening");
        //     this.$emit("modalmount");
        // },
        template: "#modal-wrap"
    });
})();
