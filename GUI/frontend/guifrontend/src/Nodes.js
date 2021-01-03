import {useState, useEffect} from 'react';

async function addNode(name,scommand,kcommand)
{
  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/addnode?nodename="+name+"&scommand="+scommand+"&kcommand="+kcommand).then((res)=>{

        if(res.ok)
        {
          console.log("added node")
           resolve(true) 
        }
        else{
         
          alert("Error in adding node!")
          resolve(false) 
          
        }


    })

  });

  let result = await promise
  return result



}
async function deleteNode(name)
{

  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/deletenode?nodename="+name).then((res)=>{

        if(res.ok)
        {
           resolve(true) 
        }
        else{
         
          alert("Error in deleting node!")
          resolve(false) 
        }


    })

  });

  let  result = await promise
  return result


}
async function startNode(name)
{
  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/startnode?nodename="+name).then((res)=>{

        if(res.ok)
        {
            resolve(true) 
        }
        else{
         
          alert("Error in starting node!")
          resolve(false) 
        }


    })

  });

  let result = await promise
  return result


}
async function killNode(name)
{
  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/killnode?nodename="+name).then((res)=>{

        if(res.ok)
        {
            resolve(true) 
        }
        else{
         
          alert("Error in starting node!")
          resolve(false) 
        }


    })

  });

  let result = await promise
  return result


}
async function fetchNodes()
{
  let promise = new Promise(function(resolve, reject) {
    
  
    fetch("http://localhost:5000/api/nodes").then((res)=>{
     
        if(res.ok)
        {
            console.log("nodes fetched")
            res.json().then((result)=>{
                resolve(result)
            });
             
        }
        else{
         
          alert("Error in adding node!")
          resolve([]) 
        }


    })

  });

  let result = await promise
  return result

}



function Nodes()
{
  const [nodes,setNodes] = useState([])
  function fetchNodesUI()
  {
    fetchNodes().then((nodes)=>{
      
        setNodes(nodes)
    });
  }

  useEffect(()=>{fetchNodesUI()},[]);


  return (<div><center> <h2>Nodes</h2> </center>

    <br /><div className="nodes">
    <NodesView nodes={nodes} rerender={()=>{fetchNodesUI()}}/>
    <NodeForm rerender={()=>{fetchNodesUI()}} />

    </div>
  </div>);
}



function NodesView(props)
{
  let statuses = {}
  let nodeList = []
  props.nodes.forEach((node)=>{

    nodeList.push(<tr><td>{node[0]}</td><td>{node[1]}</td><td>{node[2]}</td><td onClick={()=>{

      startNode(node[0]).then(()=>{

            console.log("started")

      })
      

    }}>Start</td><td onClick={()=>{

      killNode(node[0]).then(()=>{

            console.log("killed")

      })
      

    }}>Stop</td><td>{statuses[node[0]]}</td></tr>)

  })

  return(
      <div>
        <table className="styled-table">
        <thead>
        <tr>
          
          <th>Node</th><th>Start Command</th><th>Kill Command</th><th>Start Node</th><th>Kill Node</th><th>Status</th>
          
        </tr>
        </thead>
        <tbody>
        {nodeList}
        </tbody>
        </table>
 

      </div>



  );

}




function NodeForm(props)
{
  let normalButton = <button onClick={()=>{addNodeFromForm()}}>Add Node + </button>
  let disabledButton = <button onClick={()=>{addNodeFromForm()}} disabled>Adding...</button>
  
  const [button,setButton] = useState(normalButton)
  function addNodeFromForm()
  {
   
    let nodename = document.getElementById("NodeName").value;
    let scommand = document.getElementById("NodeStartCommand").value;
    let kcommand = document.getElementById("NodeKillCommand").value;
    addNode(nodename,scommand,kcommand).then((res)=>{
        if(res)
        {
            setButton(normalButton)
            props.rerender()
        }
    });
    setButton(disabledButton)


  }
 
  return(<div className="nodeForm">


      <h3>Add a Node</h3>


      <input type="text" id="NodeName" placeholder="Name of the node" /> <br />
      <input type="text" id="NodeStartCommand" placeholder="Command to start the node" /> <br />
      <input type="text" id="NodeKillCommand" placeholder="Command to kill the node" /> <br />
    
      {button}
      
      



  </div>)
}
export default Nodes;