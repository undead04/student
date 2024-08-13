interface Page {
    totalPage: number;
    currentPage: number;
    totalDocument:number;
}

interface RepositoryResponse {
    code: number;
    message: string;
    data: any;
}

// Định nghĩa kiểu cho response repository
export const repository = (code: number, message: string, data: any): RepositoryResponse => ({
    code,
    message,
    data
});