import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PRIMARY_COLOR = '#2563EB';
const SECONDARY_COLOR = '#F3F4F6';
const SERVER_URL = 'http://10.0.2.2:3000'; // Emülatör/LAN için ayarlayın

type Task = {
  id: string;
  taskTitle: string; // titleField
  subtitleField: string; // dueDate (formatted)
  isCompleted: boolean;
};

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'list_tasks'>;

// Header Component
const Header = ({ title, color }: { title: string, color: string }) => (
  <View style={[styles.headerContainer, { backgroundColor: color }]}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

// List Item Component (icon: checkbox, titleField, subtitleField)
const TaskItem = ({ task, onPress }: { task: Task, onPress: () => void }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Ionicons 
        name={task.isCompleted ? "checkmark-circle" : "radio-button-off"} 
        size={24} 
        color={task.isCompleted ? PRIMARY_COLOR : "#6B7280"} 
        style={{ marginRight: 10 }}
    />
    <View style={styles.itemContent}>
      <Text style={[styles.itemTitle, task.isCompleted && styles.completedText]}>{task.taskTitle}</Text>
      <Text style={styles.itemSubtitle}>Son Tarih: {task.subtitleField}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

// Floating Button Component
const FloatingButton = ({ icon, color, onPress }: { icon: keyof typeof Ionicons.glyphMap, color: string, onPress: () => void }) => (
  <TouchableOpacity style={[styles.floatingButton, { backgroundColor: color }]} onPress={onPress}>
    <Ionicons name={icon} size={30} color="#FFFFFF" />
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ListScreenNavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${SERVER_URL}/tasks`);
      // Tasarımda 7 öğe istenmiş olsa da, API'den geleni kullanırız.
      setTasks(response.data);
    } catch (error) {
      console.error("API Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ekran her odaklandığında listeyi yenile
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleNavigateDetail = (taskId: string) => {
    // onPressAction: navigate_task_detail
    navigation.navigate('task_detail', { taskId });
  };

  const handleNavigateAdd = () => {
    // onPressAction: navigate_add_task
    navigation.navigate('add_task');
  };

  return (
    <View style={styles.container}>
      {/* Component: Header */}
      <Header title="Yapılacaklar" color={PRIMARY_COLOR} />

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 20 }} />
        ) : tasks.length === 0 ? (
            <Text style={styles.emptyText}>Henüz bir görev eklenmemiş.</Text>
        ) : (
          /* Component: List */
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem 
                task={item} 
                onPress={() => handleNavigateDetail(item.id)} 
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
      
      {/* Component: Floating Button */}
      <FloatingButton 
        icon="add" 
        color={PRIMARY_COLOR} 
        onPress={handleNavigateAdd} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 2,
    backgroundColor: PRIMARY_COLOR,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: SECONDARY_COLOR,
    marginHorizontal: 20,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    elevation: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6B7280',
  }
});

export default HomeScreen;