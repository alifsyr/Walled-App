import { Stack } from "expo-router";
import { Image, View, Text } from "react-native";
import "../global.css";

export default function RootLayout() {
  const user = {
    name: "John Doe",
    balance: 10000000,
    accountNumber: "1234567890",
    profileImage: require("@/assets/images/profile-pict.jpg"),
    accountType: "Personal Account",
  };

  return (
    <Stack screenOptions={{ headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="home"
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <View className="flex-row items-center">
              <Image
                source={user.profileImage}
                className="w-11 h-11 rounded-full border-2 border-[#178F8D]"
              />
              <View className="ml-3">
                <Text className="font-bold text-base">{user.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {user.accountType}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <View>
              <Image
                source={require("@/assets/images/theme-switcher.png")}
                className="w-7 h-7"
              />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
