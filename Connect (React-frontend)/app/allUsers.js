import { Image } from 'expo-image';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import ChatItem from '../components/ChatItem';
import { FlashList } from "@shopify/flash-list"
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import UserItem from '../components/UserItem';

SplashScreen.preventAutoHideAsync();

export default function home() {

    const [userList, setUserList] = useState([]);
    const [searchName, setSearchName] = useState("");

    async function loadUserList() {

        const user = JSON.parse(await AsyncStorage.getItem('user'));

        let response = await fetch(
            "http://192.168.8.162:8080/Connect/LoadUserList?userId=" + user.id + "&name=" + searchName
        );

        if (response.ok) {
            let json = await response.json();
            if (json.success) {
                setUserList(json.userList);
            } else if (json.message == "nousers"){
                setUserList([]);
            }
        }
    }

    const [loaded, error] = useFonts({
        "SairaExtraCondensedBold": require("../assets/fonts/SairaExtraCondensed-Bold.ttf"),
        "RobotoCondensedRegular": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
        "RobotoRegular": require("../assets/fonts/Roboto-Regular.ttf"),
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

    useEffect(() => {
        const homeIntervalId = setInterval(() => {
            loadUserList()
        }, 1000);
        return () => clearInterval(homeIntervalId);
        // loadUserList();
    }, [searchName]);

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle("light");
        }, 0);
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: "#004F87" }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar style='light' />
                    <View style={styles.container}>
                        <Text style={styles.text1}>All Users</Text>
                        <View style={styles.searchIconContainer}>
                            <Pressable style={styles.searchIconView} onPress={loadUserList}>
                                <FontAwesome6 name={"magnifying-glass"} color={"#004F87"} size={20} />
                            </Pressable>
                            <TextInput inputMode='text' style={styles.field} placeholder={"Search"} onChangeText={(text) => { setSearchName(text) }} />
                        </View>
                    </View>
                    <View style={styles.container2}>
                        <Image source={require("../assets/images/chatListBackground.jpg")} style={styles.backgroundImage} />
                        {userList && userList.length > 0 ? (
                            <FlashList
                                data={userList}
                                renderItem={({ item }) => (
                                    <UserItem userData={item}/>
                                )}
                                estimatedItemSize={100}

                            />
                        ) : (
                            <View style={styles.noChatsContainer}>
                                <Image source={require("../assets/images/noChatsImage.png")} style={styles.noChatsImage} />
                                <Text style={styles.noChatsText}>No Users</Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        rowGap: 15,
    },
    container2: {
        flex: 1,
        paddingHorizontal: 20,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden',
        width: "100%",
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    text1: {
        color: "#ffffff",
        fontFamily: "SairaExtraCondensedBold",
        fontSize: 40,
        alignSelf: 'center'
    },
    text2: {
        color: "#00A9EB",
        fontFamily: "RobotoCondensedRegular",
        fontSize: 20,
        alignSelf: 'flex-end'
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
        paddingStart: 10,
        paddingEnd: 35,
        fontSize: 16
    },
    searchIconContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    searchIconView: {
        position: 'absolute',
        right: 2,
        zIndex: 10,
        padding: 10
    },
    chatView: {
        width: "100%",
        height: 80,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    chatImage: {
        width: 60,
        height: 60,
        borderRadius: 75,
    },
    chatSection1: {
        flex: 1,
        paddingHorizontal: 10,
        rowGap: 5,
    },
    chatSection2: {
        paddingHorizontal: 10,
        rowGap: 10,
        alignItems: 'center',
    },
    chatName: {
        color: "#383838",
        fontFamily: "RobotoRegular",
        fontSize: 20,
    },
    chatMessage: {
        color: "#6C6E6F",
        fontFamily: "RobotoRegular",
        fontSize: 16,
    },
    chatTime: {
        color: "#6C6E6F",
        fontFamily: "RobotoRegular",
        fontSize: 16,
    },
    chatMessageCountView: {
        height: 30,
        width: 30,
        backgroundColor: "#2F768F",
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatMessageCount: {
        color: "#ffffff",
        fontSize: 14,
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
});
