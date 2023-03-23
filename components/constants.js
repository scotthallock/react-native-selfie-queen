// ---------------------------------------------------------------------
// CANNOT import path from "path";
// It will result in this error when opening the app on a web browser:
// Uncaught ReferenceError: process is not defined
//    at ./node_modules/path/path.js (path.js:25:1)
//    ...
// See more about this issue:
// https://github.com/facebook/create-react-app/issues/12212
// There are a few solutions which require extra dependencies.
// But for simplicity, we elect to concatenate strings instead.
// ---------------------------------------------------------------------

export const UPLOADS_PATH =
  "https://scotthallock-c0d3.onrender.com/selfie-queen/uploads/";
export const API_UPLOADS_PATH =
  "https://scotthallock-c0d3.onrender.com/selfie-queen/api/uploads/";