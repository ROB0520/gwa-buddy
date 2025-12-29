import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "CT",
		name: "Culinary Technology"
	},
	{
		code: "FT",
		name: "Food Technology"
	},
] as const;

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	majors,
	term: [
		{
			year: 1,
			semester: 1,
			courses: [
				{
					code: "CT 111",
					name: "Occupational Health and Safety",
					units: 3,
					majorCode: [
						"CT",
						"FT",
					]
				},
				{
					code: "CT 112",
					name: "Food Safety Management",
					units: 2,
					majorCode: [
						"CT",
						"FT",
					]
				},
				{
					code: "CT 113",
					name: "Food and Beverage Management",
					units: 3,
					majorCode: [
						"FT",
						"CT",
					]
				},
				{
					code: "GE 01",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE Elective 1",
					name: "Kulturang Popular ng/sa Pilipinas",
					units: 3
				},
				{
					code: "GE 02",
					name: "Mga Babsahin Hinggil sa Kasaysayan ng Pilipinas",
					units: 3
				},
				{
					code: "AC 11",
					name: "Introduction to Information Technology",
					units: 3
				},
				{
					code: "AC 12",
					name: "Industrial Drawing",
					units: 2
				},
				{
					code: "PATHFit 1",
					name: "Movement Competency Training",
					units: 2
				},
			]
		},
		{
			year: 1,
			semester: 2,
			courses: [
				{
					code: "CT 121",
					name: "Culinary Arts and Science",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 122",
					name: "Facilities Layout and Design",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 123",
					name: "Food Nutrition and Meal Management",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "GE 03",
					name: "The Contemporary World",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "MSC 1",
					name: "Comprehensive Mathematics",
					units: 5
				},
				{
					code: "AC 13",
					name: "Computer Programming",
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
					code: "CT 211",
					name: "Bar Management",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 212",
					name: "Boufangerie and Pâtisserie Arts",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 213",
					name: "International Cuisine 1",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "AC 14",
					name: "Materials Technology Management",
					units: 3
				},
				{
					code: "GE 06",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "GE Elective 2",
					name: "Consumer Behavior and Financial Decisions",
					units: 3
				},
				{
					code: "ELP",
					name: "English for Industrial Technologists",
					units: 3
				},
				{
					code: "GE 04",
					name: "Mathematical in the Modern World",
					units: 3
				},
				{
					code: "MSC 2",
					name: "Chemistry for Industrial Technologists",
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
					code: "CT 221",
					name: "Food and Beverage Cost Control",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 222",
					name: "Food Chemistry",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "CT 223",
					name: "International Cuisine 2",
					units: 3,
					majorCode: "CT"
				},
				{
					code: "AC 15",
					name: "Quality Control and Assurance",
					units: 3
				},
				{
					code: "GE 07",
					name: "Science, Technology, and Society",
					units: 3
				},
				{
					code: "GE 08",
					name: "Ethics",
					units: 3
				},
				{
					code: "GE 09",
					name: "The Life and Works of Jose Rizal",
					units: 3
				},
				{
					code: "MSC 3",
					name: "Physics for Industrial Technologist",
					units: 3
				},
				{
					code: "PATHFit 04",
					name: "Choice of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		},
	]
} satisfies Curriculum<typeof majors>;
