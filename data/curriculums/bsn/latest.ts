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
					code: "NCM 100",
					name: "Theoretical Foundation of Nursing",
					units: 3
				},
				{
					code: "MC 1",
					name: "Anatomy and Physiology",
					units: 5
				},
				{
					code: "MC 2",
					name: "Biochemistry",
					units: 5
				},
				{
					code: "GE 04",
					name: "Mathematics in the Modern World",
					units: 3
				},
				{
					code: "GE 06",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "PE 1",
					name: "Welness and Fitness",
					units: 2
				}
			]
		}
	]
} satisfies Curriculum;
