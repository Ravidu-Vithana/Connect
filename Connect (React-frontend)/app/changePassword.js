import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function changePassword() {
    const [userId, setUserId] = useState("Loading...");
    const [oldPassword, setOldPassword] = useState("Loading...");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    async function loadProfileDetails() {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        setUserId(user.id);
        setOldPassword(user.password);

    }

    const [loaded, error] = useFonts({
        "SairaExtraCondensedBold": require("../assets/fonts/SairaExtraCondensed-Bold.ttf"),
        "RobotoBold": require("../assets/fonts/Roboto-Bold.ttf"),
        "RobotoCondensedRegular": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
    });

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
                loadProfileDetails();
            }
        }, [loaded, error, userId]
    );

    if (!loaded && !error) {
        return null;
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Image source={require("../assets/images/SignInUpBackground.png")} style={styles.backgroundImage} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.container}>
                            <ScrollView centerContent={true}>
                                <View style={styles.container2}>
                                    <Text style={styles.text1}>Change Password</Text>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Old Password</Text>
                                        <TextInput inputMode='text' style={[styles.field, { backgroundColor:"#c7c7c7"}]} value={oldPassword} editable={false}/>
                                    </View>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>New Password</Text>
                                        <TextInput inputMode='text' style={styles.field} value={newPassword} onChangeText={(text) => {
                                            setNewPassword(text);
                                        }} />
                                    </View>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Confirm New Password</Text>
                                        <TextInput inputMode='text' style={styles.field} value={confirmNewPassword} onChangeText={(text) => {
                                            setConfirmNewPassword(text);
                                        }} />
                                    </View>
                                    <Pressable style={styles.button} onPress={async () => {


                                        if (newPassword != confirmNewPassword) {
                                            Alert.alert("Error", "Passwords do not match!")
                                        } else {
                                            const result = await fetch(
                                                "http://192.168.8.162:8080/Connect/UpdatePassword?id="+userId+"&newPassword="+newPassword,
                                            );

                                            if (result.ok) {
                                                let json = await result.json();
                                                if (json.success) {

                                                    let user = json.user;

                                                    try {
                                                        await AsyncStorage.setItem("user", JSON.stringify(user));
                                                        console.log("Async storage success");
                                                    } catch (error) {
                                                        console.log("Error in async storage: " + error);
                                                        Alert.alert("Error", "Unable to Sign In. Please try again later.");
                                                    }
                                                    router.dismiss();
                                                    router.replace("/settings");
                                                    // Alert.alert("Done", "Your password is updated!");
                                                } else {
                                                    Alert.alert("Error", json.message);
                                                }
                                            }
                                        }

                                    }}>
                                        <Text style={styles.buttonText}>Update</Text>
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
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    container2: {
        flex: 1,
        alignItems: 'center',
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
    imagePickerButtonImage: {
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
        marginTop: 30,
    },
    buttonText: {
        color: "#ffffff",
        fontFamily: "RobotoBold",
        fontSize: 20,
    },
    button2: {
        height: 60,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText2: {
        color: "#00A9EB",
        fontFamily: "RobotoCondensedRegular",
        fontSize: 20,
    },
    text1: {
        color: "#ffffff",
        fontFamily: "SairaExtraCondensedBold",
        fontSize: 50,
        marginBottom: 20,
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
