import { Curriculum } from "@/data/types";

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	term: [
		{
			year: 1,
			semester: 1,
			courses: [
				{
					code: "CC-101",
					name: "Fundamentals of Programming",
					units: 3
				},
				{
					code: "Math1",
					name: "Calculus 1",
					units: 3
				},
				{
					code: "Math2",
					name: "Discrete Structures",
					units: 3
				},
				{
					code: "GE 01",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE 02",
					name: "Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas",
					units: 3
				},
				{
					code: "FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "GE 07",
					name: "Science, Technology and Society",
					units: 3
				},
				{
					code: "PATHFit 01",
					name: "Movement Competency Training",
					units: 2
				}
			]
		},
		{
			year: 1,
			semester: 2,
			courses: [
				{
					code: "CC-102",
					name: "Intermediate Programming",
					units: 3
				},
				{
					code: "DS101",
					name: "Introduction to Data Science",
					units: 3
				},
				{
					code: "Math3",
					name: "Calculus 2",
					units: 3
				},
				{
					code: "Stat1",
					name: "Introduction to Statistics",
					units: 3
				},
				{
					code: "GE 04",
					name: "Mathematics in the Modern World",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "PATHFit 02",
					name: "Exercise-based Fitness Activities",
					units: 2
				}
			]
		},
		{
			year: 2,
			semester: 1,
			courses: [
				{
					code: "CC-103",
					name: "Data Structures and Algorithms",
					units: 3
				},
				{
					code: "DS102",
					name: "Programming for Data Science",
					units: 3
				},
				{
					code: "Math4",
					name: "Linear Algebra",
					units: 3
				},
				{
					code: "Stat2",
					name: "Computer-Aided Statistical Inference",
					units: 3
				},
				{
					code: "GE 06",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "GE 08",
					name: "Ethics",
					units: 3
				},
				{
					code: "FIL 3",
					name: "Dalumat Ng/Sa Filipino",
					units: 3
				},
				{
					code: "PATHFit 03",
					name: "Choice of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "CC-104",
					name: "Information Management",
					units: 3
				},
				{
					code: "DS103",
					name: "Algorithm and Complexity",
					units: 3
				},
				{
					code: "DS104",
					name: "Artificial Intelligence",
					units: 3
				},
				{
					code: "DS108",
					name: "Data Management Warehousing",
					units: 3
				},
				{
					code: "ELP",
					name: "English for DSA Professionals",
					units: 3
				},
				{
					code: "GE 03",
					name: "The Contemporary World",
					units: 3
				},
				{
					code: "GE 09",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "PATHFit 04",
					name: "Choice of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "DS106",
					name: "Business Intelligence",
					units: 3
				},
				{
					code: "DS107",
					name: "Machine Learning & Data Mining 1",
					units: 3
				},
				{
					code: "DS105",
					name: "Data Visualization and Presentation",
					units: 3
				},
				{
					code: "ELEC1",
					name: "Professional Elective 1",
					units: 3
				},
				{
					code: "Stat3",
					name: "Computational Statistics",
					units: 3
				},
				{
					code: "Stat4",
					name: "Exploratory Data Analysis",
					units: 3
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "DS109",
					name: "Principle of Big Data",
					units: 3
				},
				{
					code: "DS110",
					name: "Information Security and Data Privacy",
					units: 3
				},
				{
					code: "DS111",
					name: "Special Topics in Data Science",
					units: 3
				},
				{
					code: "RM1",
					name: "Research Methods",
					units: 3
				},
				{
					code: "ELEC2",
					name: "Professional Elective 2",
					units: 3
				},
				{
					code: "DSA 01",
					name: "Data Science in Agriculture 1",
					units: 3
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "DS112",
					name: "Social Issues and Professional Practice",
					units: 3
				},
				{
					code: "CAP1",
					name: "Capstone Project",
					units: 3
				},
				{
					code: "ELEC3",
					name: "Professional Elective 3",
					units: 3
				},
				{
					code: "ELEC4",
					name: "Professional Elective 4",
					units: 3
				},
				{
					code: "DSA 02",
					name: "Data Science in Agriculture 2",
					units: 3
				},
				{
					code: "OJT/IZN",
					name: "On the Job Training/International Student Mobility (In-Bound, Out-Bound)",
					units: 6
				}
			]
		}
	]
} satisfies Curriculum;
