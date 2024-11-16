import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ChatItem({ messageData }) {

    let seen = false;
    if (messageData.fromUser && messageData.messageSeen) {
        seen = true;
    }

    return (
        <View style={[styles.messageView, messageData.fromUser ? styles.messageRight : styles.messageLeft]}>
            <Text style={[styles.messageText, messageData.fromUser ? styles.textRight : styles.textLeft]}>{messageData.message}</Text>
            <Text style={[styles.messageTime, , messageData.fromUser ? styles.timeRight : styles.timeLeft]}>{messageData.time}</Text>
            {messageData.fromUser && <FontAwesome6 name={seen ? "check-double" : "check"} style={{ alignSelf: "flex-end" }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    messageView: {
        flexDirection: 'row',
        borderRadius: 10,
        marginVertical: 5,
        columnGap: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        maxWidth: "85%"
    },
    messageLeft: {
        backgroundColor: "#2F768F",
        alignSelf: 'flex-start',
    },
    messageRight: {
        backgroundColor: "#FAFBFF",
        alignSelf: 'flex-end',
    },
    messageText: {
        alignSelf: 'center',
        fontFamily: "RobotoRegular",
        fontSize: 18,
        maxWidth: "75%"
    },
    messageTime: {
        alignSelf: 'flex-end',
        fontFamily: "RobotoRegular",
        fontSize: 14,
    },
    textLeft: {
        color: "white",
    },
    textRight: {
        color: "#383838",
    },
    timeLeft: {
        color: "#99BFCC",
    },
    timeRight: {
        color: "#6C6E6F",
    },
});
