import { Image } from 'expo-image';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { FlashList } from "@shopify/flash-list"
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import MessageItem from "../components/MessageItem"
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    const [chatHistory, setChatHistory] = useState(null);
    const [message, setMessage] = useState(null);
    const flashlistRef = useRef(null);

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
            }
        }, [loaded, error]
    );

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle("light");
        }, 0);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadChat()
        }, 1000);
        return () => clearInterval(intervalId);
        // loadChat();
    }, []);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
            if (flashlistRef.current != null && flashlistRef.current != undefined) {
                flashlistRef.current.scrollToEnd({ animated: true });
            }
        });
        return () => {
            showSubscription.remove();
        };
    }, []);

    const parameters = useLocalSearchParams();

    let userName = parameters.otherUserName;

    if (userName.length > 16) {
        userName = userName.substring(0, 14) + "...";
    }

    const imagePath = "http://192.168.8.162:8080/Connect/Avatar_Images/" + parameters.otherUserMobile + ".png";

    async function loadChat() {

        const user = JSON.parse(await AsyncStorage.getItem('user'));

        let response = await fetch(
            "http://192.168.8.162:8080/Connect/LoadMessageHistory?userId=" + user.id + "&otherUserId=" + parameters.otherUserId
        );

        if (response.ok) {
            let json = await response.json();

            if (json.success) {
                setChatHistory(json.responseMessageList);
            }
        }
    }

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#004F87" }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style='light' />
                <View style={styles.container}>
                    <Pressable style={styles.menuIconView} onPress={()=>{
                        router.push({ pathname: "/user", params: parameters });
                    }}>
                        <FontAwesome6 name={"ellipsis-vertical"} color={"white"} size={20} />
                    </Pressable>
                    <Image source={parameters.avatarImageFound ? imagePath : require('../assets/images/user.png')} style={styles.chatImage} />
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.text1}>{userName}</Text>
                    </View>
                    <View style={styles.chatImage}></View>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.container2}>
                        <Image source={require("../assets/images/chatDefaultBackground.png")} style={styles.backgroundImage} />
                        {chatHistory && chatHistory.length > 0 ? (
                            <FlashList
                                data={chatHistory}
                                renderItem={({ item }) => (
                                    <MessageItem messageData={item} />
                                )}
                                estimatedItemSize={100}
                                ref={flashlistRef}
                                onContentSizeChange={() => flashlistRef.current.scrollToEnd({ animated: false })}
                            />
                        ) : (
                            <View style={styles.noChatsContainer}>
                                    <Image source={require("../assets/images/noChatsImage.png")} style={styles.noChatsImage} />
                                <Text style={styles.noChatsText}>No Messages Yet</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.container3}>
                        <View style={{ flex: 1 }}>
                            <TextInput inputMode='text' style={styles.field} placeholder={"Message.."} onChangeText={(text) => { setMessage(text) }} value={message} />
                        </View>
                        <Pressable onPress={async () => {

                            if (message != null && message != "") {

                                const user = JSON.parse(await AsyncStorage.getItem('user'));

                                let response = await fetch(
                                    "http://192.168.8.162:8080/Connect/SendMessage?userId=" + user.id + "&otherUserId=" + parameters.otherUserId + "&message=" + message
                                );

                                if (response.ok) {
                                    let json = await response.json();

                                    if (!json.success) {
                                        Alert.alert("Error", json.message);
                                    } else {
                                        setMessage("");
                                        loadChat();
                                    }
                                }
                            } else {
                                Alert.alert("Error", "Please enter a message");
                            }
                        }}>
                            <Image source={require("../assets/images/sendMessageButtonIcon.png")} style={styles.sendMessageButtonImage} />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    container2: {
        flex: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        // overflow: 'hidden'
    },
    container3: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        columnGap: 15,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    chatImage: {
        width: 60,
        height: 60,
        borderRadius: 75,
    },
    text1: {
        color: "#ffffff",
        fontFamily: "SairaExtraCondensedBold",
        fontSize: 40,
        alignSelf: 'center'
    },
    menuIconView: {
        position: 'absolute',
        right: 2,
        zIndex: 10,
        padding: 20
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        width: "100%"
    },
    noChatsImage: {
        height: 200,
        width: 250,
    },
    noChatsText: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: "RobotoRegular",
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
    sendMessageButtonImage: {
        height: 40,
        width: 40,
    },
});
