import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Login';
import Chat from './Chat';

export default class App extends Component {
  state = {
    user: undefined,
  };

  onLoginSuccess = user => {
    this.setState({ user });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.user ? (
          <Chat user={this.state.user} />
        ) : (
          <Login cb={this.onLoginSuccess} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
