import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function LearningCard({ objectName, data, onClose }) {
  if (!data) return null;
  const { biology, physics, tech } = data;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{objectName}</Text>
        <ScrollView>
          {biology && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{biology.title}</Text>
              <Text style={styles.sectionText}>{biology.text}</Text>
            </View>
          )}
          {physics && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{physics.title}</Text>
              <Text style={styles.sectionText}>{physics.text}</Text>
            </View>
          )}
          {tech && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tech.title}</Text>
              <Text style={styles.sectionText}>{tech.text}</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  card: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, textAlign: 'center', marginBottom: 20, textTransform: 'capitalize', color: '#002B6B' },
  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#004AAD' },
  sectionText: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#333333', marginTop: 5, lineHeight: 24 },
  closeButton: { backgroundColor: '#004AAD', borderRadius: 20, padding: 12, elevation: 2, marginTop: 15 },
  closeButtonText: { color: 'white', fontFamily: 'Poppins-Bold', textAlign: 'center', fontSize: 18 }
});