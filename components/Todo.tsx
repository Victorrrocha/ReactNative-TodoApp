import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const states = ['todo', 'doing', 'completed'];

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    color: '#000',
    fontSize: 15,
    borderRightWidth: 1,
    flex: 1,
    borderRightColor: '#c3c3c3',
  },
  button: {
    backgroundColor: 'transparent',
    height: 40,
    width: 120,
  },
  text: {
    textDecorationLine: 'underline',
  },
  todoMenu: {
    flexDirection: 'row',
  },
  deleteBin: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 0,
  },
});

export default function Todo({todo, deleteTodoHandle, updateStateHandle}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo?.name}</Text>
      <View style={styles.todoMenu}>
        <SelectDropdown
          data={states}
          defaultValue={todo?.state}
          buttonStyle={styles.button}
          buttonTextStyle={styles.text}
          onSelect={selectedItem => {
            updateStateHandle(todo.name, selectedItem);
          }}
          buttonTextAfterSelection={selectedItem => selectedItem}
          rowTextForSelection={item => item}
        />
        <Icon.Button
          backgroundColor="#e00741"
          style={styles.deleteBin}
          name="delete-outline"
          onPress={() => deleteTodoHandle(todo.name)}
        />
      </View>
    </View>
  );
}
