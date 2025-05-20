import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer ,CartesianGrid} from 'recharts';

function aggregateProgress(progress) {
  const map = {};
  progress.forEach(item => {
    if (!map[item.category]) {
      map[item.category] = { ...item };
    } else {
      map[item.category].correctAnswers += item.correctAnswers;
      map[item.category].wrongAnswers += item.wrongAnswers;
    }
  });
  return Object.values(map);
}

const UserDashboard = () => {
  
    const[progress,setProgress]=useState([])
    useEffect(()=>{
        const fetchProgress=async()=>{
            const token=localStorage.getItem('token')
            try{
                const res=await axios.get('http://localhost:5000/progress',{
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                })
               // console.log(res.data);
                setProgress(res.data)
            }catch(error){
               console.error('Error fetching progress',error)
            }
        }
        fetchProgress()
    },[])

     const handleDeleteAll = async () => {
        const token = localStorage.getItem('token')
        try {
            await axios.delete('http://localhost:5000/progress', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setProgress([]) // Clear progress in UI
        } catch (error) {
            console.error('Error deleting progress', error)
        }
    }
   const aggregatedProgress = aggregateProgress(progress);
  return (
    <div className='user-dashboard'>
        <h1>Your Quiz Progress</h1><br></br>
        <br></br>
         <br></br>
        <br></br>
        <div style={{ width: '100%', height: 300 }}>
  <div style={{ width: '100%', height: 340, marginBottom: 32 }}>
  <ResponsiveContainer>
            <BarChart
              data={aggregatedProgress}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barCategoryGap="20%"
            >
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                contentStyle={{ background: "#f8ffae", borderRadius: 8, color: "#333" }}
                formatter={(value, name) =>
                  name === "Progress"
                    ? `${value}%`
                    : value
                }
              />
              <Legend />
              <Bar
                dataKey="correctAnswers"
                fill="#4a71d8"
                name="Correct"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              />
              <Bar
                dataKey="wrongAnswers"
                fill="#e74c3c"
                name="Wrong"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              />
              <Bar
                dataKey={item =>
                  item.correctAnswers + item.wrongAnswers > 0
                    ? ((item.correctAnswers / (item.correctAnswers + item.wrongAnswers)) * 100).toFixed(2)
                    : 0
                }
                name="Progress"
                fill="#43c6ac"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
                isAnimationActive={true}
                barSize={20}
                label={{ position: 'top', fill: '#43c6ac', fontWeight: 'bold', formatter: v => `${v}%` }}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
</div>
   </div>
   <br></br>
   <br></br>
    <br></br>
   <br></br>
   <br></br>
        <div className="table-container">
        <table>
            <thead>
           <tr>
            <th>Category </th>
            <th> Correct Answer</th>
            <th>Wrong Answer</th>
            <th> Progress (%) </th>
           </tr>
            </thead>
            <tbody>
                {progress.map((item)=>(
                   <tr key={item._id}>
                    <td>{item.category} </td>
                    <td>{item.correctAnswers}</td>
                    <td>{item.wrongAnswers}</td>
                   <td>
                     {item.correctAnswers + item.wrongAnswers > 0
                     ? ((item.correctAnswers / (item.correctAnswers + item.wrongAnswers)) * 100).toFixed(2) + '%' : '0%'}
                  </td>
                   </tr>
                ))}
              </tbody>  
        </table>
        </div>
         <button
      onClick={handleDeleteAll}
      style={{
        marginBottom: '16px',
         marginLeft:400,
        background: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Delete All Progress
    </button>
    </div>
  )
}

export default UserDashboard
