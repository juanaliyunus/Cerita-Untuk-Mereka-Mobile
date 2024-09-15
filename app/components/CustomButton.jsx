import { Text, TouchableOpacity } from "react-native";


const CustomButton = ({title, onPress}) => {
    return (
        <TouchableOpacity
            className="bg-blue-500 rounded-full p-4" 
            onPress={onPress}
            >

            <Text className="text-white text-center">
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;