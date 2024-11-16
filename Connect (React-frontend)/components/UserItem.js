import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFonts } from 'expo-font';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserItem({ userData }) {
    const imagePath = "http://192.168.8.162:8080/Connect/Avatar_Images/" + userData.otherUserMobile + ".png";

    let isLoggedUser = false;
    async function checkIfLoggedUser(){
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        if (user && user.id === userData.otherUserId){
            isLoggedUser = true;
        }
    }
    checkIfLoggedUser();

    let userName = userData.otherUserName;
    let userAbout = userData.otherUserAbout;

    // if (userName.length > 22) {
    //     userName = userName.substring(0, 20) + "...";
    // }

    // if (userAbout.length > 20) {
    //     userAbout = userAbout.substring(0, 17) + "...";
    // }

    return (
        <Pressable style={styles.userView} onPress={() => {
            !isLoggedUser && router.push({ pathname: "/chat", params: userData });
        }}>
            <Image source={userData.avatarImageFound ? imagePath : require('../assets/images/user.png')} style={styles.userImage} />
            <View style={styles.userStateView}>
                <View style={[styles.userStateViewColor, userData.otherUserStatus == "Online" ? styles.userOnline : styles.userOffline]}></View>
            </View>
            <View style={styles.userSection1}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userAbout}>{userAbout}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    userView: {
        width: "100%",
        height: 80,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 75,
    },
    userStateView: {
        width: 20,
        height: 20,
        borderRadius: 10,
        position: "absolute",
        borderColor: "#666666",
        borderWidth: 2,
        alignSelf: "flex-end",
        left: 55,
        bottom: 10,
        backgroundColor: "#666666",
    },
    userStateViewColor: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    userOnline: {
        backgroundColor: "#35b50b"
    },
    userOffline: {
        backgroundColor: "#ed1818"
    },
    userSection1: {
        flex: 1,
        paddingHorizontal: 10,
        rowGap: 5,
        alignItems:"center",
        justifyContent:"center",
    },
    userName: {
        color: "#383838",
        fontFamily: "RobotoRegular",
        fontSize: 20,
    },
    userAbout: {
        color: "#6C6E6F",
        fontFamily: "RobotoRegular",
        fontSize: 16,
    },
});
