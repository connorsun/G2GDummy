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

/** fails formatted and returns 400 status
 * @param {record} body message body
 * @param {string} message error message
 * @param {record} response http response
 */
function fail(body, message, response) {
  logger.info(JSON.stringify(body), {structuredData: true});
  response.send({status: 400, err: message});
}

/** returns the uid associated with the auth token given by the user
 * @param {string} authToken user's authentication token
 * @param {record} response http response
 */
// async function getUid(authToken, response) {
//   const serviceAccount = require("path/to/serviceAccountKey.json");
//   const adminApp = firebaseAdmin.initializeApp(
//       {credential: firebaseAdmin.credential.cert(serviceAccount)}, "admin");
//   const uinfo = await adminApp.auth().verifyIdToken(authToken)
//       .catch((error) => {
//         fail(undefined, "failed to authenticate user", response);
//       });
//   return uinfo.uid;
// }

/** writes to the user's calendar given calendar data
 * @param {string} authToken user's authentication token
 * @param {record} data calendar data
 * @param {record} response http response
 */
function writeCal(authToken, data, response) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];
  for (const day of days) {
    if (data[day] === undefined) {
      fail("malformed request: cal req is missing day " + day);
      return;
    }
  }
  // later when we set up auth:
  // const uid = getUid(authToken);

  // for now: have users manually send auth tokens
  const uid = authToken;
  const database = firebaseAdmin.database();
  database.ref("users/" + uid).set({
    data: data,
  });
  response.send({status: 200});
}

/** writes to the user's info given info data
 * @param {string} authToken user's authentication token
 * @param {record} data info data
 * @param {record} response http response
 */
function writeInfo(authToken, data, response) {
  const infoFields = ["name", "deviceID"];
  for (const field of infoFields) {
    if (data[field] === undefined) {
      fail("malformed request: info req is missing field " + field);
      return;
    }
  }
  // later when we set up auth:
  // const uid = getUid(authToken);

  // for now: have users manually send auth tokens
  const uid = authToken;
  const database = firebaseAdmin.database();
  database.ref("users/" + uid).set({
    data: data,
  });
  response.send({status: 200});
}

// write to database
exports.writeDB = onRequest({cors: true}, async (request, response) => {
  const body = request["body"];
  // sanitize request
  if (body === undefined) {
    response.send({status: 400, err: "missing request body"});
    return;
  }
  const authToken = body["userAuthToken"];
  if (authToken === undefined) {
    fail(body, "missing request authentication token", response);
    return;
  }
  const data = body["data"];
  if (data === undefined) {
    fail(body, "missing request data", response);
    return;
  }
  const reqType = body["reqType"]; // write to calendar or user info?
  if (reqType === undefined) {
    fail(body, "undefined request type", response);
    return;
  }
  if (reqType === "calendar") {
    writeCal(authToken, data, response);
  } else if (reqType === "info") {
    writeInfo(authToken, data, response);
  } else {
    fail(body, "invalid request type: " + reqType, response);
    return;
  }
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
