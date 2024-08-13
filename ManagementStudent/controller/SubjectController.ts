import express, { Request, Response, NextFunction } from 'express';
import SubjectDetail, { ISubjectDetail } from '../models/SubjectDetail';
import Subject, { ISubject } from '../models/Subject';
import { repository } from '../models/DTO/DTO';
import { GroupSubjectDTO, IDetail } from '../models/DTO/GroupSubjectDTO';
const getGroupBy=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const search: string = req.query.search as string;
        // Start with the base query
        let query: any = {};
        // Apply search filters if present
        if (search) {
            query = {
                $or: [
                    { codeSubject: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const subjectDetails = await SubjectDetail.find().sort({grade:1}).populate('subjectId', '_id name').exec();
        const groupedBySubject: { [key: string]: GroupSubjectDTO } = subjectDetails.reduce((acc, item) => {
            // Kiểm tra nếu item.subjectId là một object và có thuộc tính _id
            if (item.subjectId && typeof item.subjectId === 'object' && '_id' in item.subjectId) {
              const subjectIdObj = item.subjectId as ISubject;
              const key = subjectIdObj._id.toString();
              if (!acc[key]) {
                acc[key] = {
                  subject: subjectIdObj,
                  details:[]
                };
              }
              
              acc[key].details.push(item as IDetail);
            }
            return acc;
          }, {} as { [key: string]: GroupSubjectDTO });
        
          // Chuyển đổi object thành mảng
          const result = Object.values(groupedBySubject);
          res.status(200).json(repository(200,"",result))
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const list=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const page: number = parseInt(req.query.page as string) || 1; // Trang hiện tại, mặc định là 1
        const pageSize: number = parseInt(req.query.pageSize as string) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
        const search: string = req.query.search as string;
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        // Start with the base query
        let query: any = {};
        let sort: any = {};
        // Apply search filters if present
        if (search) {
            query = {
                $or: [
                    { codeSubject: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } }
                ]
            };
        }
        if (sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        const totalDocument = await Subject.countDocuments(query);
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const data = await Subject.find(query).sort(sort)
        .skip((currentPage-1)*pageSize).limit(pageSize)
          res.status(200).json(repository(200,"",{
            subject:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(page,totalPage)
            }
          }))
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const get=async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await Subject.findById(id)
        if (!data) {
            return res.status(404).json(repository(404, "Subject not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const post=async (req: Request, res: Response, next: NextFunction) => {
    let {name}=req.body;
    await Subject.create({
        name,
        create_at: Date.now()
    })
        .then(data => {
            res.status(200).json(repository(200, "Tạo thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
};
const put=async (req: Request, res: Response, next: NextFunction) => {
    let {name}=req.body;
    const id = req.params.id;
    await Subject.findByIdAndUpdate(id, {
        name,
        create_at: Date.now()
    })
        .then(data => {
            res.status(200).json(repository(200, "Cập nhật thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const remove=async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await Subject.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const subjectController={
    getGroupBy,
    get,
    list,
    post,
    put,
    remove
}
export default subjectController;