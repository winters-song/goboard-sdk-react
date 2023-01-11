import React from 'react';
import ReactDOM from 'react-dom/client';
import Classroom from "./examples/Classroom";
import Quiz from "./examples/Quiz";
import {BrowserRouter, Link} from 'react-router-dom';
import {Route, Routes} from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(
          <div>
            <Link to={"/classroom"}>教师课堂</Link>
            <br/>
            <Link to={"/quiz"}>试卷答题</Link>
          </div>
        )} />
        <Route path="classroom" element={<Classroom />} />
        <Route path="quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);