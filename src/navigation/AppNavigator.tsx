import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

export type RootStackParamList = {
  list_tasks: undefined;
  add_task: undefined;
  task_detail: { taskId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="list_tasks" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="list_tasks" component={HomeScreen} />
        <Stack.Screen name="add_task" component={AddTaskScreen} />
        <Stack.Screen name="task_detail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;