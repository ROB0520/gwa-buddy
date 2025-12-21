import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "ECE",
		name: "Early Childhood Education"
	}
] as const;

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	majors,
	term: [
		{
			year: 2,
			semester: 1,
			courses: [
				{
					code: "FIL 3",
					name: "Dalumat ng Filipino",
					units: 3
				},
				{
					code: "PROF ED 04",
					name: "Technology for Teaching and Learning 1",
					units: 3
				},
				{
					code: "PROF ED 05",
					name: "The Teacher and the School Curriculum",
					units: 3
				},
				{
					code: "PROF ED 06",
					name: "Assessment in Learning 1",
					units: 3
				},
				{
					code: "SNED 5",
					name: "Curriculum and Pedagogy in Inclusive Education",
					units: 3
				},
				{
					code: "SNED 6",
					name: "Educational Assessment of Students with Special Needs",
					units: 3
				},
				{
					code: "SNED-ECE 1",
					name: "Creative Arts, Music and Movement in Early Childhood Education",
					units: 3,
					majorCode: "ECE"
				},
				{
					code: "SNED-ECE 2",
					name: "Arts and Movement in Early Childhood Education",
					units: 3,
					majorCode: "ECE"
				},
				{
					code: "PATHFit 03",
					name: "Physical Activities Towards Health and Fitness 3",
					units: 2
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
