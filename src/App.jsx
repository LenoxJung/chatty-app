import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      messages: []
    }
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onopen = (event) => {
      console.log("Connected to server");
    }

    this.socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      switch(data.type) {
        case "incomingMessage":
          const message = {
            type: data.type,
            content: data.content,
            id: data.id,
            username: data.username,
            color: data.color
          }
          this.setState({messages: this.state.messages.concat(message)});
          break;
        case "incomingNotification":
          const notification = {
            type: data.type,
            content: data.content,
            id: data.id
          }
          this.setState({messages: this.state.messages.concat(notification)});
          break;
        case "userCountChanged":
          this.setState({userCount: data.userCount});
          break;
        case "connect":
          this.setState({currentUser: {name: "Anonymous", color: data.color}});
          break;
        default:
          throw new Error("Unknown event type " + data.type);
      }
    }
  }

  addMessage = (e) => {
    if (e.key === 'Enter') {
      if (!e.target.value) return;
      const msg = {
        type: "postMessage",
        username: this.state.currentUser.name,
        content: e.target.value,
        color: this.state.currentUser.color
      }
      this.socket.send(JSON.stringify(msg));
      e.target.value = "";
    }
  }

  changeUser = (e) => {
    if (e.key === 'Enter') {
      if (!e.target.value || e.target.value == this.state.currentUser.name) return;
      const msg = {
        type: "postNotification",
        content: `${this.state.currentUser.name} has changed their name to ${e.target.value}`
      }
      this.socket.send(JSON.stringify(msg));
      this.setState({currentUser: {name: e.target.value, color: this.state.currentUser.color}});
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p>{this.state.userCount} users online</p>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar user={this.state.currentUser} addMessage={this.addMessage} changeUser={this.changeUser} />
      </div>
    );
  }
}
export default App;
