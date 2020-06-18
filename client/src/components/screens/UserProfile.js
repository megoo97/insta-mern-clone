import React,{useEffect,useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {UserContext} from '../../App'
const UserProfile = () => {
  const [userProfile,setUserProfile] = useState(null);
  const {state,dispatch} = useContext(UserContext);
  const {userId} =useParams();
  const [showFollow,setShowFollow] = useState(state?!state.following.includes(userId):true);
  useEffect(() => {
    fetch('/user/'+userId,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res => res.json()).then(result => {
        console.log(result);
        setUserProfile(result);
    }).catch(error => {
      console.log(error);
    })
  },[])
  const followUser =() =>{
    fetch('/user/follow',{
      method:'put',
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }, body:JSON.stringify({
        followId:userId
      })
    }).then(res=>res.json())
    .then(data=>{
      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
      localStorage.setItem('user',JSON.stringify(data));
      setUserProfile((prevState)=> { 
        return {
          ...prevState,
          user:{
            ...prevState.user,
            followers:[...prevState.user.followers,data._id]
          }
        }
      })
      setShowFollow(false);
    }).catch(err=>{
        console.log(err)
    })
  }

  const unfollowUser =() =>{
    fetch('/user/unfollow',{
      method:'put',
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }, body:JSON.stringify({
        unfollowId:userId
      })
    }).then(res=>res.json())
    .then(data=>{
      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
      localStorage.setItem('user',JSON.stringify(data));
      setUserProfile((prevState)=> { 
        return {
          ...prevState,
          user:{
            ...prevState.user,
            followers:prevState.user.followers.filter(item=>item != data._id)
          }
        }
      })
      setShowFollow(true);
    }).catch(err=>{
        console.log(err)
    })
  }
  return (
    <>
    {
    userProfile? 
  <div style={{maxWidth:"550px",margin:"0px auto"}}>
      <div style={{
        display:"flex",
        justifyContent:"space-around",
        margin:"18px 0px",
        borderBottom:"1px solid gray"
      }}>
          <div>
            <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
              src={userProfile.user?userProfile.user.profilePicture:""}
              />
          </div>
          <div>
            <h4>{userProfile.user.name}</h4>
            <h4>{userProfile.user.email}</h4>

            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h5>{userProfile.posts.length} posts</h5>
              <h5>{userProfile.user.followers.length} followers</h5>
              <h5>{userProfile.user.following.length} following</h5>
            </div>
            {showFollow? 
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>followUser()}
            >
                Follow
            </button>
            :
            <button className="btn waves-effect waves-light #64b5f6 red darken-1"
            onClick={()=>unfollowUser()}
            >
                UNFollow
            </button>}
          </div>
      </div>
  <div className="gallery">
     {
       userProfile.posts.map(item => {
         return (
          <img className="item" src={item.photo} alt={item.title}/>
         )
       })
     }
  </div>
  </div>
  : <h2>loading</h2>} </>
  );
}

export default UserProfile;