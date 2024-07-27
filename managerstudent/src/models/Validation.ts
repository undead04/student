export interface IValidationSubject{
    name:string
}
export interface IValidationSubjectDetail{
    className:string,
    tableOfContent:string,
    subjectId:string
}
export interface IValidationClassRoom{
    name:string,
    grade:string
}
export interface IValidationStudent{
codeUser:string;
  name:string,
  email:string,
  dateOfBirth:string,
  phone:string,
  cccd:string,
  address:string,
  username:string,
  password:string,
  sex:string
}
export interface IChangePassword{
    newPassword:string,
    comfimPassword:string
}
export interface IValidationTeacher{
    codeUser:string;
  name:string,
  email:string,
  dateOfBirth:string,
  phone:string,
  cccd:string,
  address:string,
  username:string,
  password:string,
  sex:string
}
export interface IValidationTeacherClassRoom{
    classRoomId:string,
    subjectId:string,
    teacherId:string
}