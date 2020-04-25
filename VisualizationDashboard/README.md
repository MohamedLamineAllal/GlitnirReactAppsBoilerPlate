This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Glitnir control and visualization app

# Electron setup notice
To start developing and working on that you need first to install electron globally. And do the operations bellow against the chrome-sandbox.

## Globally

```
sudo chown root /home/coderhero/npm/lib/node_modules/electron/dist/chrome-sandbox && sudo chmod 4755 /home/coderhero/npm/lib/node_modules/electron/dist/chrome-sandbox
```

## Locally
or do it for the project instance as bellow:
package.json
```
scripts:{
    "configElectron": "sudo chown root node_modules/electron/dist/chrome-sandbox && sudo chmod 4755 node_modules/electron/dist/chrome-sandbox",
    "init": "npm install && npm run configElectron"
}
```

use 

```
npm init
```

or 

```
npm configElectron
```

Here a ref:
https://github.com/electron/electron/issues/17972