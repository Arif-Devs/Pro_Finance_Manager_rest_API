# Pro Finance Manager Rest API  
A Personal Finance Management System  

The Personal Finance Management System is a web application designed to empower users to manage their financial activities seamlessly.

## Project Motive  
Provide users with free financial services while leveraging user data for business insights.

## Core Features  
- Authentication  
- Role-Permission Based Authorization  
- Forgot Password with Email Verification  
- Seeding Full DB  
- Profile Update & Password Change  
- User Management  
- Accounts Management  
- Expense Tracking  
- Income Management  
- Records Generation  
- Categories Management  
- Multiple Filtering System  

## Tech Stack  
**Server:** Node, Express, MongoDB, Node Mailer, Express Validator  

## API Reference  

### Get all items  
`GET /api/v1/items`  

| Parameter     | Type         | Description                             |
|---------------|--------------|-----------------------------------------|
| access_token  | Bearer Token | **Required**. Authorization Header      |
| limit         | Number       | Not Required. Default 10                |
| page          | Number       | Not Required. Default 1                 |
| sortBy        | string       | Not Required. Default updatedAt         |
| sortType      | string       | Not Required. Default desc              |
| search        | string       | Not Required. Search Query              |
| select        | string       | Not Required. Get Specific Fields       |
| populate      | string       | Not Required. Populate Relational Data  |

### Get Single item  
`GET /api/v1/items/{id}`  

| Parameter | Type   | Description |
|-----------|--------|-------------|
| id        | string | **Required**. Id of item to fetch |
| select    | string | Not Required |
| populate  | string | Not Required |

### Update or Create New Item  
`PUT /api/v1/items/{id}`  

### Update Existing Item  
`PATCH /api/v1/items/{id}`  

### Delete Item  
`DELETE /api/v1/items/{id}`  

---

## API Swagger Documentation  
[Documentation Link](#)  

---

## Environment Variables  
To run this project, you will need to add the following environment variables to your `.env` file:

- `SERVER_PORT` – In which port your app will run on local machine  
- `SITE_URL` – Main Site URL like: `http://localhost:4000`  
- `API_BASE_URL` – API Base URL Like: `http://localhost:4000/api/v1`  
- `JWT_SECRET` – JWT Token Secret for creating access & refresh Token  
- `MONGOOSE_STRING` – MongoDB Connection String  
- `SMTP_USER` – SMTP Server User for sending mail  
- `SMTP_PASS` – SMTP Server Password  
- `SITE_MAIL` – From which Mail your app mail will send  
- `SITE_NAME` – Application Name  

---

## Run Locally  

Clone the project:

```bash
git clone https://github.com/devmunira/wallet_rest_api_v1.git


Go to the project directory:
cd my-project


Install dependencies:
npm install


Seed required role & permission based data. If you want to check forgot password route and get email verification mail to your inbox please set valid email address in src/dbSeeder/userSeeder.js file.

Setup TYPE and separate DB for production on .env file:
TYPE='production'
MONGOOSE_TEST_STRING='mongodb://127.0.0.1:27017/test'


Run seed:
npm run seed


Start the server:
npm run dev


//add test file added soon

Support

For support, email arifur.sew@gmail.com

Authors

@Arif-Devs



