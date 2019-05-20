import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    const messages = this.props.messages.map((message) =>
        <Message key={message.id} type={message.type} content={message.content} username={message.username} color={message.color} />
    );
    return(
      <main className="messages">
        {messages}
      </main>
    );
  }
}

export default MessageList;
