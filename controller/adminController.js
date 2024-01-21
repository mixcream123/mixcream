const modelAdminAcc = require("../models/adminAcc");
const modelmaDH = require("../models/maDH");
const bcrypt = require("bcrypt");
var session = require("express-session");

module.exports = class APIAdmin {
  static async loginPageAdmin(req, res) {
     const username_input = req.body.username;
    const password_input = req.body.password;

    //Get data from DB mongoDB
    try {
      const data = await modelAdminAcc.findOne({});

      // Check password correct
      const match = await bcrypt.compare(password_input, data.password);

      if (username_input == data.username && match == true) {
        var sess = req.session;
        sess.daDangNhap = true;
        sess.username = data.username;
        res.redirect("homepageAdmin/1");
      } else {
        res.render("./loginAdmin", {
          errLogin: "Sai tên tài khoản hoặc mật khẩu !",
          username_old: username_input,
          password_old: password_input,
        });
      }
    } catch (err) {
      res.status(501).json(err);
    }
  }

  static async addMDH(req, res) {
    var maDH_input = await req.body.maDH;
    var tendonhang = await req.body.tenDH;
    try {
      let checkmadonhang = await modelmaDH.findOne({
        tenmadonhang: maDH_input,
      });

      if (checkmadonhang) {
        res.status(301).render("./addMDH", { err: "Đã tồn tại mã đơn hàng !" });
      } else {
        let madonhang = new modelmaDH({ tenmadonhang: maDH_input, nameproduct: tendonhang });
        await madonhang.save(function (err, result) {
          if (err) {
            res.status(501).json(err);
          } else {
            res.status(301).render("./addMDH", {
              mess: "Thêm thành công mã đơn hàng mới !",
            });
          }
        });
      }
    } catch (err) {
      res.status(501).json(err);
    }
  }

  static async showMDH(req, res) {
    if (req.session.daDangNhap) {
      let current_page = req.params.page;
      const listMDH = await modelmaDH.find();

      //Thiết lập số sản phẩm trên trang là 100
      let orderonPage = 100;
      //Tổng số đơn hàng
      let sum_order = listMDH.length;
      //Số trang (số sản phẩm trên trang: 100SP/trang)
      const sum_page = Math.ceil(sum_order / orderonPage);

      //Áp dụng công thức hiện số trang => (số trang hiện tại - 1) * số SP/trang
      let index_document = (current_page - 1) * orderonPage;

      const pagination_array = listMDH.slice(index_document, (index_document + orderonPage) );

      res.status(301).render("./adminPage", { pagination_array, sum_order, sum_page});
    } else {
      res.redirect("login");
    }
  }
  
  static async editMDH(req, res) {
    const id = req.params.id;

    try {
      const dataMDH = await modelmaDH.findOne({ _id: id });
      res.status(301).render("./editMDH", { dataMDH });
    } catch (err) {
      res.status(501).json(err);
    }
  }


  static async updateMDH(req, res) {
  var maDH_input = await req.body.maDH;
    var tenDH_input = await req.body.tenDH;
    var id_input_new = await req.body.ID_hidden;

    try {
      let doc = await modelmaDH.findOneAndUpdate(
        { _id: id_input_new },
        { tenmadonhang: maDH_input,
          nameproduct: tenDH_input,
        },
        {
          new: true,
          timestamps: { createdAt: false, updatedAt: true },
        }
      );

      res.status(301).redirect("./homepageAdmin/1");
    } catch (err) {
      res.status(501).json(err);
    }
  }

  static async deleteMDH(req, res) {
    let id = req.params.id;
    modelmaDH.findByIdAndRemove(id.trim(), (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect("/admin/homepageAdmin/1");
      }
    });
  }
  
  
  static async deleteAllMDH(req, res){
    const arrayMDH = await req.body.arrayMDH;
    
    let valueGet = JSON.parse(arrayMDH);
  

    await valueGet.forEach((item, index)=>{
      modelmaDH.findByIdAndRemove(item, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
    })

    res.redirect("/admin/homepageAdmin/1");


  
  }

  static async searchMDH(req, res) {
    const infoSearch = req.body.info_search;
    const listMDH = await modelmaDH.find({
      tenmadonhang: { $regex: infoSearch },
    });

    if (listMDH.length < 1) {
      var err = "Không có mã đơn hàng cần tìm !";
    }
    res.status(301).render("./adminPage", { listMDH, error: err });
  }

  static async addAllMDH(req, res) {
    const nd_upload = req.body.content_upload;

    let data_parse = JSON.parse(nd_upload)

    let array_upload = [];

    data_parse.forEach((item, index)=>{
      array_upload.push(item.id_product);
    })
    
    let array_name_product = [];
    data_parse.forEach((item, index)=>{
      array_name_product.push(item.name_product);
    })

    try {
      const promises = array_upload.map(async function (item,index) {
        let checkmadonhang = await modelmaDH.findOne({ tenmadonhang: item });
        if (checkmadonhang) {
          return { error: `Đã tồn tại mã đơn hàng ${item}` };
        } else {
          let madonhang = new modelmaDH({ tenmadonhang: item , nameproduct: array_name_product[index]});
          await madonhang.save();
          return { success: `Thêm thành công mã đơn hàng ${item}` };
        }
      });

      Promise.all(promises).then((results) => {
        const messages = results.reduce(
          (acc, result) => {
            if (result.error) {
              acc.errors.push(result.error);
            } else if (result.success) {
              acc.successes.push(result.success);
            }
            return acc;
          },
          { errors: [], successes: [] }
        );

        if (messages.errors.length > 0) {
          res
            .status(301)
            .render("./addMDH", { err: messages.errors.join("-") });
        } else {
          res
            .status(301)
            .render("./addMDH", { mess: messages.successes.join("-") });
        }
      });
    } catch (err) {
      res.status(501).json(err);
    }
  }
};
