import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom';
import  Home from './components/screens/Home';
import  Profile from './components/screens/Profile';
import  Signin from './components/screens/Signin';
import  Signup from './components/screens/Signup';
import  CreatePost from './components/screens/CreatePost';

import "./App.css";
function App() {
  return (
    <BrowserRouter>
       <Navbar />
       <Route path="/" exact>
         <Home />
       </Route>
       <Route path="/signin" exact>
         <Signin />
       </Route>
       <Route path="/signup" exact>
         <Signup />
       </Route>
       <Route path="/profile" exact> 
         <Profile />
       </Route>
       <Route path="/create" exact> 
         <CreatePost />
       </Route>
    </BrowserRouter>
  );
}

export default App;
