# 🎓 Student Management System (Java + JDBC + PostgreSQL)

A **console-based Student Management System** developed using **Core Java, JDBC, and PostgreSQL**.  
This project helps beginners understand **real-world Java development**, database connectivity, and CRUD operations.

---

## 🚀 Features

- ➕ Add new student
- 📋 View all students
- ✏️ Update student details
- ❌ Delete student record
- 🔗 JDBC connection with PostgreSQL
- 📥 User input using Scanner
- 💾 Data stored permanently in database

---

## 🛠️ Technologies Used

- **Java 8**
- **JDBC 4.2**
- **PostgreSQL**
- **VS Code**
- **Git & GitHub**

---

---

## ⚙️ Database Setup (PostgreSQL)

```sql
CREATE DATABASE studentdb;

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    course VARCHAR(100)
);


## **1️⃣ Clone Repository**
git clone https://github.com/PawanParise/Student-Management-System-Java.git

## **2️⃣ Compile**
javac -cp ".;lib/postgresql-42.7.8.jar" StudentManagementSystem.java

##** 3️⃣ Run**
java -cp ".;lib/postgresql-42.7.8.jar" StudentManagementSystem

## **🖼️ Screenshots**
📌 Main Menu
📌 Insert Student

<img width="1451" height="752" alt="image" src="https://github.com/user-attachments/assets/3a41d138-4a74-4c89-b934-6b73e8d5146f" />

📌**Database View (pgAdmin)**

<img width="1916" height="1017" alt="image" src="https://github.com/user-attachments/assets/660acc3b-00b3-4558-976b-4f9ccc1cb4f6" />

## **🎯 Learning Outcomes**

1.Understanding JDBC architecture

2.Connecting Java with PostgreSQL

3.Using SQL inside Java

4.Writing clean and structured Java code

5.Real-world CRUD application

## **👨‍💻 Author**

Pawan Parise
🔗 GitHub: https://github.com/PawanParise

