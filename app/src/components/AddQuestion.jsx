import React, { useState } from 'react'
import axios from 'axios'

const AddQuestion = () => {

   const [question, setQuestion] =useState('')
   const [options, setOptions] =useState(['','','',''])
    const [answer, setAnswer] =useState('')
    const [category, setCategory] =useState('')

    const handleOptionChange = (index,value) => {
        const newOptions = [...options]
        //used for adding options dynamically one by one
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit=async (e) => {
        e.preventDefault();
        await axios.post('https://skillcheckr.onrender.com/add-question',{
            question,
            options,
            answer,
            // category 
           category: category
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
             .join(' ')     
       })
        setQuestion('');
        setOptions(['','','','']);
        setAnswer('');
        setCategory('');
        // alert('Question added successfully')
    }    

  return (
    <div className="add-question-container">
        <h1 className="title">Add Question</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
         <input type="text" placeholder="Question" value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
         className="input-field  question-input" >
        </input>   
        </div>

         {options.map((option, index) => (
         <div className="form-group" key={index}>
         <input type="text" 
         placeholder={`Option ${index + 1}`} value={option} 
         onChange={(e) => handleOptionChange(index,e.target.value)} 
         className="input-field" >
        </input>   
        </div>
         ))}

        <div className="form-group">
         <input type="text" placeholder="Answer" value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
         className="input-field" >
        </input>   
        </div>

         <div className="form-group">
         <input type="text" placeholder="Category" value={category} 
            onChange={(e) => setCategory(e.target.value)} 
         className="input-field" >
        </input>   
        </div>

       <button className="add-question-btn">Add Question</button>
      </form>
    </div>
  )
}

export default AddQuestion
