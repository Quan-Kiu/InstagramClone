export const checkImage = (file) => {
    if (!file) return 'Vui lòng chọn file.';

    if (file.size < 1024)
        return 'File của bạn có kích thước quá nhỏ (nhỏ hơn 1kb).';
    if (file.size > 1240 * 1240 * 10)
        return 'File của bạn có kích thước lớn hơn 10mb.';

    if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        !file.type.includes('video/')
    )
        return 'File của bạn không hợp lệ.';
};

export const uploadImage = async (images) => {
    let imgArray = [];
    for (const item of images) {
        const formData = new FormData();
        formData.append('file', item);

        formData.append('upload_preset', 'ijubicjh');
        formData.append('cloud_name', 'quankiu');

        const res = await fetch(
            'https://api.cloudinary.com/v1_1/quankiu/upload',
            {
                method: 'POST',
                body: formData,
            }
        );
        const { public_id, url } = await res.json();

        imgArray.push({ public_id, url });
    }
    return imgArray;
};
