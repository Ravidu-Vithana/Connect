import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function changeProfile() {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState("Loading...");
    const [lastName, setLastName] = useState("Loading...");
    const [about, setAbout] = useState("Loading...");
    const [userId, setUserId] = useState("Loading...");

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

    async function loadProfileDetails() {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        setUserId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setAbout(user.about);

        const response = await fetch("http://192.168.8.162:8080/Connect/Avatar_Images/" + user.mobile + ".png");
        if (response.ok) {
            setImage("http://192.168.8.162:8080/Connect/Avatar_Images/" + user.mobile + ".png");
        }

    }

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
                                    <Text style={styles.text1}>Change Details</Text>
                                    <Image source={image ? image : require('../assets/images/user.png')} style={styles.imagePickerButtonImage} />
                                    <Pressable style={styles.button2} onPress={async () => {
                                        let result = await ImagePicker.launchImageLibraryAsync(
                                            {
                                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                                allowsEditing: true,
                                            }
                                        );

                                        if (!result.canceled) {
                                            setImage(result.assets[0].uri);
                                        }

                                    }}>
                                        <Text style={styles.buttonText2}>Change Image</Text>
                                    </Pressable>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>First Name</Text>
                                        <TextInput inputMode='text' style={styles.field} value={firstName} onChangeText={(text) => {
                                            setFirstName(text);
                                        }} />
                                    </View>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Last Name</Text>
                                        <TextInput inputMode='text' style={styles.field} value={lastName} onChangeText={(text) => {
                                            setLastName(text);
                                        }} />
                                    </View>
                                    <View style={styles.fieldView}>
                                        <Text style={styles.fieldLabel}>Last Name</Text>
                                        <TextInput inputMode='text' style={styles.field} value={about} onChangeText={(text) => {
                                            setAbout(text);
                                        }} />
                                    </View>
                                    <Pressable style={styles.button} onPress={async () => {


                                        let formdata = new FormData();
                                        formdata.append("id", userId);
                                        formdata.append("fname", firstName);
                                        formdata.append("lname", lastName);
                                        formdata.append("about", about);
                                        formdata.append("image",
                                            {
                                                name: "avatar.png",
                                                type: "image/png",
                                                uri: image
                                            });

                                        const result = await fetch(
                                            "http://192.168.8.162:8080/Connect/UpdateProfile",
                                            {
                                                method: "POST",
                                                body: formdata,
                                            }
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
                                                // Alert.alert("Done", "Your profile is updated!");
                                            } else {
                                                Alert.alert("Error", json.message);
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
