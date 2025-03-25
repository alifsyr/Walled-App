import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native";
import PropTypes from "prop-types";

/**
 * A customizable inline dropdown component for React Native
 * @param {Object} props - Component props
 * @param {Array<string>} props.data - Array of options to display in the dropdown
 * @param {Function} props.onSelect - Callback function when an option is selected
 * @param {string} [props.placeholder] - Placeholder text when no option is selected
 * @param {Object} [props.buttonStyle] - Custom style for the trigger button
 * @param {Object} [props.dropdownStyle] - Custom style for the dropdown container
 */
const InlineDropdown: React.FC<{
    data: string[];
    onSelect: (item: string) => void;
    placeholder?: string;
    buttonStyle?: object;
    dropdownStyle?: object;
}> = ({
    data,
    onSelect,
    placeholder = "Select an option",
    dropdownStyle,
}) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

    const handleSelect = (item: string) => {
        setSelectedValue(item);
        onSelect(item);
        setDropdownVisible(false);
    };

    return (
        <View className="m-5 z-10">
            <TouchableOpacity
                className={`p-4 bg-blue-500 rounded-lg `}
                onPress={toggleDropdown}
            >
                <Text className="text-white text-center font-bold text-base">
                    {selectedValue || placeholder}
                </Text>
            </TouchableOpacity>

            {isDropdownVisible && (
                <View className={`mt-2 rounded shadow-lg max-h-52 ${dropdownStyle}`}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-4 border-b border-gray-300"
                                onPress={() => handleSelect(item)}
                            >
                                <Text className="text-base text-gray-800">{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
            )}
        </View>
    );
};

InlineDropdown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    buttonStyle: PropTypes.object,
    dropdownStyle: PropTypes.object,
};

export default InlineDropdown;
