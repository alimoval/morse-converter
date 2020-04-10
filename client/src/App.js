import React from 'react';
import axios from 'axios';
import './App.css';
import Form from './Form';

class App extends React.Component {
  state = {
    input: '',
    morse: '',
    totalCount: 0,
    thisWeekCount: 0,
    todayCount: 0,
  };

  componentDidMount() {
    axios.get('http://localhost:8000/api/metrics')
      .then(res => {
        this.setState({
          totalCount: res.data.totalCount,
          todayCount: res.data.todayCount,
          thisWeekCount: res.data.thisWeekCount,
        });
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
      .then(() => {
        return axios.get('http://localhost:8000/api/metrics')
      })
      .then(res => {
        this.setState({
          totalCount: res.data.totalCount,
          todayCount: res.data.todayCount,
          thisWeekCount: res.data.thisWeekCount,
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="App">
        <h2>Morse Converter</h2>
        <Form onSubmit={input => this.onSubmit(input)} />
        <br/>
        <div className="outputBox">{this.state.morse.replace(/ /g, "\u00a0")}</div>
        <p>total messages count: {this.state.totalCount}</p>
        <p>sent today: {this.state.todayCount}</p>
        <p>sent this week: {this.state.thisWeekCount}</p>
      </div>
    );
  }
}

export default App;
