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
            lastItemId: null,
            hash: null,
            modal: {
                id: null,
                index: null,
                show: false
            },
            comments: [],
            moreconfig: {
                show: true,
                total: null
            }
        },
        methods: {
            upload: function(e) {
                e.preventDefault();
                var self = this;
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
                        self.items.unshift(resp.data[0]);
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
                console.log(this.comments);
                console.log(this.items);
                console.log(this.lastItemId);
            },
            insertcomment: function(form) {
                var self = this;
                console.log(this.comments);
                axios
                    .post("/insert-comment", {
                        id: form.id.value,
                        comment: form.comment.value,
                        username: form.username.value
                    })
                    .then(function(resp) {
                        console.log("RESP INSERT COMMENT");
                        console.log(resp.data);
                        console.log(resp);
                        self.comments.push(resp.data.rows[0]);
                        //this.comments.unshift();
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                this.$emit("getcomments");
            },
            getcomments: function(id) {
                var self = this;
                axios
                    .post("/get-comments", { id: id })
                    .then(function(resp) {
                        self.comments = resp.data.rows.map(function(item) {
                            return {
                                username: item.username,
                                comment: item.comment
                            };
                        });
                        console.log(self.comments);
                    })
                    .catch(function(err) {
                        console.log("ERROR", err);
                    });
            },
            setlast: function(id) {
                this.lastItemId = id;
            },
            loadmore: function(e) {
                var self = this;
                e.preventDefault();
                axios
                    .post("/load-more", { id: self.lastItemId })
                    .then(function(resp) {
                        console.log(resp.data.rows);
                        for (var i = 0; i < resp.data.rows.length; i++) {
                            self.items.push(resp.data.rows[i]);
                        }
                        var last = self.items.slice(-1);
                        self.lastItemId = last[0].id;
                        console.log("selfitemslength", self.items.length);
                        console.log("moreconfigtotal", self.moreconfig.total);
                        if (self.items.length >= self.moreconfig.total) {
                            self.moreconfig.show = false;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
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

            axios
                .get("/get-count")
                .then(function(resp) {
                    self.moreconfig.total = resp.data.rows[0].count;
                })
                .catch(function(err) {
                    console.log("error", err);
                });
        }
    });

    Vue.component("img-wrap", {
        props: [
            "title",
            "description",
            "url",
            "username",
            "id",
            "timestamp",
            "created_at"
        ],
        methods: {
            openmodal: function(e) {
                this.$emit("openmodal", this.id);
            }
        },
        mounted: function() {
            this.$emit("imagewrapload", this.id);
        },
        template: `#img-wrap`
    });

    Vue.component("modal-wrap", {
        props: [
            "id",
            "url",
            "title",
            "username",
            "description",
            "timestamp",
            "comments"
        ],
        methods: {
            closemodal: function(e) {
                this.$emit("closemodal", e);
            },
            loginput: function(e) {
                console.log(e);
                console.log(this.comments);
            },
            insertcomment: function(e) {
                this.$emit("insertcomment", e.target);
            }
        },
        mounted: function() {
            this.$emit("modalmount", this.id);
        },
        template: "#modal-wrap"
    });
})();
