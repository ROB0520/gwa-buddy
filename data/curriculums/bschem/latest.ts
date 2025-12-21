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
					code: "GE FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "GE 02",
					name: "Readings in Philippine History",
					units: 3
				},
				{
					code: "Chem 115",
					name: "Principles of Chemistry",
					units: 5
				},
				{
					code: "Math 113",
					name: "Math Analysis 1",
					units: 3
				},
				{
					code: "ELP",
					name: "English for Chemists",
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
					code: "GE FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "Phys 124",
					name: "Physics 1",
					units: 4
				},
				{
					code: "Math 223",
					name: "Math Analysis 2",
					units: 3
				},
				{
					code: "Chem 223",
					name: "Inorganic Chemistry",
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
					code: "GE FIL 3",
					name: "Dalumat Ng/Sa Filipino",
					units: 3
				},
				{
					code: "Phys 214",
					name: "Physics 2",
					units: 4
				},
				{
					code: "Chem 315",
					name: "Analytical Chemistry 1",
					units: 5
				},
				{
					code: "Chem 415",
					name: "Organic Chemistry 1",
					units: 5
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
					code: "GE 01",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE 04",
					name: "Mathematics in the Modern World",
					units: 3
				},
				{
					code: "Chem 525",
					name: "Organic Chemistry 2",
					units: 5
				},
				{
					code: "Chem 624",
					name: "Physical Chemistry 1",
					units: 4
				},
				{
					code: "Chem 725",
					name: "Analytical Chemistry 2",
					units: 5
				},
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 3
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "GE 08",
					name: "Ethics",
					units: 3
				},
				{
					code: "Chem 814",
					name: "Physical Chemistry 2",
					units: 4
				},
				{
					code: "Chem 915",
					name: "Biochemistry 1",
					units: 5
				},
				{
					code: "GE 07",
					name: "Science, Technology and Society",
					units: 3
				},
				{
					code: "Chem 1013",
					name: "Chemical Instrumentation",
					units: 3
				},
				{
					code: "Chem 1112",
					name: "Experimental Design",
					units: 3
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "GE 03",
					name: "The Contemporary World",
					units: 3
				},
				{
					code: "GE 09",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "ELEC1",
					name: "Elective 1",
					units: 3
				},
				{
					code: "Chem 1223",
					name: "Biochemistry 2",
					units: 3
				},
				{
					code: "Res 1",
					name: "Thesis 1",
					units: 2
				},
				{
					code: "Chem 1324",
					name: "Analytical Chemistry 3: Technical Analysis",
					units: 4
				}
			]
		},
		{
			year: 3,
			semester: 3,
			courses: [
				{
					code: "OJT",
					name: "On-the-Job Training",
					units: 3
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "ELEC2",
					name: "Elective 2",
					units: 3
				},
				{
					code: "Chem 1413",
					name: "Inorganic Chemistry 2",
					units: 3
				},
				{
					code: "Chem 1513",
					name: "Physical Chemistry 3",
					units: 3
				},
				{
					code: "Res 2",
					name: "Thesis 2",
					units: 2
				},
				{
					code: "Chem 1613",
					name: "Organic Chemistry 3",
					units: 3
				},
				{
					code: "Sem",
					name: "Special Topics in Chemistry",
					units: 1
				}
			]
		},
		{
			year: 4,
			semester: 2,
			courses: [
				{
					code: "Res 3",
					name: "Thesis 3",
					units: 2
				},
				{
					code: "CA",
					name: "Course Audit: Chemistry Professional Courses",
					units: 3
				}
			]
		}
	]
} satisfies Curriculum;
