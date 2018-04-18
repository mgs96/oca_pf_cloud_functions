const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/notifications/chats/{pushId}').onCreate((event) => {
  // obtains the new notification
  const notification = event._data;
  console.log(event);

  //extracts some data from the notification
  const deviceToSend = notification.receiver;
  const displayMessage = notification.message;
  const sender = notification.sender;
  const senderData = JSON.stringify(notification.senderData);
  console.log(senderData);

  const payload = {
    notification: {
      title: displayMessage,
      body: "de " + sender
    },
    data: {
      user: senderData
    }
  };

  admin.messaging().sendToDevice(deviceToSend, payload)
    .then(response => console.log("Succesfully sent message:", response))
    .then(event.ref.remove()
            .then(ok => console.log("Successfully deleted node ", ok))
            .catch(error => console.log("Error deleting node", error))
          )
    .catch(error => console.log("Error sending message:", error));

  return 0;
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
