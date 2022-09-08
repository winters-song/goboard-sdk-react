import React from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Logo} from "./components";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Logo message={"Hello World"}/>
    <Button label={"Hello World"}/>
  </React.StrictMode>
);