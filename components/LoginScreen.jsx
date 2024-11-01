import { View, Text, TextInput, StyleSheet, SafeAreaView, Image, 
        KeyboardAvoidingView,TouchableWithoutFeedback,Platform,
        Keyboard, } from 'react-native';
import React, { useState} from 'react';
import { Video, ResizeMode} from 'expo-av';
import { TouchableOpacity } from 'react-native';
import { Firebase_auth } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const auth = Firebase_auth;

    const logIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Logged in successfully');
        } catch (e) {
            setError(e.message);
            alert('Failed to login' + e.message);
        } finally {
            setLoading(false);
        }
    };  
    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);       
            console.log(response);
            alert('Signed up successfully! Check your email.');
        }
        catch (e) {
            setError(e.message);
            alert('Failed to sign up' + e.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Video 
                            style={styles.video}
                            source={{
                            uri: 'https://cdn.pixabay.com/video/2023/03/01/152798-803733100_large.mp4',
                            }}
                            isLooping
                            shouldPlay
                            resizeMode={ResizeMode.COVER}
                        />
                        <View style={styles.describtionWrapper}>
                            <Text style={styles.title}>
                                Crime Monitoring
                            </Text>
                            <Text style={styles.descText}>
                                This is an amazing app helps you locate high crime locations and share with your trusted families with any possible alert!
                            </Text>
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    style={styles.textInput} 
                                    value={email} 
                                    placeholder='Email' 
                                    autoCapitalize='none' 
                                    onChangeText={(text) => setEmail(text)} />
                                <TextInput 
                                    style={styles.textInput} 
                                    value={password} 
                                    placeholder='Password' 
                                    autoCapitalize='none' 
                                    secureTextEntry={true} 
                                    onChangeText={(text) => setPassword(text)}/>
                            </View>
                            {loading ? (<ActivityIndicator size='large' color='#0000ff' />
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity  style={styles.signWrapper} onPress={logIn}>
                                        <Text style={styles.signInText}>Sign In</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.signWrapper} onPress={signUp}>
                                        <Text style={styles.signInText}>Create an account</Text>
                                    </TouchableOpacity>
                                </View> 
                            )}
                            {/* <TouchableOpacity style={styles.signWrapper} onPress={()=> console.log('Button clicked')}>
                                    <Image source={require('./../assets/images/Logo-google-icon-PNG-removebg-preview.png')} style={styles.image} />
                                    <Text style={styles.signInText}>Sign In With Google</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 500,
        height: '100%',
    },
    describtionWrapper : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#0000005c',
        paddingHorizontal: 30,
    },
    title : {
        fontFamily:'OutfitBold',
        color: '#f1f1f1',
        fontSize: 45,
    },
    descText: {
        fontFamily: 'outfit',
        color: '#f1f1f1',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 15, 
    },
    inputWrapper: { 
        width: '100%',
        marginTop: 40,
    },
    textInput: {
        backgroundColor: 'white',
        width: '100%',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonWrapper: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 40,
    },
    signWrapper: {
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 45,
        borderRadius: 10,
        marginTop: 20,
    },
    image: {
        height: 30,
        width:30,
        
    },
    signInText: {
        fontFamily: 'Outfit',
        fontSize: 16,
    },
})

export default LoginScreen