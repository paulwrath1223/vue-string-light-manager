# vue-string-light-manager

Project for controlling strips of individually addresable rgb lights. A main database is hosted by Firebase, and the Arduinos (actually ESP8266 modules, intended for ESP-01s, but reffered to as 'arduino' throughout the project) The system is intended as a service that can be sold and as such strives for simple operation and no need for reprogramming. The goal is that a user (someone who just bought, say 4 nodes) can plug them in, connect to one of the access points, at which point it will search for nearby access points, connect to them, and send over the network credentials, so that each node does not have to be setup independantly. The user will then log in to the website with google, and enter the UIDs of the nodes. (the UID would be printed on the case) after checking that these UID's have not been claimed by any other account, or that the other account removed their claim, the UID will be assosciated with that of the user. Meanwhile the nodes are checking the server for any updates on their user ID. When found, they read the user's database folder and find what colors to begin displaying.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
