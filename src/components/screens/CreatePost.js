import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
  const history = useHistory();
  const [ title, setTitle ] = useState("");
  const [ body, setBody ] = useState("");
  const [ image, setImage ] = useState("");
  const [ imageUrl, setImageUrl ] = useState("");

  useEffect(() => {
    if(imageUrl) {
      fetch("https://instgramserver.herokuapp.com/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+ localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          pic: imageUrl
        })
      })
      .then((res) => {
        console.log(res.status)
        return res.json();
      })
      .then((data) => {
        console.log(data, 'hit');
        if(data.error) {
          M.toast({html: data.error})
        } else {
          M.toast({html: data.message})
          history.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
}, [imageUrl])

  const PostDetails = () => {
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

  return (
    <div  style={{
      margin: "10px auto",
      maxWidth: "500px",
      padding:"20px",
      textAlign:"center"
    }}className="card input-field">
      <input type="text" onChange={(e) => setTitle(e.target.value)} placeholder="title" />
      <input type="text" onChange={(e) => setBody(e.target.value)} placeholder="body" />
      <div className="file-field input-field">
        <div className="btn">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" placeholder="Upload one or more files" />
        </div>
      </div>
      <button onClick={() => PostDetails()} className="btn waves-effect waves-light #645bf6 blue lighten-2">Submit Post</button>
    </div>
  )
}

export default CreatePost;