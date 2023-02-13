import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDIkmNdzZT6j6IWSG-APYiRiv81N6kinj8",
  authDomain: "blog-app-1-c0c20.firebaseapp.com",
  projectId: "blog-app-1-c0c20",
  storageBucket: "blog-app-1-c0c20.appspot.com",
  messagingSenderId: "422924170390",
  appId: "1:422924170390:web:48ec7bece6151400f63eb7"
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
