import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO';
import validation from '../validation/ValidationTeacher';
import User from '../models/User';
import AppRole from '../models/AppRole';
import bcrypt from "bcryptjs"
import Teacher from '../models/Teacher';
import ExcelJS from 'exceljs';
import { ObjectId } from 'bson';
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
        const subjectId=req.query.subjectId
        if(search) {
            query={
                $or: [
                    { codeUser: { $regex: new RegExp(search.toString(),"i") } },
                    { name: { $regex: new RegExp(search.toString(),"i")  } }
                ]
            }
        }
        if(sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        if(subjectId){
            query['subjectId']={$in:new ObjectId(subjectId.toString())}
        }
        const totalDocument = await Teacher.countDocuments(query);
        const totalPage = Math.ceil(totalDocument / pageSize);
       
        const currentPage = Math.min(page, totalPage || 1);
       
        const data=await Teacher.find(query).sort(sort).skip((currentPage-1)*pageSize).limit(pageSize)
        .populate("user")
        .populate("subject","_id name")
        res.status(200).json(repository(200, '', {
            teacher:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(totalPage,page),
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.get("/export", async (req: Request, res: Response) => {
    try {
        const teacher = await Teacher.find({});

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'ID', key: '_id', width: 30 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Date Of Birth', key: 'dateOfBirth', width: 20 },
            { header: 'CMND', key: 'cmnd', width: 20 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Address', key: 'address', width: 50 },
            
        ];

        teacher.forEach(teacher => {
            worksheet.addRow({
                _id: teacher.id,
                name: teacher.name || '',
                email: teacher.email || '',
                dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.toISOString().split('T')[0] : '',
                cmnd: teacher.cccd || '',
                phone: teacher.phone || '',
                address: teacher.address || '',
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
        const data = await Teacher.findById(id).populate("user").populate("subject")
        if (!data) {
            return res.status(404).json(repository(404, "Teacher not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    validation.validationRulesCreate(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {codeUser,name,email,dateOfBirth,phone,subjectId,cccd,address,username,password,sex}=req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        var user= await User.create({ username: username, password: hashedPassword,role:[AppRole.Teacher] });
        await Teacher.create({
            name,
            codeUser,
            email,
            dateOfBirth,
            phone,
            subjectId,
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
        let {codeUser,name,email,dateOfBirth,phone,subjectId,cccd,address,sex}=req.body;
        const id = req.params.id;
        await Teacher.findByIdAndUpdate(id, {
            name,
            codeUser,
            email,
            dateOfBirth,
            phone,
            subjectId,
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
    const teacher=await Teacher.findById(id).populate("user","_id");
    if(!teacher){
        res.status(404).json(repository(404,"Không tìm thấy giáo viên",""))
    }
    await User.findByIdAndDelete(teacher?.userId)
    await Teacher.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});
export default router;
