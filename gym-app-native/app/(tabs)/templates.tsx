import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { Template } from '../../types/workouts';
import { PromptModal } from '../../components/ui';

export default function Templates() {
  const router = useRouter();
  const { templates, workouts, deleteTemplate, togglePinTemplate, updateTemplate, refresh } = useWorkouts();
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [templateToMove, setTemplateToMove] = useState<Template | null>(null);

  // Force refresh when screen focuses
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // --- SEQUENTIAL ROTATION LOGIC ---
  const { folders, folderStates } = useMemo(() => {
    // 1. Group Templates
    const grouped: Record<string, Template[]> = {};
    const unorganized: Template[] = [];

    templates.forEach(t => {
      if (t.folder) {
        if (!grouped[t.folder]) grouped[t.folder] = [];
        grouped[t.folder].push(t);
      } else {
        unorganized.push(t);
      }
    });

    // 2. Determine Next Up per Folder
    const states = new Map<string, { nextId: string, lastDoneId: string | null, lastDoneTime: number }>();

    Object.keys(grouped).forEach(folder => {
      // Sort alphabetically to ensure deterministic order (A -> B -> C)
      const folderTemplates = grouped[folder].sort((a, b) => a.name.localeCompare(b.name));
      
      // Find the *single most recent* workout that matches ANY template in this folder
      let lastMatchTs = 0;
      let lastMatchTemplateIndex = -1;

      workouts.forEach(w => {
        const cleanTitle = w.title.replace(/\[Auto\] /gi, '').trim().toLowerCase();
        
        // check if this workout matches any template in the folder
        const matchIdx = folderTemplates.findIndex(t => {
            const cleanName = t.name.replace(/\[Auto\] /gi, '').trim().toLowerCase();
            return cleanName === cleanTitle;
        });

        if (matchIdx !== -1) {
            // Found a match. Is it newer than what we have?
            if (w.performedAt > lastMatchTs) {
                lastMatchTs = w.performedAt;
                lastMatchTemplateIndex = matchIdx;
            }
        }
      });

      // Calculate Next
      let nextId = folderTemplates[0].id; // Default to first
      let lastDoneId = null;

      if (lastMatchTemplateIndex !== -1) {
          lastDoneId = folderTemplates[lastMatchTemplateIndex].id;
          const nextIndex = (lastMatchTemplateIndex + 1) % folderTemplates.length;
          nextId = folderTemplates[nextIndex].id;
      }

      states.set(folder, { nextId, lastDoneId, lastDoneTime: lastMatchTs });
    });

    return { 
      folders: Object.keys(grouped).sort(), 
      grouped, 
      unorganized,
      folderStates: states
    };
  }, [workouts, templates]);

  const handleStart = (templateId: string) => {
    router.push({ pathname: '/log-workout', params: { templateId } });
  };

  const handleDeleteFolder = (folderName: string) => {
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete the entire "${folderName}" plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            const toDelete = templates.filter(t => t.folder === folderName);
            toDelete.forEach(t => deleteTemplate(t.id));
          }
        }
      ]
    );
  };

  const onFolderSubmit = (folderName: string) => {
    if (templateToMove) {
      updateTemplate(templateToMove.id, { ...templateToMove, folder: folderName.trim() || undefined });
    }
    setFolderModalVisible(false);
    setTemplateToMove(null);
  };

  const renderTemplateCard = (t: Template, state?: { nextId: string, lastDoneId: string | null, lastDoneTime: number }) => {
    const isNext = state ? t.id === state.nextId : false;
    const isLastDone = state ? t.id === state.lastDoneId : false;

    return (
      <TouchableOpacity 
        key={t.id} 
        onPress={() => handleStart(t.id)}
        style={[styles.card, isNext && styles.cardNext]}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
            <Text style={styles.cardTitle}>{t.name}</Text>
            {isNext && (
               <View style={styles.nextBadge}>
                 <Text style={styles.nextText}>Next Up</Text>
               </View>
            )}
            {isLastDone && (
               <View style={styles.doneBadge}>
                 <Ionicons name="checkmark" size={12} color="#fff"/>
                 <Text style={styles.doneText}>Just Done</Text>
               </View>
            )}
          </View>
          <Text style={styles.cardSub}>{t.exercises.length} Exercises</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => togglePinTemplate(t.id)} style={styles.iconBtn}>
            <Ionicons name={t.isPinned ? "pin" : "pin-outline"} size={20} color={t.isPinned ? colors.primary : colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push({ pathname: '/templates/edit', params: { templateId: t.id } })} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setTemplateToMove(t); setFolderModalVisible(true); }} style={styles.iconBtn}>
            <Ionicons name="folder-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStart(t.id)} style={[styles.btnStart, isNext && {backgroundColor: '#10b981'}]}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTemplate(t.id)} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Templates</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/templates/edit')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {folders.map(folder => {
          const state = folderStates.get(folder);
          // @ts-ignore
          const list = templates.filter(t => t.folder === folder).sort((a,b) => a.name.localeCompare(b.name));

          return (
            <View key={folder} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Ionicons name="folder-open" size={18} color="#fbbf24" />
                    <Text style={styles.sectionTitle}>{folder}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteFolder(folder)} style={{padding: 4}}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
              {list.map(t => renderTemplateCard(t, state))}
            </View>
          );
        })}

        {/* Unorganized */}
        {useMemo(() => templates.filter(t => !t.folder), [templates]).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginLeft: 0 }]}>Other Templates</Text>
            {templates.filter(t => !t.folder).map(t => renderTemplateCard(t))}
          </View>
        )}
      </ScrollView>

      <PromptModal 
        visible={folderModalVisible}
        title="Move to Folder"
        message="Enter folder name:"
        defaultValue={templateToMove?.folder}
        onCancel={() => { setFolderModalVisible(false); setTemplateToMove(null); }}
        onSubmit={onFolderSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  addBtn: { backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 8 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  cardNext: { borderColor: '#10b981', borderWidth: 1.5, backgroundColor: '#ecfdf5' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 4 },
  btnStart: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  nextBadge: { backgroundColor: '#10b981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  nextText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  doneBadge: { backgroundColor: colors.muted, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection:'row', alignItems:'center', gap:4 },
  doneText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 16, fontSize: 16 },
  emptyBtn: { marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#fff', fontWeight: 'bold' }
});
