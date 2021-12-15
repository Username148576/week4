import firebase from 'firebase';


function toDateString(time) {
  const date = new Date(time.seconds * 1000);
  const dateString = `${date.getFullYear().toString()}/${
    (date.getMonth() + 1).toString().padStart(2, '0')}/${
    date.getDate().toString().padStart(2, '0')}  ${
    date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0')}:${
    date.getSeconds().toString().padStart(2, '0')}`;

  return dateString;
}

async function getLastestTime() {
    const db = firebase.firestore();
    const timesRef = db.collection('time');
    const timesArray = [];
    const querySnapshot = await timesRef.get();
    querySnapshot.forEach((doc) => {
        doc.data().id = doc.id;
        timesArray.push(doc.data().now);
    });
    timesArray.sort();
    console.log(toDateString(timesArray[timesArray.length-1]));
}

async function getAllTimes() {
    const db = firebase.firestore();
    const timesRef = db.collection('time');

    const timesArray = [];
    const querySnapshot = await timesRef.get();
    querySnapshot.forEach((doc) => {
        doc.data().id = doc.id;
        timesArray.push(doc.data().now);
    });
    timesArray.sort();
    for(let i=0;i<timesArray.length;i++)console.log(toDateString(timesArray[i]));
}

function addCurrentTime() {
    const db = firebase.firestore();
    const timesRef = db.collection('time');
    const t = firebase.firestore.Timestamp.fromDate(new Date());
    const time={
        now : t
    }
    timesRef.add(time);
}

async function deleteEarliestTime() {
    const db = firebase.firestore();
    const timesRef = db.collection('time');
    const querySnapshot = await timesRef.get();
    let EarliestTime = 9999999999;
    let timeID;
    querySnapshot.forEach((doc) => {
        //console.log(doc.data().now.seconds);
      if (doc.data().now.seconds < EarliestTime) {
        timeID = doc.id;
        EarliestTime = doc.data().now.seconds;
      }
    });
    const timeRef = db.collection('time').doc(timeID);
    //console.log(timeID);
    timeRef.delete();
  
  }

export default {
    getLastestTime,
    getAllTimes,
    addCurrentTime,
    deleteEarliestTime,
};