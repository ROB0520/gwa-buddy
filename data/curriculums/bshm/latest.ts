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
					name: "Physical Activity Towards Health and Fitness 1: Movement Competency Training",
					units: 2
				},
				{
					code: "ELP",
					name: "English for Hospitality Industry",
					units: 3
				},
				{
					code: "GE 1",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE Fil 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "THC 1",
					name: "Philippine Culture and Tourism Geography",
					units: 3
				},
				{
					code: "THC 2",
					name: "Risk Management as Applied to Safety, Security and Sanitation",
					units: 3
				},
				{
					code: "THC 3",
					name: "Professional Development and Applied Ethics",
					units: 3
				},
			]
		},
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
