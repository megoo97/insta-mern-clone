import React from 'react';
import {Link} from 'react-router-dom';

const CreatePost = () => {
  return (
    <div className="card input-field" style={{
        margin:"30px auto", maxWidth:"500px",padding:"20px",textAlign:"center"
    }}>
        <input name="title" type="text" placeholder="title" />
        <input name="body" type="text" placeholder="body" />
        <div className="file-field input-field">
            <div className="btn #64b5f6 blue lighten-2">
                <span>Upload Image</span>
                <input type="file" />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
    </div>
    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2">Create Post</button>
    </div>
  );
}

export default CreatePost;