Circle CI build status dashboard
================================

So I had a look at Dashing with Gist #5494978 but just couldn't get it to work.  So instead of fixing it I thought it would be better to reinvent the wheel and maybe learn some more about ReactJS and ES2015 along the way.

This is purely a client-side app that is served via Nginx.


# Developing

There is a Docker file in `dev` which will turn `src/app.js` into `html/bundle.js`.

```
$ cd dev
$ docker build -t build-status-dev .
$ cd ..
$ docker run --rm -v $(pwd):/src build-status-dev
```

To see the changes you are making you can start another container which  will serve the content via Nginx.

```
$ docker run --rm -p 3001:80 -v $(pwd)/html:/usr/share/nginx/html nginx:1.11-alpine
```

Then call `localhost:3001` in your browser.

ES2015 files can be found in `src/`; everything else is in `html/`.

---

I am sure there is a more "NodeJS" way to do things, so good luck with that.


# Just let me run the thing

Assuming you have some form of computer connected to a screen which is also running an operating system with Docker installed.

```
$ docker run -d --name status-dashboard -p 3009:80 symfoni/build-status:latest
```

Then open up a web browser and point it to localhsot:3009.  Maybe even in fullscreen mode.

---

Create an API token at Circle CI (https://circleci.com/account/api) and add it to local storage as the key `circle_ci_token`.
