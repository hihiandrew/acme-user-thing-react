import React, { Component } from 'react';
import { render } from 'react-dom';
import Axios from 'axios';

const Things = ({ user }) => {
  return user.owns.map(own => {
    return <li>{own.thing.name}</li>;
  });
};

const Users = ({ userList }) => {
  return userList.map(user => {
    return (
      <div className="userList">
        <h3>{user.name}</h3>
        <ul>
          <Things key={user.id} user={user} />
        </ul>
      </div>
    );
  });
};

const UsersFiltered = ({ userList }) => {
  return userList
    .filter(user => {
      return user.owns.length > 0 ? true : false;
    })
    .map(user => {
      return (
        <div className="userList">
          <h3>{user.name}</h3>
          <ul>
            <Things key={user.id} user={user} />
          </ul>
        </div>
      );
    });
};

class Main extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      filterByThings: false,
    };
    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    Axios.get('/api/users/').then(resp => {
      this.setState({ users: resp.data });
    });
  }

  filter() {
    this.setState(1 - this.statefilterByThings);
  }

  render() {
    return (
      <div>
        <Filter switch={this.state.filterByThings} />
        <UsersFiltered userList={this.state.users} />
      </div>
    );
  }
}

render(<Main />, document.getElementById('root'));
