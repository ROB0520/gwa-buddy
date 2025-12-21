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
					code: "ProfEd 01",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "ProfEd 02",
					name: "The Child and Adolescent Learner and Learning Principles",
					units: 3
				},
				{
					code: "GE 01",
					name: "Understanding the Self",
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
					code: "PATHFit 02",
					name: "Exercise-based Fitness Activities",
					units: 2
				},
				{
					code: "FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "ProfEd 03",
					name: "Facilitating Learner - Centered Teaching",
					units: 3
				},
				{
					code: "EED1",
					name: "Good Manners and Right Conduct(Edukasyon sa Pagpapakatao)",
					units: 3
				},
				{
					code: "EED2",
					name: "Content and Pedagogy for the Mother Tongue",
					units: 3
				},
				{
					code: "EED3",
					name: "Teaching English in the Elementary Grades (Language Arts)",
					units: 3
				}
			]
		}
	]
} satisfies Curriculum;
