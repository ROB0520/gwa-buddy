import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "HE",
		name: "Home Economics"
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
					code: "PE 1",
					name: "Advanced Gymnastics and Physical Fitness",
					units: 2
				},
				{
					code: "FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3
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
					code: "PROF ED 01",
					name: "The Teaching Profession",
					units: 3
				},
				{
					code: "PROF ED 02",
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
					code: "PE 2",
					name: "Rhytmic Activities",
					units: 2
				},
				{
					code: "FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3
				},
				{
					code: "PROF ED 03",
					name: "Facilitating Learner - Centered Teaching: The Learner Centered Approaches with Emphasis on Trainers Methodology I",
					units: 3
				},
				{
					code: "TLEHE 1",
					name: "Fundamentals of Drawing",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 2",
					name: "",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 3",
					name: "Home Economics Literacy",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 4",
					name: "Principles of Food Preparation",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 5",
					name: "Introduction to ICT Specializations I",
					units: 3,
					majorCode: "HE"
				}
			]
		},
		{
			year: 2,
			semester: 1,
			courses: [
				{
					code: "PE 3",
					name: "Individual and Dual Sports",
					units: 2
				},
				{
					code: "GE 10",
					name: "Living in the IT Era",
					units: 3
				},
				{
					code: "PROF ED 04",
					name: "Technology for Teaching and Learning 1",
					units: 3
				},
				{
					code: "PROF ED 05",
					name: "Curriculum Development and Evaluation with Emphasis on Trainers' Methodology II",
					units: 3
				},
				{
					code: "PROF ED 06",
					name: "Assessment in Learning 1",
					units: 3
				},
				{
					code: "TLEHE 6",
					name: "Family and Consumer Life Skills",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 7",
					name: "Entrepreneurship",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 8",
					name: "Introductionn to Industrial Arts Part II",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 9",
					name: "Introduction to ICT Specializations II",
					units: 3,
					majorCode: "HE"
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "PE 4",
					name: "Team Sports",
					units: 2
				},
				{
					code: "PROF ED 07",
					name: "Building and Enhancing New Literacies Across the Curriculum with Emphasis on the 21st Century Skills",
					units: 3
				},
				{
					code: "PROF ED 08",
					name: "Assessment in Learning 2 with focus on Trainers Methodology I and II",
					units: 3
				},
				{
					code: "PROF ED 09",
					name: "Foundation of Special and Inclusive Education",
					units: 3
				},
				{
					code: "TLEHE 10",
					name: "Fundamentals of Food Technology",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 11",
					name: "Agri-Fishery Part I",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 12",
					name: "Arts in Daily Living",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 14",
					name: "Child and Adolescent Development",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 15",
					name: "Food and Nutrition",
					units: 3
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "PROF ED 10",
					name: "The Teacher and the Community, School Culture and Organizational Leadership with focus on Philipine TVET System",
					units: 3
				},
				{
					code: "PROF ED 11",
					name: "Technology Research 1 (Methods of Research)",
					units: 3
				},
				{
					code: "TLEHE 13",
					name: "Technology for Teaching and Learning 2",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 16",
					name: "Marriage and Family Relationships",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 17",
					name: "Agri-Fishery Part II",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 18",
					name: "Cosmetology and Beauty Care",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 19",
					name: "Household Resource Management",
					units: 3
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "ELP",
					name: "English Proficiency for BTLE",
					units: 3
				},
				{
					code: "PROF ED 12",
					name: "Technology Research 2 (Undergraduate Thesis/Research Paper/Research Project)",
					units: 3
				},
				{
					code: "TLEHE 20",
					name: "School Food Service Management",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 21",
					name: "Clothing Selection, Purchase, Construction and Care",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 22",
					name: "Crafts Design (Handicraft)",
					units: 3,
					majorCode: "HE"
				},
				{
					code: "TLEHE 23",
					name: "Consumer Education",
					units: 3
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
					code: "PROF ED 13",
					name: "Field Study 1",
					units: 3
				},
				{
					code: "PROF ED 14",
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
					code: "PROF ED 15",
					name: "Teaching Internship (Local and/or International)",
					units: 6
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
