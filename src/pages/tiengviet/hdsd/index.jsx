import { useEffect, useState } from 'react';
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
} from 'react-share';

const Hdsd = () => {

    const emailAddress = 'lichsudiaphuongtravinh@gmail.com'; // Địa chỉ email người nhận
    const subject = 'Góp ý'; // Tiêu đề email
    const body = 'Góp ý của bạn: '; // Nội dung email

    // Định dạng URL mailto với encodeURIComponent để đảm bảo mã hóa đúng
    const emailUrl = `mailto:${encodeURIComponent(emailAddress)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return (
        <>

        <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto flex-grow">
                <h2 className="text-3xl text-center pb-4 border-b border-slate-800 flex justify-center items-center gap-2">
                    Hướng dẫn sử dụng
                </h2>
                <div className="bg-white shadow rounded-xl p-4 text-justify">
                    <ul className="list-[disclosure-closed] pl-5">
                        <li>
                            <div>
                                Ở mục{' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/home.png" className="w-5 h-5" />
                                </span>
                                <b>Trang chủ</b>{' '}: bạn có thể tìm hiểu thông tin khái quát về phần mềm, cung cấp cho bạn những bài viết nổi bật nhất và những bài viết vừa được phần mềm cập nhật.
                            </div>
                        </li>
                        <li>
                            <div>
                                Để có trải nghiệm tốt hơn, bạn có thể tạo tài khoản và đăng nhập vào phần mềm ở mục{' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/account.png" className="w-5 h-5" />
                                </span>
                                {' '}
                                <b>Đăng ký/ đăng nhập</b> để có thể viết bình luận, bổ sung thông tin, chơi trò chơi, thích bài viết,...
                            </div>
                        </li>
                        <li>
                            <div>
                                {' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/list.png" className="w-4 h-4" />
                                </span>
                                {' '}
                                <b>Danh mục</b> và
                                {' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/like.png" className="w-4 h-4" />
                                </span>
                                {' '}
                                <b>yêu thích</b> là nơi lưu trữ những bài viết của phần mềm cũng như những bài viết bạn đã yêu thích.
                            </div>
                        </li>
                        <li>
                            <div>
                                Chức năng
                                {' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/map.png" className="w-5 h-5" />
                                </span>
                                {' '}
                                <b>bản đồ</b> sẽ cung cấp cho bạn vị trí của từng đối tượng cụ thể theo từng huyện, thị, thành phố, bạn có thể xem nội dung khái quát, thuyết minh cũng như 3D - VR Tour.
                            </div>
                        </li>
                        <li>
                            <div>
                                {' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/bot.png" className="w-5 h-5" />
                                </span>
                                {' '}
                                <b>Chatbot</b> sẽ cho bạn tương tác trực tiếp với ai của phần mềm nhận được những câu trả lời lý thú.
                            </div>
                        </li>
                        <li>
                            <div>
                                {' '}
                                <span className="inline-block align-middle">
                                    <img src="https://raw.githubusercontent.com/thansouuu/data-image/main/ch%E1%BB%A9c%20n%C4%83ng/find.png" className="w-5 h-5" />
                                </span>
                                {' '}
                                <b>Tìm kiếm</b> sẽ cho bạn tìm kiếm nội dung của từng huyện, thị, thành phố hay tìm kiếm theo tiêu đề bài viết.
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Nơi có hình ảnh bạn có thể chọn chia sẽ sang phần mềm thứ 3 cũng như tải về máy.</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Những chữ in đậm <b><span className={'text-amber-700'}>màu</span></b> : sẽ cung cấp cho bạn hình ảnh, nội dung liên quan.</p>
                                <p>Những chữ in đậm <b><span className={'text-green-400'}>màu</span></b> : sẽ liên kết tới những bài viết liên quan.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Thêm div trống màu trắng với chiều cao 200px */}
            <div className="bg-gray-900 -mx-6 -mb-[200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-white">
                <div className="flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-[100px] h-[100px] object-cover"
                    />
                </div>
                <div>
                    <h2 className="my-2 font-bold italic text-xl">NHÓM TÁC GIẢ:</h2>
                    <ul className="list-[disclosure-closed] pl-5 text-lg">
                        <li className='ml-5'>Hứa Phước Duy</li>
                        <li className='ml-5'>Thạch Hoàng Phương Lam</li>
                        <li className='ml-5'>Giáo viên hướng dẫn: Thi Thị Thanh Tuyền</li>
                    </ul>
                </div>
                <div>
                    <h2 className="my-2 font-bold italic text-xl">Liên hệ với chúng tôi:</h2>
                    <div className="flex items-center gap-4">
                        <EmailShareButton url={emailUrl}>
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                        <a href={`https://www.youtube.com/@L%E1%BB%8Bchs%E1%BB%AD%C4%91%E1%BB%8Baph%C6%B0%C6%A1ngTr%C3%A0Vinh`} target="_blank" rel="noopener noreferrer">
                            <img src="/logo.png" alt="Share on Messenger" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        </a>
                        <FacebookShareButton hashtag={'Góp ý'} url={window.location.href} >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={window.location.href} >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                </div>
            </div>


        
        </>
    );
};

export default Hdsd;
