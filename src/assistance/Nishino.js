import configs from '../config';

import Redis from 'ioredis';
var redis = new Redis();
import _ from 'lodash';

class Nishino{
    constructor(){
        this.userSchedule = {
            data: [],
            dirty: false
        };
        this.autoSchedule = {
            data: [],
            dirty: false
        };
        this.roomData = {};
        this.configs = configs;



        // this.programmeAddedHandler = null;
        // this.programmeUpdatedHandler = null;
        // this.programmeDeletedHandler = null;

        // this.roomDataChangedHandler = null;
    }


    getRooms(){
        return this.roomInfoes;
    }

    getSchedule(){
        console.log('call loadSchedule')
        return new Promise((resolve, reject)=>{
            // this.schedule = [];

            redis.keys('Programme:*', (err, replies)=>{
                console.log('in redis keys')
                if (err) {
                    reject(err);
                }

                var remains = replies.length;
                console.log(`find ${remains} keys`);

                replies.map((key)=>{
                    redis.hgetall(key, (err, replies)=>{
                        if (err) {
                            reject(err);
                        }



                        // this.schedule.push(replies);

                        if (--remains === 0) {
                            console.log("try resolve ")
                            // console.log(this.schedule)
                            // all done
                            this.schedule = _.sortBy(this.schedule, 'orderKey');
                            // this.miki.updateSchedule(this.schedules);
                            resolve(this.schedule);
                        }
                    });
                });
            });
        });
    }

    /**
     * init schedules only call by meru
     * @param  {[type]} schedule [description]
     * @return {[type]}          [description]
     */
    // updateSchedule(schedule){
    //     this.scheduleData = schedule;
    // }

    // bulkAddProgramme(schedule, type){
    //     return new Promise(function(resolve, reject){
    //         var schedule = [];
    //         if (type === 'auto') {
    //             schedule = this.autoSchedule;
    //         }
    //         else if (type === 'user'){
    //             schedule = this.userSchedule;
    //         }
    //         else {
    //             reject(new Error('bulkAddProgramme\'s type is invalid'));
    //         }
    //     });

    // }

    saveProgramme(programme, countdown){
        redis.hmset(programme.key, programme);
        redis.expire(programme, countdown);
    }

    // addProgramme(programme){
    //     return new Promise((resolve, reject)=>{
    //         this.programmeAddedHandler(programme)
    //             .then(()=>{
    //                 resolve(true);
    //             })
    //             .catch((err)=>{
    //                 reject(err);
    //             });
    //     });
    // }


    updateProgramme(programme){
        return new Promise((resolve, reject)=>{
            this.programmeUpdatedHandler(programme)
                .then(()=>{
                    resolve(true);
                })
                .catch((err)=>{
                    reject(err);
                });
        });
    }
}

export default Nishino;
