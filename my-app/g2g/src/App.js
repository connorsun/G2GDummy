import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import fetch from 'node-fetch';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyFamdJT673QAnyGFYetXCKFD2rbNvOls",
  authDomain: "got2go-b8322.firebaseapp.com",
  projectId: "got2go-b8322",
  storageBucket: "got2go-b8322.firebasestorage.app",
  messagingSenderId: "136089776325",
  appId: "1:136089776325:web:09ea139ebe84401d7c00ac",
  measurementId: "G-K9RZXSEGXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseURL = "https://us-central1-got2go-b8322.cloudfunctions.net/";


function App() {
  const handleWrite = () => {
    fetch(firebaseURL + "writeDB", {method: "POST",
      body: JSON.stringify({userID: 0, data: {day: "tuesday"}}), 
      headers: {"Content-Type": "application/json"}
    }).then(response => {alert("Written!"); console.log(response);})
    .catch(error => {console.log(error);});
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button type="button" onClick={handleWrite}>
          Write to Database
        </button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
