import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "MATH",
		name: "Mathematics"
	},
	{
		code: "SCI",
		name: "Science"
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
					code: "FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
				},
				{
					code: "PATHFit 01",
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
					code: "ProfEd 01",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "ProfEd 02",
					name: "The Child and Adolescent Learner and Learning Principles",
					units: 3
				}
			]
		},
		{
			year: 1,
			semester: 2,
			courses: [
				{
					code: "FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "PATHFit 02",
					name: "Exercise-based Fitness Activities",
					units: 3
				},
				{
					code: "ProfEd 03",
					name: "Facilitating Learner - Centered Teaching: The Learner Centered Approaches",
					units: 3
				},
				{
					code: "SES 1",
					name: "Earth Science",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 2",
					name: "Inorganic Chemistry",
					units: 5,
					majorCode: "SCI"
				},
				{
					code: "SES 3",
					name: "Anatomy and Physiology",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 4",
					name: "Fluid Mechanics",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SEM 1",
					name: "History of Mathematics",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 2",
					name: "College and Advanced Algebra",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 3",
					name: "Elementary Statistics and Probability",
					units: 3,
					majorCode: "MATH"
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
					code: "GE 10",
					name: "Living in the IT Era",
					units: 3
				},
				{
					code: "ProfEd 04",
					name: "Technology for Teaching and Learning 1",
					units: 3
				},
				{
					code: "ProfEd 05",
					name: "The Teacher and the School Curriculum",
					units: 3
				},
				{
					code: "ProfEd 06",
					name: "Assessment in Learning 1",
					units: 3
				},
				{
					code: "SES 5",
					name: "Environmental Science",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 6",
					name: "Electricity and Magnetism",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 7",
					name: "Organic Chemistry",
					units: 5,
					majorCode: "SCI"
				},
				{
					code: "SEM 4",
					name: "Trigonometry",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 5",
					name: "Mathematics of Investment",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 6",
					name: "Plane and Solid Geometry",
					units: 4,
					majorCode: "MATH"
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2
				},
				{
					code: "ProfEd 07",
					name: "Building and Enhancing New Literacies Across the Curriculum",
					units: 3
				},
				{
					code: "ProfEd 08",
					name: "Assessment in Learning 2",
					units: 3
				},
				{
					code: "ProfEd 09",
					name: "Foundation of Special and Inclusive Education",
					units: 3
				},
				{
					code: "SES 8",
					name: "Astronomy",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 9",
					name: "Genetics",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 10",
					name: "Waves and Optics",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 11",
					name: "Biochemistry",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SEM 7",
					name: "Logic and Set Theory",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 8",
					name: "Calculus and Analytic Geometry",
					units: 4,
					majorCode: "MATH"
				},
				{
					code: "SEM 9",
					name: "Advanced Statistics",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 10",
					name: "Principles and Strategies in Teaching Math",
					units: 3,
					majorCode: "MATH"
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "ProfEd 10",
					name: "The Teacher and the Community, School Culture and Organizational Leadership",
					units: 3
				},
				{
					code: "ProfEd 11",
					name: "Methods of Research (Research 1)",
					units: 3
				},
				{
					code: "SES 12",
					name: "Microbiology and Parasitology",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 13",
					name: "Meteorology",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 14",
					name: "The Teaching of Science",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 15",
					name: "Thermodynamics",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SES 16",
					name: "Cell and Molecular Biology",
					units: 4,
					majorCode: "SCI"
				},
				{
					code: "SEM 11",
					name: "Calculus 2",
					units: 4,
					majorCode: "MATH"
				},
				{
					code: "SEM 12",
					name: "Number Theory",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 13",
					name: "Linear Algebra",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 14",
					name: "Technology for Teaching and Learning 2",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 15",
					name: "Assessment and Evaluation in Mathematics",
					units: 3,
					majorCode: "MATH"
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "ELP",
					name: "English for Teachers",
					units: 3
				},
				{
					code: "SES 17",
					name: "Modern Physics",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 18",
					name: "Analytical Chemistry",
					units: 5,
					majorCode: "SCI"
				},
				{
					code: "SES 19",
					name: "Technology for Teaching and Learning 2",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SES 20",
					name: "Research in Teaching Science",
					units: 3,
					majorCode: "SCI"
				},
				{
					code: "SEM 16",
					name: "Research in Mathematics",
					units: 4,
					majorCode: "MATH"
				},
				{
					code: "SEM 17",
					name: "Calculus 3",
					units: 4,
					majorCode: "MATH"
				},
				{
					code: "SEM 18",
					name: "Modern Geometry",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 19",
					name: "Abstract Algebra",
					units: 3,
					majorCode: "MATH"
				},
				{
					code: "SEM 20",
					name: "Problem Solving, Math Investigation and Modeling",
					units: 3,
					majorCode: "MATH"
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "GE 03",
					name: "The Contemporary World",
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
					code: "GE 08",
					name: "Ethics",
					units: 3
				},
				{
					code: "GE 09",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "ProfEd 12",
					name: "Field Study 1",
					units: 3
				},
				{
					code: "ProfEd 13",
					name: "Field Study 2",
					units: 3
				}
			]
		},
		{
			year: 4,
			semester: 2,
			courses: [
				{
					code: "ProfEd 14",
					name: "Teaching Internship (Local and/or International)",
					units: 6
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
