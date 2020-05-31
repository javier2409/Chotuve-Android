import Constants from 'expo-constants';

const localhost = "localhost:5000";

const ENV = {
    dev: {
        apiUrl: localhost,
    },
    staging: {
        apiUrl: "chotuve-appserver-staging.herokuapp.com"
    },
    prod: {
        apiUrl: "chotuve-appserver.herokuapp.com"
    }
};

export default function getEnv(env = Constants.manifest.releaseChannel){
    if (__DEV__){
        console.log("Using dev environment");
        return ENV.dev;
    } else if (env === 'staging'){
        return ENV.staging;
    } else if (env === 'prod'){
        return ENV.prod;
    }
}