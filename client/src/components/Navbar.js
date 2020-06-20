import React,{useContext,useRef,useEffect,useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';
const Navbar = () => {
  const searchModel = useRef(null);
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const {state,dispatch} = useContext(UserContext);
  const history =useHistory();
  useEffect(() => {
    M.Modal.init(searchModel.current);
  },[])
  const renderList= () => {
    if(state) {
      return [ 
        <li><i data-target="modal1" className="material-icons modal-trigger"  style={{color:"black"}}>search</i>
        </li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li> 
    <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={()=>{
          localStorage.clear();
          dispatch({type:"CLEAR"});
          history.push('/signin')
        }}
        >
            Logout
        </button></li>
      ]
    } else {
      return [
        <li><Link to="/signin">SignIn</Link></li>,
        <li><Link to="/Signup">SignUp</Link></li>
      ]
    }
  }
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/user/search',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }
  return (
    <nav>
    <div className="nav-wrapper white" >
      <Link to={state?"/":"/signin"} className="brand-logo left">Insagram</Link>
      <ul id="nav-mobile" className="right">
      {renderList()}
      </ul>
    </div>
  <div id="modal1" className="modal modal-fixed-footer" ref={searchModel}>
    <div className="modal-content" style={{color:"black"}}>
    <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
      <ul className="collection">
      {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModel.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
    </ul>
    </div>
    <div className="modal-footer">
      <button href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
  </nav>
  );
}

export default Navbar;

