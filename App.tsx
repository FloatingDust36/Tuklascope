import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { identifyObject, generateLearningCard } from './src/services/GeminiService';
import LearningCard from './src/components/LearningCard';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [learningData, setLearningData] = useState<any>(null);
  const [objectName, setObjectName] = useState('');
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = async () => {
    if (cameraRef.current && !isLoading) {
      setIsLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        if (photo) {
            const identified = await identifyObject(photo.uri);
            setObjectName(identified);

            if (identified && identified !== "Could not identify object") {
              const cardData = await generateLearningCard(identified);
              setLearningData(cardData);
              setModalVisible(true);
            } else {
              alert('Could not identify the object. Please try again.');
            }
        }
      } catch (error) {
        console.error("Scan failed:", error);
        alert('An error occurred during the scan.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Tuklascope is thinking...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={isLoading}>
          <Text style={styles.buttonText}>SCAN</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  camera: { flex: 1 },
  buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  scanButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(0,0,0,0.2)' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 18 },
  permissionButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 20, marginTop: 20, borderRadius: 10 }
});