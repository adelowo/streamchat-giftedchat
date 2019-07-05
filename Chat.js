import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { StreamChat } from 'stream-chat';
import UUID from 'uuidjs';
import Faker from 'faker';

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
    this.channel
      .create()
      .then(() => console.log('Channel was successfully created'));
  }

  send = messages => {
    const otherMessage = {
      _id: UUID.genV4().toString(),
      created_at: new Date(),
      text: Faker.lorem.sentence(),
      user: {
        _id: this.userID,
        avatar: 'https://placeimg.com/140/140/any',
      },
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    messages.forEach(msg => {
      this.channel.sendMessage({
        text: msg.text,
      });
    });

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, otherMessage),
    }));

    this.channel.sendMessage({
      text: otherMessage.text,
    });
  };

  render() {
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
