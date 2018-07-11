import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import { UserProfile } from './UserProfile';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this);
    this.logout = this.logout.bind(this);
    this.liftTokenToState = this.liftTokenToState.bind(this);
  }

  liftTokenToState(data) {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  logout() {
    // remove token from local storage
    localStorage.removeItem('mernToken');
    // remove info from state
    this.setState({
      token: '',
      user: null
    })
  }

  checkForLocalToken() {
    //Look for token in local storage
    let token = localStorage.getItem('mernToken');
    if (!token) {
      // There was no token
      // remove mernToken from local storage just in case corrupted, replaced etc
      localStorage.removeItem('mernToken') 
      this.setState({
        token: '',
        user: null
      })
    } else {
      // token found in local storage
      // send it to the back to be verified
      axios.post('/auth/me/from/token', {
        token
      }).then( results => {
        // put the token in local storage
        localStorage.setItem('mernToken', results.data.token);
        this.setState({
          token: results.data.token,
          user: results.data.user
        })
      }).catch( err => console.log(err))
    }
  }

  componentDidMount() {
    this.checkForLocalToken();
  }

  render() {
    let user = this.state.user;
    if (user) {
      return (
        <div className="App">
          <UserProfile user={user} logout={this.logout}/>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Signup liftToken={this.liftTokenToState} />
          <Login liftToken={this.liftTokenToState} />
        </div>
      )
    }
  }
}

export default App;