# Detective Game

## Running the game server

To run this project locally, run the local server:

```sh
meteor
```

To run with a local version of the empirica core:
```sh
METEOR_PACKAGE_DIRS=/Library/MeteorPackages/ meteor
```

To inspect the server side code, add `meteor --inspect flag`


To deploy to galaxy:
1. uncomment lines in the `client: main.js` to make sure that they see the
production version
2. start the mongodb database

3. deploy
```sh

DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy detective.meteorapp.com --settings settings.json
```
4. run games
5. download data
6. shut down galaxy server
7. shut down mongodb database


Set up mongodb atlas with galaxy: https://www.okgrow.com/posts/mongodb-atlas-setup
troubleshooting `authentication fail` involved creating a new user with a simple password and trying again...



### Settings

We generated a basic settings file (`/local.json`), which should originally only contain configuration for admin login. More documentation for settings is coming soon.

You can run the app with the settings like this:

```sh
meteor --settings local.json
```
