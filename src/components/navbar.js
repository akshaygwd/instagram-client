import React,{ useContext } from 'react';
import {Link, useHistory} from 'react-router-dom';
import { UserContext } from '../App';

const NavBar = () => {
  const history = useHistory();
  const {state, dispatch } = useContext(UserContext);

  const renderList = () => {
    if(state) {
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/subscribeduserpost"><i className="material-icons">person_add</i></Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><button onClick={() => {
          localStorage.clear()
          dispatch({type: "CLEAR"})
          history.push('/signin');
        }}className="btn #c62828 red darken-3">Logout</button></li>,
      ]
    } else {
      return [
        <li><Link to="/signin">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state? "/": "/signin"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar;