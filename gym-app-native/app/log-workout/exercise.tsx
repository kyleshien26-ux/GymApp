import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { getExercisesByMuscleGroup, searchExercises, getAllMuscleGroups, Exercise } from '../../constants/exercises';

const CUSTOM_EXERCISES_KEY = '@gymapp/custom_exercises';

export default function ExercisesList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);

  const muscles = ['All', ...getAllMuscleGroups()];

  // Automatically fetch custom exercises from storage every time this screen is opened
  useFocusEffect(
    useCallback(() => {
      const loadCustomExercises = async () => {
        try {
          const stored = await AsyncStorage.getItem(CUSTOM_EXERCISES_KEY);
          if (stored) {
            setCustomExercises(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load custom exercises", e);
        }
      };
      loadCustomExercises();
    }, [])
  );

  const filteredExercises = useMemo(() => {
    let baseList = [];
    if (searchQuery.trim()) {
       baseList = searchExercises(searchQuery);
    } else {
       baseList = getExercisesByMuscleGroup(selectedMuscle);
    }
    
    // Mix the custom exercises into the search/filter results
    const matchedCustoms = customExercises.filter(e => {
        if (searchQuery.trim()) return e.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        if (selectedMuscle !== 'All') return false; // Show customs mostly in the 'All' tab or when searched
        return true;
    });

    return [...matchedCustoms, ...baseList];
  }, [searchQuery, selectedMuscle, customExercises]);

  const handleCreateCustom = async () => {
    if (!searchQuery.trim()) return;
    
    const exerciseName = searchQuery.trim();
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
    
    const updatedCustoms = [newExercise, ...customExercises];
    setCustomExercises(updatedCustoms); // Update UI immediately
    
    // Save permanently to storage so the modal can see it too
    try {
      await AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updatedCustoms));
    } catch (e) {
      console.error("Failed to save custom exercise", e);
    }

    setSearchQuery('');
    Alert.alert("Success", `Custom exercise "${exerciseName}" added!`);
  };

  const showTips = (ex: any) => {
    Alert.alert(
      ex.name,
      `${ex.tips || 'No specific tips available for this exercise.'}\n\nBiomechanics: ${ex.movementPlane}`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text}/></TouchableOpacity>
        <Text style={styles.title}>Exercise Library</Text>
        <View style={{width: 24}}/>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput 
            style={styles.input} 
            placeholder="Search or add custom..." 
            value={searchQuery}
            onChangeText={setSearchQuery} 
            autoFocus={false}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateCustom}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 50}}>
        <FlatList
          data={muscles}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, gap: 10}}
          renderItem={({item}) => (
            <TouchableOpacity 
              style={[styles.chip, selectedMuscle === item && styles.chipActive]} 
              onPress={() => setSelectedMuscle(item)}
            >
              <Text style={[styles.chipText, selectedMuscle === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredExercises}
        contentContainerStyle={{padding: 20}}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => showTips(item)}>
            <View>
              <View style={{flexDirection:'row', gap: 6, alignItems:'center'}}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.tier === 'S' && <View style={styles.badge}><Text style={styles.badgeText}>S-TIER</Text></View>}
              </View>
              
              <Text style={styles.cardSub}>
                {item.id.startsWith('custom') 
                  ? 'Custom Exercise' 
                  : `${item.muscleGroup} • ${item.target}`}
              </Text>
            </View>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 12, marginRight: 10 },
  input: { marginLeft: 10, flex: 1, fontSize: 16 },
  addButton: { backgroundColor: '#0ea5e9', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: '600', lineHeight: 28 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', height: 36 },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginRight: 8 },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 4 },
  badge: { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#166534' }
});