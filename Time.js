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
  const db = firebase.firestore().collection('time');
  const timeRef = await db.orderBy('time', 'desc').limit(1).get();
  const output = [];
  if (timeRef.empty) {
    output.push({
      id: 0,
      time: 'Time queue is empty.',
    });
    console.log('Time queue is empty.');
  } 
  else {
    timeRef.forEach((doc) => {
      doc.data().id=doc.id;
      console.log(doc.data().time);
      output.push({
        id: doc.id,
        time :toDateString(doc.data().time),
      });
    });
    console.log(output);
  }
  return output;
}

async function getAllTimes() {
  const db = firebase.firestore().collection('time');
  const timeRef = await db.orderBy('time', 'desc').get();
  const output = [];
  if (timeRef.empty) {
    output.push({
      id: 0,
      time: 'Time queue is empty.',
    });
    console.log('Time queue is empty.');
  } 
  else {
    timeRef.forEach((doc) => {
      output.push({
        id: doc.id,
        time : toDateString(doc.data().time),
      });
    });
    console.log(output);
  }
  return output;
}

function addCurrentTime() {
  const db = firebase.firestore();
  const addtimeRef = db.collection('time');
  const date = new Date();
  const addtime = { time: date };
  addtimeRef.add(addtime);
}

async function deleteEarliestTime() {
  const db = firebase.firestore().collection('time');
  const timeRef = await db.orderBy('time', 'asc').limit(1).get();
  const del = [];
    timeRef.forEach((doc) => {
      del.push({
        id: doc.id,
      });
    });
    //console.log(del.data());
    const delEarlist = db.doc(del[0].id);
    delEarlist.delete();
}

export default {
  getLastestTime,
  getAllTimes,
  addCurrentTime,
  deleteEarliestTime,
};