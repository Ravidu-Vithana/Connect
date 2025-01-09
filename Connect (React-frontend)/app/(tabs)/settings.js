import { Image } from 'expo-image';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { FlashList } from "@shopify/flash-list"
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import MessageItem from "../../components/MessageItem"
import UserItem from '../../components/UserItem';

SplashScreen.preventAutoHideAsync();

export default function user() {

    const [userCard, setUserCard] = useState({});

    async function logoutUser() {
        try {
            await AsyncStorage.removeItem('user')
            console.log("User logged out");
            router.replace('/');
        } catch (e) {
            Alert.alert("Oops", "Logout failed. Please try agian later.");
        }
    }

    const [loaded, error] = useFonts({
        "SairaExtraCondensedBold": require("../../assets/fonts/SairaExtraCondensed-Bold.ttf"),
        "RobotoCondensedRegular": require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
        "RobotoRegular": require("../../assets/fonts/Roboto-Regular.ttf"),
        "RobotoMedium": require("../../assets/fonts/Roboto-Medium.ttf"),
    });

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle("light");
        }, 0);
    }, []);

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
                async function loadUserCard() {

                    const user = JSON.parse(await AsyncStorage.getItem('user'));
                    const response = await fetch("http://192.168.8.162:8080/Connect/Avatar_Images/" + user.mobile + ".png");
                    let avatarImageFound = false;
                    if (response.ok) {
                        avatarImageFound = true;
                    }

                    const userCardData = {
                        "otherUserId": user.id,
                        "otherUserMobile": user.mobile,
                        "otherUserName": user.firstName + " " + user.lastName,
                        "otherUserStatus": "Online",
                        "otherUserAbout": user.about,
                        "avatarImageFound": avatarImageFound,
                    };

                    setUserCard(userCardData);

                }
                loadUserCard();
            }
        }, [loaded, error, userCard]
    );

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#004F87" }}>
            <StatusBar style='light' />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.text1}>Settings</Text>
                    <UserItem userData={userCard} />
                    <Pressable style={styles.button} onPress={async () => {
                        router.push("/changeProfile");
                    }}>
                        <Text style={styles.buttonText}>Change Profile</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={async () => {
                        router.push("/changePassword");
                    }}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={async () => {
                        Alert.alert('Errm', 'Are you sure you want to log out?', [
                            {
                                text: 'Nope',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Yes', onPress: () => logoutUser() },
                        ]);
                    }}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </Pressable>
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
        textAlignVertical: 'top',
        fontFamily: "RobotoMedium",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#2F768F",
        borderRadius: 10,
        height: 50,
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
});
