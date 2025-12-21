import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "DM",
		name: "Disaster Management"
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
					code: "GE 101",
					name: "Understanding the Self",
					units: 3
				},
				{
					code: "GE 102",
					name: "Purposive Communication",
					units: 3
				},
				{
					code: "GE 103",
					name: "Mathematics in the Modern World",
					units: 3
				},
				{
					code: "GE 104",
					name: "Readings in Philippine History",
					units: 3
				},
				{
					code: "FIL 101",
					name: "Komunikasyon sa Akademikong Filipino",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE 109",
					name: "Philosophy-Logic",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 112",
					name: "College Writing",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE ELEC 101",
					name: "Fundamental Concepts, Principles, Theories of Earth and Life Sciences",
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
					code: "FIL 102",
					name: "Pagbasa at Pagsulat Tungo sa Pananaliksik",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE 105",
					name: "Art Appreciation",
					units: 3
				},
				{
					code: "GE 106",
					name: "Ethics",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE 107",
					name: "The Contemporary World",
					units: 3
				},
				{
					code: "GE 111",
					name: "College Algebra",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 113",
					name: "Writing as Thinking",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 114",
					name: "Literature and Society",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE ELEC 102",
					name: "General Chemistry",
					units: 3
				},
				{
					code: "PA 101",
					name: "Introduction to Public Administration",
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
					code: "FIL 103",
					name: "Masining na Pagpapahayag",
					units: 3,
					coreOnly: true
				},
				{
					code: "SC 101",
					name: "Political Science and Governance",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 115",
					name: "Argumentation and Debate",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 108",
					name: "Science, Technology and Society",
					units: 3
				},
				{
					code: "GE ELEC 103",
					name: "Introduction to Information Technology (with Computer Fundamentals)",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE ELEC 104",
					name: "Political Science and Governance",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE ELEC 105",
					name: "Basic Accounting",
					units: 3,
					coreOnly: true
				},
				{
					code: "DM 101",
					name: "Introduction to Disaster Management",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "SC 102",
					name: "Psychology",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "GE 110",
					name: "Philosophy 2 - Ethics",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "PA 102",
					name: "Philippine Administrative Thought and Institution",
					units: 3
				},
				{
					code: "PA 103",
					name: "Human Behavior in Organization",
					units: 3,
					coreOnly: true
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
					code: "GE ELEC 106",
					name: "Corporate Governane and Social Responsibility",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA ELEC 101",
					name: "Voluntary Sector Management",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 104",
					name: "Leadership and Decision Making",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 105",
					name: "Public Fiscal Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 106",
					name: "Organization and Management",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 107",
					name: "Office and Systems Management",
					units: 3,
					coreOnly: true
				},
				{
					code: "GE 116",
					name: "English for the Profession",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "SC 103",
					name: "Basic Statistics",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "SC 104",
					name: "Basic Accounting",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "PA 103",
					name: "Human Behavior in Organization",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 102",
					name: "Basic Science of Natural Hazards",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 103",
					name: "Disaster Planning and Management",
					units: 3,
					majorCode: "DM"
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
					code: "PA ELEC 102",
					name: "Public Enterprise",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 108",
					name: "Knowledge Management and ICT for Public Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 109",
					name: "Local and Regional Administration",
					units: 3
				},
				{
					code: "PA 110",
					name: "Public Personnel Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 111",
					name: "Govcernance and Development",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 105",
					name: "Public Fiscal Administration",
					units: 3
				},
				{
					code: "PA 112",
					name: "Public Policy and Program Administration",
					units: 3
				},
				{
					code: "DM 104",
					name: "Incident Management",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 105",
					name: "Natural and Human-Induced Disaster Management",
					units: 3,
					majorCode: "DM"
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "PA ELEC 103",
					name: "Philippine Indigenous Cultural Communities",
					units: 3
				},
				{
					code: "PA 113",
					name: "Public Accounting and Budgeting",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 114",
					name: "Tools for Policy Analysis",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 115",
					name: "Administrative Law",
					units: 3
				},
				{
					code: "PA 116",
					name: "Politics and Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 117",
					name: "Research Methods in Public Administration I",
					units: 3,
					coreOnly: true
				},
				{
					code: "DM 141",
					name: "Climate Change Adaptation and Disasters",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 106",
					name: "Disaster Management and ICT",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 107",
					name: "Global Disaster Management",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 108",
					name: "Research Methods in Disaster Management I",
					units: 3,
					majorCode: "DM"
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "RIZAL",
					name: "The Life and Works of Rizal",
					units: 3
				},
				{
					code: "PA ELEC 104",
					name: "Globalization and Public Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 118",
					name: "Ethics and Accountability in Public Service",
					units: 3
				},
				{
					code: "PA 119",
					name: "Research Methods in Public Administration II",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 120",
					name: "Public Administration & the Economic System",
					units: 3,
					coreOnly: true
				},
				{
					code: "PA 121",
					name: "Special Topics/Problems in Public Administration",
					units: 3,
					coreOnly: true
				},
				{
					code: "DM 109",
					name: "Community-Based Disaster Management",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 110",
					name: "Risk Identification and Prevention",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 142",
					name: "Environmental Management",
					units: 3,
					majorCode: "DM"
				},
				{
					code: "DM 111",
					name: "Research Methods in Disaster Management II",
					units: 3,
					majorCode: "DM"
				}
			]
		},
		{
			year: 4,
			semester: 2,
			courses: [
				{
					code: "PA ELEC 105",
					name: "Environmental Ethics, Laws, and Policies",
					units: 3
				},
				{
					code: "PA ELEC 106",
					name: "Project Development and Management",
					units: 3
				},
				{
					code: "PRACTICUM 101",
					name: "Practicum",
					units: 6
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
