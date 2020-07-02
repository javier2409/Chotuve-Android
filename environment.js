import Constants from 'expo-constants';

const localhost = "192.168.0.7:5000";

const ENV = {
    dev: {
        apiUrl: "http://chotuve-appserver-staging.herokuapp.com",
    },
    staging: {
        apiUrl: "http://chotuve-appserver-staging.herokuapp.com"
    },
    prod: {
        apiUrl: "http://chotuve-appserver.herokuapp.com"
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
    } else {
        return ENV.prod;
    }
}