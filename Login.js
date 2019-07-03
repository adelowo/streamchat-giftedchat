import React, { Component } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
} from 'react-native';

export default class Login extends Component {
  state = {
    username: '',
  };

  onLogin = () => {
    axios
      .post('http://localhost:5200/login', {
        username: this.state.username,
      })
      .then(res => {
        if (res.data.status) {
          this.props.cb({
            username: this.state.username,
            token: res.data.token,
          });
          return;
        }

        Alert.alert('Authentication', 'Could not authenticate you. Try again');
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Authentication', 'Could not authenticate you. Try again');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Username"
            keyboardType="default"
            underlineColorAndroid="transparent"
            onChangeText={username => this.setState({ username })}
          />
        </View>

        <TouchableHighlight
          style={styles.button}
          onPress={() => this.onLogin()}
        >
          <Text style={{ color: 'white' }}>Start chatting</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: '#00b5ec',
  },
});
