import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exerciseDatabase, Exercise } from '../constants/exercises';
import { colors } from '../constants/colors';

const CUSTOM_EXERCISES_KEY = '@gymapp/custom_exercises';

interface Props {
  visible: boolean;
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

export default function ExercisePicker({ visible, onSelectExercise, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [localDatabase, setLocalDatabase] = useState<Exercise[]>(exerciseDatabase);

  // Load custom exercises from the phone's storage when the modal opens
  useEffect(() => {
    const loadCustomExercises = async () => {
      try {
        const stored = await AsyncStorage.getItem(CUSTOM_EXERCISES_KEY);
        if (stored) {
          const customExercises = JSON.parse(stored);
          setLocalDatabase([...customExercises, ...exerciseDatabase]);
        }
      } catch (e) {
        console.error("Failed to load custom exercises", e);
      }
    };
    if (visible) {
      loadCustomExercises();
    }
  }, [visible]);

  const filteredExercises = localDatabase.filter(e => 
    e.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleCreateCustom = async () => {
    if (!query.trim()) return; 
    
    const exerciseName = query.trim();

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: exerciseName,
      muscleGroup: 'Shoulders', 
      movementPlane: 'Horizontal Push', 
      target: 'Custom',
      tier: 'B', 
      type: 'Isolation',
      equipment: 'Dumbbell',
      fatigueCost: 'Low',
      jointStress: 'Low',
      targetReps: '8-12',
      tips: 'Custom user-created exercise.'
    };
    
    // Update the list immediately for the UI
    const updatedDatabase = [newExercise, ...localDatabase];
    setLocalDatabase(updatedDatabase); 

    // Permanently save it to AsyncStorage
    try {
      const stored = await AsyncStorage.getItem(CUSTOM_EXERCISES_KEY);
      const existingCustoms = stored ? JSON.parse(stored) : [];
      const updatedCustoms = [newExercise, ...existingCustoms];
      await AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updatedCustoms));
    } catch (e) {
      console.error("Failed to save custom exercise", e);
    }
    
    onSelectExercise(newExercise);
    setQuery('');
    onClose(); 
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Select Exercise</Text>
              <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color={colors.muted} />
                    <TextInput 
                      style={styles.input} 
                      placeholder="Search or type to create..." 
                      value={query} 
                      onChangeText={setQuery} 
                      autoFocus={true}
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleCreateCustom}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            
            {filteredExercises.length === 0 && query.trim().length > 0 ? (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>No results found.</Text>
                <TouchableOpacity style={styles.createBtn} onPress={handleCreateCustom}>
                    <Text style={styles.createBtnText}>+ Add "{query}"</Text>
                </TouchableOpacity>
            </View>
            ) : (
            <FlatList 
                data={filteredExercises}
                contentContainerStyle={{padding: 20}}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => {
                    onSelectExercise(item);
                    setQuery('');
                    onClose();
                }}>
                    <View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            {item.tier === 'S' && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>S-TIER</Text>
                                </View>
                            )}
                        </View>
                        
                        <Text style={styles.cardSub}>
                          {item.id.startsWith('custom') 
                            ? 'Custom Exercise' 
                            : `${item.muscleGroup} • ${item.target}`}
                        </Text>
                    </View>
                    <Ionicons name="add-circle" size={28} color={colors.primary} />
                </TouchableOpacity>
                )}
            />
            )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 12, marginRight: 10 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: colors.text },
  addButton: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginRight: 8 },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 4 },
  badge: { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#166534' },
  fallbackContainer: { alignItems: 'center', marginTop: 40 },
  fallbackText: { color: colors.muted, fontSize: 15, marginBottom: 16 },
  createBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});