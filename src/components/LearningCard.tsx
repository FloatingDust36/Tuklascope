import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { getDeeperExplanation } from '../services/GeminiService';
import { Ionicons } from '@expo/vector-icons';
import { Discovery } from '../types';
import Markdown from 'react-native-markdown-display';

const { width } = Dimensions.get('window');

type SingleCardProps = {
  title: string;
  text: string;
  showBakitButton: boolean;
};

type ConversationEntry = {
  title?: string;
  text: string;
};

const markdownStyles = {
  body: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  strong: {
    fontFamily: 'Poppins-Bold',
    color: '#002B6B',
  },
  em: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic' as 'italic',
    color: '#004AAD',
  },
};

const SingleCard = ({ title, text, showBakitButton }: SingleCardProps) => {
  const [conversation, setConversation] = useState<ConversationEntry[]>([{ text, title }]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBakitPress = async () => {
    setIsLoading(true);
    const history = conversation.map(c => c.text).join('\n');
    const deeperExplanation = await getDeeperExplanation(history);
    setConversation(prev => [...prev, { title: "Dahil (Because)...", text: deeperExplanation }]);
    setIsLoading(false);
  };

  return (
    <View style={styles.card}>
      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {conversation.map((entry, index) => (
          <View key={index} style={styles.aiBubble}>
            {entry.title && <Text style={styles.bubbleTitle}>{entry.title}</Text>}
            <Markdown style={markdownStyles}>{entry.text}</Markdown>
          </View>
        ))}
        {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} color="#004AAD" />}
      </ScrollView>
      {showBakitButton && (
        <TouchableOpacity style={styles.actionButton} onPress={handleBakitPress} disabled={isLoading}>
          <Ionicons name="help-circle-outline" size={24} color="white" />
          <Text style={styles.actionButtonText}>Bakit?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

type LearningCardProps = {
    objectName: string;
    data: Discovery['learningData'] | null;
    onClose: () => void;
  };
  
export const LearningCard = ({ objectName, data, onClose }: LearningCardProps) => {
    if (!data) return null;
  
    const cards = [
      { id: 'observe', ...data.stem },
      { id: 'understand', ...data.tech },
      { id: 'create', ...data.local },
    ].filter(card => card.text && card.title);
  
    return (
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{objectName}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={cards}
          renderItem={({ item }) => (
            <SingleCard title={item.title} text={item.text} showBakitButton={item.id === 'understand'} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </View>
    );
  };
  
const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    headerContainer: { paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontFamily: 'Poppins-Bold', fontSize: 32, color: 'white', textTransform: 'capitalize' },
    closeButton: {  },
    card: { width: width - 20, marginHorizontal: 10, height: '95%', backgroundColor: '#f0f4f8', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, justifyContent: 'space-between' },
    aiBubble: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15, marginVertical: 8, elevation: 1 },
    bubbleTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#004AAD', marginBottom: 5 },
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#004AAD', borderRadius: 20, paddingVertical: 12, elevation: 2, marginTop: 15 },
    actionButtonText: { color: 'white', fontFamily: 'Poppins-Bold', fontSize: 16, marginLeft: 8 },
});