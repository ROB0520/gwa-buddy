import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "CS",
		name: "Crop Science"
	}
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
					code: "GE 03",
					name: "The Contemporary World",
					units: 3
				},
				{
					code: "Soil Sci 1",
					name: "Principles of Soil Science",
					units: 3
				},
				{
					code: "Crop Prot 1",
					name: "Principles of Crop Protection",
					units: 3
				},
				{
					code: "Chem 1",
					name: "Organic Chemistry",
					units: 3
				},
				{
					code: "Bio 1",
					name: "General Biology",
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
					code: "Crop Sci 1",
					name: "Principles of Crop Production",
					units: 3
				},
				{
					code: "GE 04",
					name: "Mathematics in the Modern World",
					units: 3
				},
				{
					code: "Ani Sci 1",
					name: "Introduction to Animal Science",
					units: 3
				},
				{
					code: "Crop Prot 2",
					name: "Approaches and Practices in Past Management",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "Soil Sci 2",
					name: "Soil Fertility, Conservation and Management",
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
					code: "GE 06",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "Ani Sci 2",
					name: "Introduction to Livestock and Poultry Production",
					units: 3
				},
				{
					code: "Core Course 1",
					name: "Principles of Genetics",
					units: 3
				},
				{
					code: "Crop Sci 2",
					name: "Practices of Crop Production",
					units: 3
				},
				{
					code: "Core Course 2",
					name: "Methods of Agricultural Research",
					units: 3
				},
				{
					code: "GE FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "Core Course 3",
					name: "Introduction to Organic Agriculture",
					units: 3
				},
				{
					code: "PATHFit 03",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "GE 07",
					name: "Science, Technology and Society",
					units: 3
				},
				{
					code: "Biochem",
					name: "General Biochemistry",
					units: 3
				},
				{
					code: "Core Course 4",
					name: "Principles of Agricultural Extension and Communication",
					units: 3
				},
				{
					code: "Core Course 5",
					name: "Natural Resource and Environmental Management",
					units: 3
				},
				{
					code: "Core Course 6",
					name: "Principle of Agricultural Entrepreneurship and Marketing",
					units: 3
				},
				{
					code: "GE FIL 2",
					name: "Dalumat Ng/Sa Filipino",
					units: 3
				},
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "Core Course 7",
					name: "Introduction to Agricultural Commodity and Enterprise Development",
					units: 3
				},
				{
					code: "Core Course 8",
					name: "Basic Farm Machines, Mechanization and Water Management",
					units: 3
				},
				{
					code: "Major Course 1",
					name: "Beneficial Antropods and Micro-Organisms",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Seminar 1",
					name: "Seminar 1",
					units: 1
				},
				{
					code: "Thesis 1",
					name: "Thesis Outline",
					units: 2
				},
				{
					code: "Biotech",
					name: "Basic Biotechnology",
					units: 3
				},
				{
					code: "Major Course 2",
					name: "Weed Management",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Major Course 3",
					name: "Cereals and Food Legumes",
					units: 3,
					majorCode: "CS"
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "Major Course 4",
					name: "Slaughter of Animals and Animal Products Processing",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "GE FIL 3",
					name: "Panitikan",
					units: 3
				},
				{
					code: "GE 08",
					name: "English for Agriculturist",
					units: 3
				},
				{
					code: "Core Course 9",
					name: "Introduction to Agricultural Policy and Development",
					units: 3
				},
				{
					code: "Major Course 5",
					name: "Principles of Plant Breeding",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Major Course 6",
					name: "Fruit and Plantation Crop Production and Management",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Seminar 2",
					name: "Seminar 2",
					units: 1
				},
				{
					code: "Thesis 2",
					name: "Conduct of Thesis",
					units: 2
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "GE 09",
					name: "Ethics",
					units: 3
				},
				{
					code: "Core Course 10",
					name: "Social Entrepreneurship",
					units: 3
				},
				{
					code: "Major Course 9",
					name: "Post-Harvest Handling and Seed Technology",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Major Course 10",
					name: "General Physiology and Toxicology",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "PI",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "Major Course 7",
					name: "Bulbs, Roots and Tuber Crops Production",
					units: 3,
					majorCode: "CS"
				},
				{
					code: "Major Course 8",
					name: "Vegetable Production",
					units: 3,
					majorCode: "CS"
				}
			]
		},
		{
			year: 4,
			semester: 2,
			courses: [
				{
					code: "OJT",
					name: "On-the-Job Training",
					units: 1
				},
				{
					code: "CA",
					name: "Course Audit",
					units: 1
				},
				{
					code: "Thesis 3",
					name: "Thesis Manuscript and Defense",
					units: 1
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
