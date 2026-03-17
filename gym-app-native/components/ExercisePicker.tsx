import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { searchExercises, Exercise } from '../constants/exercises';

interface ExercisePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function ExercisePicker({ visible, onClose, onSelectExercise }: ExercisePickerProps) {
  const [query, setQuery] = useState('');
  const results = searchExercises(query);

  const handleCreate = () => {
      // Create a temporary custom exercise
      const newEx: any = {
          id: `custom-${Date.now()}`,
          name: query,
          muscleGroup: 'Other', 
          type: 'Isolation',
          tier: 'B'
      };
      onSelectExercise(newEx);
      onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
          <Text style={styles.title}>Select Exercise</Text>
        </View>
        <TextInput 
          style={styles.search} 
          placeholder="Search..." 
          value={query} 
          onChangeText={setQuery}
          autoFocus={false}
        />
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.muted, marginBottom: 15 }}>No exercises found.</Text>
              {query.trim().length > 0 && (
                  <TouchableOpacity onPress={handleCreate} style={{backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8}}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>Create "{query}"</Text>
                  </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress={() => { onSelectExercise(item); onClose(); }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Text style={styles.name}>{item.name}</Text>
                {item.tier && <View style={[styles.badge, item.tier === 'S' ? {backgroundColor: '#dcfce7'} : {backgroundColor: '#f1f5f9'}]}>
                  <Text style={[styles.badgeText, item.tier === 'S' ? {color: '#166534'} : {color: colors.muted}]}>{item.tier}</Text>
                </View>}
              </View>
              <Text style={styles.sub}>{item.muscleGroup} • {item.type}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  search: { padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, marginBottom: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: 'bold' },
  sub: { color: '#666', fontSize: 12 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold' }
});
