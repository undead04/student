export interface FilterStudentModel{
    page:number,
    pageSize:number,
    sortBy:string,
    order:string,
    grade:string,
    classRoom:string,
}
export interface FilterModel{
    page:number,
    pageSize:number,
    sortBy:string,
    order:string
}
export interface FilterQuestionModel{
    search:string,
    subjectId:string,
  grade:string
  level:string,
  tableOfContents:string,
  sortBy:string,
  order:string,
  page:string,
  pageSize:number,
}