import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../service/axios';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
    const [registrationType, setRegistrationType] = useState('donor');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [webUrl, setWebUrl] = useState('');
    const [description, setDescription] = useState('');

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => {
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        return password.length > 8 && hasNumber && hasLetter;
    };

    const handleRegister = async () => {
  
        if (!fullName) {
            alert('Full Name is required');
            return;
        }

        if (!email) {
            alert('Email is required');
            return;
        }

        if (!username) {
            alert('Username is required');
            return;
        }

        if (!password) {
            alert('Password is required');
            return;
        }

        if (!confirmPassword) {
            alert('Please confirm your password');
            return;
        }

        if (registrationType === 'orphanage' && !address) {
            alert('Address is required for orphanage registration');
            return;
        }

        if (registrationType === 'orphanage' && !webUrl) {
            alert('Web URL is required for orphanage registration');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be more than 8 characters and contain both letters and numbers');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        let registrationData = {
            username,
            password,
        };

        if (registrationType === 'donor') {
            registrationData = {
                ...registrationData,
                donor: {
                    email,
                    address,
                    phone_number: phoneNumber || '',
                    full_name: fullName,
                },
            };
        } else {
            registrationData = {
                ...registrationData,
                orphanages: {
                    email,
                    address,
                    name: fullName,
                    description: description || '',
                    phone_number: phoneNumber || '',
                    web_url: webUrl || '',
                },
            };
        }

        try {
            const endpoint = registrationType === 'donor' ? '/auth/register/donor' : '/auth/register/orphanages';
            await axiosInstance.post(endpoint, registrationData);
            alert('Registration successful!');
            navigation.navigate('Login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Please check your inputs and try again.';
            alert(`Registration failed: ${errorMessage}`);
        }

        setFullName('');
        setEmail('');
        setUsername('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setAddress('');
        setWebUrl('');
        setDescription('');
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-100">
            <ScrollView>
                <View className="flex-1 justify-center p-6">
                    <Text className="text-2xl font-bold text-gray-800 text-center mb-8">Create an Account</Text>

                    <View className="flex-row justify-center mb-4">
                        <TouchableOpacity
                            className={`p-2 mr-2 rounded-lg ${registrationType === 'donor' ? 'bg-blue-500' : 'bg-white'}`}
                            onPress={() => setRegistrationType('donor')}
                        >
                            <Text className={`${registrationType === 'donor' ? 'text-white' : 'text-blue-500'}`}>Donor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`p-2 rounded-lg ${registrationType === 'orphanage' ? 'bg-blue-500' : 'bg-white'}`}
                            onPress={() => setRegistrationType('orphanage')}
                        >
                            <Text className={`${registrationType === 'orphanage' ? 'text-white' : 'text-blue-500'}`}>Orphanage</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder={registrationType === 'donor' ? "Full Name" : "Orphanage Name"}
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <TextInput
                        placeholder="Email"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder="Username"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        placeholder="Phone Number"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TextInput
                        placeholder="Address"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        value={address}
                        onChangeText={setAddress}
                    />

                    {registrationType === 'orphanage' && (
                        <>
                            <TextInput
                                placeholder="Description"
                                className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                                placeholderTextColor="gray"
                                value={description}
                                onChangeText={setDescription}
                            />
                            <TextInput
                                placeholder="Web URL"
                                className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                                placeholderTextColor="gray"
                                keyboardType="url"
                                value={webUrl}
                                onChangeText={setWebUrl}
                            />
                        </>
                    )}

                    <TextInput
                        placeholder="Password"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        className="bg-white p-4 mb-4 rounded-lg shadow-sm"
                        placeholderTextColor="gray"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <View className="mt-5">
                        <CustomButton title="Register" onPress={handleRegister} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
