import React,{useState,useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import  {Link} from 'react-router-dom'
const Home = () => {
  const [data,setData]=useState([])
  const {state,dispatch} =useContext(UserContext);
  useEffect(() =>{
    fetch('/user/followers/posts',{
      method:"get",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res => res.json()).then(result => {
      console.log(result);
      setData(result.posts)
    }).catch(error => {
      console.log(error);
    })
  },[])
  const likePost= (id) => {
    fetch('/post/like',{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
          postId:id
      })
  }).then(res=>res.json())
  .then(result=>{

    const newData = data.map(item=>{
        if(item._id==result._id){
            return result
        }else{
            return item
        }
    })
    setData(newData)
  }).catch(err=>{
      console.log(err)
  })
  }
  const unlikePost= (id) => {
    fetch('/post/unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId:id
      })
    }).then(res =>res.json()).then((result) => {
      const newData = data.map(item =>{
        if(item._id==result._id) {
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    }).catch((error)=>{console.log(error)})
  }
  const clickLike= (post) => {
    if(post.likes.includes(state._id)) {
      unlikePost(post._id);
    } else {
      likePost(post._id);
    }
  }
  const addComment= (text,postId) =>{
    fetch('/post/comment',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text,
        postId
      })
    }).then(res =>res.json()).then((result) => {
      const newData = data.map(item =>{
        if(item._id==result._id) {
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    }).catch((error)=>{console.log(error)})
  }
  const deletePost= (postId) =>{
    fetch('/post/'+ postId,{
      method:"delete",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res =>res.json()).then((result) => {
      const newData = data.filter(item =>{
        return item._id !== result._id;
      })
      setData(newData);
    }).catch((error)=>{console.log(error)})
  }
  return (
    <div className="home" >
      {
        data.map(item => {
          return(
            <div className="card home-card" key={item.id}>
            <h5><Link to={item.postedBy._id == state._id ?'/profile/'+item.postedBy._id :"/profile"}>{item.postedBy.name}</Link>{item.postedBy._id == state._id &&
              <i className="material-icons" style={{float:"right"}} onClick={() => deletePost(item._id)}>delete</i>
              }
              </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <button style={{border:0,background:0,padding:0}}>{item.likes.includes(state._id)?<i className="material-icons" style={{color:"red"}} onClick={() => clickLike(item)}>favorite</i> :<i className="material-icons" style={{color:""}} onClick={() => clickLike(item)}>favorite_border</i> }</button>
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                  item.comments.map(record =>{
                    return(
                    <h6><span style={{fontWeight:500}}>{record.postedBy.name}</span> {record.text}</h6>
                    )
                  })
                }
                <form onSubmit={(e) =>{ 
                  e.preventDefault();
                  addComment(e.target[0].value,item._id);
                }}>
                <input type="text" placeholder="add a comment"/>
                </form>
            </div>
          </div>
          )
        })
      }

    </div>
  );
}

export default Home;