-- ===================================================================
-- AI-POWERED SMART STUDENT MANAGEMENT SYSTEM
-- Database Schema: MySQL 8.0+
-- ===================================================================

CREATE DATABASE IF NOT EXISTS student_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management_db;

-- 1. USERS TABLE (Authentication & Role-Based Access)
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS semesters;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    department_code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dept_code (department_code)
) ENGINE=InnoDB;

-- 3. COURSES TABLE
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    total_credits INT DEFAULT 160,
    total_semesters INT DEFAULT 8,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_course_dept (department_id)
) ENGINE=InnoDB;

-- 4. TEACHERS TABLE
CREATE TABLE teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    department_id BIGINT NOT NULL,
    designation VARCHAR(100),
    qualification VARCHAR(100),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_teacher_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_teacher_dept (department_id)
) ENGINE=InnoDB;

-- 5. STUDENTS TABLE
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    gender VARCHAR(20) NOT NULL, -- Male, Female, Other
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    department_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    academic_year INT NOT NULL, -- e.g. 2022, 2023, 2024, 2025
    semester INT NOT NULL DEFAULT 1, -- 1 to 8
    admission_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED, GRADUATED
    attendance_percentage DOUBLE DEFAULT 0.0,
    average_marks DOUBLE DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_student_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE RESTRICT,
    INDEX idx_student_roll (roll_number),
    INDEX idx_student_name (full_name),
    INDEX idx_student_email (email),
    INDEX idx_student_dept (department_id),
    INDEX idx_student_year (academic_year),
    INDEX idx_student_semester (semester),
    INDEX idx_student_status (status)
) ENGINE=InnoDB;

-- 6. SEMESTERS TABLE
CREATE TABLE semesters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    semester_number INT NOT NULL,
    semester_name VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL,
    UNIQUE KEY uq_sem_year (semester_number, academic_year)
) ENGINE=InnoDB;

-- 7. SUBJECTS TABLE
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    max_marks INT NOT NULL DEFAULT 100,
    CONSTRAINT fk_subject_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_subject_dept (department_id),
    INDEX idx_subject_sem (semester)
) ENGINE=InnoDB;

-- 8. ATTENDANCE TABLE
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, LATE, EXCUSED
    remarks VARCHAR(255),
    marked_by_teacher_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_teacher FOREIGN KEY (marked_by_teacher_id) 
        REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY uq_student_date (student_id, attendance_date),
    INDEX idx_att_date (attendance_date),
    INDEX idx_att_status (status)
) ENGINE=InnoDB;

-- 9. MARKS TABLE
CREATE TABLE marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    semester INT NOT NULL,
    marks_obtained DOUBLE NOT NULL,
    max_marks DOUBLE NOT NULL DEFAULT 100.0,
    grade VARCHAR(10) NOT NULL,
    exam_type VARCHAR(50) DEFAULT 'FINAL', -- INTERNAL, MIDTERM, FINAL
    exam_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_marks_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_student_subject_exam (student_id, subject_id, semester, exam_type),
    INDEX idx_marks_student (student_id),
    INDEX idx_marks_grade (grade)
) ENGINE=InnoDB;
