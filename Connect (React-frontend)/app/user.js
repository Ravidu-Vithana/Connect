import { Image } from 'expo-image';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function user() {

    const [loaded, error] = useFonts({
        "SairaExtraCondensedBold": require("../assets/fonts/SairaExtraCondensed-Bold.ttf"),
        "RobotoCondensedRegular": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
        "RobotoRegular": require("../assets/fonts/Roboto-Regular.ttf"),
        "RobotoMedium": require("../assets/fonts/Roboto-Medium.ttf"),
    });

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
                loadUsers();
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle("light");
        }, 0);
    }, []);

    async function loadUsers() {

        const user = JSON.parse(await AsyncStorage.getItem('user'));

        let response = await fetch(
            "http://192.168.8.162:8080/Connect/LoadUserList?userId=" + user.id
        );

        if (response.ok) {
            let json = await response.json();

            if (json.success) {
                console.log(json)
            } else {
                Alert.alert("Error", json.message);
            }
        }
    }

    const parameters = useLocalSearchParams();

    const imagePath = "http://192.168.8.162:8080/Connect/Avatar_Images/" + parameters.otherUserMobile + ".png";

    return (
        <View style={{ flex: 1, backgroundColor: "#004F87" }}>
            <StatusBar style='light' />
            <Image source={require("../assets/images/chatDefaultBackground.png")} style={styles.backgroundImage} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Image source={parameters.avatarImageFound ? imagePath : require('../assets/images/user.png')} style={styles.chatImage} />
                    <Text style={styles.text1}>Users</Text>
                    <Text style={styles.text2}>{parameters.otherUserMobile}</Text>
                    <TextInput inputMode='text' style={styles.field} value={parameters.otherUserAbout} multiline={true} numberOfLines={10} />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        flex: 1,
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    chatImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    text1: {
        color: "#ffffff",
        fontFamily: "SairaExtraCondensedBold",
        fontSize: 40,
        alignSelf: 'center'
    },
    text2: {
        color: "#949494",
        fontFamily: "RobotoMedium",
        fontSize: 25,
        alignSelf: 'center'
    },
    field: {
        width: "100%",
        height: 80,
        backgroundColor: "#4e95c7",
        color: "white",
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#2c82bf",
        borderRadius: 15,
        paddingStart: 10,
        paddingEnd: 35,
        fontSize: 16,
        textAlignVertical:'top',
        fontFamily: "RobotoMedium",
        marginTop:10,
    },
});
