import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { generateAdvancedPlan, ExperienceLevel, MaintenancePreference, EquipmentProfile } from '../../lib/workout-planner';
import { Template, ExerciseEntry } from '../../types/workouts';
import { MuscleGroup } from '../../constants/exercises';

const MUSCLES: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Calves'];

const EXPERIENCE_DESC = {
    'Beginner': 'Focused on linear progression and learning form.',
    'Intermediate': 'Includes periodization and more volume.',
    'Advanced': 'High volume with advanced techniques.'
};

interface GeneratedPlan {
  splitName: string;
  routines: {
    name: string;
    exercises: ExerciseEntry[];
  }[];
  scheduleAdvice: string;
}

export default function AutoPlan() {
  const router = useRouter();
  const { addTemplate, workouts } = useWorkouts();
  
  const [days, setDays] = useState(4);
  const [goal, setGoal] = useState<'Strength' | 'Hypertrophy'>('Hypertrophy');
  const [legPreference, setLegPreference] = useState<'Normal' | 'Minimum' | 'None'>('Normal');
  const [weakPoints, setWeakPoints] = useState<MuscleGroup[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel>('Intermediate');
  const [mesocycleWeek, setMesocycleWeek] = useState<number>(1);
  const [maintenancePreference, setMaintenancePreference] = useState<MaintenancePreference>('Growth');
  const [equipmentProfile, setEquipmentProfile] = useState<EquipmentProfile>('Full Gym');
  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);

  const toggleWeakPoint = (m: MuscleGroup) => {
    setWeakPoints(prev => prev.includes(m) ? prev.filter(w => w !== m) : [...prev, m]);
  };

  const handleGenerate = () => {
    const plan = generateAdvancedPlan(workouts, { 
        daysPerWeek: days, 
        weakPoints, 
        goal, 
        legPreference, 
        experience,
        maintenancePreference,
        equipmentProfile,
        mesocycleWeek
    });
    setGenerated(plan);
  };

  const handleSaveAndStart = async () => {
    if (!generated) return;
    
    let firstTemplateId = '';
    const folderName = generated.splitName; // Group by split name

    for (let i = 0; i < generated.routines.length; i++) {
      const routine = generated.routines[i];
      if (!routine.exercises.length) continue;

      const tempId = `t-${Date.now()}-${i}`;
      if (i === 0) firstTemplateId = tempId;
      
      const newTemplate: Template = {
        id: tempId,
        folder: folderName, // Assign folder
        name: routine.name, // Just the day name (e.g., "Push A")
        exercises: routine.exercises.map((ex) => ({
          ...ex,
          id: `gen-${Math.random()}`,
          sets: Array(typeof ex.sets === 'number' ? ex.sets : 0).fill(null).map(() => ({ 
            id: `s-${Math.random()}`, 
            weight: ex.suggestedWeight || 0, 
            reps: 10, 
            completed: false 
          })),
        }))
      };
      await addTemplate(newTemplate);
    }

    if (firstTemplateId) {
      Alert.alert('Success', 'Plan saved to Templates tab.');
      router.push('/(tabs)/templates');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Planner</Text>
        <Text style={styles.subtitle}>Generate a scientific training program</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!generated ? (
          <View>
            <View style={styles.aiNotice}>
                <Ionicons name="sparkles" size={20} color={colors.primary} />
                <Text style={styles.aiNoticeText}>
                    {workouts.length < 5 
                        ? `Log ${5 - workouts.length} more workouts for personalized AI suggestions.`
                        : "AI Engine is ready with your training data."}
                </Text>
            </View>

            <Text style={styles.label}>Frequency (Days/Week)</Text>
            <View style={styles.row}>
                {[3,4,5,6].map(d => (
                  <TouchableOpacity key={d} style={[styles.btn, days===d && styles.active]} onPress={()=>setDays(d)}>
                    <Text style={[styles.btnText, days===d && styles.activeText]}>{d}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            
            <Text style={styles.label}>Training Goal</Text>
            <View style={styles.row}>
                {['Strength','Hypertrophy'].map(g => (
                  <TouchableOpacity key={g} style={[styles.btn, goal===g && styles.active]} onPress={()=>setGoal(g as 'Strength' | 'Hypertrophy')}>
                    <Text style={[styles.btnText, goal===g && styles.activeText]}>{g}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Equipment</Text>
            <View style={styles.row}>
                {['Full Gym', 'Dumbbell Only', 'Home Gym'].map(e => (
                  <TouchableOpacity key={e} style={[styles.btn, equipmentProfile===e && styles.active]} onPress={()=>setEquipmentProfile(e as EquipmentProfile)}>
                    <Text style={[styles.btnText, equipmentProfile===e && styles.activeText]}>{e}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.row}>
                {['Beginner','Intermediate','Advanced'].map(l => (
                  <TouchableOpacity key={l} style={[styles.btn, experience===l && styles.active]} onPress={()=>setExperience(l as ExperienceLevel)}>
                    <Text style={[styles.btnText, experience===l && styles.activeText]}>{l}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.descText}>{EXPERIENCE_DESC[experience]}</Text>

            <Text style={styles.label}>Mesocycle Phase</Text>
            <View style={styles.row}>
                {[1, 2, 3, 4, 5].map(w => (
                  <TouchableOpacity key={w} style={[styles.btn, mesocycleWeek===w && styles.active]} onPress={()=>setMesocycleWeek(w)}>
                    <Text style={[styles.btnText, mesocycleWeek===w && styles.activeText]}>W{w}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.descText}>
              {mesocycleWeek === 1 ? 'Week 1: Introduction (MEV - Minimum Effective Volume)' : 
               mesocycleWeek === 5 ? 'Week 5: Deload (MV - Maintenance Volume)' : 
               mesocycleWeek === 4 ? 'Week 4: Overreach (MAV - Maximum Adaptive Volume)' : 
               `Week ${mesocycleWeek}: Accumulation (Building towards MAV)`}
            </Text>

            <Text style={styles.label}>Leg Training Preference</Text>
            <View style={styles.row}>
                {['Normal','Minimum','None'].map(l => (
                  <TouchableOpacity key={l} style={[styles.btn, legPreference===l && styles.active]} onPress={()=>setLegPreference(l as 'Normal' | 'Minimum' | 'None')}>
                    <Text style={[styles.btnText, legPreference===l && styles.activeText]}>{l}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Focus Areas (Weak Points)</Text>
            <View style={[styles.row, {flexWrap:'wrap'}]}>
                {MUSCLES.map(m => (
                  <TouchableOpacity key={m} style={[styles.chip, weakPoints.includes(m) && styles.activeChip]} onPress={()=>toggleWeakPoint(m)}>
                    <Text style={[styles.chipText, weakPoints.includes(m) && styles.activeText]}>{m}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            {weakPoints.length > 0 && (
              <>
                <Text style={styles.label}>Volume Priority</Text>
                <View style={styles.row}>
                  <TouchableOpacity 
                    style={[styles.btn, maintenancePreference === 'Growth' && styles.active]} 
                    onPress={() => setMaintenancePreference('Growth')}
                  >
                    <Text style={[styles.btnText, maintenancePreference === 'Growth' && styles.activeText]}>High Volume</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.btn, maintenancePreference === 'Maintenance' && styles.active]} 
                    onPress={() => setMaintenancePreference('Maintenance')}
                  >
                    <Text style={[styles.btnText, maintenancePreference === 'Maintenance' && styles.activeText]}>Maintain Others</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.descText}>
                  {maintenancePreference === 'Growth' 
                    ? 'Longer sessions. Maximize growth everywhere.' 
                    : 'Shorter sessions. Maintain non-weak points.'}
                </Text>
              </>
            )}
            
            <TouchableOpacity style={styles.mainBtn} onPress={handleGenerate}>
              <Text style={styles.mainBtnText}>Generate My Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.genHeader}>
              <View>
                <Text style={styles.genTitle}>{generated.splitName}</Text>
                <Text style={styles.genSub}>Generated split based on your goals</Text>
              </View>
              <TouchableOpacity onPress={()=>setGenerated(null)}>
                <Ionicons name="close-circle" size={32} color={colors.muted}/>
              </TouchableOpacity>
            </View>
            
            {generated.routines.map((r, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{r.name}</Text>
                    <View style={styles.cardBadge}>
                        <Text style={styles.cardBadgeText}>{r.exercises.length} Exercises</Text>
                    </View>
                </View>
                {r.exercises.map((ex, j) => (
                  <View key={j} style={styles.exRow}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={colors.primary} />
                    <Text style={styles.exText}>{ex.name}</Text>
                    <Text style={styles.exMeta}>{String(ex.sets)}x{ex.reps}</Text>
                  </View>
                ))}
              </View>
            ))}

            <View style={styles.adviceBox}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={styles.adviceText}>{generated.scheduleAdvice}</Text>
            </View>
            
            <TouchableOpacity style={styles.mainBtn} onPress={handleSaveAndStart}>
              <Text style={styles.mainBtnText}>Save All & Go to Templates</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  content: { padding: 20, paddingBottom: 100 },
  aiNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#dbeafe' },
  aiNoticeText: { marginLeft: 10, fontSize: 13, color: colors.primary, fontWeight: '600', flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12, marginTop: 24, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 2, shadowOffset: {width: 0, height: 1} },
  btnText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  activeText: { color: '#fff' },
  descText: { fontSize: 13, color: colors.muted, marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '500' },
  mainBtn: { backgroundColor: colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 40, marginBottom: 40, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 4} },
  mainBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  genHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  genTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  genSub: { fontSize: 14, color: colors.muted, marginTop: 4 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  cardBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardBadgeText: { fontSize: 11, fontWeight: '700', color: colors.muted },
  exRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  exText: { flex: 1, marginLeft: 10, fontSize: 15, color: colors.text, fontWeight: '500' },
  exMeta: { fontSize: 13, color: colors.muted, fontWeight: '600', backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  adviceBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 10 },
  adviceText: { marginLeft: 12, fontSize: 13, color: colors.muted, flex: 1, lineHeight: 20 }
});