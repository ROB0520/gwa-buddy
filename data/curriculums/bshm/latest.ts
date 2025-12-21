import { Curriculum } from "@/data/types";

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	term: [
		{
			year: 2,
			semester: 2,
			courses: [
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
					code: "HPC 4",
					name: "Ergonomics and Facilities Planning for the Hospitality Industry",
					units: 3
				},
				{
					code: "HPC 6",
					name: "Foreign Language 1",
					units: 3
				},
				{
					code: "HPC 3",
					name: "Fundamentals of Food Service Operators",
					units: 3
				},
				{
					code: "HPC 5",
					name: "Introduction to Meetings, Incentives, Conventions and Exhibitions (MICE)",
					units: 3
				},
				{
					code: "HMPE 3",
					name: "Food and Beverage Cost Control",
					units: 3
				},
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		}
	]
} satisfies Curriculum;
