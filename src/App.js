import React from 'react';
import './App.css';
import Cable from 'actioncable';

class App extends React.Component {
  state = {
    newMessage: "",
    messages: []
  }

  handleData = data => {
    switch (data.type) {
      case 'current_log':
        this.setState({
          messages: data.log
        })
        break;
      case 'new_log':
        this.setState(prevState => ({
          messages: [...prevState.messages, data.log]
        }))
        break;
      default:
        break;
    }
  }

  componentDidMount(){
    this.cable = Cable.createConsumer(`ws://localhost:3001/cable`);
    this.subscription = this.cable.subscriptions.create({
      channel: "LogMonitorChannel",
    }, {
      connected: () => {console.log('WS connected')},
      disconnected: () => {console.log('WS disconnected')},
      received: data => {
        console.log(data);
        this.handleData(data);
      }
    })
  }
  
  componentWillUnmount(){
    this.cable.subscriptions.remove(this.subscription);
  }

  changeHandler = event => {
    this.setState({
      newMessage: event.target.value
    })
  }

  renderMessages = () => (this.state.messages.map((message, index) => <p key={index}>{message}</p>));

  render() {
    return (
      <div className="App">
        
        <div>
          {this.renderMessages()}
        </div>
      </div>
      );
    }
}

export default App;