import React, { useState, useContext} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const Login = () => {
  console.log(UserContext, 'hit');
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const postData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: "invalid email"})
      return
    }
    fetch("https://instgramserver.herokuapp.com/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then((res) => {
      console.log(res.status)
      return res.json();
    })
    .then((data) => {
      if(data.error) {
        M.toast({html: data.error})
      } else {
        console.log(data.user, 'user');
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({type: "USER", payload: data.user});
        M.toast({html: data.message})
        history.push('/');
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button onClick={() => postData()}className="btn waves-effect waves-light #645bf6 blue lighten-2">Login</button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login;