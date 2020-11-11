import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import {Link} from 'react-router-dom';

const SubsUser = () => {
  const [ data, setData ] = useState([]);
  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {
    fetch('https://instgramserver.herokuapp.com/getsubspost', {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      }
    }).then((res) => res.json())
    .then((result) => {
      console.log(result);
      setData(result.posts);
    })
  }, []);

  const likePost = (id) => {
    fetch('https://instgramserver.herokuapp.com/like', {
      method: "PUT",
      body: JSON.stringify({
        postId: id
      }),
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      }
    }).then((res) =>  res.json())
    .then(result => {
      const newData = data.map((item) => {
        if(item._id == result._id) {
          return result
        }else {
          return item
        }
      })
      setData(newData);
    }).catch((error) => {
      console.log(error);
    })
  }

  const makeComment = (text, postId) => {
    fetch("https://instgramserver.herokuapp.com/comment", {
      method: "PUT",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        postId
      })
    }).then((res) => res.json())
    .then((result) => {
      console.log(result)
      const newData = data.map((item) => {
        if(item._id == result._id) {
          return result
        }else {
          return item
        }
      })
      setData(newData);
    }).catch(error => console.log(error));
  }

  const deleteComment = (commentId, id) => {
    fetch(`https://instgramserver.herokuapp.com/deletecomment/${id}/${commentId}`,{
      method: "delete",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
      console.log("result**", result)
      const newData = data.map((item) => {
        if(item._id === result._id) {
          return result
        }
        else {
          return item;
        }
      })
      setData(newData)
    })
  }

  const UnlikePost = (id) => {
    fetch('https://instgramserver.herokuapp.com/unlike', {
      method: "PUT",
      body: JSON.stringify({
        postId: id
      }),
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      }
    }).then((res) =>  res.json())
    .then(result => {
      const newData = data.map((item) => {
        if(item._id == result._id) {
          return result
        }else {
          return item
        }
      })
      setData(newData);
    }).catch((error) => {
      console.log(error);
    })
  }

  const deletePost = (postId) => {
    fetch(`https://instgramserver.herokuapp.com/delete/${postId}`, {
       method: "delete",
       headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
       }
    }).then((res) => res.json())
    .then((result) => {
      console.log(result);
      const newData = data.filter(item => {
        return item._id.toString() !== result.result._id.toString()
      })
      setData(newData);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  return (
    <div className="home">
      {
        data.length > 0 ? data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5 style={{padding: "5px"}}>
                <Link to={item.postedBy._id.toString() != state._id ? `/profile/${item.postedBy._id}` : `/profile`}>
                {item.postedBy.name}
              { item.postedBy._id == state._id ?
                <i className="material-icons" onClick={() => deletePost(item._id)} style={{float: "right"}}>
                delete
                </i>
                : null
              }
                </Link>
              </h5>
              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{color: "red"}}>favorite</i>
                {item.likes.includes(state._id)
                  ?
                  <i onClick={() => UnlikePost(item._id)}className="material-icons">thumb_down</i>
                  :
                  <i onClick={() => likePost(item._id)}  className="material-icons">thumb_up</i>
                }
                <h6>{item.likes.length} Likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                  item.comments.map((record) => {
                    console.log(record, 'hit');
                    return (
                      <div>
                      <h6>
                        <span style={{fontWeight: "500",}}>
                          {record.postedBy.name}
                        </span>
                        :
                        {record.text}
                        { record.postedBy._id == state._id &&
                          <i className="material-icons right" style={{color: "black", display:'block', cursor:"pointer"}} onClick={()=>{deleteComment()}}>deleter</i>
                        }
                      </h6>

                      </div>
                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id)
                }}>
                <input type="text" placeholder="add comment"/>
                </form>
              </div>
            </div>
          )
        })
        :
        null
      }
    </div>
  )
}

export default SubsUser;