import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { SectionHeader, Card } from '../../components/ui';
import { useWorkouts } from '../../providers/WorkoutsProvider';

const { width } = Dimensions.get('window');

const MuscleBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <View style={{ marginBottom: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted }}>{value}%</Text>
    </View>
    <View style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ width: `${Math.min(value, 100)}%`, height: '100%', backgroundColor: color }} />
    </View>
  </View>
);

export default function Progress() {
  const { workouts } = useWorkouts();

  const analytics = useMemo(() => {
    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
    
    const volumeMap = new Map<string, number>();
    muscleGroups.forEach(m => volumeMap.set(m, 0));

    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.muscleGroup) {
             volumeMap.set(ex.muscleGroup, (volumeMap.get(ex.muscleGroup) || 0) + (typeof ex.sets === 'number' ? ex.sets : ex.sets.length));
        }
      });
    });

    const totalSets = Array.from(volumeMap.values()).reduce((a, b) => a + b, 0);

    const distribution = muscleGroups.map(m => ({
      label: m,
      value: totalSets > 0 ? Math.round(((volumeMap.get(m) || 0) / totalSets) * 100) : 0,
      color: colors.primary
    }));

    const totalVolume = workouts.reduce((acc, w) => acc + w.totalVolume, 0);
    const avgVolume = workouts.length > 0 ? totalVolume / workouts.length : 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthlyWorkouts = workouts.filter(w => w.performedAt >= startOfMonth);
    const monthlyVolumeGain = monthlyWorkouts.reduce((acc, w) => acc + w.totalVolume, 0);

    const exerciseStats = new Map<string, { start: number, current: number, count: number }>();
    workouts.sort((a,b) => a.performedAt - b.performedAt).forEach(w => {
        w.exercises.forEach(ex => {
            const maxWeight = Array.isArray(ex.sets) ? Math.max(...ex.sets.map(s => s.weight || 0)) : 0;
            if (maxWeight > 0) {
                if (!exerciseStats.has(ex.name)) {
                    exerciseStats.set(ex.name, { start: maxWeight, current: maxWeight, count: 1 });
                } else {
                    const stat = exerciseStats.get(ex.name)!;
                    stat.current = Math.max(stat.current, maxWeight);
                    stat.count++;
                }
            }
        });
    });

    const topLifts = Array.from(exerciseStats.entries())
        .filter(([_, stat]) => stat.count >= 3)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([name, stat]) => ({
            name,
            start: stat.start,
            current: stat.current,
            gain: stat.current - stat.start
        }));

    // Weekly Volume (Last 6 Weeks)
    const weeklyVolumes = [];
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    let maxWeeklyVol = 1; // Avoid divide by zero
    for (let i = 5; i >= 0; i--) {
        const start = now.getTime() - ((i + 1) * oneWeek); // Start of week
        const end = now.getTime() - (i * oneWeek); // End of week
        const vol = workouts.filter(w => w.performedAt >= start && w.performedAt < end)
                            .reduce((acc, w) => acc + w.totalVolume, 0);
        if (vol > maxWeeklyVol) maxWeeklyVol = vol;
        weeklyVolumes.push(vol);
    }

    // Consistency (Last 28 Days)
    const consistency = [];
    for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d).setHours(0,0,0,0);
        const dayEnd = new Date(d).setHours(23,59,59,999);
        const hasWorkout = workouts.some(w => w.performedAt >= dayStart && w.performedAt <= dayEnd);
        consistency.push(hasWorkout);
    }
    
    return { 
        distribution, 
        avgVolume, 
        totalWorkouts: workouts.length, 
        monthlyVolumeGain, 
        monthlyWorkouts: monthlyWorkouts.length, 
        topLifts,
        weeklyVolumes,
        maxWeeklyVol,
        consistency
    };
  }, [workouts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Analysis</Text>
        <Text style={styles.subtitle}>Insight into your training data</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionHeader title="Monthly Progress" />
          <Card>
            <View style={styles.statsRow}>
                <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>Volume Added</Text>
                    <Text style={[styles.miniStatValue, {color: colors.success}]}>+{analytics.monthlyVolumeGain > 0 ? (analytics.monthlyVolumeGain/1000).toFixed(1) : 0}k</Text>
                    <Text style={styles.miniStatSub}>this month</Text>
                </View>
                <View style={[styles.miniStat, {borderLeftWidth: 1, borderColor: '#f1f5f9'}]}>
                    <Text style={styles.miniStatLabel}>Workouts</Text>
                    <Text style={styles.miniStatValue}>{analytics.monthlyWorkouts}</Text>
                    <Text style={styles.miniStatSub}>completed</Text>
                </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Lift Progress" />
          <Card>
            {analytics.topLifts.length === 0 ? (
              <Text style={styles.cardInfo}>Log at least 3 sessions of an exercise to track progress.</Text>
            ) : (
              analytics.topLifts.map((lift, i) => (
                <View key={i} style={{marginBottom: 16}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                    <Text style={{fontWeight:'700', color: colors.text, fontSize: 15}}>{lift.name}</Text>
                    <Text style={{fontWeight:'700', color: colors.success}}>+{lift.gain}kg</Text>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 6}}>
                    <Text style={{fontSize:12, color:colors.muted}}>Start: {lift.start}kg</Text>
                    <Text style={{fontSize:12, color:colors.muted}}>Now: {lift.current}kg</Text>
                  </View>
                  <View style={{height:6, backgroundColor:'#f1f5f9', borderRadius:3}}>
                    <View style={{width: `${Math.min((lift.current / (lift.start * 1.5)) * 100, 100)}%`, height:'100%', backgroundColor: colors.primary, borderRadius:3}} />
                  </View>
                </View>
              ))
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Muscle Volume Distribution" />
          <Card>
            {analytics.distribution.every(d => d.value === 0) ? (
                 <Text style={styles.cardInfo}>No data available yet.</Text>
            ) : (
                <View style={{ marginTop: 10 }}>
                {analytics.distribution.map(d => (
                    d.value > 0 && <MuscleBar key={d.label} {...d} />
                ))}
                </View>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Volume Progression" />
          <Card>
            {analytics.totalWorkouts === 0 ? (
                <Text style={styles.cardInfo}>Start training to see your volume trend.</Text>
            ) : (
                <>
                <View style={styles.chartPlaceholder}>
                    <View style={styles.chartBarContainer}>
                        {analytics.weeklyVolumes.map((vol, i) => (
                            <View key={i} style={[styles.chartBar, {height: (vol / analytics.maxWeeklyVol) * 120 + 5, backgroundColor: i === 5 ? colors.primary : '#cbd5e1'}]} />
                        ))}
                    </View>
                    <View style={styles.chartLabels}>
                        {['6w', '5w', '4w', '3w', '2w', 'Now'].map(l => (
                            <Text key={l} style={styles.chartLabelText}>{l}</Text>
                        ))}
                    </View>
                </View>
                <View style={styles.insightBox}>
                    <Ionicons name="bar-chart" size={16} color={colors.primary} />
                    <Text style={styles.insightText}>Last 6 weeks of total volume.</Text>
                </View>
                </>
            )}
          </Card>
        </View>

        <View style={styles.section}>
            <SectionHeader title="Training Consistency" />
            <Card>
                <View style={styles.consistencyGrid}>
                    {analytics.consistency.map((active, i) => (
                        <View key={i} style={[styles.gridSquare, active && {backgroundColor: colors.primary}]} />
                    ))}
                </View>
                <Text style={styles.gridLegend}>Last 28 days of activity</Text>
            </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f1f5f9' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 30 },
  statsRow: { flexDirection: 'row', padding: 10 },
  miniStat: { flex: 1, alignItems: 'center' },
  miniStatLabel: { fontSize: 11, color: colors.muted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  miniStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  miniStatSub: { fontSize: 11, color: colors.muted },
  cardInfo: { fontSize: 14, color: colors.muted },
  chartPlaceholder: { height: 180, justifyContent: 'flex-end', paddingTop: 20 },
  chartBarContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingHorizontal: 10 },
  chartBar: { width: (width - 100) / 6, borderRadius: 4 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 10 },
  chartLabelText: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  insightBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, marginTop: 20 },
  insightText: { marginLeft: 10, fontSize: 13, color: '#166534', fontWeight: '500' },
  consistencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', paddingVertical: 10 },
  gridSquare: { width: (width - 120) / 7, height: (width - 120) / 7, backgroundColor: '#f1f5f9', borderRadius: 4 },
  gridLegend: { textAlign: 'center', fontSize: 12, color: colors.muted, marginTop: 16, fontWeight: '600' }
});