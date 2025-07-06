import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { CameraView } from 'expo-camera'; 
import { identifyObject, generateLearningCard } from '../services/GeminiService';
import { LearningCard } from '../components/LearningCard';
import { Ionicons } from '@expo/vector-icons'; 
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Discovery, ModalScreenNavigationProp } from '../types';

type CameraScreenProps = {
  navigation: ModalScreenNavigationProp;
};

export const CameraScreen = ({ navigation }: CameraScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [learningData, setLearningData] = useState<Discovery['learningData'] | null>(null);
  const [objectName, setObjectName] = useState('');
  const cameraRef = useRef<CameraView | null>(null);

  const saveDiscovery = async (discovery: Discovery) => {
    const existing = await AsyncStorage.getItem('@discoveries');
    const discoveries: Discovery[] = existing ? JSON.parse(existing) : [];
    const isDuplicate = discoveries.find(d => d.objectName.toLowerCase() === discovery.objectName.toLowerCase());
    if (!isDuplicate) {
        discoveries.unshift(discovery);
        await AsyncStorage.setItem('@discoveries', JSON.stringify(discoveries));
    }
  };

  const handleScan = async () => {
    if (!cameraRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo) {
          const { objectName: identifiedName, context } = await identifyObject(photo.uri);
          setObjectName(identifiedName);

          if (identifiedName && identifiedName !== "Could not identify object") {
            const cardData = await generateLearningCard(identifiedName, context);
            
            if (cardData) { 
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setLearningData(cardData);
              setModalVisible(true);
              await saveDiscovery({ objectName: identifiedName, learningData: cardData, date: new Date().toISOString() });
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              alert('Tuklascope could not generate learning content for this object. The AI may be busy or has reached its limit.');
            }
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert('Could not identify the object.');
          }
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={35} color="white" />
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Tuklascope is thinking...</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mainScanButton} onPress={handleScan} disabled={isLoading} />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <LearningCard objectName={objectName} data={learningData} onClose={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontFamily: 'Poppins-Regular', color: '#FFFFFF', marginTop: 10, fontSize: 18 },
    buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
    mainScanButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', elevation: 5 },
    closeButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
});