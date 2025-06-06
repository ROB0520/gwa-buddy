export interface Data {
    programs: Programs;
    courses: Courses;
}

export interface Courses {
    [key: string]: Course[];
}

export interface Course {
    code: string;
    name: string;
    units: number;
    semester?: number;
    year: number;
    major?: string | string[];
}

export interface Programs {
    [key: string]: Program;
}

export interface Program {
    code: string;
    name: string;
    majors?: Major[];
    coreCode?: string;
}

export interface Major {
    code: string;
    name: string;
}
