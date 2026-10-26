import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AssetExample from './components/AssetExample';

const PALETTES = {
  cps: {
    name: 'Centro Paula Souza (CPS)',
    light: {
      background: '#F4F5F7',
      card: '#FFFFFF',
      text: '#1F2937',
      primary: '#B91C1C', // Vermelho CPS
      secondary: '#4B5563',
      border: '#E5E7EB',
      completed: '#9CA3AF',
    },
    dark: {
      background: '#111827',
      card: '#1F2937',
      text: '#F9FAFB',
      primary: '#EF4444',
      secondary: '#9CA3AF',
      border: '#374151',
      completed: '#6B7280',
    },
  },
  github: {
    name: 'GitHub',
    light: {
      background: '#F6F8FA',
      card: '#FFFFFF',
      text: '#24292F',
      primary: '#0969DA', // Azul GitHub
      secondary: '#57606A',
      border: '#D0D7DE',
      completed: '#8C959F',
    },
    dark: {
      background: '#0D1117',
      card: '#161B22',
      text: '#C9D1D9',
      primary: '#58A6FF',
      secondary: '#8B949E',
      border: '#30363D',
      completed: '#484F58',
    },
  },
  whatsapp: {
    name: 'WhatsApp',
    light: {
      background: '#E5DDD5',
      card: '#FFFFFF',
      text: '#111B21',
      primary: '#075E54', // Verde WhatsApp
      secondary: '#128C7E',
      border: '#D1D7DB',
      completed: '#8696A0',
    },
    dark: {
      background: '#0B141A',
      card: '#111B21',
      text: '#E9EDEF',
      primary: '#00A884',
      secondary: '#8696A0',
      border: '#222D34',
      completed: '#667781',
    },
  },
  nubank: {
    name: 'Nubank',
    light: {
      background: '#F4F0F8',
      card: '#FFFFFF',
      text: '#111111',
      primary: '#820AD1', // Roxo Nubank
      secondary: '#666666',
      border: '#E2D9EE',
      completed: '#A0A0A0',
    },
    dark: {
      background: '#12021C',
      card: '#1D082A',
      text: '#FFFFFF',
      primary: '#A020F0',
      secondary: '#B580E2',
      border: '#331349',
      completed: '#735292',
    },
  },
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPaletteKey, setSelectedPaletteKey] = useState('cps');

  const currentPalette = PALETTES[selectedPaletteKey];
  const colors = isDarkMode ? currentPalette.dark : currentPalette.light;

  useEffect(() => {
    loadPreferencesAndTasks();
  }, []);

  useEffect(() => {
    saveData('@todo_tasks', tasks);
  }, [tasks]);


  useEffect(() => {
    saveData('@todo_theme_mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    saveData('@todo_palette_key', selectedPaletteKey);
  }, [selectedPaletteKey]);

  const loadPreferencesAndTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@todo_tasks');
      const storedThemeMode = await AsyncStorage.getItem('@todo_theme_mode');
      const storedPalette = await AsyncStorage.getItem('@todo_palette_key');

      if (storedTasks !== null) setTasks(JSON.parse(storedTasks));
      if (storedThemeMode !== null) setIsDarkMode(JSON.parse(storedThemeMode));
      if (storedPalette !== null && PALETTES[storedPalette]) setSelectedPaletteKey(storedPalette);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  };

  const handleAddTask = () => {
    if (task.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const handleToggleTask = (id) => {
    const updated = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTasks(updated);
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter((item) => item.id !== id);
    setTasks(updated);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <AssetExample />

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.modeButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={[styles.modeButtonText, { color: colors.text }]}>
                {isDarkMode ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
              Escolha a Paleta:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.paletteList}
            >
              {Object.keys(PALETTES).map((key) => {
                const isSelected = selectedPaletteKey === key;
                const paletteObj = PALETTES[key];
                const themeColor = isDarkMode ? paletteObj.dark.primary : paletteObj.light.primary;

                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => setSelectedPaletteKey(key)}
                    style={[
                      styles.paletteChip,
                      {
                        backgroundColor: isSelected ? themeColor : colors.card,
                        borderColor: isSelected ? themeColor : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paletteChipText,
                        { color: isSelected ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      {paletteObj.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.title, { color: colors.primary }]}>
              Minha Lista de Tarefas
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Digite uma nova tarefa..."
                placeholderTextColor={colors.secondary}
                value={task}
                onChangeText={setTask}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddTask}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.checkbox,
                {
                  borderColor: item.completed ? colors.primary : colors.border,
                  backgroundColor: item.completed ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => handleToggleTask(item.id)}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.taskTextContainer}
              onPress={() => handleToggleTask(item.id)}
            >
              <Text
                style={[
                  styles.taskText,
                  { color: item.completed ? colors.completed : colors.text },
                  item.completed && styles.completedTaskText,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  headerContainer: {
    paddingTop: 10,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 6,
  },
  paletteList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  paletteChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  paletteChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginLeft: 8,
    borderRadius: 8,
    height: 48,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskCard: {
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: 'bold',
  },
});