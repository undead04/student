import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import Student, { IStudent } from "../models/Student"
import validation from '../validation/ValidationStudent';
import User from '../models/User';
import AppRole from './../models/AppRole';
import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import { ObjectId } from 'bson';
const commonPipeline = [
    {
        $lookup: {
            from: 'classrooms',
            localField: 'classRoomId',
            foreignField: '_id',
            as: 'classRoom'
        }
    },
    { $unwind: '$classRoom' },
    {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
        }
    },
    { $unwind: '$user' },
    
];
const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        let sort: any = {};
        const page=Number(req.query.page)||1;
        const pageSize=Number(req.query.pageSize)||10
        const search=req.query.search;
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        const classRoomId=req.query.classRoomId;
        if(classRoomId){
            query['classRoom._id']=new ObjectId(classRoomId as string)
            if(search) {
                query={
                    $or: [
                        { codeUser: { $regex: search, $options: 'i' } },
                        { name: { $regex: search, $options: 'i' } }
                    ]
                }
            }
            if(sortBy) {
                sort = { [sortBy as string]: sortOrder };
            }
            const countPipeline = [
                ...commonPipeline,
                { $match: query },
                { $count: 'totalDocuments' }
            ];
            const countResult = await Student.aggregate(countPipeline);
            const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
            const totalPage = Math.ceil(totalDocument / pageSize);
            const currentPage = Math.min(page, totalPage || 1);
            const fetchPipeline=[
                ...commonPipeline,
                {$match:query},
                {$skip:(currentPage-1)*pageSize},
                {$limit:pageSize}
            ]
            const data=await Student.aggregate(fetchPipeline)
            console.log(query,data)
            res.status(200).json(repository(200, '', {
                student:data,
                page:{
                    totalPage:totalPage,
                    currentPage:Math.min(totalPage,page),
                }
            }));
        }
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.get("/export", async (req: Request, res: Response) => {
    try {
        const students = await Student.find({});

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'ID', key: '_id', width: 30 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Date Of Birth', key: 'dateOfBirth', width: 20 },
            { header: 'CCCD', key: 'cccd', width: 20 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Address', key: 'address', width: 50 },
            { header: 'Class Room', key: 'classRoom', width: 20 },
        ];

        students.forEach(student => {
            worksheet.addRow({
                _id: student._id,
                name: student.name || '',
                email: student.email || '',
                dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : '',
                cmnd: student.cccd || '',
                phone: student.phone || '',
                address: student.address || '',
            });
        });

        // Căn giữa các cột
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // Thiết lập header phản hồi để tải xuống file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

        // Ghi workbook ra response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting Excel:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await Student.aggregate([...commonPipeline,{$match:{_id:new ObjectId(id)}}])
        if (!data) {
            return res.status(404).json(repository(404, "Student not found", ""));
        }
        res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    validation.validationRuleCreate(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {codeUser,name,email,dateOfBirth,phone,classRoomId,cccd,address,username,password,sex}=req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        var user= await User.create({ username: username, password: hashedPassword,role:[AppRole.Student]});
        await Student.create({
            name,
            codeUser,
            email,
            dateOfBirth,
            phone,
            classRoomId,
            cccd,
            address,
            userId:user._id,
            sex
        })
            .then(data => {
                res.status(200).json(repository(200, "Tạo thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    });

router.put('/:id',
    validation.validationRulesUpdate(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {codeUser,name,email,dateOfBirth,phone,classRoomId,cccd,address,sex}=req.body;
        const id = req.params.id;
        await Student.findByIdAndUpdate(id, {
            name,
            codeUser,
            email,
            dateOfBirth,
            phone,
            classRoomId,
            cccd,
            address,
            sex
        })
            .then(data => {
                res.status(200).json(repository(200, "Cập nhật thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    });

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const student=await Student.findById(id).populate("user","_id");
    if(!student){
        res.status(404).json(repository(404,"Không tìm thấy học sinh",""))
    }
    await User.findByIdAndDelete(student?.userId)
    await Student.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
