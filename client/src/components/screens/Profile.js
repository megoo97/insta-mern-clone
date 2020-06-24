import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App'
const Profile = () => {
  const [pics,setPics] = useState([]);
  const {state,dispatch} = useContext(UserContext);
  const [image,setImage] = useState("")
  const [url,setUrl] = useState("")
  useEffect(()=>{
    if(url){
     fetch("/user/profile/Picture",{
         method:"put",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
            profilePicture:url 
         })
     }).then(res=>res.json())
     .then(data=>{
      dispatch({type:"UPDATE_PROFILE_PICTURE",payload:{profilePicture:url}});
      localStorage.setItem('user',JSON.stringify(data));
    }).catch(err=>{
         console.log(err)
     })
 }
 },[url])

const saveImage = ()=>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","megoox97")
    fetch("https://api.cloudinary.com/v1_1/megoox97/image/upload",{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
       setUrl(data.url)
    })
    .catch(err=>{
        console.log(err)
    })
}

  useEffect(() => {
    fetch('/my/post',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res => res.json()).then(result => {
      setPics(result.posts);
    }).catch(error => {
      console.log(error);
    })
  },[])
  return (
    <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
          display:"flex",
          justifyContent:"space-around",
          margin:"18px 0px",
          borderBottom:"1px solid gray"
        }}>
            <div>
              <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
              src={state?state.profilePicture:""}
              />
            </div>
            <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Uplaod Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>saveImage()}
            
            >
               Save Image
            </button>
            </div>
            <div>
              <h4>{state?state.name:"loading"}</h4>
              <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                <h5>{pics.length} posts</h5>
                <h5>{state?state.followers.length:"0"} followers</h5>
                <h5>{state?state.following.length:"0"} following</h5>
              </div>
            </div>
        </div>
    <div className="gallery">
       {
         pics.map(item => {
           return (
            <img className="item" src={item.photo} alt={item.title}/>
           )
         })
       }
    </div>
    </div>
  );
}

export default Profile;