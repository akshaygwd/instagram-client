import React, { useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    if(imageUrl) {
      uploadFields();
    }
  }, [imageUrl]);

  const uploadFields = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: "invalid email"})
      return
    }
    fetch("https://instgramserver.herokuapp.com/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: imageUrl
      })
    }).then((res) => {
      console.log(res.status)
      return res.json();
    })
    .then((data) => {
      if(data.error) {
        M.toast({html: data.error})
      } else {
        M.toast({html: data.message})
        history.push('/signin');
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dp0xf2zwq");
    fetch("https://api.cloudinary.com/v1_1/dp0xf2zwq/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
    .then((data) => {
      console.log(data);
      setImageUrl(data.url);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const postData = () => {
   if(image) {
    uploadPic();
   }else {
     uploadFields();
   }
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="name" />
        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload one or more files" />
          </div>
        </div>
        <button
        onClick={() => postData()}
        className="btn waves-effect waves-light #645bf6 blue lighten-2">Signup</button>
        <h5>
          <Link to="/signin">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Signup;