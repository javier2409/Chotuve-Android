import { ToastAndroid } from "react-native";

export function ToastError(msg){
    ToastAndroid.show(msg, ToastAndroid.LONG);
}