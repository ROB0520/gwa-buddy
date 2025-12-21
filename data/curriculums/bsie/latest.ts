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
					code: "FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "GE 01",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE 02",
					name: "Readings in Philippine History",
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
					code: "Educ 1",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "Educ 2",
					name: "The Child and Adolescent Learner and Learning Principles",
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
					code: "FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "Educ 3",
					name: "Facilitating Learner - Centered Teaching: The Learner Centered Approaches with Emphasis on Trainers Methodology",
					units: 3
				},
				{
					code: "IEIA 1",
					name: "Fundamentals of Drawing",
					units: 3
				},
				{
					code: "PATHFit 02",
					name: "Exercise-based Fitness Activities",
					units: 2
				},
				{
					code: "IEIA 2",
					name: "Introduction to Industrial Arts Part I",
					units: 3
				},
				{
					code: "IEIA 3",
					name: "Home Economics Literacy",
					units: 3
				},
				{
					code: "IEIA 4",
					name: "Fundamentals of Electrical Technology",
					units: 3
				},
				{
					code: "IEIA 5",
					name: "Introduction to ICT Specifications I",
					units: 3
				}
			]
		}
	]
} satisfies Curriculum;
