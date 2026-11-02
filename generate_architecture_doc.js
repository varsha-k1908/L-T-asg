import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  BorderStyle, 
  HeadingLevel, 
  ShadingType,
  Header,
  Footer,
  PageNumber
} from 'docx';
import fs from 'fs';
import path from 'path';

const FONT_FAMILY = 'Times New Roman';
const BODY_SIZE = 24; // 12pt (in half-points)
const H1_SIZE = 32;   // 16pt
const H2_SIZE = 28;   // 14pt
const H3_SIZE = 24;   // 12pt bold
const CODE_SIZE = 20; // 10pt

function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: 40, // 20pt
        bold: true,
        color: '1B365D'
      })
    ]
  });
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: 26, // 13pt
        italics: true,
        color: '4A5568'
      })
    ]
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: H1_SIZE,
        bold: true,
        color: '1B365D'
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: H2_SIZE,
        bold: true,
        color: '2D3748'
      })
    ]
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: H3_SIZE,
        bold: true,
        color: '2D3748'
      })
    ]
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 276 }, // 1.15 line spacing
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: BODY_SIZE,
        ...options
      })
    ]
  });
}

function createBullet(title, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60, line: 260 },
    children: [
      new TextRun({
        text: title ? title + ': ' : '',
        font: FONT_FAMILY,
        size: BODY_SIZE,
        bold: !!title,
        color: '1A202C'
      }),
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: BODY_SIZE,
        color: '2D3748'
      })
    ]
  });
}

function createCodeBlock(codeLines) {
  return codeLines.map((line) => new Paragraph({
    spacing: { before: 20, after: 20, line: 240 },
    shading: {
      type: ShadingType.SOLID,
      color: 'F7FAFC'
    },
    children: [
      new TextRun({
        text: line,
        font: 'Courier New',
        size: CODE_SIZE,
        color: '2D3748'
      })
    ]
  }));
}

function createStyledTable(headers, rows, colWidths) {
  const tableBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: 'CBD5E0'
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((headerText, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { type: ShadingType.SOLID, color: '1B365D' },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      borders: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: headerText,
              font: FONT_FAMILY,
              size: BODY_SIZE,
              bold: true,
              color: 'FFFFFF'
            })
          ]
        })
      ]
    }))
  });

  const dataRows = rows.map((rowData, rowIndex) => new TableRow({
    children: rowData.map((cellText, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: {
        type: ShadingType.SOLID,
        color: rowIndex % 2 === 0 ? 'FFFFFF' : 'F7FAFC'
      },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      borders: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: cellText,
              font: FONT_FAMILY,
              size: BODY_SIZE,
              color: '2D3748'
            })
          ]
        })
      ]
    }))
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA }, // Full 6.5 inch printable width
    rows: [headerRow, ...dataRows]
  });
}

async function buildDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: BODY_SIZE,
            color: '2D3748'
          },
          paragraph: {
            spacing: { line: 276, after: 120 }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
              right: 1440   // 1 inch
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'L&T EduTech Activity - Student Registration and Management System',
                    font: FONT_FAMILY,
                    size: 18,
                    italics: true,
                    color: '718096'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Software Architecture Document | Page ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: '718096'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 18,
                    color: '718096'
                  }),
                  new TextRun({
                    text: ' | Sensitivity: LNT Construction Internal Use',
                    font: FONT_FAMILY,
                    size: 18,
                    color: '718096'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Title Section
          createTitle('Student Registration and Management System'),
          createSubtitle('System Architecture Specification & Technical Design Document\nBased on L&T EduTech Activity Guidelines'),

          // Document Metadata Table
          createStyledTable(
            ['Document Attribute', 'Specification Details'],
            [
              ['Project Title', 'Student Registration and Management System'],
              ['Organization / Course', 'L&T EduTech - Activity Exercise'],
              ['Architectural Style', '3-Tier Classical Model-View-Controller (MVC) Pattern'],
              ['Primary Technologies', 'Java Servlets, JDBC, MySQL, HTML5/CSS3, Apache Tomcat'],
              ['Database Name', 'student_management'],
              ['Main Entity', 'students (student_id, full_name, email, phone, department, semester, admission_date)'],
              ['Document Font Specification', 'Times New Roman, Regular 12 pt (Headings: 14–20 pt Bold)']
            ],
            [3000, 6360]
          ),

          new Paragraph({ spacing: { before: 240 } }),

          // 1. Introduction
          createHeading1('1. Introduction & Executive Overview'),
          createParagraph('The Student Registration and Management System is an enterprise-grade Java web application designed to enable educational institutions to seamlessly register students, store their academic profiles, search and view student records, update demographic/academic information, and securely remove obsolete records.'),
          createParagraph('The application is developed primarily using the Java Servlet technology stack. Java Servlets act as the server-side request orchestrators, processing incoming HTTP requests submitted through semantic HTML5 forms, establishing transactional database connectivity to a MySQL relational database via the Java Database Connectivity (JDBC) API with PreparedStatements, and dynamically generating HTML/JSON responses back to the client browser.'),

          // 2. Objectives
          createHeading1('2. System Objectives'),
          createParagraph('The primary educational and technical objectives of this system architecture include:'),
          createBullet('Automate Registration & Maintenance', 'Replace traditional paper-based workflows with a centralized digital registration ledger.'),
          createBullet('Eliminate Data Duplication', 'Enforce strict schema constraints including unique email indexing and auto-incrementing student keys to avoid duplicate candidate records.'),
          createBullet('Efficient Search & Retrieval', 'Provide low-latency searching across student identity attributes (Student ID and Student Full Name).'),
          createBullet('Servlet Lifecycle Demonstration', 'Formally demonstrate the complete Servlet lifecycle including initialization (init), request dispatching (service, doGet, doPost), and resource release (destroy).'),
          createBullet('Robust CRUD via JDBC', 'Implement the complete spectrum of Create, Read, Update, and Delete operations with parameterized SQL queries to prevent SQL injection vulnerabilities.'),

          // 3. System Features
          createHeading1('3. Core Functional Features'),
          createParagraph('The system architecture accommodates eight fundamental functional requirements:'),
          createBullet('New Student Registration', 'Captures student full name, email, contact phone, academic department, semester, and admission date via validated forms.'),
          createBullet('Display All Registered Students', 'Generates a tabular inventory displaying comprehensive profile data for all active enrollments.'),
          createBullet('Search by ID or Name', 'Filters the database dynamically by exact student ID or case-insensitive pattern matching on full name.'),
          createBullet('Update Student Details', 'Pre-populates an update form with existing records and executes transactional SQL UPDATE statements.'),
          createBullet('Delete Student Records', 'Removes obsolete records by student ID with integrity verification.'),
          createBullet('Form Input Validation', 'Performs client-side and server-side validation for required fields, email formatting, phone numbers, and semester ranges.'),
          createBullet('Success & Error Messaging', 'Renders contextual feedback alerts for registration confirmations, uniqueness violations, and not-found states.'),
          createBullet('Database Exception Handling', 'Gracefully catches SQLExceptions, ClassNotFoundExceptions, and network timeouts, returning meaningful diagnostic user alerts.'),

          // 4. Technology Stack
          createHeading1('4. Technology Stack Specification'),
          createParagraph('The system is structured across four distinct architectural layers:'),
          createStyledTable(
            ['Architectural Layer', 'Technology', 'Role & Responsibility'],
            [
              ['Presentation Layer', 'HTML5, CSS3', 'Semantic web forms (register.html, search.html, index.html) with responsive CSS styling.'],
              ['Controller / Backend', 'Java Servlets (Servlet 3.0+ / Jakarta)', 'HTTP request processing, session management, parameter validation, and view rendering.'],
              ['Data Access Layer', 'JDBC (DriverManager / PreparedStatement)', 'Database driver loading, connection pooling, prepared SQL statement execution.'],
              ['Database Layer', 'MySQL RDBMS', 'ACID-compliant relational database management system hosting the student_management schema.'],
              ['Web & Servlet Container', 'Apache Tomcat 9.x / 10.x', 'Hosts servlet execution context, maps URL endpoints via web.xml, and manages HTTP threads.'],
              ['Build & Dependency Tool', 'Apache Maven (pom.xml)', 'Automates dependency resolution for mysql-connector-j and servlet-api artifacts.']
            ],
            [2200, 2600, 4560]
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // 5. System Architecture
          createHeading1('5. Multi-Tier Architectural Design'),
          createParagraph('The application strictly adheres to the Classical 3-Tier Enterprise Web Architecture, segregating concerns across the Client Tier, Application/Servlet Tier, and Data Tier:'),

          createHeading2('5.1 Architectural Tiers Breakdown'),
          createBullet('Tier 1: Presentation Tier (Client Browser)', 'The user interacts with standardized web forms created with HTML5 and CSS3. Requests are dispatched as HTTP GET or POST methods targeting mapped servlet endpoints.'),
          createBullet('Tier 2: Business Logic / Application Tier (Apache Tomcat & Servlets)', 'Servlets (RegisterServlet, ListStudentsServlet, UpdateStudentServlet, DeleteStudentServlet) intercept requests, validate parameter payloads, encapsulate business rules, and interface with DBConnection.'),
          createBullet('Tier 3: Persistence / Data Tier (MySQL Database)', 'MySQL persists the physical table structures. JDBC PreparedStatements execute deterministic queries with parameter binding to guarantee execution security.'),

          createHeading2('5.2 Architecture Component Diagram'),
          createParagraph('The following architectural flow illustrates the interaction cycle between components:'),
          ...createCodeBlock([
            '+-----------------------------------------------------------------------------+',
            '|                             CLIENT TIER (BROWSER)                           |',
            '|   index.html  |  register.html  |  search.html  |  css/style.css            |',
            '+-----------------------------------------------------------------------------+',
            '              |                                         ^                      ',
            '      HTTP GET/POST Request                     HTTP HTML/JSON Response       ',
            '              v                                         |                      ',
            '+-----------------------------------------------------------------------------+',
            '|                     APPLICATION TIER (APACHE TOMCAT CONTAINER)              |',
            '|                                                                             |',
            '|   [ Deployment Descriptor: WEB-INF/web.xml (Servlet URL Mappings) ]         |',
            '|                                                                             |',
            '|   +---------------------+  +---------------------+  +-------------------+   |',
            '|   |   RegisterServlet   |  | ListStudentsServlet |  |UpdateStudentServlet|  |',
            '|   +---------------------+  +---------------------+  +-------------------+   |',
            '|              |                        |                        |            |',
            '|              +------------------------+------------------------+            |',
            '|                                       v                                     |',
            '|                       +-------------------------------+                     |',
            '|                       |  DeleteStudentServlet.java    |                     |',
            '|                       +-------------------------------+                     |',
            '|                                       v                                     |',
            '|                       +-------------------------------+                     |',
            '|                       |   DBConnection.java (JDBC)    |                     |',
            '|                       |   DriverManager.getConnection |                     |',
            '|                       +-------------------------------+                     |',
            '+-----------------------------------------------------------------------------+',
            '                                       |                                       ',
            '                              JDBC PreparedStatements                         ',
            '                                       v                                       ',
            '+-----------------------------------------------------------------------------+',
            '|                           DATABASE TIER (MYSQL RDBMS)                       |',
            '|                                                                             |',
            '|   Database: student_management                                              |',
            '|   Table:    students (student_id, full_name, email, phone, department, ...) |',
            '+-----------------------------------------------------------------------------+'
          ]),

          new Paragraph({ spacing: { before: 200 } }),

          // 6. Project Directory Structure
          createHeading1('6. Project Directory & Package Structure'),
          createParagraph('In accordance with the L&T EduTech Materials for Activity, the project is organized under a standard Maven-compliant directory tree:'),
          ...createCodeBlock([
            'StudentManagement/',
            '├── pom.xml                                   <- Maven project model & dependencies',
            '├── src/',
            '│   ├── main/',
            '│   │   ├── java/',
            '│   │   │   └── com/',
            '│   │   │       └── student/',
            '│   │   │           ├── RegisterServlet.java      <- Processes student registrations',
            '│   │   │           ├── ListStudentsServlet.java  <- Displays all registered students',
            '│   │   │           ├── UpdateStudentServlet.java <- Modifies student information',
            '│   │   │           ├── DeleteStudentServlet.java <- Removes obsolete student records',
            '│   │   │           └── DBConnection.java         <- Central JDBC connection utility',
            '│   │   └── webapp/',
            '│   │       ├── index.html                    <- Home portal and navigation menu',
            '│   │       ├── register.html                 <- Student registration form',
            '│   │       ├── search.html                   <- Search interface by ID or Name',
            '│   │       ├── css/',
            '│   │       │   └── style.css                 <- Application visual stylesheets',
            '│   │       └── WEB-INF/',
            '│   │           └── web.xml                   <- Servlet mapping & deployment descriptor'
          ]),

          new Paragraph({ spacing: { before: 200 } }),

          // 7. Database Design & Table Specification
          createHeading1('7. Database Architecture & Table Specification'),
          createParagraph('The database architecture centers around the student_management relational schema, having the principal entity students to store verified personal and academic attributes.'),
          
          createHeading2('7.1 Schema Entity Specification: students Table'),
          createStyledTable(
            ['Column Name', 'Data Type', 'Constraints & Indexing', 'Functional Purpose'],
            [
              ['student_id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique institutional student identification number.'],
              ['full_name', 'VARCHAR(100)', 'NOT NULL', 'Legal full name of the student.'],
              ['email', 'VARCHAR(120)', 'UNIQUE, NOT NULL', 'Official institutional email address; prevents duplicates.'],
              ['phone', 'VARCHAR(15)', 'NULL ALLOWED', 'Contact and emergency mobile number.'],
              ['department', 'VARCHAR(80)', 'NOT NULL', 'Academic branch / degree department (e.g., Computer Science).'],
              ['semester', 'INT', 'NOT NULL', 'Current academic semester (e.g., 1 through 8).'],
              ['admission_date', 'DATE', 'NOT NULL', 'Official calendar date of student admission.']
            ],
            [1800, 1600, 2600, 3360]
          ),

          createHeading2('7.2 SQL DDL Scripts (Database Creation)'),
          createParagraph('The corresponding standardized SQL scripts execute the creation of the database and entity table:'),
          ...createCodeBlock([
            '-- 1. Create and select Database',
            'CREATE DATABASE IF NOT EXISTS student_management;',
            'USE student_management;',
            '',
            '-- 2. Create the students table with full constraints',
            'CREATE TABLE IF NOT EXISTS students (',
            '    student_id INT PRIMARY KEY AUTO_INCREMENT,',
            '    full_name VARCHAR(100) NOT NULL,',
            '    email VARCHAR(120) NOT NULL UNIQUE,',
            '    phone VARCHAR(15),',
            '    department VARCHAR(80) NOT NULL,',
            '    semester INT NOT NULL,',
            '    admission_date DATE NOT NULL',
            ');',
            '',
            '-- 3. Verification Sample Record Insertion',
            'INSERT INTO students (full_name, email, phone, department, semester, admission_date) VALUES',
            "('Alex Rivera', 'alex.rivera@university.edu', '+1-555-019283', 'Computer Science', 5, '2024-08-15'),",
            "('Sophia Chen', 'sophia.chen@university.edu', '+1-555-048771', 'Data Science', 3, '2025-01-10');"
          ]),

          new Paragraph({ spacing: { before: 200 } }),

          // 8. Working Procedure & Lifecycle Flow
          createHeading1('8. Operational Working Procedure & Request Flow'),
          createParagraph('The system coordinates end-to-end user interactions through a well-defined 6-step working procedure:'),
          createBullet('Step 1: Form Presentation', 'The end user accesses the student registration interface (register.html) served statically by Tomcat.'),
          createBullet('Step 2: Submission to Controller', 'Upon filling out the form, the browser issues an HTTP POST request targeting the RegisterServlet mapping.'),
          createBullet('Step 3: Parameter Parsing & Validation', 'RegisterServlet reads form fields via req.getParameter(), trims whitespace, parses numeric and date fields, and validates required presence.'),
          createBullet('Step 4: JDBC Prepared Statement Execution', 'RegisterServlet obtains a live java.sql.Connection from DBConnection.java and executes a parameterized INSERT statement with bound variables.'),
          createBullet('Step 5: Registration Confirmation', 'The servlet writes a response back to the client displaying a success notification, generated Student ID, or duplicate email rejection.'),
          createBullet('Step 6: Lifecycle CRUD Operations', 'ListStudentsServlet, UpdateStudentServlet, and DeleteStudentServlet handle subsequent querying, modification, and deletion through equivalent prepared queries.'),

          // 9. Component Details
          createHeading1('9. Detailed Component Responsibilities'),
          createHeading2('9.1 DBConnection.java (Connection Utility)'),
          createParagraph('Centralizes the JDBC driver registration (com.mysql.cj.jdbc.Driver) and manages DriverManager.getConnection(url, user, password) calls. Protects against resource leaks by providing clean closing methods for Connection, Statement, and ResultSet.'),

          createHeading2('9.2 RegisterServlet.java (Create)'),
          createParagraph('Handles doPost() for new candidate entry. Employs INSERT INTO students (...) VALUES (?, ?, ?, ?, ?, ?) to guarantee safe execution.'),

          createHeading2('9.3 ListStudentsServlet.java (Read & Search)'),
          createParagraph('Handles doGet() to fetch all student tuples or filtered subsets when query parameters (id or name) are present, rendering a structured HTML response.'),

          createHeading2('9.4 UpdateStudentServlet.java (Update)'),
          createParagraph('Handles pre-populating existing student data upon GET, and executes UPDATE students SET ... WHERE student_id = ? upon POST.'),

          createHeading2('9.5 DeleteStudentServlet.java (Delete)'),
          createParagraph('Handles DELETE/POST requests to remove a student by their unique student_id using DELETE FROM students WHERE student_id = ?.'),

          // 10. Expected Outcome & Verification
          createHeading1('10. Expected Outcomes & Quality Attributes'),
          createBullet('Centralized Data Management', 'The institution maintains a consistent, single source of truth for all student demographic and academic profiles.'),
          createBullet('Servlet Lifecycle Compliance', 'Exemplifies production-grade servlet dispatching, session scoping, and multi-threaded request processing under Apache Tomcat.'),
          createBullet('Robust Security', 'Parameterized SQL queries eliminate injection attacks; uniqueness keys avoid duplicate records.'),
          createBullet('Maintainable Architecture', 'Strict separation between frontend HTML assets, Java backend controllers, and MySQL schema tables permits straightforward future migration to modern frameworks (such as React and Node.js REST APIs).')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('public', 'Student_Registration_and_Management_System_Architecture_Document.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document generated successfully at: ${outputPath} (${buffer.length} bytes)`);
}

buildDocx().catch((err) => {
  console.error('Failed to generate docx:', err);
  process.exit(1);
});
