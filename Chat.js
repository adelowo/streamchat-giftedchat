import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { StreamChat } from 'stream-chat';
import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import UUID from 'uuidjs';

export default class Chat extends Component {
  state = {
    messages: [],
    isLoaded: false,
  };

  constructor(props) {
    super(props);

    this.client = new StreamChat('9agc4x9dmrft');

    this.client.setUser(
      {
        id: this.props.user.id,
        name: this.props.user.username,
        image: 'https://i.imgur.com/fR9Jz14.png',
      },
      this.props.user.token
    );

    this.userID = UUID.genV4().toString();

    this.channel = this.client.channel('messaging', this.props.user.username, {
      name: 'React native Gifted Chat',
    });
  }

  componentDidMount() {
    this.channel.create().then(() => {
      this.setState({ isLoaded: true });
      console.log('Channel was successfully created');
    });

    this.channel.watch();

    this.channel.on('message.new', event => {
      if (event.user.id === this.props.user.id) {
        return;
      }

      const message = {
        _id: UUID.genV4().toString(),
        created: event.created_at,
        text: event.message.text,
        user: event.user,
      };

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });
  }

  send = messages => {
    if (!this.state.isLoaded) {
      Alert.alert('Chat not loaded');
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    messages.forEach(msg => {
      this.channel.sendMessage({
        text: msg.text,
      });
    });
  };

  render() {
    if (!this.state.isLoaded) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <GiftedChat
        messages={this.state.messages}
        user={{
          _id: this.props.user.id,
        }}
        onSend={message => this.send(message)}
      />
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
