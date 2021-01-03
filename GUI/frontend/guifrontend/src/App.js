import logo from './logo.svg';
import './App.css';
import Nodes from './Nodes';
import Topics from './Topics';


import {useState} from 'react';

function App() {
  const [layout,setLayout] = useState(<Home />);


  return (
    <div className="App">

      <div class="head">
            <header>
              <img src="/logoanv.png" height="100px"  />
            </header>

            <div  class="nav">

                  <li onClick={()=>{setLayout(<Home />)}}>Dashboard</li>
                
                  <li onClick={()=>{setLayout(<Nodes />)}}>Nodes</li>
                  <li onClick={()=>{setLayout(<Topics />)}}>Topics</li>
                  <li onClick={()=>{setLayout(<Credits /> )}}>Credits</li>
                  
            </div>



          </div>

          <MainView Layout={layout}></MainView>


    </div>
  );
}
function Home()
{
    return (<div><center><h2>Dashboard</h2></center></div>);
}


function Credits()
{
  return (<div><center><h2>Credits</h2><br />Designed and Developed by <a href="https://akshatweb.in">Akshat Joshi</a> for <a href="http://anveshak.team">Team Anveshak</a></center> </div>);
}
function MainView(props)
{
  return (props.Layout);
}



export default App;
