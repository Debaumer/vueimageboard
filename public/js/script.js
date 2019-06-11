(function() {
    new Vue({
        el: "#app",
        data: {
            heading: "image-board",
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            },
            items: [],
            lastItemId: null,
            hash: "#",
            modal: {
                id: null,
                index: null,
                show: false,
                url: null
            },
            currentImage: null,
            comments: [],
            recentcomments: [],
            moreconfig: {
                show: true,
                total: null
            }
        },
        methods: {
            logger: function(e) {
                console.log(e);
            },
            upload: function(e) {
                e.preventDefault();
                var self = this;
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
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
                location.hash = id;
                this.currentImage = id;
                console.log("currentImage", this.currentImage);
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
                this.currentImage = null;
                this.modal.show = false;
                location.hash = "";
                this.modal.id = null;
                this.modal.id = null;
            },
            nextimage: function() {
                console.log("next");
                window.location.hash =
                    parseInt(window.location.hash.slice(1)) + 1;
            },
            previousimage: function() {
                console.log("prev");
                window.location.hash =
                    parseInt(window.location.hash.slice(1)) - 1;
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
            insertcomment: function(form) {
                var self = this;

                axios
                    .post("/insert-comment", {
                        id: form.id.value,
                        comment: form.comment.value,
                        username: form.username.value
                    })
                    .then(function(resp) {
                        self.comments.push(resp.data.rows[0]);
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
                        //console.log(resp.data.rows);
                        self.comments = resp.data.rows.map(function(item) {
                            return {
                                username: item.username,
                                comment: item.comment
                            };
                        });
                        //console.log(self.comments);
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
                        //console.log(resp.data.rows);
                        for (var i = 0; i < resp.data.rows.length; i++) {
                            self.items.push(resp.data.rows[i]);
                        }
                        var last = self.items.slice(-1);
                        self.lastItemId = last[0].id;
                        if (self.items.length >= self.moreconfig.total) {
                            self.moreconfig.show = false;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            getrecentcomments: function(id) {
                var self = this;

                axios
                    .post("/recent-comments", { id: id })
                    .then(function(resp) {
                        self.recentcomments = resp.data.rows.map(function(
                            item
                        ) {
                            return {
                                id: item.id,
                                username: item.username,
                                comment: item.comment
                            };
                        });
                    })
                    .catch(function(err) {
                        console.log("ERROR", err);
                    });
            }
        },
        created: function() {
            var self = this;
            window.addEventListener("hashchange", function(e) {
                if (!location.hash.length) {
                    return;
                }
                var imageId = window.location.hash.slice(1);
                for (var i = 0; i < self.items.length; i++) {
                    if (imageId == self.items[i].id) {
                        self.modal.index = i;
                        self.modal.url = self.items[i].url;
                        self.currentImage = imageId;
                        self.modal.id = imageId;
                        self.modal.show = true;
                        break;
                    }
                }
                console.log("perhaps this code is not hit");
            });

            axios
                .get("/imgpath")
                .then(function(resp) {
                    var data = resp.data;
                    for (var i = 0; i < resp.data.length; i++) {
                        data[i].created_at =
                            resp.data[i].created_at.slice(11, 19) +
                            " - " +
                            resp.data[i].created_at.slice(0, 10);
                    }
                    self.items = data;
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
            "created_at",
            "recentcomments"
        ],
        methods: {
            openmodal: function(e) {
                this.$emit("openmodal", this.id);
            }
        },
        mounted: function() {
            this.$emit("imagewrapload", this.id);
            this.$emit("getrecentcomments", this.id);
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
                //console.log(this.comments);
            },
            insertcomment: function(e) {
                this.$emit("insertcomment", e.target);
            },
            nextImage: function() {
                console.log(parseInt(this.id) + 1);
                this.$emit("nextimage");
                this.$emit("getcomments", this.id + 1);
            },
            previousImage: function() {
                console.log(this.id - 1);
                this.$emit("previousimage");
                this.$emit("getcomments", parseInt(this.id) - 1);
            }
        },
        mounted: function() {
            this.$emit("modalmount", this.id);
        },
        template: "#modal-wrap"
    });
})();
