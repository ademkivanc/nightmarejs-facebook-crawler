const Nightmare = require("nightmare");
const vo = require('vo');

const nightmare = Nightmare({
    show: true,
    typeInterval: 20,
    waitTimeout: 60000,
    gotoTimeout: 60000
});

var run = function*() {

    yield nightmare
        .viewport(1024, 768)
        .goto('https://www.facebook.com')
        .type('#email', 'xxx@xxx.com')
        .type('#pass', 'xxxxx')
        .click('#loginbutton input')
        .wait('div[role=feed]')
        .evaluate(function () {
            window.document.body.scrollTop = document.body.scrollHeight;
        })
        .wait(3000);

    //todo we can make infinite loop
    for (var i = 0; i < 2; i++) {

        yield nightmare
            .evaluate(function () {
                var content = [];
                document.querySelectorAll('div[role=feed] .fbUserPost').forEach(function (element) {
                    if (element.querySelector('h5')) {

                        var postVideo = null, postImage = null;

                        if (element.querySelector('video')) {
                            postVideo = element.querySelector('video').src
                        }

                        if (element.querySelector('a img')) {
                            postImage = element.querySelector('a img').src
                        }

                        content.push({
                            text: element.querySelector('.userContent').innerText,
                            video: postVideo,
                            image: postImage,
                            user: {
                                name: element.querySelector('h5').innerText,
                                link: element.querySelector('h5 a').href
                            }
                        })
                    }
                });
                return content;
            })
            .then(function (result) {
                console.log(result)
            });

        yield nightmare
            .refresh()
            .evaluate(function () {
                window.document.body.scrollTop = document.body.scrollHeight;
            })
            .wait('div[role=feed]')
            .wait(3000)
    }
    yield nightmare.end();
};

vo(run)(function (err) {
    if (err) {
        console.dir(err);
    }
    console.log('done');
});


