# 🎓 Student Management System

A comprehensive web-based Student Management System built using **HTML**, **CSS**, and **JavaScript**. Designed for schools and educational institutions to manage student records, monitor academic performance, and generate detailed reports—all without a backend.

---

## 🔐 Authentication System

- Secure login with `user=admin/password=admin123`
- Session persistence using `localStorage`
- Logout functionality with session reset

---

## 📊 Dashboard

- Displays:
  - Total number of students
  - Average score across all students
  - Top-performing student
- Subject-wise average performance chart (using Chart.js)

---

## 👨‍🎓 Student Management

- Add, edit, and delete student records
- Fields include:
  - Name, Roll Number, Class, Section, Date of Birth
  - Subject Choices: Science group, Language, Technical subject
- Search/filter students by name, class, or section
- Responsive data table view

---

## 🧾 Marks Management

- Record student marks for each term:
  - Term 1, Term 2, Term 3, Final
- Automatically shows relevant subjects based on choices
- Validates input (range 0–100)
- Data saved in `localStorage`

---

## 📈 Progress Tracking

- Visual charts using **Chart.js**:
  - Bar chart (Subject-wise)
  - Line chart (Term-wise)
- Filter by individual student or show all

---

## 🧾 Report Generation

- Generate downloadable PDF reports using **jsPDF**
- Includes:
  - Student information
  - Subject-wise marks for selected term
  - Total, percentage, grade
  - Summary and statistics
  - School header and footer for formal format

---

## 🛠️ Technologies Used

| Component      | Technology        |
|----------------|-------------------|
| Structure      | HTML5             |
| Styling        | CSS3, Bootstrap   |
| Functionality  | JavaScript        |
| Charts         | Chart.js          |
| PDF Export     | jsPDF             |
| Icons          | Font Awesome      |
| Data Storage   | localStorage      |

---

## 📱 Responsive Design

- Works on all devices:
  - ✅ Desktop
  - ✅ Tablet
  - ✅ Mobile(There are still some issues to be fixed.)

---

## 🔒 Security Features

- Input validation on all forms
- Confirmation dialogs before destructive actions
- localStorage-based session management

---

## 🔧 Extensibility

- Modular JS code
- Easy to integrate with backend or cloud storage in the future
- Flexible subject and grading structure

---

## 👨‍💻 Author

**Mark-Z**  
🔗 [GitHub Profile](https://github.com/NAYAN-MONI0110)

---

## 📄 License

This project is licensed under the **MIT License**.

---

> 📌 *This project is ideal for small schools, local offline deployments, or as a base template for a full-featured student ERP system.*


