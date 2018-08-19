import React, { Component } from 'react';
import { render } from 'react-dom';
import Axios from 'axios';

const User = ({ user }) => {
  return (
    <div className="each-user">
      <h3>{user.name}</h3>
      <ul>
        {user.owns.map(own => {
          return <li key={own.id}>{own.thing.name}</li>;
        })}
      </ul>
    </div>
  );
};

const AllUsers = ({ userList }) => {
  return userList.map(user => {
    return <User user={user} key={user.id} />;
  });
};

const AllUsersFiltered = ({ userList }) => {
  const newList = userList.filter(user => user.owns.length > 0);
  return newList.map(user => {
    return <User user={user} key={user.id} />;
  });
};

const FilterButton = ({ filterThings, filterUsers }) => {
  return (
    <button className="btn" onClick={() => filterUsers()}>
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
      <AllUsersFiltered className="all-users" userList={this.state.users} />
    ) : (
      <AllUsers className="all-users" userList={this.state.users} />
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
