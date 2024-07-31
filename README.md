# Placement Portal

## Project Overview

The Placement Portal is a web-based application designed to manage all placement-related activities within a college. It provides functionalities for three types of users: Admin, Placement Officer, and Students. The portal includes features like creating and managing placement drives, adding students, shortlisting candidates, and more. It is built using Node.js and MySQL, following the Model-View (MV) architecture.

## Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Functionality Overview](#functionality-overview)
  - [Admin](#admin)
  - [Placement Officer](#placement-officer)
  - [Student](#student)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)

## Setup and Installation

### Prerequisites

- Node.js (v14.x or higher)
- MySQL

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/placement-portal.git
   cd placement-portal
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MAIL_USER=your_email@example.com
   MAIL_PASS=your_email_password
   ```

4. **Database Setup**

   - Import the provided SQL dump file (`placement_portal.sql`) into your MySQL database to set up the initial schema.

     ```bash
     mysql -u your_username -p your_database < database_dump.sql
     ```

   - Manually add an admin user to the `users` table:

     ```sql
     INSERT INTO users (username, password, role) VALUES ('admin', 'admin_password', 'admin');
     ```

     Make sure to replace `'admin_password'` with a secure password.

## Running the Project

1. **Start the Server**

   ```bash
   node app.js
   ```

2. **Access the Application**

   Open your web browser and go to `http://localhost:3000`.

## Project Structure

- `app.js`: Main application file.
- `routes/`: Contains route definitions for different user roles.
- `controllers/`: Contains logic for handling requests.
- `models/`: Contains database models and schemas.
- `views/`: Contains EJS templates for rendering web pages.
- `public/`: Contains static assets like CSS, JS, and images.

## Functionality Overview

### Admin

- **Dashboard**: View and manage placement officers.
- **Add Placement Officer**: Add new placement officers to the system.
- **View Placement Officer**: View the list of current placement officers.

### Placement Officer

- **Dashboard**: Manage placement drives and students.
- **Add Students**: Add students to the system, either individually or via a file upload.
- **Create Drive**: Create and manage placement drives with details like company name, eligibility criteria, etc.
- **Manage Drives**: View and manage existing drives, including shortlisting students and declaring results.
- **Program & Stream Planning**: Add and manage programs and streams.
- **Edit Student Details**: Edit details of students.

### Student

- **Dashboard**: View upcoming and applied drives.
- **Apply for Drive**: Apply for placement drives.
- **View Results**: View the status of applications and results of rounds.

## Environment Variables

The project requires the following environment variables:

- `MAIL_USER`: Email address used for sending notifications.
- `MAIL_PASS`: Password for the email account.

Create a `.env` file in the root directory of your project and add these variables.

## Database Schema

The database schema includes the following tables:

- `applications`: Stores student applications to drives.
- `drives`: Stores information about placement drives.
- `drive_for`: Stores information about which program and stream each drive is for.
- `placed`: Stores information about students placed in drives.
- `placement_officers`: Stores placement officer details.
- `programs`: Stores information about different programs (e.g., B.Tech, MCA).
- `rounds`: Stores information about each round in a placement drive.
- `selected`: Stores information about students selected in each round.
- `streams`: Stores information about different streams (e.g., CSE, ECE).
- `students`: Stores student details.
- `users`: Stores user credentials and roles.

To set up the database, use the provided SQL dump file `placement_portal.sql`.
