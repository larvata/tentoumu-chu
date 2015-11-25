export default {
    // http server binding address:port
    host: '127.0.0.1',
    port: 3434,

    // redis host
    redis_host: '127.0.0.1',
    redis_port: 6379,


    // schedule fetch configuration [meru]
    scheduleFetchRssUrl: 'http://feedblog.ameba.jp/rss/ameblo/akb48tvinfo/rss20.xml',
    scheduleTemplatesKey: 'scheduleTemplates',
    scheduleFetchInterval: 60000,
    expireOffset: 0
};
