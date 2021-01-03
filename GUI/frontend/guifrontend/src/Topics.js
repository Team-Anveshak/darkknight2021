
import './Topics.css'

import {useState, useEffect} from 'react';
let len = 0


async function addTopic(topic,desc,msgtype)
{
  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/addtopic?topic="+topic+"&topicdesc="+desc+"&msgtype="+msgtype).then((res)=>{

        if(res.ok)
        {
          console.log("added topic")
           resolve(true) 
        }
        else{
         
          alert("Error in adding topic!")
          resolve(false) 
        }


    })

  });

  let result = await promise
  return result



}

function Topics()
{
    
       
   const [topics,setTopics] = useState([]);
   const [msgBoxes,setMsgBoxes] = useState([]);
   let listeners = {}
   

    function fetchTopics()
    {
        fetch("http://localhost:5000/api/topics").then(async (res)=>{
            if(res.ok)
            {
                console.log("fetched");
               setTopics(await res.json());
               
              
            }
          });
    }
    function unmount(id)
    {
       document.getElementById(id).style.display="none";
    }
    function addMessageBox(listener)
    {
        console.log(msgBoxes)
        let id = "msgBox"+len
        len = len+1
        console.log(id)
        setMsgBoxes(msgBoxes=>[...msgBoxes,<MessageBox id={id} listener={listener} unmount={unmount} />])
    }
   




    useEffect(fetchTopics,[]);


    topics.forEach((topic)=>{
        let listener = new window.ROSLIB.Topic({
            ros : window.ros,
            name : topic[0],
            messageType : topic[2]
          });
          listeners[topic[0]] = listener;
    });
    

    return(<div id="topics">
              <center><h2>Topics</h2></center><br />

        
                
              <TopicListView topicList={topics} rerender={fetchTopics} listeners={listeners}  addMessageBox={addMessageBox}>

              </TopicListView>

              <div id="arena">
                  {msgBoxes}

              </div>
              <TopicForm  rerender={()=>{fetchTopics()}} />
          


    </div>);
}

function TopicListView(props)
{


    function deleteTopic(topic)
    {
       
          
          fetch("http://localhost:5000/api/deletetopic?topic="+topic).then((res)=>{
            if(res.ok)
            {
               props.rerender();
      
            }
            else
            {
              alert("Error!");
            }
          });
        
      
    }
    function viewTopic(topic)
    {
        props.addMessageBox(props.listeners[topic])
        
    }

    let content = []
    props.topicList.forEach(
        (topic)=>
    {
        content.push(<tr><td>{topic[0]}</td><td>{topic[1]}</td><td>{topic[2]}</td><td onClick={()=>{viewTopic(topic[0])}}>View Topic</td><td onClick={()=>{deleteTopic(topic[0])}}>Delete Topic</td></tr>)
    }
    )
  

   return(<div  id="topicList">

        <table className="styled-table">
            <thead>
            <tr>            
                <th>Topic</th>
                <th>Description</th>
                <th>Message Type</th>
                <th>View Topic</th>
                <th>Delete Topic</th>
                
            </tr>
            </thead>
            <tbody>
            {content}            
            </tbody>

            
        </table>



   </div>);
}
 

function MessageBox(props){
    

    const [msgs,setMsgs] = useState([])

    useEffect(()=>{
      
        props.listener.subscribe((message)=>{
            
            setMsgs(msgs => [...msgs, <span>{JSON.stringify(message)}</span>])
           

    });
    
    
    },[]);

    function close()
    {
        props.listener.unsubscribe()
        props.unmount(props.id) 
    }

    return (

            <div id={props.id}  class="msgbox">
                <button className="closebtn" onClick={()=>close()}>Close</button>

                <div className="messageView">
                    {msgs}
                </div>
            </div>


    );
}
function TopicForm(props)
{
  let normalButton = <button onClick={()=>{addTopicFromForm()}}>Add Topic + </button>
  let disabledButton = <button onClick={()=>{addTopicFromForm()}} disabled>Adding...</button>
  
  const [button,setButton] = useState(normalButton)
  function addTopicFromForm()
  {
   
    let topic = document.getElementById("topic").value;
    let topicdesc = document.getElementById("topicdesc").value;
    let message = document.getElementById("message").value;
    addTopic(topic,topicdesc,message).then((res)=>{
        if(res)
        {
            setButton(normalButton)
            props.rerender()
        }
    });
    setButton(disabledButton)


  }
 
  return(<div className="nodeForm">


      <h3>Add a Topic</h3>


      <input type="text" id="topic" placeholder="Name of the topic" /> <br />
      <input type="text" id="topicdesc" placeholder="Description of the topic" /> <br />
      <input type="text" id="message" placeholder="Message Type (eg. geometry_msgs/Twist)" /> <br />
    
      {button}
      
      



  </div>)
}
export default Topics;