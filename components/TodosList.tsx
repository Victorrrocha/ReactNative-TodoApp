import {FlatList, StyleSheet} from 'react-native';
import Todo from './Todo';

export default function TodosList({
  todos,
  deleteTodoHandle,
  updateStateHandle,
}) {
  const styles = StyleSheet.create({
    list: {
      marginTop: 10,
      paddingTop: 20,
      borderTopColor: '#f2f2f2',
      borderTopWidth: 1,
    },
  });
  const renderItem = ({item}) => (
    <Todo
      key={item?.name}
      todo={item}
      deleteTodoHandle={deleteTodoHandle}
      updateStateHandle={updateStateHandle}
    />
  );
  return (
    <FlatList
      style={styles.list}
      data={todos}
      renderItem={renderItem}
      keyExtractor={todo => todo.name}
    />
  );
}
