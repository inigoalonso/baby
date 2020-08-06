import * as firebase from 'firebase/app'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
  apiKey: "AIzaSyDi00yjlVI01-5EAL6XnWGFyKtury1Vz_s",
  authDomain: "baby-202010.firebaseapp.com",
  databaseURL: "https://baby-202010.firebaseio.com",
  projectId: "baby-202010",
  storageBucket: "baby-202010.appspot.com",
  messagingSenderId: "285644390341",
  appId: "1:285644390341:web:82da6b03a924078a0f55ac"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()

// collection references
const betsCollection = db.collection('bets')

// export utils/refs
export {
  db,
  betsCollection
}