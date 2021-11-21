import ReactDOM from 'react-dom';
import App from './App';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './constants/firebase';
import { getAuth } from '@firebase/auth';
import { getDatabase } from '@firebase/database';

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)

ReactDOM.render(<App />, document.getElementById('root'));
