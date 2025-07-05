import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { identifyObject, generateLearningCard } from './src/services/GeminiService';
import LearningCard from './src/components/LearningCard';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import JournalScreen from './src/screens/JournalScreen';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [learningData, setLearningData] = useState<any>(null);
  const [objectName, setObjectName] = useState('');
  const cameraRef = useRef<CameraView | null>(null);
  const [tuklasPoints, setTuklasPoints] = useState(0);

  const loadPoints = async () => {
        const points = await AsyncStorage.getItem('@tuklasPoints');
        setTuklasPoints(points != null ? parseInt(points, 10) : 0);
    };
    useEffect(() => { loadPoints() }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saveDiscovery = async (discovery) => {
        const existingDiscoveries = await AsyncStorage.getItem('@discoveries');
        const discoveries = existingDiscoveries ? JSON.parse(existingDiscoveries) : [];
        discoveries.unshift(discovery); // Add new discovery to the top
        await AsyncStorage.setItem('@discoveries', JSON.stringify(discoveries));
    };

  const handleScan = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo) {
          const identified = await identifyObject(photo.uri);
          setObjectName(identified);

          if (identified && identified !== "Could not identify object") {
            const cardData = await generateLearningCard(identified);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setLearningData(cardData);
            setModalVisible(true);
            const newPoints = tuklasPoints + 10;
            setTuklasPoints(newPoints);
            await AsyncStorage.setItem('@tuklasPoints', newPoints.toString());
            await saveDiscovery({ objectName: identified, learningData: cardData, date: new Date() });
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert('Could not identify the object. Please try again.');
          }
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Scan failed:", error);
      alert('An error occurred during the scan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      
      <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')} style={styles.headerButton}>
              <Ionicons name="journal-outline" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{tuklasPoints} TP</Text>
          </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Tuklascope is thinking...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={isLoading}>
          <Ionicons name="scan-outline" size={40} color="#004AAD" />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LearningCard 
          objectName={objectName} 
          data={learningData} 
          onClose={() => setModalVisible(false)} 
        />
      </Modal>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f4f8' },
  permissionText: { fontFamily: 'Poppins-Bold', fontSize: 18, textAlign: 'center'},
  permissionButton: { backgroundColor: '#004AAD', paddingVertical: 12, paddingHorizontal: 20, marginTop: 20, borderRadius: 10 },
  permissionButtonText: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 16 },
  camera: { flex: 1 },
  headerButtons: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { padding: 8, backgroundColor: 'rgba(0, 74, 173, 0.7)', borderRadius: 25 },
  scoreContainer: { backgroundColor: 'rgba(0, 74, 173, 0.7)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  scoreText: { fontFamily: 'Poppins-Bold', color: '#FFFFFF', fontSize: 18 },
  buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  scanButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(0,0,0,0.2)' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Poppins-Regular', color: '#FFFFFF', marginTop: 10, fontSize: 18 },
});