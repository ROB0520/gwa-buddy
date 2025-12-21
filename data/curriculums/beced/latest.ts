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
					code: "PATHFit 01",
					name: "Physical Activities Toward Health and Fitness 1: Movement Competency Training",
					units: 2
				},
				{
					code: "FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino (KOMFIL)",
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
					code: "GE 01",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "PROF ED 01",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "PROF ED 02",
					name: "The Child and Adolescent Learner and Learning Principles",
					units: 3
				}
			]
		}
	]
} satisfies Curriculum;
