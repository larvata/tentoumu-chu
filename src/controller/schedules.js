
export default {
    list: function*(next){
        if ('GET' !== this.method) return yield next;
        // this.body = yield render('')
    },

    modify: function*(next){
        if ('GET' !== this.method) return yield next;
        // this.body = yield render('')
    }
};

