FROM node:7.1
RUN npm install babelify babel-preset-es2015 babel-preset-react classnames gravatar moment react react-dom 
RUN npm install -g watchify
VOLUME /src
CMD ["watchify", "-t", "babelify", "/src/src/app.js", "-o", "/src/html/bundle.js"]
