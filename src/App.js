import React, { useRef, useEffect, useState } from 'react'
import './App.css';
import * as tf from "@tensorflow/tfjs"
import * as qna from "@tensorflow-models/qna"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import { Fragment } from 'react'

function App() {
  const passageRef = useRef(null)
  const questionRef = useRef(null)
  const [answer, setAnswer] = useState()
  const [model, setModel] = useState(null)

  //Load Model
  const loadModel = async () => {
    const loadedModel = await qna.load()
    setModel(loadedModel)
    console.log('Model Loaded')
  }
  //Questions
  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("Questions Submitted")
      const passage = passageRef.current.value
      const question = questionRef.current.value
      const answers = await model.findAnswers(question, passage)
      setAnswer(answers)
      console.log(answers)
    }
  }

  useEffect(() => { loadModel() }, [])
  return (
    <div className="App">
      <header className="App-header">
        {model == null ?
          <div>
            <div>Model Loading</div>
            <Loader type='ThreeDots' color='#00BFFF' height={100} width={100} />
          </div>
          :
          <React.Fragment>
            <h2>Passage</h2>
            < textarea className='text' ref={passageRef} placeholder='Enter Passage' rows='30' cols='100' />
            <h4>Ask a Question</h4>
            <input className='ques' ref={questionRef} placeholder='Enter Question' onKeyPress={answerQuestion} size='80'></input>
            <h5>Answers</h5>
            {answer ? answer.map((ans, idx) => <div><b>Answer {idx + 1} - </b>{ans.text} ({Math.floor(ans.score * 100) / 100})</div>) : ""}
          </React.Fragment>
        }
      </header>
    </div>
  );
}

export default App;
