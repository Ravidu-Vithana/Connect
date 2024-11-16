import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFonts } from 'expo-font';
import { router } from "expo-router";

export default function ChatItem({ chatData }) {
    const imagePath = "http://192.168.8.162:8080/Connect/Avatar_Images/" + chatData.otherUserMobile +".png";

    let userName = chatData.otherUserName;

    if (userName.length > 16) {
        userName = userName.substring(0, 14) + "...";
    }

    let lastMessage = chatData.lastMessage;

    if (lastMessage.length > 25) {
        lastMessage = lastMessage.substring(0, 22) + "...";
    }

    return (
        <Pressable style={styles.chatView} onPress={()=>{
            router.push({ pathname: "/chat", params: chatData });
        }}>
            <Image source={chatData.avatarImageFound ? imagePath : require('../assets/images/user.png')} style={styles.chatImage} />
            <View style={styles.userStateView}>
                <View style={[styles.userStateViewColor, chatData.otherUserStatus == "Online" ? styles.userOnline:styles.userOffline]}></View>
            </View>
            <View style={styles.chatSection1}>
                <Text style={styles.chatName}>{userName}</Text>
                <Text style={styles.chatMessage}>{lastMessage}</Text>
            </View>
            <View style={styles.chatSection2}>
                <Text style={styles.chatTime}>{chatData.lastDateTime}</Text>
                {chatData.newMessageCount > 0 ? <View style={styles.chatMessageCountView}>
                    <Text style={styles.chatMessageCount}>{chatData.newMessageCount}</Text>
                </View> : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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
    userStateView:{
        width: 20,
        height: 20,
        borderRadius:10,
        position:"absolute",
        borderColor:"#666666",
        borderWidth:2,
        alignSelf:"flex-end",
        left:55,
        bottom:10,
        backgroundColor:"#666666",
    },
    userStateViewColor:{
        width:"100%",
        height:"100%",
        borderRadius: 10,
    },
    userOnline:{
        backgroundColor: "#35b50b"
    },
    userOffline:{
        backgroundColor: "#ed1818"
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
});
