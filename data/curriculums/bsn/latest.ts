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
					code: "PATHFit 1",
					name: "Movement Competency Training",
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
					code: "NMC 100",
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
					code: "GE 03",
					name: "The Contemporary World",
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
			]
		}
	]
} satisfies Curriculum;
