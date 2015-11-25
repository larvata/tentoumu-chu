#tentoumu-chu 3.0
A website for checkout/manage 48-group TV programme schedule.An online version you can found on [http://douyu.sashi-con.info/](http://douyu.sashi-con.info/). And also there is a browser extension  [miichan](https://github.com/larvata/miichan) powered by this service.


**this branch is under developing**

features
+ update schedule automatically
+ ~~ multiple user support for edit schedule entry ~~


refactoried with following tech stack:
+ nodejs 5.0
+ es6/7
+ koa
+ react for frontend


## requirements

- nodejs
- redis


## debuging

```
npm run dev
num run hot
```


kojimako - server
meru - schedule fetcher
miki - configuration and schedule/schedule storage
naachan - room state fetcher