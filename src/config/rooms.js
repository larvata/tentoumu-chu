export default {
    // douyu api get room detail
    douyuRoomAPI: 'http://www.douyutv.com/api/client/room/',

    // douyu api get user avatar
    douyuAvatarAPI: 'http://uc.douyutv.com/avatar.php?',

    // douyu api get screenshot
    douyuWebPicUrl: 'http://staticlive.douyutv.com/upload/web_pic',

    // zhanqi api get room detail
    zhanqiRoomAPI: 'http://www.zhanqi.tv/api/static/live.roomid/',

    // zhanqi api get user avatar
    zhanqiAvatarAPI: 'http://pic.cdn.zhanqi.tv/avatar',

    // zhanqi api get screenshot
    zhanqiWebPicUrl: 'http://dlpic.cdn.zhanqi.tv/live',

    // room check interval
    roomCheckInterval: 180000,

    // room info
    roomInfo: [{
        disabled: false,
        room_id: 33968,
        room_alias: 'akb49房间',
        always_show: true,
        live_provider: 'zhanqi'
    },
    {
        disabled: false,
        room_id: 33967,
        room_alias: 'ske48房间',
        always_show: true,
        live_provider: 'zhanqi'
    },
    {
        disabled: false,
        room_id: 40183,
        room_alias: 'nmb48房间',
        always_show: true,
        live_provider: 'zhanqi'
    },
    {
        disabled: false,
        room_id: 40184,
        room_alias: 'hkt48',
        always_show: true,
        live_provider: 'zhanqi'
    },
    {
        disabled: true,
        room_id: 2246,
        room_alias: 'akb48房间',
        always_show: true,
        live_provider: 'douyu'
    },
    {
        disabled: true,
        room_id: 2319,
        room_alias: 'ske48房间',
        always_show: true,
        live_provider: 'douyu'
    },
    {
        disabled: true,
        room_id: 6186,
        room_alias: 'hkt48房间',
        always_show: false,
        live_provider: 'douyu'
    },
    {
        disabled: true,
        room_id: 3622,
        room_alias: 'nmb48房间',
        always_show: false,
        live_provider: 'douyu'
    },
    {
        disabled: false,
        room_id: 141261,
        room_alias: 'sashi',
        always_show: false,
        live_provider: 'douyu'
    },
    {
        disabled: false,
        room_id: 83376,
        room_alias: 'mayuyu',
        always_show: false,
        live_provider: 'douyu'
    },
    {
        disabled: false,
        room_id: 67299,
        room_alias: 'yukirin',
        always_show: false,
        live_provider: 'douyu'
    },
    {
        disabled: true,
        room_id: 129661,
        room_alias: 'haruppi',
        always_show: true,
        live_provider: 'douyu'
    },
    {
        disabled: false,
        room_id: 289172,
        room_alias: 'hkt345',
        always_show: false,
        live_provider: 'douyu'
    }]
};

