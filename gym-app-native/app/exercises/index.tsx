import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { getExercisesByMuscleGroup, searchExercises, getAllMuscleGroups } from '../../constants/exercises';

export default function ExercisesList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  const muscles = ['All', ...getAllMuscleGroups()];

  // FILTER LOGIC
  const filteredExercises = useMemo(() => {
    if (searchQuery.trim()) return searchExercises(searchQuery);
    return getExercisesByMuscleGroup(selectedMuscle);
  }, [searchQuery, selectedMuscle]);

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

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput 
          style={styles.input} 
          placeholder="Search exercises..." 
          value={searchQuery}
          onChangeText={setSearchQuery} 
          autoFocus={false}
        />
      </View>

      {/* MUSCLE TABS */}
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

      {/* LIST */}
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
              <Text style={styles.cardSub}>{item.muscleGroup} • {item.target}</Text>
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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', margin: 20, marginTop: 0, padding: 12, borderRadius: 12 },
  input: { marginLeft: 10, flex: 1, fontSize: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', height: 36 },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  badge: { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#166534' }
});