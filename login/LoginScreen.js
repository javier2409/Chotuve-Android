import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Divider, Icon, Input } from 'react-native-elements';
import { Button } from 'react-native';
import { AuthContext } from '../App';

export default function LoginScreen(){

    const [userData, setUserData] = useContext(AuthContext);

    return (
        <View>
            <Text>Hola!</Text>
        </View>
    )
}
