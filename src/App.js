import React, {useEffect, createContext,useReducer, useContext} from 'react';
import './App.css';
import NavBar from './components/navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { reducer, initialState } from './reducers/userReducer';
import SubsUser from './components/screens/SubsUser';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      dispatch({type: "USER", payload: user});
    }else {
      history.push('/signin');
    }
  }, []);

  return (
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/signin"  component={Login}/>
      <Route path="/profile/:userId" component={UserProfile} />
      <Route path="/profile" exact component={Profile}/>
      <Route path="/signup"  component={Signup}/>
      <Route path="/create" component={CreatePost} />
      <Route path="/subscribeduserpost" component={SubsUser} />
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log('App');
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
