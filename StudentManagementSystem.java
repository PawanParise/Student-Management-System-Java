import java.sql.*;
import java.util.Scanner;

public class StudentManagementSystem {

   
static final String URL  = "jdbc:postgresql://localhost:5433/studentdb";
static final String USER = "postgres";
static final String PASS = "your_pgadmin_password";

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {
            
            Connection con = DriverManager.getConnection(URL, USER, PASS);
            con.setAutoCommit(true);
            System.out.println("Connected to PostgreSQL");

            Statement check = con.createStatement();
            ResultSet rsDb = check.executeQuery("SELECT current_database()");
            rsDb.next();
            System.out.println("Connected DB: " + rsDb.getString(1));

            while (true) {
                System.out.println("\n--- Student Management System ---");
                System.out.println("1. Add Student");
                System.out.println("2. View Students");
                System.out.println("3. Exit");
                System.out.print("Enter choice: ");
                int choice = sc.nextInt();

                switch (choice) {

                    case 1:
                        System.out.print("Enter ID: ");
                        int id = sc.nextInt();
                        sc.nextLine();

                        System.out.print("Enter Name: ");
                        String name = sc.nextLine();

                        System.out.print("Enter Age: ");
                        int age = sc.nextInt();

                        PreparedStatement ps = con.prepareStatement(
                            "INSERT INTO students(id, name, age) VALUES (?, ?, ?)"
                        );
                        ps.setInt(1, id);
                        ps.setString(2, name);
                        ps.setInt(3, age);

                        int rows = ps.executeUpdate();
                        System.out.println("Rows inserted = " + rows);
                        System.out.println("Student added successfully");
                        break;

                    case 2:
                        Statement st = con.createStatement();
                        ResultSet rs = st.executeQuery("SELECT * FROM students");

                        System.out.println("\nID | Name | Age");
                        System.out.println("----------------");
                        while (rs.next()) {
                            System.out.println(
                                rs.getInt("id") + " | " +
                                rs.getString("name") + " | " +
                                rs.getInt("age")
                            );
                        }
                        break;

                    case 3:
                        con.close();
                        sc.close();
                        System.out.println("Program exited");
                        return;

                    default:
                        System.out.println("Invalid choice");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
