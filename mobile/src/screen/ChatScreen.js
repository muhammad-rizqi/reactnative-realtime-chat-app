import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../styles/styles';
import ChatItem from '../components/ChatItem';
import io from 'socket.io-client';
import {Component} from 'react';

class ChatScreen extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      message: '',
      chatMessages: [],
    };
  }
  componentDidMount() {
    const username = this.props.route.params.username;
    this.socket = io('http://192.168.43.131:3000');
    this.socket.on('chat messages', (msg) =>
      this.setState({chatMessages: [...this.state.chatMessages, msg]}),
    );
    this.socket.emit('change_username', username);
  }

  sendMessage() {
    this.setState({message: ''});
    this.socket.emit('chat messages', {message: this.state.message});
  }

  render() {
    console.log(this.state.chatMessages);
    return (
      <View style={styles.container}>
        <View style={styles.appBar}>
          <Image
            source={require('../assets/icons/go-back-left-arrow.png')}
            style={styles.icon}
          />
          <TouchableOpacity style={styles.appBarText}>
            <Text style={styles.appBarTitle}>Hello</Text>
            <Text style={styles.appBarDesc}>Online</Text>
          </TouchableOpacity>
        </View>
        <StatusBar backgroundColor="#212227" />
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
          onContentSizeChange={() =>
            this.scrollView.scrollToEnd({animated: false})
          }
          style={[styles.pageContainer, {flex: 1}]}>
          {this.state.chatMessages.map((msg, index) => (
            <ChatItem
              key={index}
              outgoing={msg.username === this.props.route.params.username}
              message={msg.message}
              time="12.00"
            />
          ))}
        </ScrollView>
        <View style={styles.composeMessage}>
          <TextInput
            placeholderTextColor="#4b4d5a"
            placeholder="Type a message ..."
            value={this.state.message}
            style={styles.input}
            onChangeText={(messageText) =>
              this.setState({message: messageText})
            }
            multiline={true}
          />
          <TouchableOpacity onPress={() => this.sendMessage()}>
            <Image
              source={require('../assets/icons/send-button.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default ChatScreen;
