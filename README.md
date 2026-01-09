# Student Management System (Java + JDBC + PostgreSQL)

This is a console-based Java project using JDBC and PostgreSQL.
It performs basic CRUD operations on student data.

## Technologies Used
- Java 8+
- PostgreSQL
- JDBC (PostgreSQL Driver)
- VS Code

## Features
- Add Student
- View Students
- Update Student
- Delete Student

## Database Setup
```sql
CREATE DATABASE studentdb;

CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT
);
##JDBC Configuration

Update your database details in the code:

jdbc:postgresql://localhost:5433/studentdb
username: postgres
password: your_password

##How to Run
javac -cp ".;lib/postgresql-42.7.8.jar" StudentManagementSystem.java
java -cp ".;lib/postgresql-42.7.8.jar" StudentManagementSystem

##Author
Pawan Parise