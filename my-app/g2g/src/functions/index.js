/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const firebaseAdmin = require("firebase-admin");
// const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.helloConner = onRequest((request, response) => {
  logger.info("Hello Alec!", {structuredData: true});
  response.send("Hello Conner from Alec");
});

// write to database
exports.writeDB = onRequest({cors: true}, (request, response) => {
  const body = request["body"];
  // sanitize request
  if (body == null) {
    response.send({status: 400, err: "missing request body"});
    return;
  }
  const id = body["userID"];
  if (id == null) {
    logger.info(JSON.stringify(body), {structuredData: true});
    response.send({status: 400, err: "missing request userID"});
    return;
  }
  const data = body["data"];
  if (data == null) {
    logger.info(JSON.stringify(body), {structuredData: true});
    response.send({status: 400, err: "missing request data"});
    return;
  }
  const database = firebaseAdmin.database();
  database.ref("users/" + id).set({
    data: data,
  });
  response.send({status: 200});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
// exports.makeuppercase =
//      onDocumentCreated("/messages/{documentId}", (event) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log("Uppercasing", event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({uppercase}, {merge: true});
// });

firebaseAdmin.initializeApp();
