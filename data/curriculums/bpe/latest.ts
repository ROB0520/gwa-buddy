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
					name: "Kontekstwalisadong Komunikasyon sa Filipino (KOMFIL)",
					units: 3
				},
				{
					code: "PE 1",
					name: "Advanced Gymnastics and Physical Fitness",
					units: 2
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
					name: "Math in the Modern World",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "PROF ED 1",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "PROF ED 2",
					name: "The Child and Adolescent Learners and Learning Principles",
					units: 3
				}
			]
		},
	]
} satisfies Curriculum;
