import { useColorScheme } from '@/hooks/useColorScheme';
import { useTodoActions } from '@/hooks/useTodos';
import { SubTask } from '@/src/db/schema';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';

interface SubTaskActionSheetPayload {
  subTask: SubTask;
}

const SubTaskActionSheet = ({ sheetId, payload }: SheetProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const { editSubTask, deleteSubTask, toggleSubTask } = useTodoActions();
  
  const subTask = payload && typeof payload === 'object' && 'subTask' in payload ? (payload as SubTaskActionSheetPayload).subTask : null;
  const [editText, setEditText] = useState(subTask?.text || '');
  
  if (!subTask) return null;

  const handleEdit = () => {
    if (editText.trim()) {
      editSubTask(subTask.id, editText.trim());
      setIsEditing(false);
      SheetManager.hide(sheetId!);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subtask',
      'Are you sure you want to delete this subtask?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSubTask(subTask.id);
            SheetManager.hide(sheetId!);
          },
        },
      ]
    );
  };

  const handleToggleComplete = () => {
    toggleSubTask(subTask.id, !subTask.completed);
    SheetManager.hide(sheetId!);
  };

  const actions = [
    {
      icon: 'create-outline',
      title: 'Edit Subtask',
      action: () => setIsEditing(true),
      color: isDark ? '#4d9be6' : '#3498db',
    },
    {
      icon: subTask.completed ? 'checkbox-outline' : 'square-outline',
      title: subTask.completed ? 'Mark as Incomplete' : 'Mark as Complete',
      action: handleToggleComplete,
      color: subTask.completed ? '#e67e22' : '#27ae60',
    },
    {
      icon: 'trash-outline',
      title: 'Delete Subtask',
      action: handleDelete,
      color: '#e74c3c',
    },
  ];

  return (
    <ActionSheet id={sheetId} containerStyle={isDark ? styles.containerDark : styles.container}>
      <View style={styles.header}>
        <View style={styles.dragIndicator} />
        <Text style={isDark ? styles.titleDark : styles.title}>Subtask Options</Text>
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={isDark ? [styles.editInput, styles.editInputDark] : styles.editInput}
            value={editText}
            onChangeText={setEditText}
            placeholder="Edit subtask text..."
            placeholderTextColor={isDark ? '#718096' : '#999'}
            multiline
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setEditText(subTask.text);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.saveButton]}
              onPress={handleEdit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <View style={isDark ? [styles.subTaskPreview, styles.subTaskPreviewDark] : styles.subTaskPreview}>
            <Ionicons 
              name={subTask.completed ? 'checkbox-outline' : 'square-outline'} 
              size={18} 
              color={subTask.completed ? '#27ae60' : isDark ? '#ccc' : '#666'} 
            />
            <Text style={[
              isDark ? styles.subTaskTextDark : styles.subTaskText,
              subTask.completed && styles.completedText
            ]}>
              {subTask.text}
            </Text>
          </View>

          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={isDark ? [styles.actionItem, styles.actionItemDark] : styles.actionItem}
              onPress={action.action}
            >
              <Ionicons name={action.icon as any} size={22} color={action.color} />
              <Text style={isDark ? styles.actionTextDark : styles.actionText}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerDark: {
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  titleDark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  subTaskPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  subTaskPreviewDark: {
    backgroundColor: '#34495e',
  },
  subTaskText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  subTaskTextDark: {
    marginLeft: 10,
    fontSize: 14,
    color: '#bdc3c7',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionItemDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  actionTextDark: {
    marginLeft: 15,
    fontSize: 16,
    color: '#ecf0f1',
  },
  editContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2c3e50',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editInputDark: {
    borderColor: '#4a5568',
    backgroundColor: '#34495e',
    color: '#ecf0f1',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SubTaskActionSheet; 