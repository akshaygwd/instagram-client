import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
  const [ mypics, setMyPics ] = useState([]);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);
  const { state, dispatch } = useContext(UserContext);
  console.log(state, 'state');
  useEffect(() => {
    fetch('https://instgramserver.herokuapp.com/mypost', {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      }
    }).then((res) => {
      return res.json();
    }).then((result) => {
      console.log(result);
      setMyPics(result.post);
    })
  }, []);

  useEffect(() => {
    if(image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dp0xf2zwq");
      fetch("https://api.cloudinary.com/v1_1/dp0xf2zwq/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
      .then((data) => {
        console.log(data, 'data');
        setImageUrl(data.url);
        fetch("https://instgramserver.herokuapp.com/updatepic", {
          method: "put",
          body: JSON.stringify({
            pic: data.url
          }),
          headers: {
            "Authorization": "Bearer "+localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          }
        }).then((res) => {
          return res.json()
        }).then((result) => {
          console.log(result, 'here me now');
          localStorage.setItem("user",
          JSON.stringify({...state, pic: result.pic}))
          dispatch({type: "UPDATEPIC", payload: result.pic})
        })
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [image])

  const updatePhoto = (file) => {
    setImage(file);
  }

  return (
    <div className="profile">
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 0px",
        borderBottom: "1px solid grey"
      }}>
        <div>
          <img
            src={state ? state.pic: "...loading"}
            style={{width: "120px", height: "120px", borderRadius: "50%"}}
            />
            <div className="file-field input-field">
              <div className="btn">
                <span>Upload Image</span>
                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
              </div>
              <div className="file-path-wrapper">
                <input style={{display: "none"}}  className="file-path validate" type="text" placeholder="Upload one or more files" />
              </div>
            </div>
        </div>
        <div style={{width: "55%"}}>
          <h4>{state ? state.name: "...loading"}</h4>
          <h5>{state ? state.email: "...loading"}</h5>
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.followers.length : '0'} followers</h6>
            <h6>{state ? state.following.length : '0'} followings</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {
          mypics.length > 0 ?
          mypics.map((pic) => {
            return (
              <img key={pic._id} className="item" src={pic.photo} />
            )
          })
          :
          null
        }

      </div>
    </div>
  )
}

export default Profile;