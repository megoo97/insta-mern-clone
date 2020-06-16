import React,{useEffect,useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {UserContext} from '../../App'
const UserProfile = () => {
  const [userProfile,setUserProfile] = useState(null);
  const {state,dispatch} = useContext(UserContext);
  const {userId} =useParams();
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
            src="https://images.unsplash.com/photo-1564923630403-2284b87c0041?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
            />
          </div>
          <div>
            <h4>{userProfile.user.name}</h4>
            <h4>{userProfile.user.email}</h4>

            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h5>{userProfile.posts.length}</h5>
              <h5>40 followers</h5>
              <h5>40 following</h5>
            </div>
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