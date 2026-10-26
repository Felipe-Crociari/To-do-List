import { Text, View, StyleSheet, Image } from 'react-native';
export default function AssetExample({ textColor = '#000000' }) {
return (
<View style={styles.container}>
<Text style={[styles.paragraph, { color: textColor }]}>
App de Lista de Tarefas (Expo + Async Storage)
</Text>
</View>
);
}
const styles = StyleSheet.create({
container: {
alignItems: 'center',
justifyContent: 'center',
padding: 8,
},
paragraph: {
margin: 4,
fontSize: 14,
fontWeight: 'bold',
textAlign: 'center',
},
logo: {
height: 50,
width: 50,
},
});