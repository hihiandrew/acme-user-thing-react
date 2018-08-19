import React, { Component } from 'react';
import { render } from 'react-dom';
import Axios from 'axios';

const User = ({ user }) => {
  return user.owns.map(own => {
    return <li>{own.thing.name}</li>;
  });
};

const AllUsers = ({ userList }) => {
  return userList.map(user => {
    return (
      <div className="userList">
        <h3>{user.name}</h3>
        <ul>
          <User key={user.id} user={user} />
        </ul>
      </div>
    );
  });
};

const AllUsersFiltered = ({ userList }) => {
  const newList = userList.filter(x => x.owns.length > 0);
  return newList.map(user => {
    return (
      <div className="userList">
        <h3>{user.name}</h3>
        <ul>
          <User key={user.id} user={user} />
        </ul>
      </div>
    );
  });
};

const FilterButton = ({ filterThings, filterUsers }) => {
  return (
    <button onClick={() => filterUsers()}>
      {filterThings ? 'Show All Users' : 'Only Show Users With Things'}
    </button>
  );
};

class Main extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      filterByThings: false,
    };
    this.filterUsers = this.filterUsers.bind(this);
  }

  componentDidMount() {
    Axios.get('/api/users/').then(resp => {
      this.setState({ users: resp.data });
    });
  }

  filterUsers() {
    this.setState({ filterByThings: !this.state.filterByThings });
  }

  render() {
    let PageView = this.state.filterByThings ? (
      <AllUsersFiltered userList={this.state.users} />
    ) : (
      <AllUsers userList={this.state.users} />
    );
    return (
      <div>
        <FilterButton
          filterThings={this.state.filterByThings}
          filterUsers={this.filterUsers}
        />
        {PageView}
      </div>
    );
  }
}

render(<Main />, document.getElementById('root'));
