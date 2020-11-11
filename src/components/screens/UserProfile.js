import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [ userProfile, setUserProfile ] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [ showFollow, setShowFollow ] = useState(state ? !state.following.includes(userId) : true);
  console.log(userId, 'hit');
  useEffect(() => {
    fetch(`https://instgramserver.herokuapp.com/user/${userId}`, {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      }
    }).then((res) => {
      return res.json();
    }).then((result) => {
      console.log(result, 'hit');
      setUserProfile(result)
    })
  }, []);

  const followUser = ()=>{
    fetch('https://instgramserver.herokuapp.com/follow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            followId:userId
        })
    }).then(res=>res.json())
    .then(data=>{

        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
         localStorage.setItem("user",JSON.stringify(data))
         setUserProfile((prevState)=>{
             return {
                 ...prevState,
                 user:{
                     ...prevState.user,
                     followers:[...prevState.user.followers,data._id]
                    }
             }
         })
         setShowFollow(false)
    })
}
const unfollowUser = ()=>{
    fetch('https://instgramserver.herokuapp.com/unfollow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            unfollowId:userId
        })
    }).then(res=>res.json())
    .then(data=>{

        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
         localStorage.setItem("user",JSON.stringify(data))

         setUserProfile((prevState)=>{
            const newFollower = prevState.user.followers.filter(item=>item != data._id )
             return {
                 ...prevState,
                 user:{
                     ...prevState.user,
                     followers:newFollower
                    }
             }
         })
         setShowFollow(true)

    })
}

  return (
    <>
    { userProfile ?     <div className="profile">
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 0px",
        borderBottom: "1px solid grey"
      }}>
        <div>
          <img
            src={userProfile ? userProfile.user.pic: "...loading"}
            style={{width: "120px", height: "120px", borderRadius: "50%"}}
            />
        </div>
        <div style={{width: "55%"}}>
          <h4>{userProfile ? userProfile.user.name: "...loading"}</h4>
          <h5>{userProfile.user.email}</h5>
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <h6>{userProfile.posts.length} posts</h6>
            <h6>{userProfile.user.followers.length} followers</h6>
            <h6>{userProfile.user.following.length} followings</h6>
          </div>
          {
            showFollow ?
            <button style={{margin: '10px'}} onClick={() => followUser()}className="btn waves-effect waves-light #645bf6 blue lighten-2">Follow</button>
            :
            <button style={{margin: '10px'}} onClick={() => unfollowUser()}className="btn waves-effect waves-light #645bf6 blue lighten-2">UnFollow</button>
          }



        </div>
      </div>
      <div className="gallery">
        {
          userProfile.posts.length > 0 ?
          userProfile.posts.map((pic) => {
            return (
              <img key={pic._id} className="item" src={pic.photo} />
            )
          })
          :
          null
        }

      </div>
    </div> : <h2>...locading</h2> }

    </>
  )
}

export default UserProfile;