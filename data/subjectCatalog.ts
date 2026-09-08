// Auto-generated Comprehensive Subject Catalog & Curriculum Info
// Includes both Current Year (2026 Batch) & Previous Year (Reappear / 25261)

export interface SubjectCurriculumRecord {
  code: string;
  name: string;
  fullTitle: string;
  semester: string;
  termType: 'current' | 'reappear';
  termId: string;
  category: string;
  categoryDetail: string;
  credits: number;
  l: number;
  t: number;
  p: number;
  syllabusPdf: string | null;
  courseDescription: string;
  gradingScheme: Record<string, string> | null;
  continuousAssessment: {
    componentCount: number;
    evaluationRule: string;
    components: Array<{
      name: string;
      timing: string;
      weightage: string;
      syllabus: string;
      format: string;
    }>;
  } | null;
  examPatterns: {
    midTerm: { title: string; description: string; weightage: string; type: string } | null;
    endTerm: { title: string; description: string; weightage: string; type: string } | null;
  } | null;
  totalUnits: number;
  units: Array<{ unitNumber: number; unit: string; title: string; }>;
}

export const ALL_SUBJECTS_CATALOG: Record<string, { current: SubjectCurriculumRecord | null; reappear: SubjectCurriculumRecord | null }> = {
  "cse111": {
    "current": {
      "code": "CSE111",
      "name": "Orientation To Computing",
      "fullTitle": "CSE111 — Orientation To Computing",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course introduces computational thinking, computing environments, software development practices, version control, cybersecurity, artificial intelligence and emerging technologies. It also supports career planning, professional portfolio development and participation in academic enrichment opportunities.",
      "gradingScheme": {
        "attendance": "30",
        "continuous_assessment": "70",
        "mid_term_examination": "NA",
        "end_term": "NA"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Computer Fundamentals"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Computer Hardware"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Number Systems"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Version Control"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Modern AI Trends and Tools"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    },
    "reappear": {
      "code": "CSE111",
      "name": "Orientation To Computing-I",
      "fullTitle": "CSE111 — Orientation To Computing-I",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on skill development and employability by introducing the functional components of computer systems, operating systems like Linux, and networking basics. It also emphasizes the utilization of professional tools such as Git, GitHub, and AI platforms to enhance technical skills and digital practices.",
      "gradingScheme": {
        "attendance": "20",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "30"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Operating System"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linux Operating System"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Cohorts and Skill Sets"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Computer Network and Communication"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Version Control"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse326": {
    "current": {
      "code": "CSE326",
      "name": "Internet Programming",
      "fullTitle": "CSE326 — Internet Programming",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 2,
      "l": 1,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Internet Programming covers HTML5, semantic HTML and forms, CSS-based responsive design, JavaScript, DOM manipulation, browser APIs, debugging, and deployment using GitHub Pages.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 10",
            "weightage": "50%",
            "syllabus": "Students will work in groups of three to develop a web application using HTML Fundamentals, Semantic HTML and Forms, Cascading Style Sheets (CSS), JavaScript Fundamentals, Interactive Web Development, and Web Application Development & Deployment. The project should demonstrate responsive web design, form validation, JavaScript programming, DOM manipulation, event handling, browser APIs, debugging techniques, code organization, and deployment using GitHub Pages.",
            "format": "Rubric To assess students' ability to collaboratively design, develop, and deploy a responsive and interactive web application by applying the concepts learned throughout the course."
          },
          {
            "name": "Test",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "The assessment will consist of multiple-choice questions covering HTML Fundamentals, Semantic HTML and Forms, and Cascading Style Sheets (CSS). Questions will assess conceptual understanding, syntax knowledge, identification of correct code snippets, and application of HTML, semantic HTML, forms, and CSS concepts.",
            "format": "Rubric To evaluate students' understanding of HTML fundamentals, semantic HTML, forms, and CSS concepts through objective-type questions."
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Students are required to demonstrate their understanding of JavaScript fundamentals, functions, arrays, objects, higher-order functions, DOM manipulation, event handling, form validation, regular expressions, browser storage, browser APIs, error handling, debugging techniques, code organization, and web application deployment by completing a practical implementation on their own devices (BYOD). The assessment will also include a written examination to evaluate conceptual knowledge and coding proficiency, followed by a viva voce to assess students' understanding of the implemented solution, programming logic, and related concepts.",
            "format": "Rubric To evaluate students' understanding and application of JavaScript programming, interactive web development, DOM manipulation, event handling, browser APIs, debugging techniques, client-side applicatio"
          },
          {
            "name": "Test",
            "timing": "Wk",
            "weightage": "50%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Semantic HTML and Forms"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Cascading Style Sheets"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "JavaScript Fundamentals"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Interactive Web Development"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Web Application Development and Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CSE326",
      "name": "Internet Programming Laboratory",
      "fullTitle": "CSE326 — Internet Programming Laboratory",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 2,
      "l": 0,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on internet programming techniques including HTML5 for structure, CSS for responsive design and layout, and JavaScript for client-side logic and DOM manipulation.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Expanding HTML Knowledge"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Introduction to Cascading Style Sheets"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "JavaScript Application Development"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "JavaScript Functions, Events and Validation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Javascript DOM"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int108": {
    "current": {
      "code": "INT108",
      "name": "Python Programming",
      "fullTitle": "INT108 — Python Programming",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces Python programming fundamentals and covers conditional and iterative statements, functions and recursion, core data structures, object-oriented programming, file handling, exceptions, and regular expressions.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "NA",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 2 / 14",
            "weightage": "30%",
            "syllabus": "Students will complete approximately 254 coding problems, including static questions, and 70 MCQs on a selected third-party platform, with questions distributed across the complete syllabus. Eligible marks out of 15 are prorated according to the percentage of total questions correctly solved and further prorated using the percentage scored in the proctored Coding Contests (CAs).",
            "format": "Rubric Students must solve at least 50% of the coding problems and at least 50% of the MCQs to be eligible. Both conditions are mandatory. Eligible marks are calculated from the percentage of total coding problems and MCQs correctly solved and then prorated according to performance in the proctored Coding Contests."
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 5 / 6",
            "weightage": "40%",
            "syllabus": "The test will be of 45 minutes duration and will be conducted in offline mode.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 9 / 10",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 marks) and Coding Problems (20 marks).",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test - Code based 3",
            "timing": "Wk 12 / 13",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 marks) and Coding Problems (20 marks).",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Conditional and Iterative Statements"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "String, Lists, Tuples and Dictionaries"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Functions and recursion"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Classes and objects; Object oriented programming terminology"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Files and Exceptions; Regular Expressions"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT108",
      "name": "Python Programming",
      "fullTitle": "INT108 — Python Programming",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development through Python programming. It covers the installation of the Python environment, conditional and iterative statements, functions, core data structures like lists, dictionaries, tuples and sets, object-oriented programming, and file handling operations.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Conditional statements; Iterative statements"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Functions and Recursion"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "String; Lists; Tuples and Dictionaries"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Classes and objects; Object oriented programming terminology"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Files and Exceptions; Regular Expressions"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "mth165": {
    "current": {
      "code": "MTH165",
      "name": "Mathematics For Engineers",
      "fullTitle": "MTH165 — Mathematics For Engineers",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course develops engineering mathematics skills in matrix methods and linear systems, differential and integral calculus, multivariable differentiation and integration, optimization, and Fourier series. Students apply these methods to solve mathematical and engineering problems involving systems of equations, derivatives, integrals, area, volume, and periodic functions.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Review of matrices, elementary matrix operations, rank, linear dependence and independence of vectors, linear systems, inverse matrices, eigenvalues and eigenvectors, Cayley-Hamilton theorem, differentiation of standard, parametric and implicit functions, logarithmic and higher-order differentiation, Rolleâs and mean value theorems, Taylor and Maclaurin theorems, L'Hospital's rule, and maxima and minima.",
            "format": "Rubric To analyze the understanding of the concepts of the students related to linear algebra and basic calculus"
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Limits and continuity, partial derivatives and total derivative, chain rule, Euler's theorem for homogeneous functions, maxima and minima for a function of two variables, and Lagrange method of multiplier.",
            "format": "Rubric Develop students' understanding of multivariable calculus and problem-solving skills for engineering and real-world applications."
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2",
            "format": "Rubric To test the subjective knowledge of the students and provide the opportunity to improve their CA performance in case of low marks or any missed CA"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Differential calculus and its applications"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Fundamentals of integral calculus"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Multivariate differentiation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Multivariable integration and applications"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to Fourier series"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "MTH165",
      "name": "Mathematics For Engineers",
      "fullTitle": "MTH165 — Mathematics For Engineers",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development, enabling students to apply concepts of matrices, calculus of one variable, multi-variable differential and integral calculus, and Fourier series to engineering problems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Differential and Integral Calculus"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Application of Derivatives"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Multivariate functions"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Multiple Integrals"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Fourier Series"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "mth174": {
    "current": {
      "code": "MTH174",
      "name": "Engineering Mathematics",
      "fullTitle": "MTH174 — Engineering Mathematics",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers matrix algebra, linear differential equations, Fourier series, multivariate calculus, and integral calculus. It develops students' ability to solve systems of linear equations, differential equations, and problems involving multi-variable derivatives, surface integrals, and volume integrals.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "elementary operations and their use in getting the rank, inverse of a matrix and solution of linear simultaneous equations, Eigen-values and Eigenvectors of a matrix, Cayley-Hamilton theorem, introduction to linear differential equation, solution of linear differential equation, linear dependence and linear independence of solution, method of solution of linear differential equation differential operator, solution of second order homogeneous linear differential equation with constant coefficient, solution of higher order homogeneous linear differential equations with constant coefficients, solution of non-homogeneous linear differential equations with constant coefficients using operator method.",
            "format": "Rubric To evaluate the conceptual clarity of the students in Matrix Algebra and Linear Differential Equations using a subjective test of 30 marks."
          },
          {
            "name": "Test 2",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "introduction and Euler's formulae, conditions for a Fourier expansion and functions having points of discontinuity, change of interval, even and odd functions, half range series",
            "format": "Rubric To evaluate the conceptual clarity of the students about Unit IV using subjective test of 30 marks."
          },
          {
            "name": "Test 3",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "Subjective questions can be asked from the syllabus of CA1 and CA2.",
            "format": "Rubric It is intended for students who missed either CA-I or CA-II, or for those who wish to improve their performance in either component."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Linear differential equation-I"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linear differential equation-II"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Fourier Series"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Multivariate Calculus"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Integral Calculus"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "MTH174",
      "name": "Engineering Mathematics",
      "fullTitle": "MTH174 — Engineering Mathematics",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers fundamental concepts of matrices, linear differential equations, Fourier series, and multi-variable calculus to solve problems in sciences and engineering.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Linear differential equation-I"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linear differential equation-II"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Fourier Series"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Multivariate Calculus"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Integral Calculus"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "che110": {
    "current": {
      "code": "CHE110",
      "name": "Environmental Studies",
      "fullTitle": "CHE110 — Environmental Studies",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "40",
        "mid_term_examination": "20",
        "end_term": "35"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Field / industrial visit based",
            "timing": "Wk 2 / 10",
            "weightage": "50%",
            "syllabus": "A group-based activity where every group has to make an AI based product on a given topic of environmental relevance and then promote it on social media platforms in order to generate environmental awareness.",
            "format": "Rubric Total – 100 Quality of the product – 20 Social media coverage – 30 Written report - 50"
          },
          {
            "name": "Test",
            "timing": "Wk 10 / 12",
            "weightage": "50%",
            "syllabus": "Total-30 MCQs from Unit-I to Unit-VI. Five questions from each Unit. Each question will carry one mark.",
            "format": "Rubric Each question will carry one mark."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "35%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Natural resources and ecosystem"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Biodiversity and Conservation"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Environmental Pollution"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Disaster Management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Human communities and environment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CHE110",
      "name": "Environmental Studies",
      "fullTitle": "CHE110 — Environmental Studies",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development, enabling students to define current environmental issues, explain ecosystem components, and determine the role of environmental policies and practices to reduce pollution.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "40",
        "mid_term_examination": "20",
        "end_term": "35"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Natural resources and ecosystem"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Biodiversity and Conservation"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Environmental Pollution"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Disaster Management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Human communities and environment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "ece120": {
    "current": {
      "code": "ECE120",
      "name": "Basic Electronics Engineering Workshop",
      "fullTitle": "ECE120 — Basic Electronics Engineering Workshop",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 1,
      "l": 0,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This practical workshop develops skills in assembling electronic circuits, measuring electrical quantities, validating analogue and digital IC functionality, designing combinational logic circuits, and building sensor-based microcontroller applications. Students also undertake project planning, reporting, presentation, and collaborative execution.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Performance/Job Evaluation/Execution",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Practical-1 to Practical-4 will be evaluated in Week-5. Each student will be given one practical to write and perform. Performance: 50 marks, Viva: 30 marks, Write up: 20 marks.",
            "format": "Rubric Evaluate the understanding level of the students in practical-1 to practical-4. A detailed evaluation rubric is mentioned on the introductory pages of the lab report."
          },
          {
            "name": "Planning Project-Report and Presentation",
            "timing": "Wk 9 / 14",
            "weightage": "50%",
            "syllabus": "Students complete a project report and presentation, including presentation of the project, project methodology, and individual contribution as an individual and as a member of a team.",
            "format": "Rubric Evaluate the understanding level of the students in the project and their respective contributions in the completion of the project as an individual and as a member of a team. Presentation skills: 33 marks; Methodology of the Project: 33 marks; Individual contribution: 34 marks. A detailed evaluation rubric is mentioned on the introductory pages of the lab report."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Divider Quest"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Diode Voltage Quest"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Universal Gate Adventure"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Adder Chronicles"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Intelligent Systems"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int335": {
    "current": {
      "code": "INT335",
      "name": "Design Thinking",
      "fullTitle": "INT335 — Design Thinking",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers human-centered design frameworks, user research, problem identification, ideation, prototyping, validation, customer journey analysis, and iterative product redesign. Students apply design thinking methods to develop, evaluate, and present user-centered solutions.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 2 / 6",
            "weightage": "50%",
            "syllabus": "MCQ based",
            "format": "Rubric To assess students' understanding of fundamental concepts, definitions, principles, and factual knowledge."
          },
          {
            "name": "Project",
            "timing": "Wk 3 / 11",
            "weightage": "50%",
            "syllabus": "Group wise project",
            "format": "Rubric The objective of the project is to provide students with an opportunity to apply theoretical knowledge to real-world problems through independent or team-based work."
          },
          {
            "name": "Assignment - Situation based problem solving",
            "timing": "Wk 8 / 12",
            "weightage": "50%",
            "syllabus": "Test based Offline",
            "format": "Rubric To evaluate students' ability to explain concepts, analyze problems, and present logical, structured answers."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Empathy, Observation and Problem Identification"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Ideation and Creative Problem Solving"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Product Design and Prototyping"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Testing, Validation and Customer Experience"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Innovation Project, Re-Design and Product Presentation"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mec136": {
    "current": {
      "code": "MEC136",
      "name": "Engineering Drawing With Autocad",
      "fullTitle": "MEC136 — Engineering Drawing With Autocad",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 2)",
      "credits": 4,
      "l": 2,
      "t": 2,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "Through this course students should be able to recognize the fundamentals of engineering drawing and AutoCAD tool, understand the conceptual framework of orthographic projections, and build isometric views and 3D models.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "33%",
            "syllabus": "Concepts of engineering drawing, projection of points and lines with basic AutoCAD commands",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "33%",
            "syllabus": "Orthographic and sectional views with AutoCAD based 2D drawings",
            "format": ""
          },
          {
            "name": "Test 3",
            "timing": "Wk 13 / 14",
            "weightage": "33%",
            "syllabus": "Isometric views and development of surfaces with AutoCAD",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Projection of Points and Lines"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Orthographic Projections"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Sectional Views"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Isometric Views"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Development of Surfaces"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "MEC136",
      "name": "Engineering Drawing With Autocad",
      "fullTitle": "MEC136 — Engineering Drawing With Autocad",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 2)",
      "credits": 4,
      "l": 2,
      "t": 2,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "Through this course students should be able to recognize the fundamentals of engineering drawing and AutoCAD tool, understand the conceptual framework of orthographic projections, and build isometric views and 3D models.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Projection of Points and Lines"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Orthographic Projections"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Sectional Views"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Isometric Views"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Development of Surfaces"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "phy175": {
    "current": {
      "code": "PHY175",
      "name": "Modern Physics And Electronics",
      "fullTitle": "PHY175 — Modern Physics And Electronics",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers solid-state physics, semiconductor materials and devices, number systems, digital logic, combinational and sequential circuits, and Arduino programming with sensor interfacing.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "An MCQ-based test comprising 30 questions will be conducted through OAS/Google Form/Offline mode. The test will assess students' conceptual understanding of the topics covered in Units I and II.",
            "format": "Rubric To evaluate students' understanding of the fundamental concepts of solid-state physics, semiconductor materials, and electronic devices."
          },
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "Simulation-based Assignment/Project (Proteus). Circuit designing and simulation on Proteus: 10 marks; Project Report and Presentation: 10 marks; Viva: 10 marks.",
            "format": "Rubric Evaluation of circuit design and simulation using Proteus."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Fundamentals of Electricity and Devices"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Introduction to Number System and Logic Gates"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to Combinational Logic Circuits"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to Sequential Logic Circuits"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction of Arduino and Sensors"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "csr101": {
    "current": {
      "code": "CSR101",
      "name": "Python Programming",
      "fullTitle": "CSR101 — Python Programming",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Data Engineering)",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops proficiency in Python programming, covering core syntax, control structures, functions, recursion, strings, data structures, object-oriented programming, modules, packages, exception handling, numerical and matrix operations, and data analysis and visualization using Python libraries.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "NA",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 1 / 14",
            "weightage": "30%",
            "syllabus": "The students will be given coding problems and MCQs on the selected third-party platform. The questions will be framed with equal distribution from the complete syllabus.",
            "format": "Rubric To evaluate student's overall understanding of the programming concepts."
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 5 / 6",
            "weightage": "30%",
            "syllabus": "The test will be of one hour duration and will have 02 coding questions and 10 MCQs. The test will cover the topics completed in weeks 1, 2, 3 and 4.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 9 / 10",
            "weightage": "30%",
            "syllabus": "The test will be of one hour duration and will have 02 coding questions and 10 MCQs. The test will cover the topics completed in weeks 5, 6, 7 and 8.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test",
            "timing": "Wk 12 / 13",
            "weightage": "40%",
            "syllabus": "The test will be of one hour duration. It will cover units covered till week 12 and will contain fill-ups, jumbled-statement-based questions, output-based questions, and other questions.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Control Flow, Functions, and Problem-Solving"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data Structures, Classes, and Inheritance"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Modules and Exception Handling"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Matrices"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "File Handling, Data Loading, and Visualization"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "csr102": {
    "current": {
      "code": "CSR102",
      "name": "Design Thinking And Complex Problem Solving",
      "fullTitle": "CSR102 — Design Thinking And Complex Problem Solving",
      "semester": "Sem1",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Data Engineering)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course develops students' understanding and application of Design Thinking, human-centered problem solving, analytical reasoning, creative problem solving, workflow design, iterative refinement, solution communication, reflection, and feedback integration for addressing real-world challenges.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 2 / 4",
            "weightage": "50%",
            "syllabus": "Mode: MCQ-based Test. Units Covered: Unit I & Unit II. Question Type: 30 Multiple Choice Questions (MCQs). Marks: As per course evaluation scheme. Duration: 45â60 Minutes.",
            "format": "Rubric To assess students' understanding of the fundamental concepts of Design Thinking, human-centered problem solving, stakeholder analysis, problem identification, problem framing, scope definition, const"
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "Mode: MCQ-based Test. Units Covered: Unit III & Unit IV. Question Type: 30 Multiple Choice Questions (MCQs). Marks: As per course evaluation scheme. Duration: 45â60 Minutes.",
            "format": "Rubric To evaluate students' analytical reasoning, critical thinking, decision-making abilities, and creative problem-solving skills. The assessment focuses on evaluating alternatives, identifying cognitive"
          },
          {
            "name": "Test 3",
            "timing": "Wk 9 / 12",
            "weightage": "50%",
            "syllabus": "Mode: MCQ-based Test. Units Covered: Unit IV, Unit V & Unit VI. Question Type: 30 Multiple Choice Questions (MCQs). Marks: As per course evaluation scheme. Duration: 45â60 Minutes.",
            "format": "Rubric o assess students' understanding of workflow design, validation techniques, iterative refinement, feedback integration, solution communication, professional reporting, reflection, and continuous impro"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Problem Definition and Analysis"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Analytical and Critical Thinking"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Ideation and Creative Problem Solving"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Workflow Design and Iterative Refinement"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Solution Communication and Reflection"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece249": {
    "current": {
      "code": "ECE249",
      "name": "Basic Electrical And Electronics Engineering",
      "fullTitle": "ECE249 — Basic Electrical And Electronics Engineering",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers basic electrical and electronics engineering concepts, including the workings of semiconductor devices, Arduino configuration, number systems, combinational and sequential circuits, and application-based projects.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 13",
            "weightage": "50%",
            "syllabus": "To assess students' ability to design, implement, and troubleshoot electronic circuits, demonstrating their practical skills and problem-solving capabilities.",
            "format": "Rubric Problem Statement: 10M, Literature Survey: 10M, Circuit Simulation: 10M, Synopsis Report: 5M, Working model: 20M, Viva: 20M, Flashcheck: 20M, Edutrack: 5M. Total Marks: 65M (Phase 1 35M + Phase 2)."
          },
          {
            "name": "Test",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "To assess the ability to understanding and practical application of electrical laws, semiconductor devices, and sensor based systems",
            "format": "Rubric Type: MCQ; Total questions: 30; Total Marks: 30 M (1 marks for each question); Negative Marking: 25%"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Introduction of Arduino and Sensors"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Introduction to number system and logic gates"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to Combinational Logic Circuits"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to Sequential Logic Circuits"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Applications of Sequential Circuits"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "ECE249",
      "name": "Basic Electrical And Electronics Engineering",
      "fullTitle": "ECE249 — Basic Electrical And Electronics Engineering",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Introduction of Arduino and Sensors"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Introduction to number system and logic gates"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to Combinational Logic Circuits"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to Sequential Logic Circuits"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Applications of Sequential Circuits"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "phy110": {
    "current": {
      "code": "PHY110",
      "name": "Engineering Physics",
      "fullTitle": "PHY110 — Engineering Physics",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 2)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to understand the basic principles of physics to lay the foundation for engineering courses, covering topics such as lasers, optical fibers, quantum mechanics, and the physics of solids.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Term paper",
            "timing": "Wk 2 / 12",
            "weightage": "50%",
            "syllabus": "A problem based on Lab at Home will be assigned to the individual student. Students are expected to complete the task and submit a handwritten report.",
            "format": "Rubric Written Report-20 Marks (Presenting accurate information-10 Marks, Observation, conclusion and analysis-5 Marks, Completeness-5 Marks); Viva-10 Marks"
          },
          {
            "name": "Test",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "A subjective test will be conducted on the basis of the sub-topics covered from Unit 1 and Unit 2. Test will comprise of questions of marks 5 or multiple of 5.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Lasers and applications"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Fiber Optics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Quantum Mechanics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Solid State Physics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to engineering materials"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "PHY110",
      "name": "Engineering Physics",
      "fullTitle": "PHY110 — Engineering Physics",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 2)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to understand the basic principles of physics to lay the foundation for engineering courses, covering topics such as lasers, optical fibers, quantum mechanics, and the physics of solids.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Lasers and Applications"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Fiber Optics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Quantum Mechanics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Solid State Physics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to Engineering Materials"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "ece131": {
    "current": null,
    "reappear": {
      "code": "ECE131",
      "name": "Basic Electrical And Electronics Engineering",
      "fullTitle": "ECE131 — Basic Electrical And Electronics Engineering",
      "semester": "Sem1",
      "termType": "reappear",
      "termId": "25261",
      "category": "Specialization",
      "categoryDetail": "Specialization (Robotics)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamental principles of electrical and electronics engineering, including electrical circuits, machines, semiconductor devices, and operational amplifiers. It also introduces concepts of IoT, cloud computing, and embedded systems with a focus on employability and skill development.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Fundamentals of A.C. Circuits"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Fundamentals of Electrical Machines"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Fundamentals of semiconductor devices and digital circuits"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Fundamentals of Filters and Operational Amplifiers"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Fundamentals of embedded system and its application in industrial processes"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse101": {
    "current": {
      "code": "CSE101",
      "name": "Computer Programming",
      "fullTitle": "CSE101 — Computer Programming",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Course Focus: EMPLOYABILITY, SKILL DEVELOPMENT, ENTREPRENEURSHIP",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 2 / 13",
            "weightage": "30%",
            "syllabus": "The students will be given approx. 120 coding problems and 90 MCQs on the selected third party platform.",
            "format": "Rubric Based on the Percentage of questions solved by the student"
          },
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "40%",
            "syllabus": "The test will be of one hour duration and will be conducted in offline mode.",
            "format": ""
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 9 / 10",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 marks) and Coding Problems(20 marks)",
            "format": ""
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 12 / 13",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 marks) and Coding Problems(20 marks)",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Control structures and Input/Output functions"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "User defined functions and Storage classes"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Arrays in C"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Pointers, Dynamic memory allocation and Strings"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Derived types including structures and unions"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse121": {
    "current": {
      "code": "CSE121",
      "name": "Orientation To Computing-Ii",
      "fullTitle": "CSE121 — Orientation To Computing-Ii",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on skill development and employability by introducing students to various computing domains including Data Science, Big Data, AI, Machine Learning, Cyber Security, DevOps, Cloud Computing, and Full Stack Web Development.",
      "gradingScheme": {
        "attendance": "20",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "30"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Certification - MOOCs 1",
            "timing": "Wk 3 / 5",
            "weightage": "33%",
            "syllabus": "Students need to produce the certificate earned for completing the MOOC that was assigned in the CSE111 course. Students will be evaluated on the basis of their performance.",
            "format": "Rubric 70% weightage given MOOC and 30% to profile creation"
          },
          {
            "name": "Certification - MOOCs 2",
            "timing": "Wk 4 / 9",
            "weightage": "33%",
            "syllabus": "Students need to produce the certificate earned for completing the Cohort MOOC. Students will be evaluated based on their performance on Cohort MOOC completion during course duration.",
            "format": ""
          },
          {
            "name": "Portfolio",
            "timing": "Wk 8 / 12",
            "weightage": "33%",
            "syllabus": "Students will be evaluated on the basis of their video presentations of their dream CVs uploaded to YouTube and a Gantt chart of their career path plan.",
            "format": "Rubric 70% weightage given to CV generation and three year career roadmap and 30% for the profile creation"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "30%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Artificial Intelligence & Machine Learning"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Cybersecurity"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "DevOps & Software Testing"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Cloud Computing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Full Stack Web Development & UI/UX"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse320": {
    "current": {
      "code": "CSE320",
      "name": "Software Engineering",
      "fullTitle": "CSE320 — Software Engineering",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on the evolution of Software Engineering, SDLC models, design principles, UML representation, software testing techniques, project management, DevOps tools, and software quality standards.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Case based",
            "timing": "Wk 2 / 12",
            "weightage": "50%",
            "syllabus": "Case study assigned on a specific topic to evaluate the student through case study.",
            "format": "Rubric Evaluated on the basis of Written SRS-30%, System Design-30%, Test Cases-20% and viva-20%"
          },
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "MCQ Based Test covering topics from week 1 to week 4 (Lifecycle models, SRS, DFDs and UML). Total 30 questions each question will carry 1 marks.",
            "format": "Rubric Lifecycle models-10 marks, SRS-10marks, DFDs and UML:10marks."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Software Design Principles & System Architecture"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Object-Oriented Software Development and Modeling Techniques"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Software Testing Concepts, Techniques, and Automation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Software Project Management & DevOps Practices"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Quality Management, Maintenance & Emerging Technologies"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int306": {
    "current": {
      "code": "INT306",
      "name": "Database Management Systems",
      "fullTitle": "INT306 — Database Management Systems",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 1 / 14",
            "weightage": "30%",
            "syllabus": "The weightage of programming practice which is spread across Query writing and MCQs. Problems with problems should open unit-wise with previous old unit getting locked with next old opening and even unit getting locked with next even opening.",
            "format": ""
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 5 / 6",
            "weightage": "30%",
            "syllabus": "MCQ and query-based test on CodeTantra platform",
            "format": ""
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 8 / 9",
            "weightage": "30%",
            "syllabus": "Mix of MCQ and queries on CodeTantra platform",
            "format": ""
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "40%",
            "syllabus": "Mix of MCQ and Queries / PL/SQL code",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Relational query language"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Relational Operations"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Relational Database Design"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Programming Constructs in Databases"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "NoSQLDatabases"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mth166": {
    "current": {
      "code": "MTH166",
      "name": "Differential Equations And Vector Calculus",
      "fullTitle": "MTH166 — Differential Equations And Vector Calculus",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on the definitions, distinctions, and solution methods for various differential equations, including partial differential equations like heat, wave, and Laplace equations. Additionally, it covers vector calculus concepts such as derivatives of vector fields, gradient, divergence, curl, and the computation of line, surface, and volume integrals.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "exact equations, equations reducible to exact equations, equations of the first order and higher degree, Clairaut's equation. introduction to linear differential equation, Solution of linear differential equation, LD/LI, method of solution of LDE, solution of second and higher order homogeneous linear differential equations with constant coefficient.",
            "format": ""
          },
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "introduction to partial differential equation, method of Separation of Variables, solution of wave equation, solution of heat equation, solution of Laplace equation. limit, continuity and differentiability of vector functions, length of space curve, motion of a body or particle on a curve.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Differential equations of higher order"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linear Differential Equations"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Partial Differential Equation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Vector Calculus I"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Vector calculus II"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mth401": {
    "current": {
      "code": "MTH401",
      "name": "Discrete Mathematics",
      "fullTitle": "MTH401 — Discrete Mathematics",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "The course is an introduction to discrete mathematics comprising essentials for computer science students, including counting and proof techniques.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Propositional logic, propositional equivalences, quantifiers, introduction to proof, direct proof, proof by contraposition, vacuous and trivial proof, proof strategy, proof by contradiction, proof of equivalence and counterexamples, mistakes in proof, recurrence relation, modelling with recurrence relations, homogeneous linear recurrence relations with constant coefficients, method of inverse operator to solve the nonhomogeneous recurrence relation with constant coefficient, generating functions, and solution of recurrence relation using generating functions.",
            "format": "Rubric To test the understanding of logic, proofs, mistakes in proofs, recursive processes, and the solution of recurrence relations."
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Graph terminologies, special types of graphs including complete, cycle, regular, wheel, cube, bipartite and complete bipartite graphs, representing graphs, adjacency and incidence matrices, graph isomorphism, paths and connectivity for undirected and directed graphs, and Dijkstra's algorithm for the shortest path problem.",
            "format": "Rubric To test the understanding of graph theory concepts, graph representation, and path algorithms."
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering the syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the student and provide opportunity to improve their CA performance in case of low marks or missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Recurrence Relations"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Counting Principles and Relations"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Graphs Theory I"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Graphs Theory II"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Number Theory and Its Application in Cryptography"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece279": {
    "current": {
      "code": "ECE279",
      "name": "Basic Electrical And Electronics Engineering Laboratory",
      "fullTitle": "ECE279 — Basic Electrical And Electronics Engineering Laboratory",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective (Pool 1)",
      "credits": 1,
      "l": 0,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This laboratory course focuses on basic electrical and electronics engineering skills, including assembling electronic components, using measuring instruments, and designing combinational and sequential circuits. It emphasizes employability and skill development through the validation of digital and analogue ICs and project-based applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Performance/Job Evaluation/Execution",
            "timing": "Wk 4 / 5",
            "weightage": "33%",
            "syllabus": "Faculty will evaluate students for practical 1, 2, 3, and 4. The student will be assigned 1 practical to perform.",
            "format": "Rubric practical performance 50 mark, viva of 30 mark, and a write-up of 20 Mark"
          },
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 9 / 10",
            "weightage": "33%",
            "syllabus": "Pictionary Based Activity type assessment, based on Practical 1 to Practical 6. Total Question 15 and a maximum mark 60.",
            "format": ""
          },
          {
            "name": "Planning Project-Report and Presentation",
            "timing": "Wk 12 / 14",
            "weightage": "33%",
            "syllabus": "Faculty will conduct Project Report Presentation based on the Parameters.",
            "format": "Rubric Presentation skills: 20 marks, Methodology of the Project: 20Marks, Individual contribution: 20M"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 0,
      "units": []
    },
    "reappear": null
  },
  "frn601": {
    "current": {
      "code": "FRN601",
      "name": "French Language Skills I",
      "fullTitle": "FRN601 — French Language Skills I",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course aims to equip students with basic French language skills, enabling them to understand and use familiar everyday expressions, explain themselves and others, communicate simply, and write basic personal details.",
      "gradingScheme": {
        "attendance": "0",
        "continuous_assessment": "0",
        "mid_term_examination": "0",
        "end_term": "0"
      },
      "continuousAssessment": {
        "componentCount": 0,
        "evaluationRule": "",
        "components": []
      },
      "examPatterns": null,
      "totalUnits": 7,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Le Temps et l'Espace"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "L'Identité et la Présentation"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "La Communication et l'Action"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Ma Ville et mes Lieux"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Les Déplacements et les Descriptions"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Les Goûts, les Loisirs et les Verbes"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "jap601": {
    "current": {
      "code": "JAP601",
      "name": "Japanese-I",
      "fullTitle": "JAP601 — Japanese-I",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course, Japanese-I, aims to equip students with fundamental Japanese language skills, including basic communication, vocabulary, and sentence formation. It also focuses on developing cultural understanding and the ability to apply simple Japanese in professional and social contexts.",
      "gradingScheme": {
        "attendance": "0",
        "continuous_assessment": "0",
        "mid_term_examination": "0",
        "end_term": "0"
      },
      "continuousAssessment": {
        "componentCount": 0,
        "evaluationRule": "",
        "components": []
      },
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "は じ め ま し て"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "そちらはなんじまでですか"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "いっしょにいきませんか"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "ざんねんですが (Zannen desu ga)"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "これ、おねがいします"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel121": {
    "current": {
      "code": "PEL121",
      "name": "Advanced Communication Skills I",
      "fullTitle": "PEL121 — Advanced Communication Skills I",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on competitive and placement examinations for higher education and mass recruiters, along with skill enhancement and personality development.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Presentation-Individual",
            "timing": "Wk 3/4",
            "weightage": "33%",
            "syllabus": "Power Point Presentation based SWOT ( Strength, Weakness, Opportunity, Threat) Analysis",
            "format": ""
          },
          {
            "name": "Test 1",
            "timing": "Wk 5/6",
            "weightage": "33%",
            "syllabus": "A written test consisting of 30 Multiple Choice Questions (MCQs) based on prescribed grammar topics",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 11/12",
            "weightage": "33%",
            "syllabus": "An offline test on Multiple Choice Questions(MCQs), a writing activity, and role-play (3-4 students).",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Building Sentences"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Tenses"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Articles and indefinites"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Active Passive Voice"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Phrasal Verbs"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel125": {
    "current": {
      "code": "PEL125",
      "name": "Advanced Communication Skills I",
      "fullTitle": "PEL125 — Advanced Communication Skills I",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on competitive and placement examinations for higher education and mass recruiters, along with skill enhancement and personality development.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Presentation-Individual",
            "timing": "Wk 3/4",
            "weightage": "33%",
            "syllabus": "Power Point Presentation based SWOT ( Strength, Weakness, Opportunity, Threat) Analysis",
            "format": ""
          },
          {
            "name": "Test 1",
            "timing": "Wk 5/6",
            "weightage": "33%",
            "syllabus": "A written test consisting of 30 Multiple Choice Questions (MCQs) based on prescribed grammar topics",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 11/12",
            "weightage": "33%",
            "syllabus": "An offline test on Multiple Choice Questions(MCQs), a writing activity, and role-play (3-4 students).",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Statements & Questions"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Tenses Review"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Modals Review & Determiners"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Reported Speech"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Vocabulary"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel130": {
    "current": {
      "code": "PEL130",
      "name": "Advanced Communication Skills I",
      "fullTitle": "PEL130 — Advanced Communication Skills I",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on competitive and placement examinations for higher education and mass recruiters, along with skill enhancement and personality development.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Presentation-Individual",
            "timing": "Wk 3/4",
            "weightage": "33%",
            "syllabus": "Power Point Presentation based SWOT ( Strength, Weakness, Opportunity, Threat) Analysis",
            "format": ""
          },
          {
            "name": "Test 1",
            "timing": "Wk 5/6",
            "weightage": "33%",
            "syllabus": "A written test consisting of 30 Multiple Choice Questions (MCQs) based on prescribed grammar topics",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 11/12",
            "weightage": "33%",
            "syllabus": "An offline test on Multiple Choice Questions(MCQs), a writing activity, and role-play (3-4 students).",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Sentence Structure"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Conditionals"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Infinitives, Gerunds and Quantifiers"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Reduced Clauses, Connectors and Focus Structures"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Professional Vocabulary"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece182": {
    "current": {
      "code": "ECE182",
      "name": "Electronics For Robots",
      "fullTitle": "ECE182 — Electronics For Robots",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development, enabling students to understand, analyze, and apply electronic devices such as p-n junction diodes, BJTs, FETs, and op-amps. Students will also learn to simulate real-world applications using these electronic devices.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Event - Participation",
            "timing": "Wk 6 / 7",
            "weightage": "50%",
            "syllabus": "To combine academic learning with engaging and enjoyable activities that foster critical thinking, collaboration, and creativity among students. a. Participation: 80 Marks(Hardware: 30 Marks, Working: 30 Marks, Presentation: 20 Marks) b. Winner 1/2/3: 20 Marks",
            "format": ""
          },
          {
            "name": "Test",
            "timing": "Wk 8 / 14",
            "weightage": "50%",
            "syllabus": "Subjective academic task of five questions for 25 Marks and each question consists of 5 Marks. 5 Marks for class note book preparation.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Bipolar Junction Transistors"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Field effect transistors"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Feedback amplifiers and power amplifier"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Oscillators"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Operational amplifiers and applications"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece213": {
    "current": {
      "code": "ECE213",
      "name": "Digital Electronics",
      "fullTitle": "ECE213 — Digital Electronics",
      "semester": "Sem2",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers digital number systems, boolean algebra, and the application of binary arithmetic concepts for designing combinational circuits. Students will also learn to develop various flip-flops, registers, counters, and analyze memory design and FPGA applications.",
      "gradingScheme": {
        "attendance": "0",
        "continuous_assessment": "100",
        "mid_term_examination": "0",
        "end_term": "0"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 4",
            "weightage": "50%",
            "syllabus": "Subjective questions from topic of unit 1 and unit 2.",
            "format": "Rubric 6 questions of 5 marks"
          },
          {
            "name": "Test 2",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "Subjective questions from topic of unit 4 and unit 5.",
            "format": "Rubric 6 questions of 5 marks"
          }
        ]
      },
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Boolean Algebra and Logic gates"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Introduction to Combinational Logic Circuits"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to Sequential Logic Circuits"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Sequential Logic Circuits Applications"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Memory and Programmable Logic"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse202": {
    "current": {
      "code": "CSE202",
      "name": "Object Oriented Programming",
      "fullTitle": "CSE202 — Object Oriented Programming",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops C++ programming and object-oriented programming skills through topics including classes, functions, pointers, constructors, file handling, operator overloading, inheritance, polymorphism, exception handling, templates, and the Standard Template Library. Students apply these concepts to solve programming problems and build software applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "NA",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 1 / 14",
            "weightage": "30%",
            "syllabus": "Students will be given approximately 126 coding problems and 90 MCQs on a selected third-party platform, with equal distribution across the complete syllabus. Final marks are calculated by prorating the marks for which the student is eligible against the percentage scored in the proctored coding contests and mandatory written test.",
            "format": "Rubric To qualify, a student must solve at least 50% of the coding problems and 50% of the MCQs. Eligible marks out of 15 are based on the percentage of questions solved and are then prorated using the percentage scored in the other continuous assessments; final marks are rounded up."
          },
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "40%",
            "syllabus": "A mandatory written test of one-hour duration covering the topics completed in weeks 5 and 6.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 8 / 9",
            "weightage": "30%",
            "syllabus": "Mix of MCQs worth 10 marks and coding problems worth 20 marks.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 12 / 13",
            "weightage": "30%",
            "syllabus": "Mix of MCQs worth 10 marks and coding problems worth 20 marks.",
            "format": "Rubric To ensure understanding of the concepts and check the student's progress and performance on an individual basis."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Pointers, Reference Variables, Arrays and String Concepts"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data Files, Constructors and Destructors"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Operator Overloading, Type Conversion and Inheritance"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dynamic Memory Management and Polymorphism"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Exception Handling, Templates and Standard Template Library"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CSE202",
      "name": "Object Oriented Programming",
      "fullTitle": "CSE202 — Object Oriented Programming",
      "semester": "Sem3",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on employability, skill development, and entrepreneurship, enabling students to identify basic programming constructs, interpret object-oriented model principles, and apply them in C++ language implementation.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Pointers, Reference Variables, Arrays and String Concepts"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data File operations, Constructors, Destructors and File Handling"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Operator Overloading, Type Conversion and Inheritance"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dynamic Memory Management and Polymorphism"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Exception Handling, Templates and Standard Template Library (STL)"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse205": {
    "current": {
      "code": "CSE205",
      "name": "Data Structures And Algorithms",
      "fullTitle": "CSE205 — Data Structures And Algorithms",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The subject covers the analysis and implementation of data structures and algorithms, including arrays, linked lists, stacks, queues, recursion, trees, heaps, hashing, graphs, searching, and sorting. It emphasizes complexity analysis, efficient data storage and retrieval, and applying appropriate data structures and algorithms to problem solving.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 1 / 14",
            "weightage": "30%",
            "syllabus": "Students will complete approximately 126 coding problems and 90 MCQs covering the complete syllabus on a selected third-party platform. Final marks are determined by the percentage of questions solved and prorated using performance in proctored coding contests and the mandatory written test.",
            "format": "Rubric Students must solve at least 50% of the coding problems and 50% of the MCQs to qualify. Eligible marks out of 15 are based on the percentage of questions solved and are then prorated according to the percentage scored in the other continuous assessments, with final marks rounded up."
          },
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "40%",
            "syllabus": "This is a mandatory one-hour written test covering the topics completed in weeks 5 and 6.",
            "format": "Rubric To evaluate the progress of individual students based on the applicability of learned concepts."
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 9 / 10",
            "weightage": "30%",
            "syllabus": "Mix of MCQs worth 10 marks and coding problems worth 20 marks.",
            "format": "Rubric To evaluate basic programming skills of students."
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 12 / 13",
            "weightage": "30%",
            "syllabus": "Mix of MCQs worth 10 marks and coding problems worth 20 marks.",
            "format": "Rubric To evaluate basic programming skills of students."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Linked Lists"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Stacks and Queues"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Recursion and Trees"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Heaps and Hashing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Graphs"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CSE205",
      "name": "Data Structures And Algorithms",
      "fullTitle": "CSE205 — Data Structures And Algorithms",
      "semester": "Sem3",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development, designed to enable students to understand time and space complexity of programs and data structures. It covers the implementation and importance of Linked Lists, Stacks, Queues, Trees, Heap operations, and Hashing techniques for efficient data storage and retrieval.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Linked Lists"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Stacks and Queues"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Trees and Recursion"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Heaps and Hashing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Graphs"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse306": {
    "current": {
      "code": "CSE306",
      "name": "Computer Networks",
      "fullTitle": "CSE306 — Computer Networks",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject covers computer network architectures, models, physical and data link layers, IP addressing, routing, transport and application layer protocols, congestion control, and wireless networking standards. It also develops practical skills in network configuration, subnetting, routing, IPv6, and server setup.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "30 MCQs having 1 mark each.",
            "format": "Rubric Assess the understanding of network components, network models and data communion techniques."
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "Two scenario-based practical questions and viva to be implemented in lab.",
            "format": "Rubric Assess the knowledge of IP addressing, subnetting, routing algorithms in network layer operations."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test of 30 marks covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the student and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Physical and Data Link Layers"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "MAC Sublayer and IP Addressing"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Routing and IP Header"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Transport Layer and Congestion Control"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Application Layer and Wireless Networks"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CSE306",
      "name": "Computer Networks",
      "fullTitle": "CSE306 — Computer Networks",
      "semester": "Sem3",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "Through this course, students define network topologies, models, and functionalities of different layers, explain data communication and transmission media, and identify error handling protocols. Additionally, students utilize IP addressing techniques, examine routing algorithms, and analyze the role of key application layer protocols and services.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "APPLICATION LAYER"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "TRANSPORT LAYER: CONGESTION CONTROL"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "NETWORK LAYER: IP Header"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "DATA LINK LAYER"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "PHYSICAL LAYER"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse423": {
    "current": {
      "code": "CSE423",
      "name": "Virtualization And Cloud Computing",
      "fullTitle": "CSE423 — Virtualization And Cloud Computing",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 1,
      "syllabusPdf": null,
      "courseDescription": "This course covers virtualization, distributed computing, cloud computing models and architecture, cloud migration, cloud economics, and AWS fundamentals. It also examines AWS compute, storage, database, identity, access management, and security services.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "30 MCQ based online test will be taken to check the knowledge attainment of students from unit 1 and unit 2.",
            "format": "Rubric To check the student's knowledge regarding Virtualization, Distributed computing and basics of Cloud computing."
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "3 subjective scenario based questions will be given of 10 marks each. All the questions must follow revised blooms taxonomy. Offline test will be taken to check the knowledge attainment of students from unit 3, unit 4 and unit 5.",
            "format": "Rubric To check the student's knowledge regarding Cloud Architecture, Cloud Economics, AWS Fundamentals, AWS Compute Services."
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Cloud Computing and Cloud Migration"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Cloud Architecture and Economics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "AWS Fundamentals"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "AWS Compute Services"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "AWS Storage and Database Services"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "frn602": {
    "current": {
      "code": "FRN602",
      "name": "Foundation French Ii",
      "fullTitle": "FRN602 — Foundation French Ii",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course develops basic French vocabulary and grammar for everyday communication. It builds listening, speaking, and writing skills for interacting on familiar topics and describing people, places, objects, and events.",
      "gradingScheme": {
        "attendance": "10",
        "continuous_assessment": "30",
        "mid_term_examination": "20",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Skill Based Assignment",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Preparer un video sur le sujet donnÃ©",
            "format": "Rubric Skill based C.A â Video making"
          },
          {
            "name": "Test 1",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Evaluation basÃ©e sur la grammaire et le vocabulaire",
            "format": "Rubric Test based on grammar and vocabulary"
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA-1 and CA-2",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 7,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Nous parlons de notre routine quotidienne"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Nous racontons des événements passés"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Parler du futur, des besoins et des personnes"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Nous parlons du futur, des besoins et des personnes"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Comparer, décrire et apprécier"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Voyager, faire des achats et comprendre le monde juridique"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel132": {
    "current": {
      "code": "PEL132",
      "name": "Communication Skills-Ii",
      "fullTitle": "PEL132 — Communication Skills-Ii",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course develops students' listening, reading, writing, speaking, grammar, vocabulary, and professional communication skills. It focuses on effective communication in personal, societal, academic, and professional contexts.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "Best 3 of 4 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Presentation - Individual",
            "timing": "Wk 3 / 4",
            "weightage": "33%",
            "syllabus": "Each student will prepare first drafts of their CV and Portfolio and present them orally to demonstrate their professional profile and placement readiness. The instructor will provide individual feedback on the presentation, portfolio, and CV.",
            "format": "Rubric To showcase academic qualifications, technical skills, and career objectives through an effective CV and Portfolio presentation."
          },
          {
            "name": "Interview",
            "timing": "Wk 5 / 6",
            "weightage": "33%",
            "syllabus": "Students will complete assigned tasks on the BET online platform and participate in a mock interview based on a range of job descriptions. Assessment will be based on their performance in the online tasks and interview.",
            "format": "Rubric To evaluate students' performance in the assigned homework and interview."
          },
          {
            "name": "Test 1",
            "timing": "Wk 9 / 10",
            "weightage": "33%",
            "syllabus": "Students' progress on the BET platform will be evaluated alongside an offline assessment to measure their proficiency in listening, reading, and writing skills.",
            "format": "Rubric To assess students' Listening, Reading, and Writing skills along with their performance in the assigned online homework tasks."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "33%",
            "syllabus": "A comprehensive offline assessment of students' listening, speaking, reading, and writing skills will be conducted.",
            "format": "Rubric To evaluate students' listening, speaking, reading, and writing skills."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Practical"
        }
      },
      "totalUnits": 7,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Speaking/Pronunciation"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Reading"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Writing"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Grammar"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Vocabulary"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Practical"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel134": {
    "current": {
      "code": "PEL134",
      "name": "Upper Intermediate Communication Skills-Ii",
      "fullTitle": "PEL134 — Upper Intermediate Communication Skills-Ii",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course develops students' English grammar, active listening, reading comprehension, critical evaluation, speaking, presentation, and written communication skills for effective communication in social and professional contexts.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "Best 3 of 4 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Presentation - Individual",
            "timing": "Wk 3 / 4",
            "weightage": "33%",
            "syllabus": "Each student will prepare the initial drafts of their CV and Portfolio and deliver an oral presentation to showcase their professional profile and readiness for placements. The instructor will provide individual feedback on the presentation, CV, and Portfolio, helping students identify areas for improvement and refine their work. These initial drafts will serve as the foundation for further development, while the uploading of the CV to the placement portal and its final approval will be carried out during the 5th semester. Submission of a hard copy of the CV and the portfolio link is mandatory for all students.",
            "format": "Rubric To effectively present academic qualifications, technical skills, and career objectives through a professional CV and Portfolio presentation"
          },
          {
            "name": "Interview",
            "timing": "Wk 5 / 6",
            "weightage": "33%",
            "syllabus": "Students will complete the assigned activities on the Oxford online platform, listen to âKnow Your Companyâ (KYC)-based audio track beforehand, and participate in a mock interview based on various Job Descriptions (JDs). Their performance will be evaluated based on the successful completion of online assignments, and their participation in the mock interview.",
            "format": "Rubric To evaluate students' understanding and performance through the assigned assignment (10 Marks) and mock interview (20 Marks)"
          },
          {
            "name": "Test 1",
            "timing": "Wk 9 / 10",
            "weightage": "33%",
            "syllabus": "Students will complete Listening, Reading, and Writing activities, along with the assigned assignments, on the Oxford online platform. Their assessment will be based on their performance in listening, reading comprehension tasks such as true/false/not given, fill-in-the-blanks, and multiple-choice questions, as well as writing and the assigned online assignment.",
            "format": "Rubric To assess students' Listening, Reading, and Writing skills (20 Marks), along with their performance in the assigned online assignment tasks (10 Marks)"
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "33%",
            "syllabus": "Listening to a track, reading comprehension comprising true/false/not given questions, fill in the blanks, or multiple choice questions, writing task.",
            "format": "Rubric To assess studentsâ Listening, Reading, & Writing Skills"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Practical"
        }
      },
      "totalUnits": 7,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Speaking/Pronunciation"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Reading"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Writing"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Grammar"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Vocabulary"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Practical"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pel136": {
    "current": {
      "code": "PEL136",
      "name": "Advanced Communication Skills-Ii",
      "fullTitle": "PEL136 — Advanced Communication Skills-Ii",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "Advanced Communication Skills-II develops students' vocabulary, grammar, listening, reading, speaking, and writing abilities for personal, academic, and professional contexts, including interview, CV, portfolio, and placement-readiness skills.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "Best 3 of 4 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Presentation - Individual",
            "timing": "Wk 3 / 4",
            "weightage": "33%",
            "syllabus": "Each student will prepare the first drafts of their CV and Portfolio and present them orally to demonstrate their professional profile and placement readiness. The instructor will provide individual feedback on the presentation, portfolio, and CV. The hardcopy of the CV and the link to the portfolio are mandatory submissions to the class teacher.",
            "format": "Rubric To showcase academic qualifications, technical skills, and career objectives through an effective CV and Portfolio presentation."
          },
          {
            "name": "Interview",
            "timing": "Wk 5 / 6",
            "weightage": "33%",
            "syllabus": "Students will complete the assigned tasks on the Oxford online platform, listen to a Know Your Company (KYC)-based audio track beforehand, and participate in a mock interview based on a range of Job Descriptions (JDs). Their performance will be evaluated based on the successful completion of online assignments and the mock interview.",
            "format": "Rubric To evaluate students' understanding and performance through the assigned assignments (10 Marks) and interview (20 Marks)."
          },
          {
            "name": "Test 1",
            "timing": "Wk 9 / 10",
            "weightage": "33%",
            "syllabus": "Students will complete Listening, Reading, and Writing tasks (20 Marks) and assigned assignments (10 Marks) on the Oxford online platform. Assessment will be based on listening, reading comprehension, writing, and assigned online assignment tasks.",
            "format": "Rubric To assess students' Listening, Reading, and Writing skills (20 Marks), along with their performance in the completion of assigned online assignments (10 Marks)."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "33%",
            "syllabus": "Listening to a track, reading comprehension comprising true/false/not given questions, fill in the blanks, or multiple-choice questions, and writing task.",
            "format": "Rubric To assess students' Listening, Reading, & Writing Skills."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Practical"
        }
      },
      "totalUnits": 7,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Speaking"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Reading"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Writing"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Grammar"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Vocabulary"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Practical"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse252": {
    "current": {
      "code": "CSE252",
      "name": "Introduction To Artificial Intelligence And Machine Learning",
      "fullTitle": "CSE252 — Introduction To Artificial Intelligence And Machine Learning",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces the fundamental concepts of Artificial Intelligence and Machine Learning, including intelligent agents, data preparation, supervised and unsupervised learning, model evaluation, and AI applications in robotics and autonomous systems. Students develop AI-enabled solutions using Python and Scikit-learn for real-world problems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 11",
            "weightage": "50%",
            "syllabus": "Students are required to create a Machine Learning based solution to solve a real-world problem statement. Evaluation covers innovation or benefit to society and prospective outcomes, project quality and completeness in terms of technical skills, and report, presentation, and viva Q&A.",
            "format": "Rubric Innovation/Benefit to Society and Prospective Outcomes (Publication, Patent, Revenue etc.): 10; Project Quality and Completeness in terms of Technical Skills: 10; Report + Presentation/Viva Q&A: 10."
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Test will be based on subjective questions from the topics covered in Unit-1 and Unit-2 of the syllabus. The test may be a mix of concept-based, numerical-based, and coding-based questions. Every question can be of 5 or 10 marks.",
            "format": "Rubric To evaluate learning of students based on their understanding and application of concepts learned."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective Test covering syllabus from Units-1 through Unit-3.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case if low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Data Preparation and Machine Learning Workflow"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Supervised Machine Learning"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Unsupervised Learning"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Model Evaluation and Improvement"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "AI for Intelligent Systems and Robotics"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse253": {
    "current": {
      "code": "CSE253",
      "name": ".Net Programming",
      "fullTitle": "CSE253 — .Net Programming",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces the .NET ecosystem and C# programming, including object-oriented programming, LINQ, generics, asynchronous programming, dependency injection, and SOLID principles. It also covers ASP.NET Core MVC, Entity Framework Core, SQL Server, authentication and authorization, and the development and testing of RESTful Web APIs.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 12",
            "weightage": "50%",
            "syllabus": "Develop a responsive ASP.NET Core MVC application by recreating the interface of a given real-world website. CA3 is a project-based assessment evaluated for 30 marks: 10 marks for project presentation, 5 marks for viva voce, 5 marks for project report, 5 marks for code semantics and quality, and 5 marks for user interface design and implementation.",
            "format": "Rubric To enable students to apply C#, ASP.NET Core, Entity Framework Core, SQL Server, and Web API concepts to design and develop a complete industry-oriented web application."
          },
          {
            "name": "Visual Implementation",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Design and develop a responsive ASP.NET Core MVC application that replicates the interface and functionality of a real-world website using concepts learned in the course. CA1 is a visual implementation assessment comprising 15 marks for written submission, 10 marks for code implementation, and 5 marks for viva, for a total of 30 marks.",
            "format": "Rubric To develop students' ability to translate visual designs into responsive and functional web applications using ASP.NET Core MVC, HTML, CSS, Bootstrap, and C#."
          },
          {
            "name": "Test - Code based",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Apply C#, ASP.NET Core, Entity Framework Core, and SQL Server to solve programming and application development problems. CA2 is a code-based MCQ examination consisting of 30 multiple-choice questions assessing understanding of Backend Development Using ASP.NET Core. Each correct answer earns one mark, 0.25 marks are deducted for each incorrect answer, and unanswered questions receive no marks or deductions.",
            "format": "Rubric To assess students' understanding and application of C# programming, ASP.NET Core, Entity Framework Core, and Web API concepts through coding-based problem solving."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "C# Programming Fundamentals"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Advanced C# Programming"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Backend Development Using ASP.NET Core"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "ASP.NET Core MVC, Entity Framework Core and Security"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "SQL Server and ASP.NET Core Web API"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse276": {
    "current": {
      "code": "CSE276",
      "name": "Artificial Intelligence Foundations",
      "fullTitle": "CSE276 — Artificial Intelligence Foundations",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and ML)",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The subject covers the foundations, evolution, characteristics, and applications of Artificial Intelligence, including state-space problem formulation, classical and heuristic search, knowledge representation, reasoning, and intelligent agents. It also introduces Machine Learning, Deep Learning, Generative AI, Large Language Models, prompt engineering, Responsible AI, modern AI development ecosystems, and emerging trends.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "30%",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 2 / 13",
            "weightage": "30%",
            "syllabus": "The CA1 project will be evaluated based on Problem Selection and Data Preparation, Model Development and Deployment, and the Project Outcome (Patent/Research Paper/Revenue Generation Proposal) along with Viva-Voce and Presentation. The evaluation emphasizes problem identification, technical implementation, innovation, and effective presentation of the developed solution.",
            "format": "Rubric To evaluate students' ability to design, implement, and demonstrate an Artificial Intelligence solution by applying problem-solving, knowledge representation, reasoning, and intelligent system concepts."
          },
          {
            "name": "Test 1",
            "timing": "Wk 3 / 6",
            "weightage": "30%",
            "syllabus": "Syllabus of the test will be Unit-I and Unit-II.",
            "format": "Rubric To assess individual students' understanding of the fundamental concepts of Artificial Intelligence covered in Unit-I and Unit-II."
          },
          {
            "name": "Test 2",
            "timing": "Wk 10 / 12",
            "weightage": "30%",
            "syllabus": "A 30-mark subjective test will be conducted to assess students' understanding of content covered in Unit-I to Unit-V.",
            "format": "Rubric To assess individual students' understanding and application of Artificial Intelligence concepts covered in Unit-I to Unit-V."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Search and Knowledge Representation"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Intelligent Agents"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Evolution and Modern AI Paradigms"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Generative and Responsible AI"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Artificial Intelligence Ecosystem and Future Trends"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece183": {
    "current": {
      "code": "ECE183",
      "name": "Mathematics For Robotics",
      "fullTitle": "ECE183 — Mathematics For Robotics",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "Mathematics for Robotics covers coordinate systems, matrices, linear and nonlinear equations, Laplace transforms, numerical solutions of ordinary differential equations, interpolation, numerical differentiation and integration, probability, stochastic processes, calculus of variations, and Lagrangian dynamics for robot manipulators.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project - Design project",
            "timing": "Wk 2 / 11",
            "weightage": "50%",
            "syllabus": "Simulation based Mathematical Modeling in MATLAB/Python",
            "format": "Rubric To enable the student to apply the concepts learned for robotics applications"
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Design based problem",
            "format": "Rubric Grab knowledge about different ways to solve the Linear and non linera equation"
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2",
            "format": "Rubric To test conceptual knowledge of student"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Solution of Linear and Nonlinear Equations"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Laplace Transform"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Numerical Solution of Ordinary Differential Equations"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Interpolation, Differentiation and Integration"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Probability and Stochastic Processes"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece244": {
    "current": {
      "code": "ECE244",
      "name": "Elements Of Robotics",
      "fullTitle": "ECE244 — Elements Of Robotics",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamental elements and architecture of robotic systems, including robot mechanisms, actuators, transmission systems, sensors, embedded controllers, programming, motion control, and intelligent robotics. It also addresses the analysis, application, and design of robotic systems across industrial and other fields.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "It will have 6 questions of 5 marks each, totaling 30 marks, based on Units 1 and 2. A minimum of one question will be scenario based.",
            "format": "Rubric Six questions carrying 5 marks each for a total of 30 marks, with a minimum of one scenario-based question."
          },
          {
            "name": "Project - Design project",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Execution - 15; Viva - 10; Project Report and Presentation - 5.",
            "format": "Rubric Execution: 15 marks; Viva: 10 marks; Project Report and Presentation: 5 marks."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "The test will be based on the syllabus of CA1 and CA2. It will contain 6 questions carrying 5 marks each.",
            "format": "Rubric Six questions carrying 5 marks each, evaluating performance against specific learning objectives."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Mechanical Elements of Robotics"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Electrical and Electronics Elements"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Robot Mechanical Design Parameters"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Control and Programming Elements"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Intelligent Robotics and Applications"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece245": {
    "current": {
      "code": "ECE245",
      "name": "Elements Of Robotics Laboratory",
      "fullTitle": "ECE245 — Elements Of Robotics Laboratory",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 1,
      "l": 0,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This practical laboratory course develops skills in robot anatomy, actuators, robot specifications, coordinate systems, programming, kinematics, trajectory planning, sensors, end effectors, and autonomous path planning. Students use robotic simulation software, robotic arms, and mobile or humanoid robots to analyze, program, and implement robotic applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 9,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Specifications of Robot"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Robot Coordinate System"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Forward Kinematics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Inverse Kinematics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "I’m organizing the notes around the planning method, Cartesian straight-line generation, the two-link planar kinematics, and the Orangewood arm implementation. The equations will distinguish Cartesian path generation from joint-space execution, since that distinction is central to obtaining a genuinely straight end-effector path.# Unit 6: Trajectory Planning"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "End Effectors and Sensors"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Programming the Robot"
        },
        {
          "unitNumber": 8,
          "unit": "Unit8",
          "title": "Study of Actuators"
        },
        {
          "unitNumber": 9,
          "unit": "Unit9",
          "title": "Exams & Practice"
        }
      ]
    },
    "reappear": null
  },
  "ece246": {
    "current": {
      "code": "ECE246",
      "name": "Sensors For Robotics",
      "fullTitle": "ECE246 — Sensors For Robotics",
      "semester": "Sem3",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization (AI and Robotics)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the principles and characteristics of robotic sensors, including position, motion, force, environmental, vision, proximity, and tactile sensors. It also addresses sensor interfacing, sensor fusion, navigation, and sensor-based robotic applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 4",
            "weightage": "50%",
            "syllabus": "It will have 6 questions, 5 marks each, based on units 1 and 2. Out of which, a minimum of one question will be scenario based.",
            "format": "Rubric To determine a student's ability to complete certain tasks on knowledge of content."
          },
          {
            "name": "Project - Design project",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Execution - 15; Viva - 10; Project Report and Presentation - 5",
            "format": "Rubric To develop problem-solving, design, and implementation skills through a structured engineering project."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "The syllabi of CA1 and CA2 will be considered for CA3. 30 marks; 6 questions, each question carrying 5 marks.",
            "format": "Rubric To determine a student's ability to complete certain tasks on knowledge of content."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Force & Velocity Transducers"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Position & Light Transducers"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Robot Vision Sensors"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Robot Tactile Sensors"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Robotic Sensor Applications and Use cases from Industry"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse316": {
    "current": {
      "code": "CSE316",
      "name": "Operating Systems",
      "fullTitle": "CSE316 — Operating Systems",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamentals of operating systems, including OS structure, process management, CPU scheduling, synchronization, and deadlock handling. Students will also learn about memory management techniques like paging and segmentation, as well as disk scheduling methods.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 2 / 10",
            "weightage": "50%",
            "syllabus": "Project-Based.Project will be a group task but submission will be on an individual basis. There can be a maximum of 3 students in a group, who will be assigned different modules of the same project.Non-submission of the project report on UMS will result in 0 marks.",
            "format": ""
          },
          {
            "name": "Test",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "MCQ based. There will be a total of 30 questions, with each question carrying 1 mark. There will be a negative marking of 0.25 marks for each incorrect answer.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "CPU Scheduling"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Process Synchronization"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Deadlock & Security"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Memory Management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "File Management"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "CSE316",
      "name": "Operating Systems",
      "fullTitle": "CSE316 — Operating Systems",
      "semester": "Sem3",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development in operating systems, covering OS structure, process management, CPU scheduling, synchronization, and deadlock handling. It also addresses memory management techniques, file management, and device management to facilitate process coordination.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "CPU Scheduling"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Process Synchronization and Threads"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Deadlock, Protection and Security"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Memory Management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "File Management, Device Management and Inter Process Communication"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "csc104": {
    "current": null,
    "reappear": {
      "code": "CSC104",
      "name": "It Fundamentals",
      "fullTitle": "CSC104 — It Fundamentals",
      "semester": "Sem3",
      "termType": "reappear",
      "termId": "25261",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on skill development in IT fundamentals, enabling students to understand Windows OS architecture, manage systems using security tools, and automate tasks through Bash and PowerShell scripting.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Windows Security, User Management, and Networking"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Bash Scripting Fundamentals"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Advanced Bash Scripting & Automation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "PowerShell Basics and Core Concepts"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Advanced PowerShell and Automation"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse211": {
    "current": {
      "code": "CSE211",
      "name": "Computer Organization And Design",
      "fullTitle": "CSE211 — Computer Organization And Design",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the basics of organization and architecture of a digital computer, including concepts of instruction sets, microprocessor design, input-output units, and memory systems. It also analyzes modern computing architectures, Verilog HDL, and trends in computer architecture.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "MCQ based question on unit 1,2. Questions must follow analytical and scenario based approach and also must follow revised blooms taxonomy",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "MCQ based question on unit 3,4 and 5. Questions must follow analytical and scenario based approach and must follow blooms taxonomy",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Central Processing Unit"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Input-Output Organization"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to HDLs in Digital Systems"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Memory Unit"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to GPU Architecture"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse273": {
    "current": {
      "code": "CSE273",
      "name": "CSE273",
      "fullTitle": "CSE273",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 0,
      "l": 0,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "",
      "gradingScheme": null,
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Pandas for Data Handling"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Exploratory Data Analysis"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Linear Algebra and Calculus"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Statistics for ML"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Statistical Learning Theory"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    },
    "reappear": null
  },
  "cse310": {
    "current": {
      "code": "CSE310",
      "name": "Programming In Java",
      "fullTitle": "CSE310 — Programming In Java",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on Java programming constructs, Object-Oriented Programming principles, inheritance, exception handling, multithreading, and the use of collections and generics. It aims to develop skills in creating efficient, reusable code and managing advanced Java applications involving database connectivity.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "50",
        "mid_term_examination": "0",
        "end_term": "45"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first 2 CAs are mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Programming Practice",
            "timing": "Wk 1 / 13",
            "weightage": "30%",
            "syllabus": "Evaluation of individual student progress based on approx. 90 coding problems and 90 MCQs on a third party platform. Students must solve at least 50% to qualify.",
            "format": "Rubric Marks calculated by prorating eligible marks with percentage of marks scored in proctored Coding Contests."
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 5 / 6",
            "weightage": "40%",
            "syllabus": "Mandatory written test of one hour duration covering topics completed in week 5 and 6.",
            "format": ""
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 9 / 10",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 Marks) and Coding Problems (20 Marks). Part of 'Best out of 2' along with Test - Code based 3.",
            "format": ""
          },
          {
            "name": "Test - Code based 3",
            "timing": "Wk 12 / 13",
            "weightage": "30%",
            "syllabus": "Mix of MCQs (10 Marks) and Coding Problems (20 Marks). Part of 'Best out of 2' along with Test - Code based 2.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "45%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Loops, Arrays, and OOP Concepts"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Inheritance and Polymorphism"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Nested Class, Lambda Expressions, and Exceptions"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "I/O Fundamentals, Generics, and Multithreading"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Collections and Java Database Programming"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse325": {
    "current": {
      "code": "CSE325",
      "name": "Operating Systems Laboratory",
      "fullTitle": "CSE325 — Operating Systems Laboratory",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 1,
      "l": 0,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This laboratory course covers practical operating systems concepts including Linux command-line tools, Bash shell scripting, low-level file and directory operations using OS system calls, process and thread management, and inter-process communication mechanisms.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          },
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Shell Scripting"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "File system management"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Process Management & Signals"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Multithreading & Synchronization"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Inter-Process Communication (IPC)"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse408": {
    "current": {
      "code": "CSE408",
      "name": "Design And Analysis Of Algorithms",
      "fullTitle": "CSE408 — Design And Analysis Of Algorithms",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course develops skills in designing and analyzing efficient algorithms using complexity analysis, divide-and-conquer, dynamic programming, greedy methods, graph algorithms, transform-and-conquer, backtracking, branch and bound, and approximation techniques. It also covers string matching, computational geometry, advanced sequence-processing techniques, and computational complexity classes.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Individual assessment comprising 15 MCQs to evaluate conceptual understanding and programming skills.",
            "format": "Rubric Assess students' conceptual understanding, analytical thinking, and problem-solving skills related to algorithmic concepts through objective and coding-based assessment."
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Individual assessment comprising 15 MCQs to evaluate conceptual understanding and programming skills.",
            "format": "Rubric Assess students' conceptual understanding, analytical thinking, and problem-solving skills related to algorithmic concepts through objective and coding-based assessment."
          },
          {
            "name": "Test - Code based",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "Individual BYOD-based practical coding assessment comprising MCQs and 2 programming problems requiring students to design, implement, test, and optimize algorithmic solutions.",
            "format": "Rubric Assess students' programming proficiency by designing, implementing, and testing efficient algorithmic solutions in a practical environment."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "String Matching Algorithms and Computational Geometry"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Dynamic Programming"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Graph Algorithms, Network Optimization, and Greedy Technique"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Transform-and-Conquer and Advanced Algorithmic Techniques"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Backtracking, Approximation, and Complexity Classes"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int428": {
    "current": {
      "code": "INT428",
      "name": "Artificial Intelligence Essentials",
      "fullTitle": "INT428 — Artificial Intelligence Essentials",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 1,
      "syllabusPdf": null,
      "courseDescription": "This course covers the essentials of Artificial Intelligence, from foundational concepts and search algorithms to machine learning, deep learning, and generative AI. Students will learn to apply various AI techniques and tools to solve real-world problems, including model deployment and MLOps.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Skill Based Assignment",
            "timing": "Wk 4 / 12",
            "weightage": "33%",
            "syllabus": "Students are required to create a small AI product, such as a chatbot, utilizing modern Generative AI tools, or draft a patent showcasing a novel AI-driven solution to a real-world problem. Marks distribution for students would be: Problem Identification & Innovation- 10, Technical Execution & Skill Demonstration- 10, and Presentation and Q&A- 10.",
            "format": "Rubric Problem Identification & Innovation- 10, Technical Execution & Skill Demonstration- 10, and Presentation and Q&A- 10."
          },
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "33%",
            "syllabus": "Syllabus of the test will be unit 1 and unit 2.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Problem Solving & Search in AI / AI problem design"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Machine Learning"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to deep neural networks / Modern NLP"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Generative AI & Ethics / Prompt Engineering"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Data Analysis & Visualization / AI Model Environments & Lifecycle Basics"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mth302": {
    "current": {
      "code": "MTH302",
      "name": "Probability And Statistics",
      "fullTitle": "MTH302 — Probability And Statistics",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 4,
      "l": 3,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This subject provides an overview of random variables, probability distributions, correlation, regression, and statistical tests, enabling students to apply these concepts to engineering problems and analyze estimators.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5/6",
            "weightage": "50%",
            "syllabus": "To evaluate students' understanding and application of random variables/distributions (pmf, pdf, CDF, moments to fourth order), simple linear regression (plots, fit, assumptions), and correlation (Pea properties.",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 11/12",
            "weightage": "50%",
            "syllabus": "To assess students' understanding of the exponential, gamma, and normal distributions; the normal approximation to the binomial and the CLT (statements only); MGFs (statements only); and core estimati",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Correlation and Linear regression"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Special Discrete Distributions"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Special Continuous Distributions"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Point Estimation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Testing of Hypothesis"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pea305": {
    "current": {
      "code": "PEA305",
      "name": "Analytical Skills-I",
      "fullTitle": "PEA305 — Analytical Skills-I",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course aims to develop students' analytical skills by applying procedural fluency with number systems and mathematical operations to solve problems related to percentage, profit & loss, data series, ratio, proportion, permutation, combination, and reasoning.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "30 MCQ will be asked covering topics from Lecture No. 1 to 9, Duration of the first CA is 45 minutes and 25 % negative marking will be imposed for every incorrect answer",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "30 MCQs will be asked covering topics from Lecture No. 11 to 18, Duration of the second CA is 45 minutes and 25% negative marking will be imposed for every incorrect answer",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Percentage, Profit Loss Discount"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Logical reasoning"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Ratio and proportions, Alligation and mixtures"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Permutation and combination, Probability"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Simple and compound interest, Analytical reasoning"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pea307": {
    "current": {
      "code": "PEA307",
      "name": "Advanced Analytical Skills-I",
      "fullTitle": "PEA307 — Advanced Analytical Skills-I",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on developing advanced analytical skills, including numeration, percentage, ratio, counting methods, and logical reasoning, to prepare students for competitive examinations and enhance their employability.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "30 MCQ type questions would be asked covering topics from Lecture No. 1 to 9, Duration of the first CA is 40 minutes and 25 negative marking will be imposed for every incorrect answer",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "30 MCQ type questions would be asked covering topics from Lecture No. 11 to 18, Duration of the second CA is 40 minutes and 25 % negative marking will be imposed for every incorrect answer",
            "format": ""
          },
          {
            "name": "Test 3",
            "timing": "Wk 13 / 14",
            "weightage": "50%",
            "syllabus": "30 MCQ type questions would be asked covering topics from Lecture No. 20 to 26, Duration of the third CA is 40 minutes and 25% negative marking will be imposed for every incorrect answer",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced percentage and Income based questions"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Flow chart and Alpha numeric coding"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Advanced ratio and proportion, Components and blending"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Counting methods and Probability"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Interest based problems, Analytical reasoning and Non verbal reasoning"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse274": {
    "current": {
      "code": "CSE274",
      "name": "Applied Machine Learning",
      "fullTitle": "CSE274 — Applied Machine Learning",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Through this course, students learn to explain types of data and data pre-processing concepts, apply feature engineering, and use dimensionality reduction techniques. They also learn to compare and implement nonlinear, regression, ensemble, and clustering models using appropriate evaluation metrics.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 12",
            "weightage": "66%",
            "syllabus": "To check the student learnability of Applied ML. To implement all the topics in a practical way",
            "format": ""
          },
          {
            "name": "Test - Code based",
            "timing": "Wk 5 / 6",
            "weightage": "34%",
            "syllabus": "To check the student learnability of Applied ML. Syllabus will be UNIT-1,2,and 3",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Feature Engineering and Dimensionality Reduction"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linear & Probabilistic Classification Models"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Regression"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Ensemble Learning"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Unsupervised Learning"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse275": {
    "current": {
      "code": "CSE275",
      "name": "Optimization Techniques For Machine Learning",
      "fullTitle": "CSE275 — Optimization Techniques For Machine Learning",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject explores optimization techniques in machine learning and artificial intelligence systems, covering population-based, evolutionary, swarm intelligence, hybrid, and metaheuristic algorithms. It focuses on applying these methods for feature selection, model optimization, hyperparameter tuning, and developing real-world solutions.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "50%",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 6",
            "weightage": "50%",
            "syllabus": "This assessment aims to measure students' comprehension of key optimization concepts, including gradient-based and gradient-free techniques, evolutionary algorithms, and swarm intelligence methods. The test includes both theoretical and applied components – short-answer questions, problem-solving exercises, and case-based scenarios.",
            "format": ""
          },
          {
            "name": "Project",
            "timing": "Wk 11",
            "weightage": "50%",
            "syllabus": "To enable students to apply theoretical knowledge of optimization algorithms to practical machine learning problems. Students are required to identify a suitable dataset, define an optimization objective (e.g., feature selection, hyperparameter tuning, or model performance enhancement), and design an algorithmic solution using evolutionary, swarm, or hybrid optimization techniques.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Evolutionary Algorithms"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Swarm Intelligence Techniques"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Advanced Nature-Inspired Optimization"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Optimization for Machine Learning and AutoML"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Hybrid Optimization and Applications"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int219": {
    "current": {
      "code": "INT219",
      "name": "Front End Web Developer",
      "fullTitle": "INT219 — Front End Web Developer",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability, entrepreneurship, and skill development in front-end web technologies. It covers HTML5 structure, CSS3 principles for responsive design, JavaScript fundamentals for interactivity, advanced asynchronous concepts, DOM manipulation, and TypeScript for type-safe development.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 12",
            "weightage": "50%",
            "syllabus": "The student will develop project using HTML, CSS, JavaScript/TypeScript. Category 1: Problem Statement–Based Projects or Category 2: Revenue-Generating Projects.",
            "format": "Rubric Functionality; User Interface; Code Quality, Implementation & Presentation; Video Presentation; Social Media Presence"
          },
          {
            "name": "Visual Implementation",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "The student will design a responsive website using HTML, CSS and JavaScript along with its ES6 features",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "JavaScript Programming Fundamentals"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Advanced JavaScript and Asynchronous Programming"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "DOM Manipulation and Modern Tooling"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "TypeScript Fundamentals"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "TypeScript for Web Applications and Quality Assurance"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int222": {
    "current": {
      "code": "INT222",
      "name": "Advanced Web Development",
      "fullTitle": "INT222 — Advanced Web Development",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Visual Implementation",
            "timing": "Wk 5",
            "weightage": "50%",
            "syllabus": "To check the practical understanding of students. This will include topics such as modules, eventEmitter, fs , JSON, streams, zlib, http, express, sockets and middlewares.",
            "format": "Rubric written(15), viva(5), code quality and implementation(10)"
          },
          {
            "name": "Project",
            "timing": "Wk 12",
            "weightage": "50%",
            "syllabus": "To develop a web app using Node.js. Students will be able to create live web based applications using Node.js.",
            "format": "Rubric User interface(5), Functionality(5), Code quality and presentation(10), Video presentation-content quality(5), Social media reach(5)"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Implementing HTTP Services & Basic Websites With Node.JS"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Socket Services in Node.js & Creating middlewares"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Getting Started with MongoDB & Introduction to Mongoose"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to PostgreSQL"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Testing and Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT222",
      "name": "Advanced Web Development",
      "fullTitle": "INT222 — Advanced Web Development",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Implementing HTTP Services & Basic Websites With Node.JS"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Socket Services in Node.js & Creating middlewares"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Getting Started with MongoDB & Introduction to Mongoose"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to PostgreSQL"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Testing and Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int242": {
    "current": {
      "code": "INT242",
      "name": "Cyber Security Essentials",
      "fullTitle": "INT242 — Cyber Security Essentials",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces fundamental concepts of information security, threats, and vulnerabilities. It covers authentication, secure network architecture, cloud security, endpoint defenses, incident response, and risk management.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 5 / 7",
            "weightage": "50%",
            "syllabus": "The test shall consist of memory based or analytical type multiple choice questions. Test shall consist of memory based or analytical type multiple choice 30 questions each of 1 mark each.",
            "format": ""
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 10 / 12",
            "weightage": "50%",
            "syllabus": "Test will be hands-on practical using Virtual environment (VMWARE workstation/Oracle Virtual Box). Based on CompTIA Security+ certification, having 2 questions of 10 marks each (Job evaluation-20 marks and viva-10 marks)",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Identity and Access Management and Secure Enterprise Network Architecture"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Secure Cloud Network Architecture, Resiliency, and Vulnerability Management"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Network, Endpoint, and Application Security Capabilities"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Incident Response, Monitoring, and Indicators of Malicious Activity"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Risk Management Processes, Data Protection, and Compliance"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int249": {
    "current": {
      "code": "INT249",
      "name": "System Administration",
      "fullTitle": "INT249 — System Administration",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the administration of Windows and Linux server operating systems. Students will learn about the installation process, basic server configuration, storage solutions, server hardening, and managing permissions, networks, and packages.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          },
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Performing Basic Server Configuration, Administering the Server & Implementing Storage Solutions"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Securing The Server"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Performing Basic Linux Tasks, Managing Users, Groups, Permissions & Storage"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Managing Files, Directories, Linux Boot Process & Kernel Modules"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Managing Devices & Networking"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int255": {
    "current": {
      "code": "INT255",
      "name": "Mathematics Behind Machine Learning",
      "fullTitle": "INT255 — Mathematics Behind Machine Learning",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course aims to equip students with the mathematical foundations necessary for understanding and applying machine learning models, covering topics such as linear algebra, probability, optimization techniques, and regularization methods.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "To assess individual student learning outcomes through a Subjective Test.",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 10 / 12",
            "weightage": "50%",
            "syllabus": "To measure and check for individual student understanding of the subject through a Subjective Test.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Matrix Decompositions for Representation Learning"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Probability Theory and Loss Functions for Machine Learning"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Optimization Techniques for Machine Learning"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Mathematical Foundations of Support Vector Machines"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Regularization and Generalization Theory"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "csc202": {
    "current": {
      "code": "CSC202",
      "name": "System Administration",
      "fullTitle": "CSC202 — System Administration",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamentals of Linux system administration, including managing users, groups, permissions, files, and software. Students will also learn to administer system services, configure network settings, and apply Linux security.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Test shall consist of 30 multiple choice questions of 1 mark each",
            "format": ""
          },
          {
            "name": "Test 2",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "Test shall consist of 30 multiple choice questions of 1 mark each",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Configuring Permissions and File Management"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Managing Software and Storage"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Managing Devices, Processes, Memory, and the Kernel"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Configuring Network Security"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Using Infrastructure as Code"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "csc203": {
    "current": {
      "code": "CSC203",
      "name": "Introduction To Blockchain",
      "fullTitle": "CSC203 — Introduction To Blockchain",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces students to the basic concepts of blockchain technology, distributed computing, and cryptography. It covers the functionality of Bitcoin and Ethereum blockchains, smart contracts, and their applications in various business domains.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 3 / 4",
            "weightage": "50%",
            "syllabus": "Academic task shall consist of concept based questions of 5 marks or 10 marks out of syllabus",
            "format": ""
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "Practical of 30 marks scenario based questions",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Cryptography Basics"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Basic Distributed Computing and Cryptography"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Bitcoin Basics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Ethereum Basics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Blockchain Vertical Solutions and Use Cases"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ert425": {
    "current": {
      "code": "ERT425",
      "name": "Entrepreneurship And Business Basics",
      "fullTitle": "ERT425 — Entrepreneurship And Business Basics",
      "semester": "Sem4",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 2,
      "l": 0,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course provides an understanding of entrepreneurship and its industry implications. Students will learn to measure environmental factors for business ideas, structure the product development process, and formulate business plan components and strategies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Presentation - Group 1",
            "timing": "Wk 2 / 5",
            "weightage": "50%",
            "syllabus": "The student will work in a group of comfortable size (3 to 5 students per group) and perform business environment analysis (macro and micro factors) for business opportunity identification. They need to pick a product or service and make a detailed presentation on the environment scanning (macro and micro factors), need assessment, resource assessment and further will prepare market and operation plan for the identified business idea",
            "format": "Rubric Environment scanning: 10 Marks, Need assessment: 2 marks, Resource assessment: 3Marks, Proposed Solution/Business Idea- 5 Marks, Marketing Plan- 5 Marks, Operations plan- 5 Marks"
          },
          {
            "name": "Presentation - Group 2",
            "timing": "Wk 9 / 11",
            "weightage": "50%",
            "syllabus": "Group of students will create a business plan by approving the idea from the course instructor. Business plan will be presented in the form of power point presentation in front of class and must include financial, human resource plan. The group will also develop social media pages and prepare suitable content for their social media pages.",
            "format": "Rubric Business Objectives- 5 Marks, Financial Plan- 8 Marks, Human resource plan-7 Marks, Social Media Pages -10 Marks"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 5,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Business Opportunity"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Components of a Business Plan"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Idea generation using AI"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Market launch through social media"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse376": {
    "current": {
      "code": "CSE376",
      "name": "Automated Testing",
      "fullTitle": "CSE376 — Automated Testing",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The subject covers automated software testing, including test automation tools, bug reporting and tracking, test-case design, Java testing frameworks, structural testing, code coverage, and test management and reporting. Students use tools and frameworks such as Bugzilla, Jenkins, JUnit 5, TestNG, Maven, Gherkin, EclEmma, and Selenium-related technologies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Case based practical questions will be given to the student",
            "format": "Rubric To evaluate student on the basis of practical work"
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "Case based practical questions will be given to the student",
            "format": "Rubric To evaluate student on the basis of practical work"
          },
          {
            "name": "Test",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "MCQ based test which is allocated in 12th week and submission in 13th week",
            "format": "Rubric Student get evaluated on istqb based pattern through mcq test"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Bug Reporting"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Test Administration"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Various Testing Frameworks Available in Java"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Structural Testing Using Automated Tool"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Test Automation and Management/Reporting Frameworks"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse377": {
    "current": {
      "code": "CSE377",
      "name": "Web Automation Testing",
      "fullTitle": "CSE377 — Web Automation Testing",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamentals and application of web automation testing using Selenium IDE, Selenium WebDriver, Maven, TestNG, Selenium Grid, Apache JMeter, Playwright, and Katalon Studio. Students learn to create and execute automated web application test scripts, perform functional and performance testing, conduct cross-browser testing, and generate test reports.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Scenario based problem solving using selenium where student will be evaluated with 50% marks based on tool usage, 40% marks based on conceptual knowledge and 10% marks are based upon Gamification: Evaluation will be based on Sprint duration",
            "format": "Rubric To evaluate the student on the basis of practical usage of Selenium IDE and webdriver tools"
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "Scenario based problem solving using selenium where student will be evaluated with 50% marks based on tool usage, 40% marks based on conceptual knowledge and 10% marks are based upon Gamification: Evaluation will be based on Sprint duration",
            "format": "Rubric To evaluate the student on the basis of practical usage of Selenium Grid, JMeter and PlayWright."
          },
          {
            "name": "BYOD-Practical 3",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "Scenario based problem solving using selenium where student will be evaluated with 50% marks based on tool usage, 40% marks based on conceptual knowledge and 10% marks are based upon Gamification: Evaluation will be based on Sprint duration",
            "format": "Rubric To evaluate the students based on the practical usage of Selenium IDE, Selenium WebDriver, Selenium Grid, Apache JMeter, and Playwright tools"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Selenium IDE and WebDriver"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Selenium Locators"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Selenium Validation and Grid"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Performance Testing Tools"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Web Testing Tools"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse471": {
    "current": {
      "code": "CSE471",
      "name": "Deep Learning For Computer Vision",
      "fullTitle": "CSE471 — Deep Learning For Computer Vision",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers fundamental computer vision and deep learning concepts, convolutional neural networks, transfer learning, object detection, image segmentation, generative vision models, vision-language models, and interpretability techniques. Students apply these techniques to design, implement, evaluate, and document computer vision solutions for real-world problems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "The first CA is mandatory; the best 1 of the remaining 2 also counts.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 11",
            "weightage": "66%",
            "syllabus": "Students are required to carry out a comprehensive computer vision project by covering the entire course syllabus, involving problem identification, dataset selection, text preprocessing, model design and implementation using deep learning and transformer-based approaches, performance evaluation using suitable metrics, and analysis of results, followed by proper documentation and presentation of the work.",
            "format": "Rubric The objective of this project is to apply complete deep learning for computer vision to solve real world problems by designing, implementing and evaluating the techniques."
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "34%",
            "syllabus": "Unit-I and Unit-II will be covered.",
            "format": "Rubric Student will be able to learn the basic concepts of computer vision and deep learning along with Convolution Neural Network architecture."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "34%",
            "syllabus": "Subjective test covering syllabus from Unit-1 to Unit-IV.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Convolutional Neural Networks and Training Techniques"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Transfer Learning and Fine-Tuning for Vision Tasks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Object Detection and Localization"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Image Segmentation and Advanced Vision Architectures"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Generative Vision Models"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse472": {
    "current": {
      "code": "CSE472",
      "name": "Deep Learning For Natural Language Processing",
      "fullTitle": "CSE472 — Deep Learning For Natural Language Processing",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the foundations of Natural Language Processing and advanced deep learning techniques, including word embeddings, sequence models, and transformer architectures. Students learn to apply these models to real-world tasks such as sentiment classification, translation, and text generation.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Word Embeddings and Vector Representations"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Deep Learning Sequence Models for NLP"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Sequence-to-Sequence Models and Attention Mechanisms"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Transformers and Pretrained Language Models"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Generative NLP and LLMs"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece128": {
    "current": {
      "code": "ECE128",
      "name": "Introduction To Iot Networking Protocols",
      "fullTitle": "ECE128 — Introduction To Iot Networking Protocols",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This subject introduces networking fundamentals, IoT architecture, design requirements, communication protocols, security, messaging queues, publish/subscribe communications, lightweight sessions, and IoT applications for value creation.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Assignment - Simulation based",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Students have to solve 3 out of 4 scenario and situation-based questions.",
            "format": "Rubric Evaluate the performance of the students through situation based problem."
          },
          {
            "name": "Project",
            "timing": "Wk 9 / 11",
            "weightage": "50%",
            "syllabus": "Projects are assigned to implement an IoT solution.",
            "format": "Rubric To implement an IoT solution through Project."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject Knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Introduction to IoT"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "IoT-Design Requirements"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "IoT Protocols and Security"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Messaging Queues and Publish/Subscribe Communications"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "IoT Applications for Value Creations"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece237": {
    "current": {
      "code": "ECE237",
      "name": "Architecting Smart Iot Devices",
      "fullTitle": "ECE237 — Architecting Smart Iot Devices",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the architecture and programming of NodeMCU-based smart IoT devices, including input/output devices, PWM, I2C, SPI, Bluetooth, ThingSpeak, and Blynk. Students develop and demonstrate IoT solutions using NodeMCU.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 5 / 7",
            "weightage": "50%",
            "syllabus": "Students have to solve 5 scenario and situation-based questions",
            "format": "Rubric Evaluate the performance of the students through scenario /situation-based problem"
          },
          {
            "name": "Project",
            "timing": "Wk 6 / 14",
            "weightage": "50%",
            "syllabus": "Projects are assigned to implement an IoT.",
            "format": "Rubric To implement an IoT solution through the Project"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Input devices with NodeMCU"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Output devices with NodeMCU"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Programming NodeMCU for PWM"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Bluetooth with NodeMCU"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "IoT with Thingspeak"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int234": {
    "current": {
      "code": "INT234",
      "name": "Predictive Analytics",
      "fullTitle": "INT234 — Predictive Analytics",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Predictive Analytics covers data preprocessing, exploratory data analysis, regression, classification, clustering, association rule mining, dimensionality reduction, neural networks, and ensemble methods. Students apply predictive models, evaluate their performance, and use methods to improve predictive accuracy.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Scenario-based questions will be asked from the students to evaluate their understanding of the various concepts.",
            "format": "Rubric Student will be evaluated on the basis of case based questions."
          },
          {
            "name": "Skill Based Assignment",
            "timing": "Wk 5 / 11",
            "weightage": "50%",
            "syllabus": "Project assessment covering the problem statement and dataset (10 marks); implementation, report, and viva (60 marks), including data cleaning and visualization, EDA and statistical analysis, model development and evaluation, report format, technical writing, and viva; LinkedIn engagement (10 marks); and GitHub contributions through commits, pull requests, and stars (20 marks).",
            "format": "Rubric To understand the knowledge gained by the students in the form of project."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective Test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "SUPERVISED LEARNING: REGRESSION"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "SUPERVISED LEARNING: CLASSIFICATION"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "UNSUPERVISED LEARNING: CLUSTERING AND PATTERN DETECTION"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dimensionality Reduction and Neural Networks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "MODEL PERFORMANCE"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT234",
      "name": "Predictive Analytics",
      "fullTitle": "INT234 — Predictive Analytics",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to understand data preprocessing and exploratory data analysis, apply regression and classification techniques, and analyze clustering algorithms and neural network models to enhance predictive accuracy.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "SUPERVISED LEARNING: REGRESSION"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "SUPERVISED LEARNING: CLASSIFICATION"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "UNSUPERVISED LEARNING: CLUSTERING AND PATTERN DETECTION"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dimensionality Reduction and Neural Networks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "MODEL PERFORMANCE"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int244": {
    "current": {
      "code": "INT244",
      "name": "Securing Computing Systems",
      "fullTitle": "INT244 — Securing Computing Systems",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject covers security operations center fundamentals, incident response, log and network traffic analysis, endpoint threat detection, SIEM, threat intelligence, and cloud security monitoring. It also addresses incident response automation, advanced threat hunting, SOAR, zero-trust security, compliance, and emerging SOC technologies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "Test will be conducted in the form of MCQ questions. The test contains 30 questions, each carrying 1 mark, with no negative marking.",
            "format": "Rubric To evaluate the subject knowledge of each student individually."
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "Complete a penetration testing engagement and submit a Proof of Concept, a detailed vulnerability report for the identified bug, and a technical report describing challenges solved in a recognized cybersecurity competition. Students must generate a minimum revenue of Rs1,000 through legitimate cybersecurity activities such as bug bounty programs or approved security assessments.",
            "format": "Rubric Student can generate revenue through security assessments, bug hunting, cybersecurity and penetration-testing training, or by winning a CTF or similar cybersecurity competition."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering the syllabus from CA1 and CA2.",
            "format": "Rubric To test students' subject knowledge and provide an opportunity to improve their CA performance in case of low marks or a missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Log and Network Traffic Analysis"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Endpoint, SIEM, and Security Analytics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Response Automation and SOC Metrics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Compliance and Cloud Security Operations"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Advanced Threat Hunting and Future Trends"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT244",
      "name": "Securing Computing Systems",
      "fullTitle": "INT244 — Securing Computing Systems",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course covers basic concepts of operating systems, cryptography and ethical hacking, as well as methods of performing footprinting, scanning, and compromising target systems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Footprinting and Scanning"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Enumeration, System Hacking, Malware"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Sniffers, Social Engineering, Denial of Service"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Session Hijacking, Web Servers and Applications, SQL Injection"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Hacking Wi-Fi and Bluetooth, Mobile Device Security, Cloud Technologies and Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int250": {
    "current": {
      "code": "INT250",
      "name": "Digital Evidence Analysis",
      "fullTitle": "INT250 — Digital Evidence Analysis",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers computer forensics and incident response, storage and file systems, forensic data acquisition, and analysis of Windows, Linux, network, web, email, dark web, and malware evidence.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "MCQ-based questions. The test shall consist of 30 questions of 1 mark each.",
            "format": "Rubric Analysis fundamentals of computer forensics and incident response handling process and explain storage systems and file systems."
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "BYOD-Practical consisting of 1 practical question of 30 marks, such that 15 marks will be for practical execution, 5 marks for report, and 10 marks for viva.",
            "format": "Rubric Data acquisition and duplication, and analyze Windows-based forensic artifacts and Linux forensic tools to analyze file systems and memory."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Understanding Hard Disks and File Systems"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data Acquisition and Windows Forensics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Linux and Network Forensics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dark Web, Email, and Web Attacks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Analysis of Malware"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT250",
      "name": "Digital Evidence Analysis",
      "fullTitle": "INT250 — Digital Evidence Analysis",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development in the field of digital evidence analysis, covering computer forensics fundamentals, incident response, and file systems. Students will learn to use various forensic tools for Windows and Linux, analyze web attacks, explore dark web forensics, and interpret malware behavior.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Understanding Hard Disks and File Systems"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data Acquisition, Duplication and Windows Forensics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Linux and Network Forensics"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dark Web Forensics, Investigating Email Crimes and Web Attacks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Analysis of Malware"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int252": {
    "current": {
      "code": "INT252",
      "name": "Web App Development With Reactjs",
      "fullTitle": "INT252 — Web App Development With Reactjs",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops skills in building React.js web applications using modern JavaScript, JSX, reusable functional components, React hooks, forms and validation, client-side routing, API-based data fetching, and shared state management.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 4 / 12",
            "weightage": "50%",
            "syllabus": "Students will design and develop full web applications using React.js by implementing ES6 features, JSX, components, props, state, React Hooks, event handling, routing, API integration, form handling, conditional rendering, component styling, and modern React development practices.",
            "format": "Rubric To assess students' ability to develop an interactive web application using React.js concepts."
          },
          {
            "name": "Visual Implementation",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "This task will cover topics such as ES6 concepts, React.js fundamentals, JSX, component creation, component styling, and related React development concepts.",
            "format": "Rubric To assess students' knowledge of React.js concepts and their ability to implement them in real-world coding scenarios."
          },
          {
            "name": "Test",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "This test will be a code-based MCQ test designed to assess students' understanding of React.js concepts.",
            "format": "Rubric To assess students' understanding of ES6+ JavaScript features, JSX, state management, and form handling."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Component Design and Styling"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "State, Events, Hooks, and Side Effects"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Form Handling and Validation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Client-Server Communication and Routing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Global State, Debugging, and Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT252",
      "name": "Web App Development With Reactjs",
      "fullTitle": "INT252 — Web App Development With Reactjs",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development by teaching students to build web applications with ReactJS. It covers advanced JavaScript concepts, JSX components, state management, hooks, form validation, HTTP methods, routing, and application deployment.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Components and styles in React"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Events, States, Component Lifecycle and Hooks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Working with Forms"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "HTTP Methods and Routing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Redux, Debugging and Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int257": {
    "current": {
      "code": "INT257",
      "name": "Modern Web Application Development",
      "fullTitle": "INT257 — Modern Web Application Development",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers modern web application development using Next.js, including project structure, routing, rendering strategies, data fetching, APIs, Server Actions, authentication, database integration, performance optimization, deployment, and industry practices. Students develop and evaluate full-stack Next.js applications using contemporary web development techniques.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "Students will analyze the given problem, document their solution on paper, implement it using Next.js in VS Code, and justify their approach through a viva examination",
            "format": "Rubric To evaluate students' ability to analyze, design, and develop a Next.js application by applying routing, rendering, and data-fetching concepts"
          },
          {
            "name": "Project",
            "timing": "Wk 3 / 11",
            "weightage": "50%",
            "syllabus": "Students are required to develop a complete Next.js web application that demonstrates the effective use of routing, rendering, data fetching, APIs, authentication, database integration, performance optimization, and deployment. The project will be evaluated based on documentation, implementation, demonstration, code quality, and viva voce.",
            "format": "Rubric To assess students' ability to design, develop, and present a full-stack Next.js web application by applying modern web development concepts"
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 12",
            "weightage": "50%",
            "syllabus": "Students will analyze the given problem, document their solution on paper, implement a complete Next.js web application in VS Code, and justify their design decisions, implementation, and technical approach through a viva examination",
            "format": "Rubric To evaluate students' ability to analyze, design, develop, and justify a full-stack Next.js web application by applying modern web development concepts and industry best practices"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Rendering Strategies and Data Fetching"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "API Development and Server Actions"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Authentication and Database Integration"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Performance, SEO, and Deployment"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Advanced Features and Industry Practices"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int312": {
    "current": {
      "code": "INT312",
      "name": "Big Data Fundamentals",
      "fullTitle": "INT312 — Big Data Fundamentals",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamental concepts and principles of Big Data, the Hadoop ecosystem, and associated tools like Hive, HBase, and Cassandra to analyze and solve big data problems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "To make the students understand the need and importance of fundamental concepts and principles of Big Data and analyze internal functioning of different modules of Big Data and Hadoop",
            "format": ""
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "To make the students prepare for applying tools and techniques to analyze Big data and examine solution for a given problem using suitable Big data techniques",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Hadoop Architecture"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Map Reduce and YARN"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Introduction to Apache Hive"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to Apache HBase"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to Apache Cassandra"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int363": {
    "current": {
      "code": "INT363",
      "name": "Cloud Microservices",
      "fullTitle": "INT363 — Cloud Microservices",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers cloud computing fundamentals, microservices architecture, containerization and orchestration, cloud-native development, economic considerations, and cloud security. Students learn to build and deploy simple cloud-native microservices and analyze issues such as security, interoperability, monitoring, and cost optimization.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "MCQ's based Test",
            "format": "Rubric Student will be able to understand the basics of cloud and microservices"
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "MCQ's based Test",
            "format": "Rubric Student will be able to understand the steps to build a simple microservice and analyze the issues of cloud"
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA 1 and CA 2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Evolution of Cloud Microservices"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Deploying Microservices"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Economic Benefits of Microservices"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Cloud-Native Development"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Cloud Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT363",
      "name": "Cloud Microservices",
      "fullTitle": "INT363 — Cloud Microservices",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the main concepts of cloud, its characteristics, advantages, key technologies, and various delivery and deployment models. It explores the fundamental differences in design and operation between microservices and monolithic architectures, including containerization and orchestration.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Evolution of Cloud Microservices"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Deploying Microservices"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Economic Benefits of Microservices"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Cloud-Native Development"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Cloud Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int364": {
    "current": {
      "code": "INT364",
      "name": "Cloud Architecture And Implementation-Ii",
      "fullTitle": "INT364 — Cloud Architecture And Implementation-Ii",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course introduces AWS cloud architecture and implementation, including disaster recovery, secure networking, storage and compute, databases, monitoring, automation, serverless applications, and container-based microservices. Students develop practical skills in designing, deploying, securing, and optimizing resilient AWS solutions.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Practical test covering knowledge of AWS services.",
            "format": "Rubric To test the student's knowledge based on AWS services."
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "Practical test covering knowledge of AWS services.",
            "format": "Rubric To test the student's knowledge based on AWS services."
          },
          {
            "name": "BYOD-Practical 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Practical-based test covering CA1 and CA2.",
            "format": "Rubric To test the practical knowledge of the students and provide an opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Networking and Connectivity in AWS"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Storage and Compute Services"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Databases and Data Management"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Resiliency, Monitoring, and Automation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Serverless and Microservices Architectures"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": {
      "code": "INT364",
      "name": "Cloud Architecture And Implementation-Ii",
      "fullTitle": "INT364 — Cloud Architecture And Implementation-Ii",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course covers AWS architecture, global infrastructure, security services, secure and scalable networks, storage and compute solutions, and relational and NoSQL databases on AWS.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Networking and Connectivity in AWS"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Storage and Compute Services"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Databases and Data Management"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Resiliency, Monitoring, and Automation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Serverless and Microservices Architectures"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse330": {
    "current": {
      "code": "CSE330",
      "name": "Competitive Coding Approaches-Techniques",
      "fullTitle": "CSE330 — Competitive Coding Approaches-Techniques",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 1,
      "syllabusPdf": null,
      "courseDescription": "This subject develops competitive coding skills through algorithm complexity analysis, primality testing, recursion, backtracking, dynamic programming, and efficient sorting algorithms. Students apply these techniques to solve computational and optimization problems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test - Code based 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "To evaluate the understanding of students related to Algorithm Analysis and Primality Testing.",
            "format": "Rubric Unit1, Unit 2 syllabus will be considered for evaluation."
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Unit 3 and unit 4 syllabus will be considered for evaluation.",
            "format": "Rubric To evaluate the understanding of students related to Recursion and Dynamic Programming."
          },
          {
            "name": "Test - Code based 3",
            "timing": "Wk 13 / 14",
            "weightage": "50%",
            "syllabus": "Unit 5 and Unit 6 will be considered for the evaluation.",
            "format": "Rubric To evaluate the understanding of students related to Advanced Dynamic Programming and Efficient Sorting Algorithms."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Primality Testing"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Recursion and Advanced Techniques"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Basic Dynamic Programming"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Dynamic Programming Problems"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Efficient Sorting Algorithms & Analysis"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse333": {
    "current": {
      "code": "CSE333",
      "name": "Combinatorial Studies-I",
      "fullTitle": "CSE333 — Combinatorial Studies-I",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Combinatorial Studies-I covers discrete mathematics, graph theory, combinatorics, linear algebra, calculus, probability and statistics, and numerical ability. It develops problem-solving skills in logic, algebraic and graph structures, mathematical analysis, probability distributions, and numerical reasoning.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "30",
        "mid_term_examination": "25",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 5,
        "evaluationRule": "Best 4 of 5 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 2 / 3",
            "weightage": "25%",
            "syllabus": "Format: MCQs (Single/Multiple correct). Coverage: Propositional logic; first order logic; sets, relations and functions; partial orders and lattices. Duration: 40-50 minutes. Mode: Offline.",
            "format": "Rubric To assess students' understanding of mathematical logic and discrete structures through multiple choice questions covering the syllabus."
          },
          {
            "name": "Test 2",
            "timing": "Wk 5 / 6",
            "weightage": "25%",
            "syllabus": "Format: MCQs (Single/Multiple correct). Coverage: Monoids and groups; combinatorics, including counting principles, recurrence relations and generating functions. Duration: 40-50 minutes. Mode: Offline.",
            "format": "Rubric To assess students' understanding of algebraic structures and combinatorial techniques through multiple choice questions covering the syllabus."
          },
          {
            "name": "Test 3",
            "timing": "Wk 8 / 9",
            "weightage": "25%",
            "syllabus": "Format: MCQs (Single/Multiple correct). Coverage: Graphs, including connectivity, matching, colouring, trees, planarity and related counting results. Duration: 40-50 minutes. Mode: Offline.",
            "format": "Rubric To assess students' ability to apply graph-theoretic concepts through multiple choice questions covering the syllabus."
          },
          {
            "name": "Test 4",
            "timing": "Wk 10 / 11",
            "weightage": "25%",
            "syllabus": "Format: MCQs (Single/Multiple correct). Coverage: Matrices, determinants, systems of linear equations, eigenvalues and eigenvectors, LU decomposition; limits, continuity and differentiability, maxima and minima, mean value theorem, and integration. Duration: 40-50 minutes. Mode: Offline.",
            "format": "Rubric To assess students' understanding of linear algebra and calculus through multiple choice questions covering the syllabus."
          },
          {
            "name": "Test 5",
            "timing": "Wk 12 / 13",
            "weightage": "25%",
            "syllabus": "Format: MCQs (Single/Multiple correct). Coverage: Random variables; uniform, normal, exponential, Poisson and binomial distributions; mean, median, mode and standard deviation; conditional probability and Bayes theorem; along with a comprehensive component from the full CSE-333 syllabus. Duration: 40-50 minutes. Mode: Offline.",
            "format": "Rubric To assess students' understanding of probability and statistics and integrated command over the complete syllabus through multiple choice questions."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "25%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Graphs and Combinatorics"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Linear Algebra"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Calculus"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Probability"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Numerical Ability"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pea306": {
    "current": {
      "code": "PEA306",
      "name": "Analytical Skills-Ii",
      "fullTitle": "PEA306 — Analytical Skills-Ii",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 2,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course develops analytical and quantitative problem-solving skills through topics including time and work, pipes and cisterns, syllogism, mensuration, calendars, clocks, time-speed-distance, seating arrangements, data interpretation, and data sufficiency. Students apply these concepts to solve placement and competitive test problems within stipulated time.",
      "gradingScheme": {
        "attendance": "10",
        "continuous_assessment": "35",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first CA is mandatory; the best 2 of the remaining 3 also count.",
        "components": [
          {
            "name": "Assignment",
            "timing": "Wk 1 / 14",
            "weightage": "40%",
            "syllabus": "Tests will be taken on the practice platform.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time."
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 1 to 8. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time."
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 9",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 10 to 18. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time."
          },
          {
            "name": "Test 3",
            "timing": "Wk 13 / 14",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 20 to 26. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Syllogism and Number Ranking Test"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Mensuration, Calendar, and Clocks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Time, Distance, Trains, Boats and Streams"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Height, Distance, and Analytical Reasoning"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Data Interpretation and Data Sufficiency"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pea308": {
    "current": {
      "code": "PEA308",
      "name": "Advanced Analytical Skills-Ii",
      "fullTitle": "PEA308 — Advanced Analytical Skills-Ii",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 2,
      "t": 1,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This subject develops advanced analytical and quantitative problem-solving skills for placement and competitive tests. It covers efficiency, logical reasoning, mensuration, calendars and clocks, time-speed-distance, trigonometry, seating arrangements, coded inequalities, data interpretation, and data sufficiency.",
      "gradingScheme": {
        "attendance": "10",
        "continuous_assessment": "35",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "The first CA is mandatory; the best 2 of the remaining 3 also count.",
        "components": [
          {
            "name": "Assignment",
            "timing": "Wk 1 / 14",
            "weightage": "40%",
            "syllabus": "Test will be taken on the practise platform",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time"
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 1 to 8. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time"
          },
          {
            "name": "Test 2",
            "timing": "Wk 8 / 9",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 10 to 18. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time"
          },
          {
            "name": "Test 3",
            "timing": "Wk 13 / 14",
            "weightage": "30%",
            "syllabus": "20 MCQs will be asked covering topics from Lecture No. 20 to 26. Duration of the first CA is 30 minutes and 25% negative marking will be imposed for every incorrect answer.",
            "format": "Rubric To test the ability of students to solve the questions in stipulated time"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "15%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Syllogism, Time Sequence and Ranking"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Mensuration, Calendar and Clocks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Time, Speed and Moving Objects"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Trigonometry, Seating and Coded Inequalities"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Data Interpretation and Data Sufficiency"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pes390": {
    "current": {
      "code": "PES390",
      "name": "Soft Skills",
      "fullTitle": "PES390 — Soft Skills",
      "semester": "Sem5",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 2,
      "t": 2,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course develops placement-oriented soft skills through verbal reasoning, resume and digital profile optimization, video CV and portfolio creation, professional speaking, interview preparation, and group discussion practice. It emphasizes grammatical accuracy, structured communication, personal branding, AI-assisted career tools, and evidence-based reasoning.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "NA",
        "end_term": "55"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "All 4 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment",
            "timing": "Wk 2 / 6",
            "weightage": "25%",
            "syllabus": "Students must justify and upload an ATS-friendly CV, demonstrate professional presentation and formatting, accurate spelling and grammar, complete contact information and professional links, a skills summary, work experience, internships or projects, certifications and achievements, alignment with a job description, and an ATS score above 80. They must also upload the CV to the placement portal for approval and create the first draft of a portfolio.",
            "format": "Rubric CV justification and uploading: 30 marks, covering presentation and formatting (2), spelling and grammar (2), contact information and professional links (2), skills summary (2), work experience/internships/projects (3), certifications and achievements (2), CV alignment with job description (4), ATS score above 80 (3), CV justification (4), and placement portal upload and approval plus first portfolio draft (6). A placement-registered student receives zero if the CV is not uploaded and approved. A non-registered student must submit a trainer-signed hard copy of the approved CV during CA or receive zero."
          },
          {
            "name": "Test",
            "timing": "Wk 3 / 4",
            "weightage": "25%",
            "syllabus": "Students complete an objective assessment containing error-correction questions across six fundamental grammar categories. They identify the incorrect part of each sentence and select or provide the appropriate correction, demonstrating grammatical knowledge, attention to detail, and accurate application of language concepts used in placement aptitude tests and professional communication.",
            "format": "Rubric To assess students' ability to identify grammatical errors and apply standard English grammar rules accurately."
          },
          {
            "name": "Interview",
            "timing": "Wk 10 / 11",
            "weightage": "25%",
            "syllabus": "Students participate in a mock interview conducted by the trainer and answer a series of questions. They must bring general and specialized resumes in the prescribed format, be prepared to discuss their qualifications and experience, and wear an ID card.",
            "format": "Rubric CV approved on the placement portal: 5 marks; grooming and etiquette: 5 marks; language proficiency: 5 marks; comprehension of questions and justification with examples: 10 marks; body language and confidence: 5 marks."
          },
          {
            "name": "Group Discussion",
            "timing": "Wk 12 / 13",
            "weightage": "25%",
            "syllabus": "Students participate in groups of 8-10 and discuss an on-the-spot current affairs, social, technical, or abstract topic for 12-15 minutes. They must support their viewpoints with facts, figures, examples, and justification, maintain formal dress and appropriate decorum, and use techniques including KWA, SPELT, POPBEANS, SCAMPER, and VAP.",
            "format": "Rubric Content and analysis of topic: 10 marks; language proficiency: 10 marks; grooming and body language: 5 marks; effective use of group discussion vocabulary and interpersonal skills: 5 marks."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "55%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "CV Customization and Digital Profile Optimization"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Content Creation Skills"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Voice Modulation and Intonation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Interview Practice"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Group Discussion Practice"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse322": {
    "current": null,
    "reappear": {
      "code": "CSE322",
      "name": "Improvement/ReAppear • 2023 Batch · 2025-26 Term 1",
      "fullTitle": "CSE322",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 0,
      "l": 0,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "",
      "gradingScheme": null,
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "REGULAR EXPRESSIONS AND REGULAR SETS"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "FORMAL LANGUAGES"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "CONTEXT- FREE LANGUAGES"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "PUSHDOWN AUTOMATA AND PARSING"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "TURING MACHINES AND COMPLEXITY"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "pev301": {
    "current": null,
    "reappear": {
      "code": "PEV301",
      "name": "Verbal Ability",
      "fullTitle": "PEV301 — Verbal Ability",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear (Core)",
      "credits": 4,
      "l": 2,
      "t": 2,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to demonstrate proficiency in English grammar, develop strong speaking skills, and employ reading comprehension for professional communication. It focuses on composing professional documents such as CVs, mastering group discussions and job interviews, and building a professional online presence.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "15",
        "end_term": "40"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Story Telling in Professional Setting"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "CV Writing, CV Justification, and Interview Preparation"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Personal Branding, Elevator Pitch and Project Pitching"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Reading Comprehension"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Group Discussion and Analytical Thinking"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int344": {
    "current": null,
    "reappear": {
      "code": "INT344",
      "name": "Natural Language Processing",
      "fullTitle": "INT344 — Natural Language Processing",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 1,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamentals of Natural Language Processing, including linguistic components, text preprocessing, and vector space models. Students explore probabilistic models, deep learning architectures such as RNNs and Transformers, and develop end-to-end systems for applications like chatbots and machine translation.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Vector Space Models"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Natural Language Processing with Probabilistic Models"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Natural Language Processing with Classification Models"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Natural Language Processing with Sequence and Attention Models"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Building Models/ Case Studies"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int374": {
    "current": null,
    "reappear": {
      "code": "INT374",
      "name": "Data Analytics With Power Bi",
      "fullTitle": "INT374 — Data Analytics With Power Bi",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on Data Analytics using Power BI, enabling students to understand the setup, interface, and basic features for data visualization, apply data preparation and modeling techniques, and use DAX functions to create advanced insights and user-friendly dashboards.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Connecting and Preparing Data"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Building and Structuring Data Models"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Advanced Calculations with DAX"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Designing and Enhancing Visual Reports"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Optimizing Power BI Performance"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int394": {
    "current": null,
    "reappear": {
      "code": "INT394",
      "name": "Machine Learning Algorithms",
      "fullTitle": "INT394 — Machine Learning Algorithms",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "Through this course students should be able to analyze foundational concepts and learning paradigms in machine learning, interpret classification techniques and probabilistic models, and understand regression and clustering algorithms for predictive modelling.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Classification"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Non-parametric classification and Ensemble Models"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Regression and Clustering"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Reinforcement Learning"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Model Complexity and Optimization"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int395": {
    "current": null,
    "reappear": {
      "code": "INT395",
      "name": "Supervised Learning",
      "fullTitle": "INT395 — Supervised Learning",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development in the field of supervised learning. It covers data preprocessing, standard classification algorithms, ensemble learning, regression techniques, time series forecasting, and model evaluation strategies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Classification with scikit-learn"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Ensemble Methods and Hyperparameter Tuning"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Regression with scikit-Learn"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Time Series Regression"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Pipelines, Model Evaluation and Model Deployment"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int423": {
    "current": null,
    "reappear": {
      "code": "INT423",
      "name": "Machine Learning-Ii",
      "fullTitle": "INT423 — Machine Learning-Ii",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers unsupervised learning concepts including K-Means and advanced clustering algorithms, anomaly detection methods, reinforcement learning principles such as MDPs and Deep Q-Networks, and the development of recommender systems.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced Clustering Techniques"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Clustering Metrics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Foundations of Reinforcement Learning"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Q-Learning & Deep Q- Networks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Recommender Systems"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "eng606": {
    "current": null,
    "reappear": {
      "code": "ENG606",
      "name": "Contemporary Short Stories",
      "fullTitle": "ENG606 — Contemporary Short Stories",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on contemporary short stories, aiming to help students understand key terms, thematic concerns, and social and cultural issues in fiction. Students will learn to analyze cultural dimensions, interpret structural and stylistic concepts, and develop critical abilities to understand literary works.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Marriage is a Private Affair by Chinua Achebe"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "The Dance of the Happy Shades by Alice Munro"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "The Five-Dollar Smile by Shashi Tharoor"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Interpreter of Maladies by Jhumpa Lahiri"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "The Embassy of Cambodia by Zadie Smith"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "fin212": {
    "current": null,
    "reappear": {
      "code": "FIN212",
      "name": "Basic Financial Management",
      "fullTitle": "FIN212 — Basic Financial Management",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to analyze the importance of financial management and finance functions in a corporate setup, exploring short and long-term sources of finance. It covers concepts such as the time value of money, capital structure, cost of capital, dividend policy, and working capital requirements.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Sources of Finance and Cost of Capital"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Capital Budgeting"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Risk & Return and Leverage"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Capital Structure and Dividend Theory"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Working Capital Management"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "fst801": {
    "current": null,
    "reappear": {
      "code": "FST801",
      "name": "Fashion Studies",
      "fullTitle": "FST801 — Fashion Studies",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course examines historical and contemporary fashion trends, terminology, and the impact of fashion on individual identity and social norms. It covers various aspects of the industry including fashion forms, cycles, influential trends, societal factors, and fashion globalization.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Fashion and terminology"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Language of Fashion"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Fashion and Society"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Most Influential Fashion Trends"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Fashion Globalization"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "geo295": {
    "current": null,
    "reappear": {
      "code": "GEO295",
      "name": "Physical Geography",
      "fullTitle": "GEO295 — Physical Geography",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced Concepts of Geomorphology"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Climatology"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Oceanography"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Biogeography"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Environmental Geography"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "his291": {
    "current": null,
    "reappear": {
      "code": "HIS291",
      "name": "Ancient Indian History And Culture",
      "fullTitle": "HIS291 — Ancient Indian History And Culture",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course explores the history and culture of ancient India, ranging from prehistoric sources and the Vedic era to the rise and decline of empires such as the Mauryas and Guptas. It also covers the analysis of ancient Indian art, architecture, and various schools of art.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Beginning of Historical Age"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "The Great Aryans"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Mauryan Period"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Post Mauryan Period"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Ancient Indian art"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "hrm203": {
    "current": null,
    "reappear": {
      "code": "HRM203",
      "name": "Human Resource Planning And Development",
      "fullTitle": "HRM203 — Human Resource Planning And Development",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development within Human Resource Planning and Development, covering strategic HRM, planning concepts for talent demand, and HRD mechanisms to optimize workforce strategies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "HR Planning Process"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "HRD Concepts"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "HRD Mechanisms"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "HRD Implementation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Contemporary Issues in HRD"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int323": {
    "current": null,
    "reappear": {
      "code": "INT323",
      "name": "Database Essentials Toward Informatica",
      "fullTitle": "INT323 — Database Essentials Toward Informatica",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course focuses on EMPLOYABILITY,SKILL DEVELOPMENT.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Basics of Data Integration"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Data Warehouse"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Multi-dimensional data"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "ETL Processing with SQL Server Integration Services and Rapid Miner"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Cloud Databases and Master Data Management(MDM)"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int331": {
    "current": null,
    "reappear": {
      "code": "INT331",
      "name": "Fundamentals Of Devops",
      "fullTitle": "INT331 — Fundamentals Of Devops",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers the fundamental concepts of DevOps, including its lifecycle, methodology, and tools. Students will learn to use essential tools such as Linux, Git, and Maven, and apply DevOps practices on cloud platforms to streamline software development and operations.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "DevOps on cloud with basic LINUX commands"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Basic Git"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Advanced Git"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "DevOps Trends"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Working with Maven"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "int346": {
    "current": null,
    "reappear": {
      "code": "INT346",
      "name": "Robotic Process Automation",
      "fullTitle": "INT346 — Robotic Process Automation",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development in Robotic Process Automation (RPA), covering concepts such as Task Bots, Meta Bots, and IQ Bots using Automation Anywhere tools. Students learn to build secure, resilient automation workflows, integrate external scripts, and manage bots via the Control Room.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced Task Bot, Meta Bots, and IQ Bots"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Package Actions, Excel Automation, QR Codes, and File Operations"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Credential Vault, Lockers, and Resilient & Scalable Bots"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Extending Automation 360 Capabilities with External Scripts"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Automation Anywhere Control Room and Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "psy291": {
    "current": null,
    "reappear": {
      "code": "PSY291",
      "name": "Psychological Testing",
      "fullTitle": "PSY291 — Psychological Testing",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course explores core concepts and purposes of psychological testing, including the analysis of major types of tests, their role in assessing traits and cognitive functions, and their applications in education, health, and organizational settings.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Types of Psychological Tests"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Psychological Traits"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Stress Management and Performance"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Cognitive Dysfunction and Psychological Testing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Applications and Current Trends"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "soc371": {
    "current": null,
    "reappear": {
      "code": "SOC371",
      "name": "Sociology Of Media",
      "fullTitle": "SOC371 — Sociology Of Media",
      "semester": "Sem5",
      "termType": "reappear",
      "termId": "25261",
      "category": "Improvement/ReAppear",
      "categoryDetail": "Improvement/ReAppear",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development, enabling students to identify the basics of media and its relationship to society. It covers the analysis of media impacts on social phenomena, institutions, and the creation of new social realities.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": null,
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Impact of New Media forms"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Production of Culture"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Media and Social Institution"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Media Violence"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Media and Social Shaping"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Give Feedback"
        }
      ]
    }
  },
  "cse212": {
    "current": {
      "code": "CSE212",
      "name": "Electronic Devices And Circuits",
      "fullTitle": "CSE212 — Electronic Devices And Circuits",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Diodes and its Application"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Bipolar junction Transistors"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Transistor Biasing and Thermal Stabilization"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Transistor Hybrid Models and Multistage Amplifiers"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Field Effect Transistors and FET Biasing"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse332": {
    "current": {
      "code": "CSE332",
      "name": "Industry Ethics And Legal Issues",
      "fullTitle": "CSE332 — Industry Ethics And Legal Issues",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 2,
      "l": 2,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability, entrepreneurship, and skill development by teaching students to apply ethical principles in IT, understand intellectual property concepts, and analyze legal and security issues in the information technology sector.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Case based",
            "timing": "Wk 3 / 11",
            "weightage": "50%",
            "syllabus": "Student groups will be formed to thoroughly analyze a broader problem statement and develop a well-structured and innovative solution.",
            "format": "Rubric Identification of Problem Statement and formulation of Objectives: 15 Marks; Analysis of Existing Case Studies: 15 Marks; Originality and Innovation: 20 Marks; Use of Relevant Terminology: 15 Marks; Clarity and Organization: 20 Marks; Presentation Skills: 15 Marks"
          },
          {
            "name": "Test",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "MCQ",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Intellectual Properties (IP's)"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Government Funding and Startup schemes"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Startup in IT"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Companies"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Ethical and Professional issues in Information Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse357": {
    "current": {
      "code": "CSE357",
      "name": "Combinatorial Studies",
      "fullTitle": "CSE357 — Combinatorial Studies",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course provides comprehensive preparation for technical interviews by covering fundamental computer science concepts including data structures, algorithms, databases, operating systems, and computer networks. It emphasizes practical skills through whiteboard coding exercises, mock interviews, and behavioral scenarios to enhance problem-solving agility and communication.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Interview",
            "timing": "Wk 4 / 11",
            "weightage": "50%",
            "syllabus": "CV preparation followed by interview to evaluate a candidate’s articulation of technical logic, problem-solving agility, and behavioral fit through real-time dialogue.",
            "format": ""
          },
          {
            "name": "Test - Code based",
            "timing": "Wk 4 / 6",
            "weightage": "50%",
            "syllabus": "Technical evaluation emphasizing proficiency in Operating system, computer networks and database to evaluate precision, conceptual clarity, and rapid decision-making skills.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Computer Networking Basics"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Database Management Systems (DBMS)"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Fundamentals of Programming Languages"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Data Structures"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Algorithms"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "pes319": {
    "current": {
      "code": "PES319",
      "name": "Soft Skills-Ii",
      "fullTitle": "PES319 — Soft Skills-Ii",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 2,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to develop professional soft skills including Digital Portfolio Design, Vocal Communication, Video CV creation, Interview preparedness, Group Discussions, and Workplace Ethics. Students will learn to demonstrate ethical conduct, professionalism, and responsibility in simulated workplace and placement scenarios.",
      "gradingScheme": {
        "attendance": "15",
        "continuous_assessment": "30",
        "mid_term_examination": "0",
        "end_term": "55"
      },
      "continuousAssessment": {
        "componentCount": 4,
        "evaluationRule": "All 4 CAs count towards your CA score.",
        "components": [
          {
            "name": "Portfolio",
            "timing": "Wk 3 / 4",
            "weightage": "25%",
            "syllabus": "Create a professional digital portfolio website, give a 2-minute presentation, and verify the URL on the placement portal.",
            "format": "Rubric Content presentation and branding (10 marks); Language proficiency & body language (10 marks); CV upload (5 marks); Storytelling & narrative (3 marks); Verification of portfolio URL (2 marks)"
          },
          {
            "name": "Skill Based Videos",
            "timing": "Wk 5 / 6",
            "weightage": "25%",
            "syllabus": "Create and submit a 60-90 second professional Video CV focusing on a specific job role or career goal.",
            "format": "Rubric Content presentation through video CV (10 marks); Language proficiency (10 marks); Body language and grooming (5 marks); Technical aspect (5 marks)"
          },
          {
            "name": "Interview",
            "timing": "Wk 9 / 10",
            "weightage": "25%",
            "syllabus": "Mock interview where students participate in a simulated process, answer questions, and discuss qualifications using their resume.",
            "format": "Rubric Understanding the question and justifying the answer (10 marks); Language proficiency (10 marks); Grooming & etiquette (5 marks); Body language and confidence (5 marks)"
          },
          {
            "name": "Group Discussion",
            "timing": "Wk 11 / 12",
            "weightage": "25%",
            "syllabus": "Students actively participate in structured group interactions (8-10 students) on a spot topic for 12-15 minutes.",
            "format": "Rubric Content and analysis of topic (10 marks); Language proficiency (10 marks); Grooming & body language (5 marks); Effective usage of group discussion vocabulary and interpersonal skills (5 marks)"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "55%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Effective Vocal Communication"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Video CV"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Interview Skills"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Guided Group Interaction"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Workplace Ethics"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int221": {
    "current": {
      "code": "INT221",
      "name": "Mvc Programming",
      "fullTitle": "INT221 — Mvc Programming",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on skill development in MVC programming using the Laravel framework, covering installation, routing, controllers, and Blade templates. Students will learn to manage cookies, sessions, emails, form validation, and databases to build robust and modular web applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 4 / 12",
            "weightage": "50%",
            "syllabus": "To develop a web app using Laravel. Students will be able to create live web based applications using Laravel",
            "format": ""
          },
          {
            "name": "Visual Implementation",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "To check the practical understanding of students. This will include questions related to directory structure, Request, Routing & Responses, Controllers, Blade and Advanced Routing",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Request, Routing & Responses"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Controllers, Blade and Advanced Routing"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "URL Generation, Request Data and Emails"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Laravel Form validation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Getting started with databases"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int245": {
    "current": {
      "code": "INT245",
      "name": "Penetration Testing",
      "fullTitle": "INT245 — Penetration Testing",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability, entrepreneurship, and skill development in penetration testing, teaching students to safely conduct testing exercises and apply vulnerability scan strategies. Students will learn to identify footprinting techniques, demonstrate system hacking for Windows and Linux, and analyze cloud environments.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Test 1 will based be hands-on practical using Virtual environment (VMWARE workstation/Oracle Virtual Box). Based on EC-Council CPENT (certified penetration testing professional) CompTIA Pentest+ certification.",
            "format": "Rubric one Practical question, job-evaluation -15 marks and viva 15 marks"
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 9 / 11",
            "weightage": "50%",
            "syllabus": "Test 3 will be based hands-on practical. 30 Marks practical test generating integrated Penetration testing report.",
            "format": "Rubric Generating integrated Penetration testing report on information gathering phase[5marks], scanning phase[10marks], exploiting the target [10 marks] and suggesting remediation steps [5marks]"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Footprinting and Gathering Intelligence"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Vulnerability Scan"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Web Application Exploitation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "System Hacking and Post Exploitation"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Communication and Reporting"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int327": {
    "current": {
      "code": "INT327",
      "name": "Cloud Infrastructure And Resource Management",
      "fullTitle": "INT327 — Cloud Infrastructure And Resource Management",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course provides comprehensive knowledge of cloud infrastructure and resource management, including cloud economics, security, data protection, Azure storage, application development, and network capabilities, with an emphasis on Microsoft Azure.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "BYOD-Practical",
            "timing": "Wk 5/6",
            "weightage": "50%",
            "syllabus": "Setting Up a Free Microsoft Azure Account, Implementing User and Group Management in Unix Administration",
            "format": ""
          },
          {
            "name": "Project",
            "timing": "Wk 11/12",
            "weightage": "50%",
            "syllabus": "Optimizing Azure Storage, Configuring Azure Virtual Networks, Remote Access, and VM Communication for Infrastructure Migration",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Cloud Governance and Manage Identities"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Cloud Compliances and Regulations"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Cloud Storage"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Cloud compute resources"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Cloud Networking"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int345": {
    "current": {
      "code": "INT345",
      "name": "Computer Vision",
      "fullTitle": "INT345 — Computer Vision",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 0,
        "evaluationRule": "",
        "components": []
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Camera Geometry and 2-D Projective Geometry"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Stereo Geometry, Camera motion and 3D Reconstruction"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Feature Detection and Description, Feature Matching and model Fitting"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Color Processing and Range Image Processing"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Image Segmentation and Advanced topics in computer vision"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "eng607": {
    "current": {
      "code": "ENG607",
      "name": "Contemporary Prose And Poetry",
      "fullTitle": "ENG607 — Contemporary Prose And Poetry",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course introduces students to contemporary prose and poetry, focusing on literary movements, characteristics, thematic analysis, and the relationship between literature and society to foster diverse literary voices and styles.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Journal writing",
            "timing": "Wk 4/5",
            "weightage": "50%",
            "syllabus": "CA-1 will be based on unit I, II and unit III and the subject teacher will assign the topics to the students. The student will write an essay/research paper/book chapter or create a graphical representation of a literary work. The assignment is of 30 marks. Fifteen marks will be given for written work and fifteen marks for publication or graphical representation. Assessment will be based on rubrics which will be shared at the time of CA allotment.",
            "format": "Rubric Assessment will be based on rubrics which will be shared at the time of CA allotment."
          },
          {
            "name": "Skill Based Videos",
            "timing": "Wk 8/9",
            "weightage": "50%",
            "syllabus": "CA-2 will be based on unit 4, 5 and unit 6. The student will make skill based videos and post on social media or will make short documentary on a particular topic and will share this on social media. Rubrics will be shared at the time of CA allotment.",
            "format": "Rubric Rubrics will be shared at the time of CA allotment."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Philip Larkin"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "O.Henry: The Last Leaf and After Twenty Years"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Ted Hughes"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "A. K. Ramanujan: Is There an Indian Way of Thinking? An Informal Essay"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "T.S.Eliot: The Hollow Men and The Love Song of J. Alfred Prufrock"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "fin213": {
    "current": {
      "code": "FIN213",
      "name": "Indian Financial System",
      "fullTitle": "FIN213 — Indian Financial System",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "The course analyzes the role and importance of the financial system, including capital markets, money markets, and banking systems, in the development of the Indian economy.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Indian capital market"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Financial services"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Indian Banking System"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Foreign Exchange Market"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Financial Regulations"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "fin215": {
    "current": {
      "code": "FIN215",
      "name": "Mutual Funds And Exchange Traded Funds",
      "fullTitle": "FIN215 — Mutual Funds And Exchange Traded Funds",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers the structure, participants, and regulatory framework of the mutual fund industry in India, including various schemes, taxation aspects, and the characteristics of exchange-traded funds.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Event - Participation",
            "timing": "Wk 4 / 8",
            "weightage": "50%",
            "syllabus": "Conduct a Mutual Funds Investment Awareness Session for a minimum target audience of 30 people aged above 25 years.",
            "format": "Rubric Audience Reach: 10 Marks, Session Conduct and Delivery: 8 Marks, Trainer Collaboration: 5 Marks, Documentation and Report: 7 Marks"
          },
          {
            "name": "Assignment - Field / industrial visit based",
            "timing": "Wk 4 / 12",
            "weightage": "50%",
            "syllabus": "Open 20 Dmat accounts of clients through referrals with a renowned trading member of Indian stock exchange.",
            "format": "Rubric 0-10 Dmat: 0-10 marks, 10-20 Dmat: 10-20 marks, Incomplete: 0-2 Marks, Full/minor issues: 2-6 Marks, Complete: 7-10 Marks"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Mutual fund products and features"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Exchange traded funds"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Debt funds"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Liquid funds"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Regulations"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "fst802": {
    "current": {
      "code": "FST802",
      "name": "Indian Culture Studies",
      "fullTitle": "FST802 — Indian Culture Studies",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on analyzing the diverse culture of India, evaluating its various components through arts, crafts, and textiles, and utilizing these cultural motifs as sources of inspiration in the design development process.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Northern Himalayan region & northern plains-1"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Northern plains-2 & central India"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Eastern India & North- East India"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Western India- the bright side"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "The Konkan Region & Southern India"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "geo296": {
    "current": {
      "code": "GEO296",
      "name": "Human Geography",
      "fullTitle": "GEO296 — Human Geography",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Blog writing",
            "timing": "Wk 3 / 6",
            "weightage": "50%",
            "syllabus": "Student will write the blog creatively, using figure, image, table and flowchart etc.",
            "format": ""
          },
          {
            "name": "Test",
            "timing": "Wk 5 / 8",
            "weightage": "50%",
            "syllabus": "student will prepare for the test (subjective + Objective) based on the end-term syllabus",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Approaches to Human geography"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Human Society"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Population Geography"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Settlement Geography"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Models, Theories and Laws in Human Geography"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "his292": {
    "current": {
      "code": "HIS292",
      "name": "Medieval Indian History And Culture",
      "fullTitle": "HIS292 — Medieval Indian History And Culture",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "AT comprises two parts. Part A and part b. Part A (20 Marks) comprises handwritten assignment on the topic allocated to them. Part B (10 marks) includes gamification activities including EWL.",
            "format": ""
          },
          {
            "name": "Presentation - Individual",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "AT comprises two parts. Part A and part b. Part A (20 Marks) is the presentation on the allocated to them on UMS. Part B (10 marks) comprises 3 gamification activities.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "The Delhi Sultanate (1206-1526): Forms of Political Legitimization and Control"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Vijayanagar Kingdom and South India"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "The Mughal Empire"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Political centralization and forms of political legitimacy"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Medieval India and cultural activities"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int332": {
    "current": {
      "code": "INT332",
      "name": "Devops Virtualization And Configuration Management",
      "fullTitle": "INT332 — Devops Virtualization And Configuration Management",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers DevOps infrastructure concepts including containerization, microservices, and continuous integration workflows using tools like Docker, Maven, GitHub Actions, and Jenkins.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Image Building & Container Management"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Microservices with Docker Compose"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Maven Build Automation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Continuous Integration (CI) with GitHub Actions"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "CI/CD with Jenkins"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int347": {
    "current": {
      "code": "INT347",
      "name": "Software Bots",
      "fullTitle": "INT347 — Software Bots",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "NA",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 12",
            "weightage": "33%",
            "syllabus": "Students will be allocated a project topic to work on project. Project will be evaluated on the basis of workflow execution, viva and report.",
            "format": ""
          },
          {
            "name": "Test - Code based 1",
            "timing": "Wk 4 / 5",
            "weightage": "33%",
            "syllabus": "Unit-1 and Uniy-2 will be part of CA.",
            "format": ""
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk",
            "weightage": "33%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "N8N Foundations and Core Building Blocks"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Error Handling and Workflow Reliability"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "AI Integration in N8N Workflows"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Introduction to Intelligent Agents"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Security, Monitoring, and Optimization"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "law352": {
    "current": {
      "code": "LAW352",
      "name": "Trademarks And Allied Laws",
      "fullTitle": "LAW352 — Trademarks And Allied Laws",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course enables students to identify appropriate international treaties for trademark applications, apply legal criteria for protection, and understand registration requirements. It also covers analyzing proprietors' rights, trademark licensing and assignment, evaluating infringement remedies, and designing legal strategies for unfair competition and related disputes.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "20",
        "mid_term_examination": "25",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Case based 2",
            "timing": "Wk 5/7",
            "weightage": "50%",
            "syllabus": "Create and present a poster on trademarks, covering their importance, functionality, protection, and a real-world case study, supported by a 5-7 minute oral explanation.",
            "format": ""
          },
          {
            "name": "Assignment - Case based 1",
            "timing": "Wk 7/9",
            "weightage": "50%",
            "syllabus": "Analyze a real-world trademark case involving infringement or registration disputes through research, legal analysis, oral presentation, and a detailed written report.",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "25%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Creation of trademark"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Registration of trademarks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Commercial exploitation of trademarks"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Infringement of Trademark"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Allied law"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mkt905": {
    "current": {
      "code": "MKT905",
      "name": "Search Engine Optimization",
      "fullTitle": "MKT905 — Search Engine Optimization",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers search behavior, intent patterns, and advanced keyword research strategies for content creation and optimization. Students will learn to develop focused search engine marketing campaigns and analyze digital campaign performance.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Keyword research"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Content marketing and internal linking"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Optimizing the foundations"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Conversion and Analytics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "SEO campaigns"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "mth265": {
    "current": {
      "code": "MTH265",
      "name": "Discrete Mathematics For Computing",
      "fullTitle": "MTH265 — Discrete Mathematics For Computing",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers foundational discrete mathematics concepts for computing, including relations, lattices, Boolean algebra, discrete probability, formal languages, and automata.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "To develop a strong understanding of relations, ordered sets, and lattices, focusing on their properties, visual representations, and practical applications in mathematical reasoning and problem-solvi. Relations : introduction, types of relations, reflexive relations... Ordered Sets and Lattices...",
            "format": ""
          },
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "To assess understanding of discrete probability concepts, including probability computation, independence, distributions, Bayes’ theorem, expected values, and variance, with a focus on their applicati. Discrete Probability-I... Discrete Probability -II...",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Ordered Sets and Lattices"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Boolean Algebra"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Discrete Probability-I"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Discrete Probability -II"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Languages, Automata, Grammars"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "psy292": {
    "current": {
      "code": "PSY292",
      "name": "Positive Psychology",
      "fullTitle": "PSY292 — Positive Psychology",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course focuses on employability and skill development by exploring the aims, scope, and dimensions of positive psychology, including holistic approaches to human development. Students will evaluate applications of positive psychology, hypothesize perspectives on happiness and well-being, and apply self-regulation and goal-setting methods.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "The individual assignment will be given to each student",
            "format": ""
          },
          {
            "name": "Presentation - Individual",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "The student will be given an individual presentation to present their work",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Self Control, Regulation and Personal Goal Setting"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Positive Traits"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Positive Cognitive States and Processes"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Perspectives on Happiness and Well Being"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Application of Positive Psychology"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int396": {
    "current": {
      "code": "INT396",
      "name": "Unsupervised Learning",
      "fullTitle": "INT396 — Unsupervised Learning",
      "semester": "Sem6",
      "termType": "current",
      "termId": "current",
      "category": "Specialization",
      "categoryDetail": "Specialization",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers fundamental concepts and algorithms of unsupervised learning, including clustering, dimensionality reduction, and anomaly detection, along with applying these techniques on real-world datasets using Python frameworks.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 1,
        "evaluationRule": "",
        "components": [
          {
            "name": "NA",
            "timing": "Wk",
            "weightage": "0%",
            "syllabus": "NA",
            "format": ""
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Partition-Based Clustering"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Hierarchical & Density-Based Clustering"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Dimensionality Reduction and Representation Learning"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Association Rule Mining & Anomaly Detection: Association Rule Mining"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Evaluation and Applications of Unsupervised Learning"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse379": {
    "current": {
      "code": "CSE379",
      "name": "Mobile Automated Testing",
      "fullTitle": "CSE379 — Mobile Automated Testing",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 0,
      "t": 0,
      "p": 4,
      "syllabusPdf": null,
      "courseDescription": "This subject develops practical skills in automated testing of Android mobile applications using Appium, including emulator and real-device setup, Appium Inspector, and native app automation. It also covers Agile and Scrum practices, defect management with Jira and Bugzilla, and mobile testing tools such as Katalon Studio, Espresso, Robotium, and Selendroid.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "BYOD-Practical",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Case based practical questions will be given to the student",
            "format": "Rubric To evaluate student on the basis of practical work"
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "MCQ based test inline with industry certification",
            "format": "Rubric To evaluate student on the basis of test"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Appium Project"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Android Native Apps Automation with Appium"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Agile Testing"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Jira and Bugzilla for Testers"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Introduction to Other Mobile Testing Tools"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "ece140": {
    "current": {
      "code": "ECE140",
      "name": "Workshop On Iot For Digital Society",
      "fullTitle": "ECE140 — Workshop On Iot For Digital Society",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 1,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This course develops skills in designing Raspberry Pi-based IoT systems, including GPIO and peripheral control, sensor interfacing, serial communication, computer vision, and cloud-edge integration. Students implement practical smart systems using communication protocols, cloud platforms, data processing, and embedded hardware.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment - Case based",
            "timing": "Wk 3 / 7",
            "weightage": "50%",
            "syllabus": "Students are required to identify the problem, propose a Raspberry Pi-based solution, explain the hardware/software architecture, justify the choice of sensors and communication protocols, and present their findings through a written report and presentation.",
            "format": "Rubric Students will analyze a real-world case study based on Raspberry Pi applications such as Smart Home Automation, Smart Agriculture, Smart Healthcare, Smart Surveillance, Smart Traffic Management etc."
          },
          {
            "name": "Project",
            "timing": "Wk 5 / 14",
            "weightage": "50%",
            "syllabus": "Suggested projects include Smart Home Automation, Weather Monitoring System, Face Recognition System, Smart Attendance System, Smart Irrigation, IoT-based Energy Monitoring, Object Detection, Smart Parking, Home Security System, or Cloud-based Sensor Monitoring using MQTT/ThingSpeak/AWS IoT. Students shall submit the project report, source code, demonstration video, and final presentation.",
            "format": "Rubric Students will develop a Raspberry Pi-based mini project individually or in teams (maximum 3 students)."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced GPIO & Peripheral Control"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Sensor Systems & Data Acquisition"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Camera Interfacing & Computer Vision"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Serial Communication & Industrial Interfaces"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "IoT Cloud & Edge Integration"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int251": {
    "current": {
      "code": "INT251",
      "name": "Malware Analysis And Cyber Defence",
      "fullTitle": "INT251 — Malware Analysis And Cyber Defence",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops skills in malware analysis and cyber defence through static and dynamic analysis, assembly and disassembly, malicious binary debugging, malware persistence, code injection, hooking, and obfuscation techniques. It also covers memory forensics, advanced malware detection, malware hunting, and defence strategies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "BYOD-Practical consisting of 1 practical question of 30 marks, including practical execution, report, and viva.",
            "format": "Rubric Practical execution: 15 marks; Report: 5 marks; Viva: 10 marks."
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "Practical-based task involving static and dynamic analysis of a given malware sample and preparation of a detailed report.",
            "format": "Rubric Practical execution: 15 marks; Report: 5 marks; Viva: 10 marks."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering the syllabus from CA1 and CA2.",
            "format": "Rubric To test students' subject knowledge and provide an opportunity to improve their CA performance in case of low marks or a missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Dynamic Analysis and Assembly Language"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Disassembly and Malware Debugging"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Malware Persistence, Injection and Hooking"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Obfuscation and Malware Forensics"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Advanced Malware Detection Using Memory Forensics"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int253": {
    "current": {
      "code": "INT253",
      "name": "Web Development In Python Using Django",
      "fullTitle": "INT253 — Web Development In Python Using Django",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops skills in building web applications with Python and Django, including project and app structure, views, URL mapping, templates, forms, models, migrations, ORM, and Django Admin. It also covers cookies, sessions, authentication, user management, permissions, testing, debugging, and database configuration.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test - Code based 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "This task will include topics such as views, URLs, templates, and template inheritance: written (15), practical (10), and viva (5).",
            "format": "Rubric To test the implementation skills of the students"
          },
          {
            "name": "Project",
            "timing": "Wk 4 / 12",
            "weightage": "50%",
            "syllabus": "This task includes the development of a website using Django. Students will be evaluated on Functionality & Requirements, User Interface, Database Design, and Model Implementation.",
            "format": "Rubric To create a Django web application"
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 8 / 10",
            "weightage": "50%",
            "syllabus": "This task will include forms, models, cookies, and sessions: written (15), practical (10), and viva (5).",
            "format": "Rubric To test the implementation skills of the students"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Views and URLs"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Templates, Debugging and Testing"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Forms in Django"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Models and Migrations and Django Admin"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Cookies and Sessions, users and authentication"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int315": {
    "current": {
      "code": "INT315",
      "name": "Cluster Computing",
      "fullTitle": "INT315 — Cluster Computing",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "Cluster Computing covers Apache Spark and Scala for distributed data processing, including RDDs, Spark SQL, GraphX, Spark Streaming with Apache Kafka, and machine learning using Spark MLlib and PySpark. The course emphasizes applying these technologies to big-data processing, analytics, graph processing, and practical machine-learning workflows.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 4 / 13",
            "weightage": "50%",
            "syllabus": "Students design, develop, and document a project integrating multiple syllabus components to demonstrate their understanding and practical application of course concepts. The task translates theoretical knowledge into practical implementation while encouraging creativity and technical proficiency.",
            "format": "Rubric 15 marks for implementation, 5 marks for the report, and 10 marks for the presentation and viva."
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "The BYOD-Practical emphasizes real-world tasks that develop critical thinking, problem-solving, and decision-making abilities. Students apply theoretical knowledge to practical scenarios from Units 1, 2, and 3, including the introduction to Spark and Scala and the use of RDDs for application development in Spark.",
            "format": "Rubric The assessment consists of three questions, each worth 10 marks."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering the syllabus from CA1 and CA2.",
            "format": "Rubric To test students' subject knowledge and provide an opportunity to improve CA performance in case of low marks or a missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Introduction to Programming in Scala"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Using RDD for Creating Applications in Spark and Graph Analytics"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Running SQL Queries Using Spark SQL"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Spark Streaming with Apache Kafka"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Spark ML Programming and PySpark"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int328": {
    "current": {
      "code": "INT328",
      "name": "Network Virtualization And Cloud Security",
      "fullTitle": "INT328 — Network Virtualization And Cloud Security",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject covers cloud security principles and practices, including identity and access management, secure networking, compute and storage security, security operations, backup and recovery, vulnerability assessment, and emerging cloud security trends. It emphasizes practical security configuration using Microsoft Azure and related cloud technologies.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Students will perform the given practical task on Azure portal from various topics and save the work in the form of screenshots in a pdf file which will be uploaded on UMS.",
            "format": "Rubric Students will be assessed for their knowledge on topics from Unit 1 and Unit 2"
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Students will perform the given practical task on Azure portal from various topics and save the work in the form of screenshots in a pdf file which will be uploaded on UMS.",
            "format": "Rubric Students will be assessed for their knowledge on topics from Unit 3, Unit 4 and Unit 5"
          },
          {
            "name": "BYOD-Practical 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Students will perform the given practical task on Azure portal from various topics and save the work in the form of screenshots in a pdf file which will be uploaded on UMS.",
            "format": "Rubric Students will be assessed for their knowledge on topics from Unit 1 to Unit 5"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Secure Networking"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Secure Compute and Storage"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Manage Security Operation"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Data Collection Rule (DCR)"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Emerging Trends and Best Practices in Cloud Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int422": {
    "current": {
      "code": "INT422",
      "name": "Deep Learning",
      "fullTitle": "INT422 — Deep Learning",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops skills in building and optimizing deep learning models using TensorFlow and Keras. It covers NVIDIA DGX Station A100, convolutional and recurrent neural networks, autoencoders, generative adversarial networks, and model deployment using Docker and Streamlit.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 11",
            "weightage": "50%",
            "syllabus": "Each student will be assigned a project topic and evaluated based on the innovation of the solution, presentation skills, and report writing.",
            "format": "Rubric To assess the skills of the individual in the learned concepts of deep learning, TensorFlow, Keras, CNN, and RNN."
          },
          {
            "name": "Test 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "This task will contain topics from unit 1 and unit 2.",
            "format": "Rubric To check the knowledge of students on learned topics."
          },
          {
            "name": "Test 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide an opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Building Models with Keras"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Classifying Images with Deep Convolutional Neural Networks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Autoencoders and Pre-trained CNN"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Modeling Sequential Data Using Recurrent Neural Networks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Generative Adversarial Networks"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "eng608": {
    "current": {
      "code": "ENG608",
      "name": "Contemporary Drama",
      "fullTitle": "ENG608 — Contemporary Drama",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course introduces key terms associated with contemporary drama and examines socio-political issues, thematic concerns, stylistic and narrative techniques, motifs, and symbols in selected literary works. The prescribed works include Top Girls, Mother Courage and Her Children, Final Solutions, A Streetcar Named Desire, and The Piano Lesson.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Assignment - Research Paper Writing",
            "timing": "Wk 3 / 4",
            "weightage": "50%",
            "syllabus": "The CA1 assessment will cover Unit I and Unit II. The subject teacher will assign specific topics to students. Each student is required to either write a research paper or book chapter/create a graphical interpretation of a literary work. The assignment carries a total of 30 marksâ15 marks will be awarded for the written component, and 15 marks for publication.",
            "format": "Rubric Students will learn about the significance of contemporary short story writing and its relevance and application."
          },
          {
            "name": "Presentation - Individual",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "CA2 will focus on Unit 3 and Unit 4. Students are required to deliver presentations on contemporary issues related to drama.",
            "format": "Rubric Students will learn about presentation skills about contemporary issues in drama."
          },
          {
            "name": "Test",
            "timing": "Wk 12 / 13",
            "weightage": "50%",
            "syllabus": "The revised CA category for courses currently being offered under A0202 will now be A0203 and similarly for CA category A0303 the updated CA category will now be A0304 and so on. The additional CA will be conducted only in the form of a Test. Subjective test covering syllabus from CA-1 and CA-2.",
            "format": "Rubric Students overall understanding of the paper is comprehensively tested"
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Caryl Churchill: Top Girls"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Bertolt Brecht: Mother Courage and Her Children"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Mahesh Dattani: Final Solutions"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Tennessee Williams: A Streetcar Named Desire"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "August Wilson: The Piano Lesson"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "fst803": {
    "current": {
      "code": "FST803",
      "name": "Fashion Design Process",
      "fullTitle": "FST803 — Fashion Design Process",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 0,
      "t": 0,
      "p": 5,
      "syllabusPdf": null,
      "courseDescription": "This subject develops the fashion design process through user-centered briefs, research, trend forecasting, ideation, historical and cultural analysis, and design development. Students create and evaluate fashion concepts, materials, collections, design documentation, rendered presentations, and a professional digital portfolio.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "All 3 CAs count towards your CA score.",
        "components": [
          {
            "name": "Assignment 1",
            "timing": "Wk 2 / 4",
            "weightage": "33%",
            "syllabus": "Choose a central topic such as Futuristic India, Desi Streetwear, or Sustainable Summer. Create a brainstorming board containing 15-20 raw ideas represented through images, words, icons, and sketches. Develop a mind map with the central theme in the middle, at least five branches covering areas such as lifestyle, colors, fabrics, silhouettes, and emotions, and supporting images or quick sketches along each branch.",
            "format": "Rubric To guide students from raw idea generation to a focused fashion theme using brainstorming and mind mapping."
          },
          {
            "name": "Assignment 2",
            "timing": "Wk 4 / 6",
            "weightage": "33%",
            "syllabus": "Create a titled mood board using 6-8 images that communicate the chosen theme's mood or feeling. Develop a color board with 5-7 color swatches extracted from the mood board, labeling their names and emotional impact or usage. Create a fictional client profile with demographic and psychographic details and include 2-3 style reference images.",
            "format": "Rubric To express the design theme's emotion and target client using mood boards, color boards, and client boards."
          },
          {
            "name": "Assignment 3",
            "timing": "Wk 7 / 8",
            "weightage": "33%",
            "syllabus": "Create a swatch board containing 4-6 physical or digital fabric swatches suitable for the chosen theme. Label each swatch with its fabric name, texture and feel, and intended usage. Add two illustrations or flats showing garments that could be made from the selected fabrics.",
            "format": "Rubric To explore fabric types and build a tactile and visual base for future garment ideas."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 4,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Research and Ideation"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Design Development"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Execution"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse403": {
    "current": {
      "code": "CSE403",
      "name": "Network Security And Cryptography",
      "fullTitle": "CSE403 — Network Security And Cryptography",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject covers conventional and modern cryptography, symmetric-key and public-key algorithms, hashing, digital signatures, key distribution, and security mechanisms across TCP/IP layers. It also examines attacks on wireless ad hoc networks and applies cryptographic techniques through practical programming exercises.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "Test 1 will be based on syllabus covered till lecture 14; 4 questions will be there (two 10 marks and two 5 marks).",
            "format": "Rubric To evaluate the performance of the students on the basis of syllabus covered."
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "Test 2 will be conducted in lecture 29 covering all the practicals. One practical-based question will be given, with 15 marks for practical evaluation and 15 marks for viva.",
            "format": "Rubric To test practical knowledge of every student individually using C/C++/Java/Python language."
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Test 3 will be based on syllabus covered till lecture 35; 4 questions will be there (two 10 marks and two 5 marks).",
            "format": "Rubric To evaluate the performance of the students on the basis of syllabus covered."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Modern Symmetric-key Encipherment"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Assymetric-key Encipherment"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Message integrity and Hash function"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Digital Signature and Key management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Network Security"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse406": {
    "current": {
      "code": "CSE406",
      "name": "Advanced Java Programming",
      "fullTitle": "CSE406 — Advanced Java Programming",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers advanced Java programming, including collections streams, lambda operations, GUI and event handling, JDBC database applications, file I/O, JSP, date/time APIs, localization, multithreading, and concurrency. Students develop Java applications, connect applications to databases using JDBC, and use lambda expressions and concurrency features.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Test - Code based 1",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "To evaluate basic programming skills of students",
            "format": "Rubric To evaluate basic programming skills of students"
          },
          {
            "name": "Test - Code based 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "It will have questions to implement object oriented programming concepts to design small applications",
            "format": "Rubric To evaluate programming and logic building skills of students"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "GUI and Event Handling"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "File I/O and JDBC"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "JavaServer Pages"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Java Date and Time API"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Concurrency, Localization, and Multithreading"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse434": {
    "current": {
      "code": "CSE434",
      "name": "Game Development In 3D",
      "fullTitle": "CSE434 — Game Development In 3D",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course covers 3D game development in Unity, including 3D modelling, procedural environments, player controls, AI-driven behaviours, advanced scripting, lighting, user interfaces, immersive experiences, storytelling, multiplayer development and optimization.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 6",
            "weightage": "50%",
            "syllabus": "The task consists of Job Evaluation worth 50 marks and viva worth 50 marks.",
            "format": "Rubric To develop the analytic skills of the student."
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "The task consists of Job Evaluation worth 50 marks and viva worth 50 marks.",
            "format": "Rubric To develop the analytic skills of the student."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Player Controls and Positioning"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "3D concepts for game play"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Programming"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Gameplay components"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Working with Navmesh"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse436": {
    "current": {
      "code": "CSE436",
      "name": "Blockchain",
      "fullTitle": "CSE436 — Blockchain",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "The course covers blockchain fundamentals, decentralization, symmetric and public-key cryptography, consensus algorithms, Bitcoin networks and transactions, alternative coins, smart contracts, Ethereum, Geth, Web3, and decentralized applications. It also includes practical work involving Solidity, MetaMask, Remix IDE, contract deployment, and Ethereum account and genesis-block management using Geth.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Test 1",
            "timing": "Wk 3 / 5",
            "weightage": "50%",
            "syllabus": "The test will consist of subjective questions of 5 or 10 marks each out of the syllabus covered till lecture 14.",
            "format": "Rubric To evaluate the performance of the students on the basis of syllabus covered."
          },
          {
            "name": "Test 2",
            "timing": "Wk 9 / 10",
            "weightage": "50%",
            "syllabus": "The test will consist of subjective questions of 5 or 10 marks each out of the syllabus covered till lecture 29.",
            "format": "Rubric To evaluate the performance of the students on the basis of syllabus covered."
          },
          {
            "name": "Test 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "The test will consist of subjective questions of 5 or 10 marks each out of the syllabus covered till lecture 35.",
            "format": "Rubric To evaluate the performance of the students on the basis of syllabus covered."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Symmetric and Public Key Cryptography"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Consensus Algorithms and Bitcoin Introduction"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Bitcoin Network, Payments, Clients and APIs"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Alternative Coins and Smart Contracts"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Ethereum, Web3 and Decentralized Applications"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse476": {
    "current": {
      "code": "CSE476",
      "name": "Agentic Ai And Intelligent Automation",
      "fullTitle": "CSE476 — Agentic Ai And Intelligent Automation",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 1,
      "syllabusPdf": null,
      "courseDescription": "This course covers the design and development of intelligent, autonomous, conversational, and multi-agent AI systems using Azure AI Foundry, Python, Semantic Kernel, AutoGen, and Azure AI services. It also addresses workflow automation, testing, monitoring, deployment, responsible AI, security, governance, and enterprise applications.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Project 1",
            "timing": "Wk 2 / 5",
            "weightage": "50%",
            "syllabus": "Project on the basis of Unit-I and Unit-II will be submitted by the student, with rubrics for implementation (10 marks), presentation (10 marks), and viva (10 marks).",
            "format": "Rubric To build intelligent AI agents and autonomous and conversational AI systems using Microsoft Azure AI Foundry. Rubrics: Implementation (10 marks), Presentation (10 marks), and Viva (10 marks)."
          },
          {
            "name": "Project 2",
            "timing": "Wk 9 / 11",
            "weightage": "50%",
            "syllabus": "Project will be submitted by the students on the basis of Unit-III and Unit-IV, with rubrics for implementation (10 marks), presentation (10 marks), and viva (10 marks).",
            "format": "Rubric To build production-ready AI agents and multi-agent environment. Rubrics: Implementation (10 marks), Presentation (10 marks), and Viva (10 marks)."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Building Intelligent Agent Workflows"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Agent Development with Python and Frameworks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Multi-Agent Systems and Collaboration"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Testing, Monitoring, and Deployment of AI Agents"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Responsible AI, Security, and Enterprise Governance"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse493": {
    "current": {
      "code": "CSE493",
      "name": "Linux System Administration",
      "fullTitle": "CSE493 — Linux System Administration",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops students' ability to navigate and manage Linux environments, administer files, users, permissions, processes, services, networking, packages, storage, security, and system logs. It also covers SSH, scheduled tasks, SELinux, logical volumes, ACLs, NFS, boot management, installation, troubleshooting, and automation using Red Hat Enterprise Linux.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Evaluate Linux installation, secure networking, storage management, boot configuration, automation, troubleshooting, and documentation skills.",
            "format": "Rubric To assess students' understanding of Red Hat Enterprise Linux (RHEL) concepts and administration tasks. Written Work - 5 marks; Execution - 15 marks; Viva Voce - 10 marks."
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Evaluate Linux installation, secure networking, storage management, boot configuration, automation, troubleshooting, and documentation skills.",
            "format": "Rubric To assess students' understanding of Red Hat Enterprise Linux (RHEL) concepts and administration tasks. Written Work - 5 marks; Execution - 15 marks; Viva Voce - 10 marks."
          },
          {
            "name": "BYOD-Practical 3",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Evaluate Linux installation, secure networking, storage management, boot configuration, automation, troubleshooting, and documentation skills.",
            "format": "Rubric To assess students' understanding of Red Hat Enterprise Linux (RHEL) concepts and administration tasks. Written Work - 5 marks; Execution - 15 marks; Viva Voce - 10 marks."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Permissions, Processes, Services, SSH, and Logs"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Networking, Packages, File Systems, and Virtualization"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Command Productivity, Scheduling, Performance, and ACLs"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "SELinux and Advanced Storage Management"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Network Storage, Boot, Security, and Installation"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cse494": {
    "current": {
      "code": "CSE494",
      "name": "Intelligent Nosql Databases",
      "fullTitle": "CSE494 — Intelligent Nosql Databases",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course provides an overview of NoSQL databases and MongoDB fundamentals for handling scalable, schema-flexible data. Students learn data modeling, CRUD operations, indexing, aggregation, application integration, AI-based predictive analytics, and development of a functional mini-project.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "This academic task requires students to explore and apply concepts related to Intelligent NoSQL systems through theoretical study and practical implementation. Students will analyze different NoSQL database paradigms (key-value, document, column-family, and graph databases), evaluate their performance and scalability, and implement data storage and retrieval solutions for large-scale datasets. The task may involve designing intelligent data models, integrating analytics or AI-driven features, conducting experiments, and documenting results using proper academic and technical standards.",
            "format": "Rubric To check the subject understanding and learning ability of the students"
          },
          {
            "name": "Project",
            "timing": "Wk 5 / 13",
            "weightage": "50%",
            "syllabus": "The project-based assignment aims to provide students with a platform to demonstrate their understanding and practical application of concepts covered in the course. Students will design, develop, and document a project that integrates multiple components of the syllabus, fostering a deep understanding of concepts while encouraging creativity and technical proficiency. The marks distribution is 15 marks for implementation, 5 marks for the report, and 10 marks for the presentation and viva.",
            "format": "Rubric To test the querying approach and skill set of the student"
          },
          {
            "name": "Test",
            "timing": "Wk 10 / 11",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "MongoDB Basics and CRUD Operations"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Schema Design and Data Modeling"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Indexing and Aggregation Framework"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "MongoDB Integration"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Project"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int372": {
    "current": {
      "code": "INT372",
      "name": "Iphone Application Programming",
      "fullTitle": "INT372 — Iphone Application Programming",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops foundational and practical skills in iPhone application programming using Swift and Xcode. It covers Swift programming concepts, MVVM architecture, UIKit controls, TableViews, iPhone project templates, responsive layouts, databases, multimedia, MapKit, WKWebView, and web-service integration.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "BYOD-Practical 1",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Students will be provided with a scenario-based question. They are required to write the code in the provided answer booklet and then implement the solution. Evaluation will be based on both the correctness of the written code and its execution.",
            "format": "Rubric Code Structure: 10 marks; Implementation & Functionality: 10 marks; Concept Clarity & Code Explanation: 5 marks. The objective is to enhance the logical and programming skills of the students."
          },
          {
            "name": "Skill Based Assignment",
            "timing": "Wk 5 / 12",
            "weightage": "50%",
            "syllabus": "Develop an iOS gamification application using Swift and Xcode. Students must plan, design, implement, and evaluate an interactive, goal-driven application using tools and concepts such as UIKit controls, TableView, Storyboards, project templates, web services, and iOS-specific features, following standard software development practices for iOS platforms.",
            "format": "Rubric Execution: 5 marks; Presentation/Viva: 10 marks; UI/UX: 5 marks; Interim Report: 5 marks; Final Report: 5 marks."
          },
          {
            "name": "BYOD-Practical 2",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Students will be provided with a scenario-based question. They are required to write the code in the provided answer booklet and then implement the solution. Evaluation will be based on both the correctness of the written code and its execution.",
            "format": "Rubric Code Structure: 10 marks; Implementation & Functionality: 10 marks; Concept Clarity & Code Explanation: 5 marks. The objective is to enhance the logical and programming skills of the students."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "MVVM Architecture"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "UIKit Controls"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "TableViews"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "iPhone Project Templates"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Web Services"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int402": {
    "current": {
      "code": "INT402",
      "name": "Modern Web Programming Tools And Techniques",
      "fullTitle": "INT402 — Modern Web Programming Tools And Techniques",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course develops proficiency in C# and ASP.NET Core for building MVC applications and RESTful Web APIs. It covers object-oriented programming, Razor views, model binding and validation, middleware, dependency injection, authentication and authorization, Entity Framework Core, SQL Server, CRUD operations, and API testing with Postman.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Project",
            "timing": "Wk 3 / 12",
            "weightage": "50%",
            "syllabus": "Develop a responsive ASP.NET Core MVC application by recreating the interface of a given real-world website. This is a project-based assessment evaluated for a total of 30 marks.",
            "format": "Rubric 10 marks for the project presentation, 5 marks for the viva voce, 5 marks for the project report, 5 marks for code semantics and quality, and 5 marks for the user interface design and implementation."
          },
          {
            "name": "Visual Implementation",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Design and develop a responsive ASP.NET Core MVC application that replicates the interface and functionality of a real-world website by applying the concepts learned in the course.",
            "format": "Rubric 15 marks for the written submission, 10 marks for code implementation, and 5 marks for the viva, for a total of 30 marks."
          },
          {
            "name": "Test - Code based",
            "timing": "Wk 8 / 9",
            "weightage": "50%",
            "syllabus": "Apply C#, ASP.NET Core, Entity Framework Core, and SQL Server to solve programming and application-development problems. The assessment is a code-based MCQ examination consisting of 30 questions covering backend development using ASP.NET Core.",
            "format": "Rubric Each correct answer is awarded 1 mark, 0.25 marks are deducted for every incorrect answer, and no marks are awarded or deducted for unanswered questions."
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "C# Programming Fundamentals"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Backend Development Using Asp.Net"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Asp.Net MVC and Security"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "SQL Server For Backend Development"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Asp.Net With Web API"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int411": {
    "current": {
      "code": "INT411",
      "name": "Software Project Management",
      "fullTitle": "INT411 — Software Project Management",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 3,
      "l": 3,
      "t": 0,
      "p": 0,
      "syllabusPdf": null,
      "courseDescription": "This course covers software project management, including project planning, cost and effort estimation, software development life cycle models, risk management, resource allocation, monitoring and control, and software quality management. It also includes AI-assisted estimation and monitoring, Agile, DevOps, CI/CD, earned value analysis, and blockchain-based traceability.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "25",
        "mid_term_examination": "20",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 3,
        "evaluationRule": "Best 2 of 3 CAs will be considered for evaluation.",
        "components": [
          {
            "name": "Term paper",
            "timing": "Wk 2 / 11",
            "weightage": "50%",
            "syllabus": "The term papers rubrics are: Title and Abstract-20%, Literature Review-30%, Research Methodology-40%, Conclusion-10%.",
            "format": "Rubric Title and Abstract-20%, Literature Review-30%, Research Methodology-40%, Conclusion-10%."
          },
          {
            "name": "Test- Situation based problem solving",
            "timing": "Wk 5 / 6",
            "weightage": "50%",
            "syllabus": "Situation-based test topics are: Advanced Software Project Management, Cost estimation Metrics and Analytics (4 scenario based questions, where 2 questions will be of 5 marks each and 2 questions will be of 10 marks each.)",
            "format": "Rubric To evaluate the student-based on the scenario-based subjective test."
          },
          {
            "name": "Test",
            "timing": "Wk 11 / 12",
            "weightage": "50%",
            "syllabus": "Subjective test covering syllabus from CA1 and CA2.",
            "format": "Rubric To test the subject knowledge of the students and provide opportunity to improve their CA performance in case of low marks or any missed CA."
          }
        ]
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "20%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Cost Estimation and Life Cycle Models"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Effort Estimation"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Activity Planning and Risk Management"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Resource Allocation, Monitoring and Control"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Software Quality and Small Projects"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "int416": {
    "current": {
      "code": "INT416",
      "name": "Software Project Management Laboratory",
      "fullTitle": "INT416 — Software Project Management Laboratory",
      "semester": "Sem7",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 2,
      "l": 0,
      "t": 0,
      "p": 3,
      "syllabusPdf": null,
      "courseDescription": "This laboratory course develops practical software project management skills using tools such as Microsoft Project, GitHub, Asana, and Jira. It covers project planning, task and resource management, Gantt and PERT charts, network diagrams, cost management, progress tracking, collaborative planning, and Agile project execution.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "NA",
        "end_term": "50"
      },
      "continuousAssessment": null,
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 15,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Defining The Project"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Tasks"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Task Linkages"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Resources"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Network Diagram View"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Shortening Your Project"
        },
        {
          "unitNumber": 7,
          "unit": "Unit7",
          "title": "Overallocations"
        },
        {
          "unitNumber": 8,
          "unit": "Unit8",
          "title": "Resolving Overallocations"
        },
        {
          "unitNumber": 9,
          "unit": "Unit9",
          "title": "Printing Project Reports"
        },
        {
          "unitNumber": 10,
          "unit": "Unit10",
          "title": "Tracking Progress"
        },
        {
          "unitNumber": 11,
          "unit": "Unit11",
          "title": "Use a PERT analysis to estimate task durations"
        },
        {
          "unitNumber": 12,
          "unit": "Unit12",
          "title": "Managing Costs"
        },
        {
          "unitNumber": 13,
          "unit": "Unit13",
          "title": "Collaborative Project Planning and Monitoring using GitHub and Asana"
        },
        {
          "unitNumber": 14,
          "unit": "Unit14",
          "title": "Agile Project Execution and Control using Jira"
        },
        {
          "unitNumber": 15,
          "unit": "Unit15",
          "title": "Exams & Practice"
        }
      ]
    },
    "reappear": null
  },
  "cse227": {
    "current": {
      "code": "CSE227",
      "name": "Advanced Android App Development",
      "fullTitle": "CSE227 — Advanced Android App Development",
      "semester": "Sem8",
      "termType": "current",
      "termId": "current",
      "category": "Core",
      "categoryDetail": "Core",
      "credits": 3,
      "l": 2,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This subject focuses on entrepreneurship, employability, and skill development in advanced Android app development, covering topics such as Realtime Database, interactive visuals, complex networking, AI-based chat interfaces, device connectivity, and web content management.",
      "gradingScheme": {
        "attendance": "5",
        "continuous_assessment": "45",
        "mid_term_examination": "0",
        "end_term": "50"
      },
      "continuousAssessment": {
        "componentCount": 2,
        "evaluationRule": "All 2 CAs count towards your CA score.",
        "components": [
          {
            "name": "Skill Based Assignment",
            "timing": "Wk 2 / 12",
            "weightage": "50%",
            "syllabus": "Advanced Android App Development : Skill-Based Assignment – Gamification Apps Development, is designed to equip students with the skills necessary to develop engaging and interactive gamification apps on the Android platform. The curriculum focuses on advanced Android development techniques, including user interface design, Firebase, Graphics, Sensors , Device Connectivity, Wireless Communication and utilizing Android-specific features to create immersive gaming experiences.",
            "format": "Rubric Execution:-05, Presentation/Viva:-10, UI/UX:-05, Interim Report:-05, Final Report:-05. Optional component: (Social Media Footprint) Upon successfully mobile app deployment on google play store, the student will be eligible for upgrading the marks as per the following: For each Twenty downloads, two subjective comments and ten ratings of 4 star+ collectively, will make the student eligible to earn additional 02 marks (max up to 10 marks)"
          },
          {
            "name": "BYOD-Practical",
            "timing": "Wk 4 / 5",
            "weightage": "50%",
            "syllabus": "Students will be provided with a scenario-based question. They are required to write the code in the provided answer booklet and then implement the solution. Evaluation will be based on both the correctness of the written code and its execution.",
            "format": "Rubric Written: 10 marks and execution of code: 20 Marks"
          }
        ]
      },
      "examPatterns": {
        "midTerm": null,
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "50%",
          "type": "Practical"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Advanced Graphics"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Advanced Networking with Retrofit"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "AI Integration in Android Applications"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Smart Device Communication and Sensing Systems"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Web-Based Content"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  },
  "cseb422": {
    "current": {
      "code": "CSEB422",
      "name": "Project Management",
      "fullTitle": "CSEB422 — Project Management",
      "semester": "Sem8",
      "termType": "current",
      "termId": "current",
      "category": "Elective",
      "categoryDetail": "Elective",
      "credits": 4,
      "l": 3,
      "t": 0,
      "p": 2,
      "syllabusPdf": null,
      "courseDescription": "This course aims to equip students with a comprehensive understanding of project management, covering traditional, agile, and hybrid approaches, stakeholder management, scheduling, risk analysis, and agile practices like Scrum.",
      "gradingScheme": {
        "attendance": "0",
        "continuous_assessment": "0",
        "mid_term_examination": "40",
        "end_term": "60"
      },
      "continuousAssessment": {
        "componentCount": 0,
        "evaluationRule": "",
        "components": []
      },
      "examPatterns": {
        "midTerm": {
          "title": "Mid Term Examination",
          "description": "Mid-semester comprehensive evaluation",
          "weightage": "40%",
          "type": "Examination"
        },
        "endTerm": {
          "title": "End Term Examination",
          "description": "Final semester comprehensive evaluation",
          "weightage": "60%",
          "type": "Examination"
        }
      },
      "totalUnits": 6,
      "units": [
        {
          "unitNumber": 1,
          "unit": "Unit1",
          "title": "Project Initiation and Stakeholder Management"
        },
        {
          "unitNumber": 2,
          "unit": "Unit2",
          "title": "Project Planning and Scheduling"
        },
        {
          "unitNumber": 3,
          "unit": "Unit3",
          "title": "Project Execution and Risk Management"
        },
        {
          "unitNumber": 4,
          "unit": "Unit4",
          "title": "Agile Foundations and Frameworks"
        },
        {
          "unitNumber": 5,
          "unit": "Unit5",
          "title": "Agile Practices and Organizational Adoption"
        },
        {
          "unitNumber": 6,
          "unit": "Unit6",
          "title": "Continuous Assessment"
        }
      ]
    },
    "reappear": null
  }
};

export function getSubjectCurriculum(code: string, termType: 'current' | 'reappear' = 'current'): SubjectCurriculumRecord | null {
  const cleanCode = code.match(/[A-Za-z]+\d{3}/)?.[0]?.toLowerCase() || code.toLowerCase().trim();
  const entry = ALL_SUBJECTS_CATALOG[cleanCode];
  if (!entry) return null;
  return entry[termType] || entry.current || entry.reappear || null;
}

export function getSubjectCurriculumEntry(code: string): { current: SubjectCurriculumRecord | null; reappear: SubjectCurriculumRecord | null } | null {
  const cleanCode = code.match(/[A-Za-z]+\d{3}/)?.[0]?.toLowerCase() || code.toLowerCase().trim();
  return ALL_SUBJECTS_CATALOG[cleanCode] || null;
}

