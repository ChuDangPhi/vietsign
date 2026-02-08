import { Base } from "./base";

export class ClassModel extends Base {
  constructor() {
    super("teaching-management/classrooms");
  }

  getAllClasses = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getClassById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  createClass = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  updateClass = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteClass = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };

  // Specific endpoints
  getStudentClasses = async () => {
    const res = await this.apiGet("/my-classes");
    return res.data;
  };

  // Student management
  getClassroomStudents = async (classroomId: number) => {
    const res = await this.apiGet(`/${classroomId}/students`);
    return res.data;
  };

  addStudentToClassroom = async (classroomId: number, studentId: number) => {
    const res = await this.apiPost(`/${classroomId}/students`, { studentId });
    return res.data;
  };

  removeStudentFromClassroom = async (
    classroomId: number,
    studentId: number,
  ) => {
    const res = await this.apiDelete(`/${classroomId}/students`, undefined, {
      studentId,
    });
    return res.data;
  };
}

const Classes = new ClassModel();
export default Classes;
