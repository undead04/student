import { storage } from "../firebase/firbaseConfig";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
const handleUploadFile = (file: File | undefined): Promise<string> => {
    return new Promise((resolve, reject) => {
      if(file){
      const filename = `${file.name}_${Date.now()}.txt`;
      const storageRef = ref(storage, `files/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // Tại đây bạn có thể xử lý tiến độ nếu cần
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject("");
            });
        }
      );
    }
    });
  };
  const hanldeDeleteImage = async (imagePath: string) => {
    const storageRef = ref(storage, imagePath);

    try {
      await deleteObject(storageRef);
      console.log('Đã xóa hình ảnh thành công');
    } catch (error) {
      console.error('Lỗi khi xóa hình ảnh:', error);
      // Xử lý lỗi tại đây nếu cần
    }
  };
const firebaseService={
    hanldeDeleteImage,
    handleUploadFile
}
export default firebaseService