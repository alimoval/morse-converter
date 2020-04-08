import React from 'react';
import axios from 'axios';
import * as moment from 'moment';
import './App.css';
import Form from './Form';

class App extends React.Component {
  state = {
    input: '',
    messages: [],
    morse: '',
    thisWeekCount: 0,
    todayCount: 0,
  };

  componentDidMount() {
    axios.get('http://localhost:8000/api/message')
      .then(res => {
        if (res.data && res.data.messages && res.data.messages.length) {
          this.setState({
            messages: res.data.messages,
            todayCount: this.countTodayMessages(res.data.messages),
            thisWeekCount: this.countThisWeekMessages(res.data.messages),
          });
        }
      })
      .catch(err => console.error(err));
  }

  countTodayMessages = data => {
    const today = moment().dayOfYear();
    const year = moment().year();
    return data.filter(el => {
      return moment(el.createdAt).dayOfYear() === today
        && moment(el.createdAt).year() === year;
    }).length;
  }

  countThisWeekMessages = data => {
    const todayWeekNumber = moment().week();
    const year = moment().year();
    return data.filter(el => {
      return moment(el.createdAt).week() === todayWeekNumber
        && moment(el.createdAt).year() === year;
    }).length;
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
        return axios.get('http://localhost:8000/api/message')
      })
      .then(res => {
        if (res.data && res.data.messages && res.data.messages.length) {
          this.setState({
            messages: res.data.messages,
            todayCount: this.countTodayMessages(res.data.messages),
            thisWeekCount: this.countThisWeekMessages(res.data.messages),
          });
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="App">
        <h2>Morse Converter</h2>
        <Form onSubmit={input => this.onSubmit(input)} />
        <br/>
        <div className="outputBox">{this.state.morse}</div>
        <p>total messages count: {this.state.messages.length}</p>
        <p>sent today: {this.state.todayCount}</p>
        <p>sent this week: {this.state.thisWeekCount}</p>
      </div>
    );
  }
}

export default App;
