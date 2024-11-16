import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View , KeyboardAvoidingView, Platform , Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router"

SplashScreen.preventAutoHideAsync();

export default function signIn() {
    const [image, setImage] = useState(null);
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    const [loaded, error] = useFonts({
        "SairaExtraCondensedBold": require("../assets/fonts/SairaExtraCondensed-Bold.ttf"),
        "RobotoCondensedBold": require("../assets/fonts/RobotoCondensed-Bold.ttf"),
        "RobotoBold": require("../assets/fonts/Roboto-Bold.ttf"),
        "RobotoCondensedRegular": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
    });

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Image source={require("../assets/images/SignInUpBackground.png")} style={styles.backgroundImage} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
                        <View style={styles.container}>
                            <ScrollView>
                                <View style={styles.container2}>
                                    <Text style={styles.text1}>Sign In</Text>
                                    <Image source={image ? image : require('../assets/images/user.png')} style={styles.userImage} />
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Mobile</Text>
                                        <TextInput inputMode='text' style={styles.field} onChangeText={(text)=>{
                                            setMobile(text)
                                            if(text.length == 10){
                                                setImage("http://192.168.8.162:8080/Connect/Avatar_Images/"+text+".png");
                                            }else{
                                                setImage(null);
                                            }
                                        }}/>
                                    </View>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Password</Text>
                                        <TextInput inputMode='text' style={styles.field} secureTextEntry={true} onChangeText={(text) => {
                                            setPassword(text)
                                        }} />
                                    </View>
                                    <Pressable style={styles.button2} onPress={()=>{
                                        Alert.alert("Hadala Natho","Hdapaaaaaaaaaaaaaaan");
                                    }}>
                                        <Text style={styles.buttonText2}>Forgot Password?</Text>
                                    </Pressable>
                                    <Pressable style={styles.button} onPress={async () => {

                                        let response = await fetch(
                                            "http://192.168.8.162:8080/Connect/SignIn",
                                            {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    mobile: mobile,
                                                    password: password
                                                }),
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }
                                        );

                                        if (response.ok) {
                                            let json = await response.json();

                                            if (json.success) {
                                                let user = json.user;

                                                try {
                                                    await AsyncStorage.setItem("user", JSON.stringify(user));
                                                    console.log("Async storage success");
                                                    router.dismiss();
                                                    router.replace("/home");
                                                } catch (error) {
                                                    console.log("Error in async storage: " + error);
                                                    Alert.alert("Error", "Unable to Sign In. Please try again later.");
                                                }

                                            } else {
                                                Alert.alert("Error", json.message);
                                            }
                                        }

                                    }}>
                                        <Text style={styles.buttonText}>Sign In</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    container2: {
        alignItems: 'center',
        rowGap:10,
    },
    scrollView: {
        width: "100%",
        alignItems: 'center'
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    button: {
        backgroundColor: "#2F768F",
        borderRadius: 20,
        height: 60,
        width: 300,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontFamily: "RobotoBold",
        fontSize: 20,
    },
    button2: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        alignSelf:"flex-end",
    },
    buttonText2: {
        color: "#00A9EB",
        fontFamily: "RobotoCondensedBold",
        fontSize: 20,
    },
    text1: {
        color: "#ffffff",
        fontFamily: "SairaExtraCondensedBold",
        fontSize: 50,
        alignSelf:'flex-start'
    },
    fieldView: {
        width: "100%",
        marginTop: 10,
    },
    fieldLabel: {
        marginBottom: 5,
        fontSize: 18,
        color: "#ffffff",
        fontFamily: "RobotoCondensedRegular",
    },
    field: {
        width: "100%",
        height: 50,
        backgroundColor: "#ffffff",
        color: "black",
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#00A9EB",
        borderRadius: 15,
        paddingHorizontal: 8,
        fontSize: 16
    },
});
