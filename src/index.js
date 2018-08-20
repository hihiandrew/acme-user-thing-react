import React, { Component } from 'react';
import { render } from 'react-dom';
import Axios from 'axios';

const User = ({ user }) => {
  return (
    <div className="each-user">
      <h3 className="title">{user.name}</h3>
      <div className="things">
        {user.owns.map(own => {
          return <p key={own.id}>{own.thing.name}</p>;
        })}
      </div>
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
        <div className="btn-container">
          <FilterButton
            filterThings={this.state.filterByThings}
            filterUsers={this.filterUsers}
          />
        </div>
        <div className="users-container">{PageView}</div>
      </div>
    );
  }
}

render(<Main />, document.getElementById('root'));
