import ReactDOM from 'react-dom';
import React,{useState} from "react";
function App() {
    const [userInfo,setUserInfo] =useState({
        userName:"",
        userAge:"18",
        userHeight:"",
    });
    const onGetUserInfo=() => {
        const data = {userHeight:"180"};
        const info = {...userInfo,...data};
        // 错误的更新方式
        //userInfo.userHeight = data.userHeight;
        setUserInfo(info);

    };
    return (
        <div className="App">
            <div>
                <h1>hello world</h1>
                <h2>userName:{userInfo.userName}</h2>
                <h2>userAge:{userInfo.userAge}</h2>
                <h2>userHeight:{userInfo.userHeight}</h2>
                <button onClick={onGetUserInfo}>获取用户信息</button>
                </div>
        </div>
    )
}