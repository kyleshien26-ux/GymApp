import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useSettings } from '../providers/SettingsProvider';

export default function PlateCalculator() {
  const router = useRouter();
  const { settings } = useSettings();
  const [targetWeight, setTargetWeight] = useState('');
  
  const isLbs = settings.preferences?.units === 'lbs';
  const barWeight = isLbs ? 45 : 20;
  const plateSet = isLbs ? [45, 35, 25, 10, 5, 2.5] : [25, 20, 15, 10, 5, 2.5, 1.25];

  const calculatePlates = (weight: number) => {
    if (weight <= barWeight) return [];
    let remaining = (weight - barWeight) / 2;
    const result: number[] = [];
    
    for (const plate of plateSet) {
      while (remaining >= plate) {
        result.push(plate);
        remaining -= plate;
      }
    }
    return result;
  };

  const plates = targetWeight ? calculatePlates(Number(targetWeight)) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={styles.title}>Plate Calculator ({isLbs ? 'LBS' : 'KG'})</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Target Weight ({isLbs ? 'lbs' : 'kg'})</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={targetWeight} 
          onChangeText={setTargetWeight}
          placeholder={`e.g. ${isLbs ? '225' : '100'}`} 
        />
        
        <View style={styles.result}>
          <View style={styles.bar}><Text style={styles.plateText}>{barWeight}</Text></View>
          {plates.map((p, i) => (
            <View key={i} style={[styles.plate, { height: 40 + p * (isLbs ? 1.5 : 2) }]}>
              <Text style={styles.plateText}>{p}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.hint}>Per side</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  content: { padding: 20, alignItems: 'center' },
  label: { fontSize: 14, color: colors.muted, marginBottom: 8 },
  input: { width: '100%', backgroundColor: colors.card, padding: 16, borderRadius: 12, fontSize: 24, textAlign: 'center', marginBottom: 40 },
  result: { flexDirection: 'row', alignItems: 'center', height: 150, gap: 4 },
  bar: { width: 10, height: 150, backgroundColor: '#94a3b8', justifyContent: 'center', alignItems: 'center' },
  plate: { width: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  plateText: { color: '#fff', fontSize: 10, fontWeight: 'bold', transform: [{ rotate: '-90deg' }] },
  hint: { marginTop: 20, color: colors.muted }
});