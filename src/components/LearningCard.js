import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getDeeperExplanation } from '../services/GeminiService';
import { Ionicons } from '@expo/vector-icons';

const ChatBubble = ({ text, isUser = false }) => (
  <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
    <Text style={styles.bubbleText}>{text}</Text>
  </View>
);

export default function LearningCard({ objectName, data, onClose }) {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (data) {
      const initialFacts = [
        data.biology ? `${data.biology.title}: ${data.biology.text}` : '',
        data.physics ? `${data.physics.title}: ${data.physics.text}` : '',
        data.tech ? `${data.tech.title}: ${data.tech.text}` : '',
      ].filter(Boolean);
      setConversation(initialFacts.map(fact => ({ text: fact, author: 'ai' })));
    }
  }, [data]);

  const handleBakitPress = async () => {
    setIsLoading(true);
    const history = conversation.map(c => c.text).join('\n');
    const deeperExplanation = await getDeeperExplanation(history);
    setConversation(prev => [...prev, { text: deeperExplanation, author: 'ai' }]);
    setIsLoading(false);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{objectName}</Text>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {conversation.map((entry, index) => <ChatBubble key={index} text={entry.text} />)}
          {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} color="#004AAD" />}
        </ScrollView>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBakitPress} disabled={isLoading}>
            <Ionicons name="help-circle-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Bakit? (Why?)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.closeButton]} onPress={onClose}>
            <Text style={styles.actionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  card: { width: '100%', height: '75%', backgroundColor: '#f0f4f8', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, textAlign: 'center', marginBottom: 20, textTransform: 'capitalize', color: '#002B6B' },
  bubble: { padding: 12, borderRadius: 18, marginVertical: 5, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#d1e7ff', alignSelf: 'flex-end' },
  bubbleText: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#333333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#004AAD', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 20, elevation: 2 },
  actionButtonText: { color: 'white', fontFamily: 'Poppins-Bold', fontSize: 16, marginLeft: 8 },
  closeButton: { backgroundColor: '#6c757d' }
});