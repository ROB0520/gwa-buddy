import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "FM",
		name: "Financial Management"
	},
	{
		code: "HRM",
		name: "Human Resource Management"
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
					code: "GE FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "BA CORE 1",
					name: "Basic Microeconomics",
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
					code: "BA CORE 2",
					name: "Good Governance and Social Responsibility",
					units: 3
				},
				{
					code: "GE 06",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "GE 07",
					name: "Science, Technology and Society",
					units: 3
				},
				{
					code: "GE FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "GE 08",
					name: "Ethics",
					units: 3
				},
				{
					code: "Elective 1",
					name: "Entrepreneurial Management",
					units: 3
				},
				{
					code: "Elective 2",
					name: "Personal Finance",
					units: 3
				}
			]
		},
		{
			year: 2,
			semester: 1,
			courses: [
				{
					code: "PATHFit 03",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				},
				{
					code: "GE 09",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "GE FIL 3",
					name: "Dalumat Ng/Sa Filipino",
					units: 3
				},
				{
					code: "BA CORE 4",
					name: "Taxation (Income Taxation)",
					units: 3
				},
				{
					code: "BA CORE 5",
					name: "Human Resource Management",
					units: 3
				},
				{
					code: "BA CORE 3",
					name: "Business Law",
					units: 3
				},
				{
					code: "Elective 3",
					name: "Cooperative Management",
					units: 3,
					majorCode: "FM"
				},
				{
					code: "Elective 3",
					name: "Management",
					units: 3,
					majorCode: "HRM"
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "ELP",
					name: "English for Business Administrators",
					units: 3
				},
				{
					code: "Elective 7",
					name: "Franchising",
					units: 3,
					majorCode: "FM"
				},
				{
					code: "BA CORE 6",
					name: "International Trade and Agreements",
					units: 3
				},
				{
					code: "CMBEC 1",
					name: "Strategic Management",
					units: 3
				},
				{
					code: "Elective 4",
					name: "Public Finance",
					units: 3,
					majorCode: "FM"
				},
				{
					code: "Elective 5",
					name: "Mutual Fund",
					units: 3,
					majorCode: "FM"
				},
				{
					code: "Elective 6",
					name: "Security Analysis",
					units: 3,
					majorCode: "FM"
				},
				{
					code: "Elective 4",
					name: "Global/International Trade",
					units: 3,
					majorCode: "HRM"
				},
				{
					code: "Elective 5",
					name: "Logistics Management",
					units: 3,
					majorCode: "HRM"
				},
				{
					code: "Elective 6",
					name: "Marketing Management",
					units: 3,
					majorCode: "HRM"
				},
				{
					code: "Elective 7",
					name: "Environmental Management System",
					units: 3,
					majorCode: "HRM"
				},
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
