import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Form from './Form';

class App extends React.Component {
  state = {
    input: '',
    count: 0,
    morse: '',
  };

  componentDidMount() {
    axios.get('http://localhost:8000/api/metrics')
      .then(res => {
        this.setState({ count: res.data.count });
      })
      .catch(err => console.error(err));
  }

  onSubmit = input => {
    axios.post('http://localhost:8000/api/convert', { input })
      .then(res => {
        this.setState({
          input: res.data.input,
          morse: res.data.morse,
        });
      })
      .catch(err => console.error(err));
    axios.get('http://localhost:8000/api/metrics')
      .then(res => {
        this.setState({ count: res.data.count });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="App">
        <br/>
        <Form onSubmit={input => this.onSubmit(input)} />
        <br/>
        <div className="outputBox">{this.state.morse}</div>
        <p>total messages count: {this.state.count}</p>
      </div>
    );
  }
}

export default App;
