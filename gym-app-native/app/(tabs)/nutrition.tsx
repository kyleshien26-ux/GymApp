import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';
import { calculateNutrition } from '../../lib/nutrition';
import { SectionHeader, Card } from '../../components/ui';

const { width } = Dimensions.get('window');

const MacroBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 }}>{label}</Text>
    <View style={{ height: 100, width: 12, backgroundColor: '#f1f5f9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' }}>
        <View style={{ height: `${Math.min((value/max)*100, 100)}%`, width: '100%', backgroundColor: color }} />
    </View>
    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 8 }}>{value}g</Text>
  </View>
);

export default function Nutrition() {
  const router = useRouter();
  const { settings } = useSettings();
  const plan = useMemo(() => calculateNutrition(settings.userProfile), [settings.userProfile]);

  const weightData = useMemo(() => {
    return settings.measurements
        .filter(m => m.type === 'Weight')
        .sort((a, b) => a.date - b.date)
        .slice(-7); 
  }, [settings.measurements]);

  // Check if profile is initialized
  if (settings.userProfile.age === 0 || settings.userProfile.height === 0 || settings.userProfile.currentWeight === 0) {
    return (
        <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center', padding: 20}]}>
            <View style={{alignItems: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10}}>
                <Ionicons name="body-outline" size={60} color={colors.primary} />
                <Text style={{fontSize: 22, fontWeight: '800', marginTop: 20, color: colors.text, textAlign: 'center'}}>Complete Your Profile</Text>
                <Text style={{textAlign: 'center', color: colors.muted, marginTop: 10, marginBottom: 30, lineHeight: 22}}>
                    To get accurate nutrition targets and TDEE calculations, we need your age, height, and weight.
                </Text>
                <TouchableOpacity 
                    style={{backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center'}}
                    onPress={() => router.push('/settings/profile')}
                >
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Setup Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <TouchableOpacity onPress={() => router.push('/settings/profile')}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.calorieCard}>
            <View>
                <Text style={styles.calorieLabel}>Daily Target</Text>
                <Text style={styles.calorieValue}>{plan.targetCalories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.goalBadge}>{settings.userProfile.nutritionGoal.toUpperCase()}</Text>
                <Text style={styles.tdeeText}>TDEE: {plan.tdee}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <SectionHeader title="Macro Targets" />
            <Card>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                    <MacroBar label="Protein" value={plan.macros.protein} max={250} color={colors.primary} />
                    <MacroBar label="Carbs" value={plan.macros.carbs} max={400} color="#fbbf24" />
                    <MacroBar label="Fats" value={plan.macros.fats} max={100} color="#ef4444" />
                </View>
                <Text style={styles.macroNote}>Based on {settings.userProfile.currentWeight}kg BW and {settings.userProfile.activityLevel} activity.</Text>
            </Card>
        </View>

        <View style={styles.section}>
            <SectionHeader title="Weight Trend" actionLabel="Log" onActionPress={() => router.push('/measurements')} />
            <Card>
                {weightData.length > 1 ? (
                    <View style={styles.chartContainer}>
                        {weightData.map((m, i) => {
                            const minW = Math.min(...weightData.map(d => d.value)) - 1;
                            const maxW = Math.max(...weightData.map(d => d.value)) + 1;
                            const range = maxW - minW;
                            const h = ((m.value - minW) / range) * 80;
                            return (
                                <View key={m.id} style={{ alignItems: 'center', flex: 1 }}>
                                    <View style={[styles.chartPoint, { marginBottom: h + 10 }]} />
                                    <Text style={{ fontSize: 10, color: colors.muted }}>{new Date(m.date).getDate()}</Text>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <Text style={styles.emptyText}>Log at least 2 weight measurements to see a trend.</Text>
                )}
                {weightData.length > 0 && (
                    <Text style={styles.currentWeight}>Current: {weightData[weightData.length-1].value} kg</Text>
                )}
            </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  content: { padding: 20 },
  calorieCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary, padding: 24, borderRadius: 20, marginBottom: 24, shadowColor: colors.primary, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  calorieLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  calorieValue: { color: '#fff', fontSize: 48, fontWeight: '800', lineHeight: 56 },
  calorieUnit: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  goalBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden', color: '#fff', fontWeight: '800', fontSize: 12, marginBottom: 6 },
  tdeeText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  section: { marginBottom: 24 },
  macroNote: { textAlign: 'center', marginTop: 20, fontSize: 12, color: colors.muted },
  chartContainer: { flexDirection: 'row', height: 120, alignItems: 'flex-end', paddingHorizontal: 10 },
  chartPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  emptyText: { textAlign: 'center', color: colors.muted, padding: 20 },
  currentWeight: { textAlign: 'center', marginTop: 10, fontWeight: '700', fontSize: 16, color: colors.text }
});