import { Image } from 'expo-image';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View ,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router"

SplashScreen.preventAutoHideAsync();

export default function index() {

  const [loaded, error] = useFonts({
    "Monarda": require("../assets/fonts/Monarda.ttf"),
    "SairaExtraCondensedBold": require("../assets/fonts/SairaExtraCondensed-Bold.ttf"),
    "RobotoRegular": require("../assets/fonts/Roboto-Regular.ttf"),
    "RobotoBold": require("../assets/fonts/Roboto-Bold.ttf"),
  });

  useEffect(
    () => {
      const checkUserInAsyncStorage = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('user');

          if (jsonValue != null) {
            router.replace("/home");
          }

        } catch (e) {
          Alert.alert("Error", "Unable to Sign In. Please try again later.");
          console.error(e);
        }
      };

      checkUserInAsyncStorage();
    }
  );

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
    setTimeout(() => {
      setStatusBarStyle("light");
    }, 0);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style='light' />
      <Image source={require("../assets/images/welcomeBackground.png")} style={styles.backgroundImage} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.text1}>Welcome To</Text>
          <Text style={styles.text2}>Connect</Text>
          <Image source={require("../assets/images/logoWhite.png")} style={styles.logo} />
          <View style={styles.view1}>
            <Pressable style={styles.button} onPress={() => {
              router.push("/signIn");
            }}>
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <View style={styles.view2}>
              <View style={styles.line}></View>
              <Text style={styles.text3}>or</Text>
              <View style={styles.line}></View>
            </View>
            <Pressable style={styles.button} onPress={() => {
              router.push("/signUp");
            }}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  text1: {
    color: "#8CD8F5",
    fontFamily: "SairaExtraCondensedBold",
    fontSize: 50,
  },
  text2: {
    color: "#ffffff",
    fontFamily: "Monarda",
    fontSize: 70,
  },
  text3: {
    color: "#ffffff",
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
  logo: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  button: {
    backgroundColor: "#2F768F",
    borderRadius: 20,
    height: 60,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "RobotoBold",
    fontSize: 20,
  },
  view1: {
    marginVertical: 50,
    width: "100%",
    alignItems: 'center',
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  line: {
    borderColor: "#2F768F",
    borderWidth: 1,
    flex: 1
  },
});
