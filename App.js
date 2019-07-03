import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Login';
import Chat from './Chat';

export default function App() {
  state = {
    user: undefined,
  };

  onLoginSuccess = user => {
    this.setState({ user });
  };

  return (
    <View style={styles.container}>
      {this.state.user ? <Chat /> : <Login cb={this.onLoginSuccess} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
