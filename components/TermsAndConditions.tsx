// app/TermsAndConditions.tsx
import React, { useRef } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface TermsAndConditionsProps {
    visible: boolean;
    onClose: () => void;
    onScrollEnd: () => void;
    hasScrolledToEnd: boolean;
    setHasScrolledToEnd: (value: boolean) => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
    visible,
    onClose,
    onScrollEnd,
    hasScrolledToEnd,
    setHasScrolledToEnd,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollPosition = event.nativeEvent.contentOffset.y;

        // Check if the user has scrolled to the end
        if (scrollPosition + scrollHeight >= contentHeight) {
            setHasScrolledToEnd(true);
            onScrollEnd();
        }
    };

    const handleCheckboxPress = () => {
        if (!hasScrolledToEnd) {
            Alert.alert("Please read the Terms and Conditions before agreeing.");
        } else {
            // Logic to toggle checkbox state can be added here if needed
            Alert.alert("You have agreed to the Terms and Conditions.");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
                <View className="w-4/5 max-h-[80%] bg-white rounded-lg p-5">
                    <Text className="text-lg font-bold mb-3">Terms and Conditions</Text>
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        scrollEventThrottle={16} // Adjust for smoother scrolling
                    >
                        <Text className="text-gray-500 mb-5 text-lg">
                            By using this application, you agree to the following terms and conditions:
                            {"\n\n"}
                            1. <Text className="font-bold">Acceptance of Terms</Text>: By accessing and using this application, you accept and agree to be bound by these terms and conditions.
                            {"\n\n"}
                            2. <Text className="font-bold">User Responsibilities</Text>: You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
                            {"\n\n"}
                            3. <Text className="font-bold">Data Privacy</Text>: We respect your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy for more details.
                            {"\n\n"}
                            4. <Text className="font-bold">Limitation of Liability</Text>: We will not be liable for any damages arising from the use of this application.
                            {"\n\n"}
                            5. <Text className="font-bold">Changes to Terms</Text>: We may update these terms from time to time. Your continued use of the application after any changes constitutes your acceptance of the new terms.
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                        onPress={handleCheckboxPress}
                        className="flex flex-row items-center mt-3"
                    >
                        <FontAwesome
                            name={hasScrolledToEnd ? "check-square" : "square-o"}
                            size={20}
                            color={hasScrolledToEnd ? "blue" : "gray"}
                        />
                        <Text className="ml-2 text-gray-500 text-sm">
                            I have read and agree to the Terms and Conditions *
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-blue-600 rounded-lg h-10 justify-center items-center mt-5"
                    >
                        <Text className="text-white">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default TermsAndConditions;