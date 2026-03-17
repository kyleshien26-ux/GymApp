import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { searchExercises } from '../../constants/exercises';

interface PickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exerciseName: string) => void;
}

export default function ExercisePicker({ visible, onClose, onSelect }: PickerProps) {
  const [query, setQuery] = useState('');
  const results = searchExercises(query);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Exercise</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={30} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <TextInput 
          style={styles.search} 
          placeholder="Search (e.g. Bench Press)" 
          value={query} 
          onChangeText={setQuery} 
          autoFocus
        />

        <FlatList
          data={results}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => (
            <TouchableOpacity 
              style={styles.item} 
              onPress={() => { onSelect(item.name); onClose(); }}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.muscleGroup} • {item.type}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  search: { backgroundColor: '#f1f5f9', margin: 20, padding: 12, borderRadius: 10, fontSize: 16 },
  item: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  name: { fontSize: 16, fontWeight: '500' },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 }
});