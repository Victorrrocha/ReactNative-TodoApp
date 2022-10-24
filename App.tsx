import {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import TodosList from './components/TodosList';
import ITodo from './Interfaces/ITodo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

let todoArray: ITodo[] = [];

let filteredTodos: ITodo[] = [];

let defaultTodo: ITodo = {
  name: '',
  state: 'todo',
};

export default function App() {
  useEffect(() => {
    async function getAllKeys() {
      try {
        await AsyncStorage.getAllKeys().then(keys => {
          if (keys !== null) {
            console.log(keys);
            getData(keys);
          }
        });
      } catch (error) {
        //
      }
    }
    getAllKeys();
  }, []);

  const [todos, setTodos] = useState([...todoArray]);
  const [newTodo, setNewTodo] = useState({name: '', state: 'todo'});
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const getData = async keys => {
    const promises: Promise<any>[] = [];
    try {
      keys.forEach(async key => {
        promises.push(AsyncStorage.getItem(key));
      });
      Promise.all(promises).then(responseArray => {
        responseArray.forEach(response => {
          if (response !== null) {
            todoArray.push(JSON.parse(response));
          }
        });
        setTodos([...todoArray]);
      });
    } catch (error) {}
  };
  const updateStateHandle = (name: string, state: string) => {
    setTodos(prev => {
      return prev.map(todo => {
        if (todo.name === name) {
          todo.state = state;
          updateStorage(todo);
        }
        return todo;
      });
    });
  };

  const updateStorage = async (todo: ITodo) => {
    await AsyncStorage.setItem(todo.name, JSON.stringify(todo));
  };

  const textChangeHandle = (text: string) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => searchForTodo(text), 100);
    setNewTodo(prev => {
      return {...prev, name: text};
    });
  };

  const searchForTodo = (text: string) => {
    filteredTodos = todos.filter(todo => {
      return todo.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());
    });
  };

  const newTodoHandle = async () => {
    try {
      const jsonValue = JSON.stringify(newTodo);
      await AsyncStorage.setItem(newTodo.name, jsonValue);
    } catch (error) {}
    setTodos(prev => [...prev, newTodo]);
    setNewTodo(defaultTodo);
  };

  const deleteTodoHandle = async (name: string) => {
    await AsyncStorage.removeItem(name);
    setTodos(prev => {
      return prev.filter(todo => todo.name !== name);
    });
  };

  const styles = StyleSheet.create({
    appContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    appTitle: {
      color: '#000',
      fontSize: 30,
      textAlign: 'center',
    },
    inputView: {
      marginBottom: 20,
    },
    textInput: {
      borderBottomColor: '#c4c4c4',
      borderBottomWidth: 1,
    },
    actionsMenu: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionsMenuButton: {
      flex: 1,
      marginRight: 5,
    },
    todoArea: {
      marginVertical: 20,
      marginBottom: 70,
    },
    eraseIcon: {
      paddingRight: 0,
      backgroundColor: '#00ABE7 ',
    },
  });

  return (
    <SafeAreaView style={styles.appContainer}>
      <View>
        <Text style={styles.appTitle}>ToDo</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          value={newTodo.name}
          onChangeText={textChangeHandle}
          placeholder="Insert new or search for todo"
          maxLength={50}
        />
      </View>
      <View style={styles.actionsMenu}>
        <View style={styles.actionsMenuButton}>
          <Button
            onPress={newTodoHandle}
            title="ADD"
            color="#6BD425"
            accessibilityLabel="ADD"
            disabled={!(newTodo.name.trim().length > 0)}
          />
        </View>
        <Icon.Button
          style={styles.eraseIcon}
          name="eraser"
          onPress={() => setNewTodo(defaultTodo)}
        />
      </View>
      <SafeAreaView style={styles.todoArea}>
        <TodosList
          todos={newTodo.name.trim().length > 0 ? filteredTodos : todos}
          deleteTodoHandle={deleteTodoHandle}
          updateStateHandle={updateStateHandle}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}
