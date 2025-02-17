let lastStates = [];
let index = 0;
function myUseState (initialState) {
  lastStates[index] = lastStates[index] || initialState;
  const currentIndex = index;
  function setState (newState) {
    lastStates[currentIndex] = newState;
    render();
  }
  return [lastStates[index++], setState];

}
function App() {
    const [userName,setUserName] = myUseState("");
    const [userAge,setUserAge] = myUseState("18");
    const [userHeight,setUserHeight] = myUseState("");
    return (
        // <div className="App">
        // <p>
        //     姓名<input onChange={(e) => setUserName(e.target.value)} value={userName}/>
        // </p>
        // <p>
        // 年龄
        // <input onChange={(e) => setUserAge(e.target.value)} value={userAge}/>

        // </p>
        //     <p>{UserName}</p>
        //     <p>{userAge}</p>
        // </div>

    )


} 
//么此渲染都会将state的index值为0
function render(){
    index = 0;
    ReactDOM.render(<App/>,document.getElementById("root"))

}