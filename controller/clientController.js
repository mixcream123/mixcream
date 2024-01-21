const modelmaDH = require("../models/maDH");

module.exports = class APIClient{
    static async check(req, res){
        const tenMDH = req.body.tenmadonhang;
        console.log(tenMDH)
        let check_result = await modelmaDH.findOne({tenmadonhang: tenMDH});
        console.log(check_result)
        if(check_result){
             res.render("./checkMDH", {
              message_success:
                "Cảm ơn bạn đã tin tưởng sử dụng sản phẩm của Như ! HÀNG THẬT 100% 🎉🎉🎉 ",
              info_order_id: `
            
            - Mã đơn hàng: ${check_result.tenmadonhang} `,
            info_order_name: `
            - Tên sản phẩm: ${check_result.nameproduct}`,
            });
        }else{
            res.render("./checkMDH", {
              message_fail:
                "Xin lỗi, chúng tôi KHÔNG có sản phẩm này😥. Vui lòng gọi cho Như để biết thêm thông tin. Hotline: 0913.822.841",
            });
        }
    }
}