import React, {Component} from 'react';

class Message extends Component {

  componentDidMount() {
    if (window.innerHeight + window.scrollY + this.refs.message.offsetHeight >= document.documentElement.offsetHeight) this.refs.message.scrollIntoView();
  }

  render() {
    let messages = this.props.content.split(/(https?:[/|.|\w|\s|-|:]*\.(?:jpg|gif|png))/gi);
    messages = messages.filter(message => !message == "");
    const content = messages.map((message, index) => {
      return (
        <div key={index}>{/(https?:[/|.|\w|\s|-|:]*\.(?:jpg|gif|png))/gi.test(message) ? (<img src={message} />) : (message)}<br/></div>
      )
    });
    return this.props.type == "incomingMessage"? (
      <div ref="message" className="message">
        <span className="message-username" style={{color: this.props.color}}>{this.props.username}</span>
        <span className="message-content">{content}</span>
      </div>
    ) : (
      <div ref="message" className="message system">
        {this.props.content}
      </div>
    )
  }
}

export default Message;
