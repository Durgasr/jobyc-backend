# jobyc-backend

## Project Description

A full-fledged job portal enabling recruiters to post jobs, manage applicants, and review 
candidate profiles.

## Functionalities

- Sign and Login as a recruiter or job seeker.
- Recruiter can post jobs only if profile completion score is >80. 
- Job seeker can apply jobs on ly profile completion is >80.
- recruiter can Edit, delete, posted jobs.
- recruiter can see the applicants along with applicant details and resume once review, job  seeker will get email alerts.
- Perform all actions securely after successful login with JWT token authentication.
- On logout, the JWT token is deleted for security.
- user can reset the password using reset password url sent through email.
- users can edit profile details.

## Validations

[All validations are done mongoose schema](*.schema.js)

## User Authentication

[Users must log in using JWT token authentication](/src/middlewares/auth.js)

## Handling Errors, Invalid Paths, and Form Data

[handle Errors with custom error messages](/src//middlewares/errorHandlerMiddleware.js)

[handle form data using multer](/src/middlewares/fileupload.middleware.js)

## Required Dependencies

| package               | Version      | Description                  |
| --------------------- | ------------ | ---------------------------- |
| "express"             | ^5.1.0       | Framework for Node JS        |
| "mongodb"             | ^6.19.0      | For Persistent Storage       |
| "mongoose"            | ^8.18.1      | ODM library                  |
| "otp-generator        | ^4.0.1       | To generate otp              |
| "jsonwebtoken"        | ^9.0.2       | JWT Authentication           |
| "ejs":                | ^3.1.10      | Render Dynamic web pages     |
| "express-ejs-layouts" | ^2.5.1       | Defines Common Layout        |
| "express-validator"   | ^7.2.1       | Validates user input         |
| "cookie-parser"       | ^1.4.7       | Parses and manages Cookies   |
| "multer"              | ^2.0.2       | Handling mutlipart/form-data |
| "nodemailer"          | ^7.0.6       | for sending emails           |
| "cors"                | ^2.8.5       | to accept requests from specified origin|

To install all the above dependencies run command "npm install"


## How to run

- Need to install required package using "npm install" in the root folder and then run the app using  "node server.js"