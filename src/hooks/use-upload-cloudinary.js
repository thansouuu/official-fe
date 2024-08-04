import axios from 'axios';

export const uploadToCloudinary = async (files) => {
    try {
        // Sử dụng Promise.all để thực hiện upload cho từng file một
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'o5qdyqnw'); // Thay 'your_upload_preset' bằng preset của bạn
        
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dvqeld7hm/image/upload', // Thay 'your_cloud_name' bằng cloud name của bạn
                formData
            );

            return response.data;
        });

        // Đợi cho tất cả các upload promise hoàn thành
        const uploadResults = await Promise.all(uploadPromises);

        console.log('Kết quả tất cả các upload:', uploadResults);

        return uploadResults;

    } catch (error) {
        console.error('Lỗi upload:', error);
    }
}