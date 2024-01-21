const express = require("express");
const router = express.Router();
const adminControll = require("../controller/adminController");
const multer = require("multer");
// Admin Page

router
  .route("/login")
  .get((req, res) => {
    res.render("loginAdmin");
  })
  .post(adminControll.loginPageAdmin);

// // cấu hình lưu trữ file khi upload xong
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
    //   const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname);
  },
});
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage });

//toi trang quan li admin
router.get("/homepageAdmin/:page", adminControll.showMDH);

//Toi trang them ma don hang
router.get("/addMDH", (req, res) => {
  res.render("addMDH");
});

// //Toi trang post của thêm mã đơn hàng
router.post("/addMDH", adminControll.addMDH);

// Toi trang chỉnh sửa mã đơn hàng
router.get("/editMDH/:id", adminControll.editMDH);

// //Tới trang cập nhật đơn hàng
router.post("/editMDH", adminControll.updateMDH);

//Thực hiện xóa mã đơn hàng
router.get("/deleteMDH/:id", adminControll.deleteMDH);

//Thực hiện xóa toàn bộ đơn hàng
router.post("/deleteAllMDH/", adminControll.deleteAllMDH);

//Thực hiện tìm kiếm mã đơn hàng
router.post("/searchMDH", adminControll.searchMDH);

// //Thực hiện upload mã đơn hàng với file PDF
//Dạng 1.File Tiktok
router.get("/addMDH_type1", upload.single("formFile"), (req, res) => {
  //nhận dữ liệu từ form
  const file = req.file;

  // Kiểm tra nếu không phải dạng file thì báo lỗi
  if (!file) {
    const error = new Error("Upload file again!");
    error.httpStatusCode = 400;
    // return next(error)
  }
  // file đã được lưu vào thư mục uploads
  // gọi tên file: req.file.filename và render ra màn hình

  const fs = require("fs");
  const pdf = require("pdf-parse");
  let nameFile = req.body.formFile;
  // Xu li upload file
  let dataBuffer = fs.readFileSync(`./uploads/testagain.PDF`);
  pdf(dataBuffer).then(function (data) {
    let array = data.text.split(",");

    let array_change = [];
    let array_result = [];

    var regexfind =
      /Default|TN150|CBTH|DL|TNA|TN350|TNM|CBTU|TN1000|TN200|TN500|TN90|TN90L|TNDOL|TNB|TNDL|CTTGHL|350T|CTTRL|500gT|150T/;

    var regexQuantity = /Qty/;
    var regexID = /KHÔNG TIỀN MẶT/;

    let array_soluong = []

    let array_soID = [];

    array.forEach((item, index) => {
      someText = item.replace(/(\r\n|\n|\r)/gm, "");

      if (someText.search(regexfind) > 0) {
        array_change.push(someText);
      }

      if (someText.search(regexQuantity) > 0) {
        array_soluong.push(someText)
      }

      if (someText.search(regexID) > 0) {
        array_soID.push(someText);
      }
    });




    array_change.forEach((item, index) => {
      let key_total = item.search(regexfind);
      let result_total = item.substring(key_total, key_total + 6);
      array_result.push(result_total);
    });


    let array_quantity = [];
    array_change.forEach((item, index) => {
      let key_total = item.search(regexfind);
      let result_total = item.substring(key_total, key_total + 2);
      array_quantity.push(result_total);
    });

    let total_quantity = [];

    array_soluong.forEach((item, index) => {
      let kitu_quantity = item.indexOf("NameSKU[Seller SKU]");
      let result = "";
      if (kitu_quantity > 0) {
        result = item.substring(kitu_quantity + 19, kitu_quantity + 20);
      }
      total_quantity.push(result);
    });




    function changeName(inputKeySecret) {
      let resultchangeName = "";
      let stringinput = inputKeySecret;

      for (let i = 2; i < 7; i++) {
        let splitkeyword = stringinput.substring(0, i);

        if (splitkeyword == "TN150") {
          resultchangeName = "KEM BODY CỐT Ủ - 150GR DƯỠNG BODY";
          break;
        } else if (splitkeyword == "CBTH") {
          resultchangeName = "COMBO NGÀY ĐÊM TRẮNG SÁNG 1 THÁNG";
          break;
        } else if (splitkeyword == "DL") {
          resultchangeName = "Kem Body Dưỡng Sáng Siêu Cấp - 320gr";
          break;
        } else if (splitkeyword.search(/TNA/) != -1) {
          resultchangeName = "ÁO Ủ KEM DÀY DẶN";
          break;
        } else if (splitkeyword == "TN350") {
          resultchangeName = "KEM BODY CỐT Ủ - 350GR DƯỠNG BODY LÀM ĐẸP DA";
          break;
        }
        else if (splitkeyword.search(/350T/) != -1) {
          resultchangeName = "Kem Body Cốt Ủ (Bản Tết)";
          break;
        }
        else if (splitkeyword.search(/150T/) != -1) {
          resultchangeName = "Kem Body Cốt Ủ (Bản Tết)";
          break;
        }
        else if (splitkeyword == "TNM") {
          resultchangeName = "MUỐI TẮM COM BÒ";
          break;
        } else if (splitkeyword.search(/500gT/) != -1) {
          resultchangeName = "Kem Body Cốt Ủ (Bản Tết)- 500gr";
          break;
        }
        else if (splitkeyword.search(/CTTGHL/) != -1) {
          resultchangeName = "Kem Body Cốt Thái Tẩy (Mix B&BW) Dưỡng Body Làm Đẹp Da";
          break;
        }
        else if (splitkeyword.search(/CBTU/) != -1) {
          resultchangeName = "COMBO NGÀY ĐÊM TRẮNG SÁNG 2 TUẦN";
          break;
        } else if (splitkeyword.search(/TN100/) != -1) {
          resultchangeName = "KEM BODY CỐT Ủ - 1KG (KÈM ÁO Ủ KEM)";
          break;
        } else if (splitkeyword.search(/CTTRL/) != -1) {
          resultchangeName = "Kem Body Cốt Thái Tẩy (Mix B&BW) Dưỡng Body Làm Đẹp Da";
          break;
        }
        else if (splitkeyword == "TN200") {
          resultchangeName = "Kem Body Dưỡng Sáng Siêu Cấp - 200gr";
          break;
        } else if (splitkeyword == "TN500") {
          resultchangeName = "KEM BODY CỐT Ủ - 500GR Dưỡng Body Làm Đẹp Da";
          break;
        } else if (splitkeyword.search(/Defaul/) != -1) {
          resultchangeName = "Kem Body Cốt Ủ (Bản Tết)- 500gr";
          break;
        } else if (splitkeyword == "TN90") {
          resultchangeName = "KEM BODY CỐT THÁI 90% - 125GR";
          break;
        } else if (splitkeyword == "TN90L") {
          resultchangeName = "KEM BODY CỐT THÁI 90% - 350GR";
          break;
        } else if (splitkeyword == "TNDOL") {
          resultchangeName = "COMBO 2 CHAI DẦU OLIU";
          break;
        } else if (splitkeyword == "TNB") {
          resultchangeName = "SET Ủ TẮM BỘT ĐẬU ĐỎ & DẦU OLIU";
          break;
        } else if (splitkeyword == "TNDL") {
          resultchangeName = "KEM DƯỠNG SÁNG DA - 320GR";
          break;
        }
      }

      return resultchangeName;
    }

    //Name Product
    let arraynameProduct = [];

    array_result.forEach((item, index) => {
      let changekey = changeName(item);
      arraynameProduct.push(changekey);
    });

    // console.log(total_quantity)
    // console.log(arraynameProduct);

    for (let i = 0; i < total_quantity.length; i++) {
      for (let j = i; j < arraynameProduct.length; j++) {
        arraynameProduct[j] =
          arraynameProduct[j] + " - ( Số lượng: " + total_quantity[i] + " ) \n";
        break;
      }
    }

    let mang = [];

    array.forEach((item, index) => {

      if (item.search("ET") > 0) {
        mang.push(item);
      }
    });


    let mangnameproduct = [];
    array.forEach((item, index) => {
      if (item.search("Qty") > 0) {
        mangnameproduct.push(item);
      }
    });

    let mangTotal = [];
    array.forEach((item, inde) => {
      if (item.search("Total") > 0) {
        mangTotal.push(item);
      }
    });

    var mangTotalresult = [];
    mangTotal.forEach((item, index) => {
      let stringsplit = item.search("Total");
      let result = item.substring(stringsplit + 5, stringsplit + 7);
      mangTotalresult.push(result.trim());
    });

    // console.log(mangTotalresult);
    // console.log(arraynameProduct);
    // console.log(mangTotalresult);

    var newarrayname_Product = [];

    // console.log(arraynameProduct);
    // console.log(mangTotalresult);
    // console.log(total_quantity);
    // console.log(mangTotalresult);

    var k = 0;
    for (let i = 0; i < total_quantity.length; i++) {
      for (let j = i; j < mangTotalresult.length; j++) {
        let sum_quantity_order = mangTotalresult[j];
        if (sum_quantity_order == total_quantity[k]) {
          newarrayname_Product.push(`1. ${arraynameProduct[k]}`);
          k++;
        } else {
          var stringoutput = "";
          for (let z = 1; z <= sum_quantity_order; z++) {
            let element = arraynameProduct[k++];
            stringoutput += `${z}. ${element}`;
          }
          newarrayname_Product.push(stringoutput);
        }
        break;
      }
    }

    // for (let i = 0; i <= arraynameProduct.length; i++) {
    //   for (let j = i; j <= mangTotalresult.length; j++) {
    //     let count = mangTotalresult[j];

    //     if (mangTotalresult[j - 1] == 2 && count == 1) {
    //       let z = j;
    //       z++;
    //       newarrayname_Product.push(`1. ${arraynameProduct[z]}`);
    //     } else {
    //       if (count == 1) {
    //         newarrayname_Product.push(`1. ${arraynameProduct[j]}`);
    //       } else if (count > 1 && count == total_quantity[j]) {
    //         newarrayname_Product.push(`1. ${arraynameProduct[j]}`);
    //       } else if (count > 1) {
    //         let stringIn = "";
    //         let stringconenct = "";
    //         let k = i;
    //         for (let z = 1; z <= count; z++) {
    //           let element = arraynameProduct[k++];
    //           stringIn = `${z}. ${element}`;
    //           stringconenct += stringIn;
    //         }
    //         newarrayname_Product.push(stringconenct);
    //       }
    //     }

    //     break;
    //   }
    // }

    var mangKQ = [];


    array_soID.forEach((item, index) => {
      let stringsplit = item.search("MẶT");

      let result = "";

      if (stringsplit != -1) {
        result = item.substring(stringsplit + 3, stringsplit + 15);
      }

      mangKQ.push(result.trim());
    });

    //quantity: arraynameProduct - 18
    //mangKQ: id_product
    //newarrayname_Product
    console.log(newarrayname_Product)

    var result = [];

    for (let i = 0; i < mangKQ.length; i++) {
      for (let j = i; j < array_result.length; j++) {
        let Object_Product = {
          id_product: mangKQ[i],
          name_product: newarrayname_Product[j],
        };

        result.push(Object_Product);

        break;
      }
    }
    let resultJSON = JSON.stringify(result);



    res.render("./previewMDH", { result: resultJSON });
    //  res.render("./ketqua", { result });



  });
});

//Dạng 2.File ET
router.post("/adminMDH_type2", upload.single("formFile"), (req, res) => {
  //nhận dữ liệu từ form
  const file = req.file;

  // Kiểm tra nếu không phải dạng file thì báo lỗi
  if (!file) {
    const error = new Error("Upload file again!");
    error.httpStatusCode = 400;
    return next(error);
  }
  // file đã được lưu vào thư mục uploads
  // gọi tên file: req.file.filename và render ra màn hình

  const fs = require("fs");
  const pdf = require("pdf-parse");
  let nameFile = req.body.formFile;
  // Xu li upload file
  let dataBuffer = fs.readFileSync(`./uploads/${file.filename}`);
  pdf(dataBuffer).then(function (data) {
    let array = data.text.split(",");

    let array_change = [];
    let array_result = [];

    var regexfind =
      /Default|TN150|CBTH|DL|TNA|TN350|TNM|CBTU|TN1000|TN200|TN500|TN90|TN90L|TNDOL|TNB|TNDL/;

    var regexQuantity = /Nội dung hàng hóa/;
    var regexID = /Mã vận/;

    let array_soluong = [];

    let array_soID = [];

    array.forEach((item, index) => {
      someText = item.replace(/(\r\n|\n|\r)/gm, "");

      if (someText.search(regexfind) > 0) {
        array_change.push(someText);
      }

      if (someText.search(regexQuantity) > 0) {
        array_soluong.push(someText);
      }

      if (someText.search(regexID) > 0) {
        array_soID.push(someText);
      }
    });





    array_change.forEach((item, index) => {
      let key_total = item.search(regexfind);
      let result_total = item.substring(key_total, key_total + 6);
      array_result.push(result_total);
    });


    let array_quantity = [];
    array_change.forEach((item, index) => {
      let key_total = item.search(regexfind);
      let result_total = item.substring(key_total, key_total + 2);
      array_quantity.push(result_total);
    });

    let total_quantity = [];

    array_soluong.forEach((item, index) => {
      let kitu_quantity = item.indexOf("TL");
      let result = "";
      if (kitu_quantity > 0) {
        result = item.substring(kitu_quantity, kitu_quantity - 1);
      }
      total_quantity.push(result);
    });


    function changeName(inputKeySecret) {
      let resultchangeName = "";
      let stringinput = inputKeySecret;

      for (let i = 2; i < 7; i++) {
        let splitkeyword = stringinput.substring(0, i);
        if (splitkeyword == "TN150") {
          resultchangeName = "KEM BODY CỐT Ủ - 150GR";
          break;
        } else if (splitkeyword == "CBTH") {
          resultchangeName = "COMBO NGÀY ĐÊM TRẮNG SÁNG 1 THÁNG";
          break;
        } else if (splitkeyword == "DL") {
          resultchangeName = "Kem Body Dưỡng Sáng Siêu Cấp - 320gr";
          break;
        } else if (splitkeyword.search(/TNA/) != -1) {
          resultchangeName = "ÁO Ủ KEM DÀY DẶN";
          break;
        } else if (splitkeyword == "TN350") {
          resultchangeName = "KEM BODY CỐT Ủ - 350GR DƯỠNG BODY LÀM ĐẸP DA";
          break;
        } else if (splitkeyword == "TNM") {
          resultchangeName = "MUỐI TẮM COM BÒ";
          break;
        } else if (splitkeyword.search(/CBTU/) != -1) {
          resultchangeName = "COMBO NGÀY ĐÊM TRẮNG SÁNG 2 TUẦN";
          break;
        } else if (splitkeyword.search(/TN100/) != -1) {
          resultchangeName = "KEM BODY CỐT Ủ - 1KG (KÈM ÁO Ủ KEM)";
          break;
        } else if (splitkeyword == "TN200") {
          resultchangeName = "Kem Body Dưỡng Sáng Siêu Cấp - 200gr";
          break;
        } else if (splitkeyword == "TN500") {
          resultchangeName = "KEM BODY CỐT Ủ - 500GR";
          break;
        } else if (splitkeyword.search(/Defaul/) != -1) {
          resultchangeName = "Combo Kem Ủ & Dưỡng - 2 tuần";
          break;
        } else if (splitkeyword == "TN90") {
          resultchangeName = "KEM BODY CỐT THÁI 90% - 125GR";
          break;
        } else if (splitkeyword == "TN90L") {
          resultchangeName = "KEM BODY CỐT THÁI 90% - 350GR";
          break;
        } else if (splitkeyword == "TNDOL") {
          resultchangeName = "COMBO 2 CHAI DẦU OLIU";
          break;
        } else if (splitkeyword == "TNB") {
          resultchangeName = "SET Ủ TẮM BỘT ĐẬU ĐỎ & DẦU OLIU";
          break;
        } else if (splitkeyword == "TNDL") {
          resultchangeName = "KEM DƯỠNG SÁNG DA - 320GR";
          break;
        }
      }

      return resultchangeName;
    }

    //Name Product
    let arraynameProduct = [];

    array_result.forEach((item, index) => {
      let changekey = changeName(item);
      arraynameProduct.push(changekey);
    });


    // console.log(total_quantity)
    // console.log(arraynameProduct);

    for (let i = 0; i < total_quantity.length; i++) {
      for (let j = i; j < arraynameProduct.length; j++) {
        arraynameProduct[j] =
          arraynameProduct[j] + " - ( Số lượng: " + total_quantity[i] + " ) \n";
        break;
      }
    }

    let mang = [];

    array.forEach((item, index) => {
      if (item.search("ET") > 0) {
        mang.push(item);
      }
    });

    let mangnameproduct = [];
    array.forEach((item, index) => {
      if (item.search("Qty") > 0) {
        mangnameproduct.push(item);
      }
    });

    let mangTotal = [];
    array.forEach((item, inde) => {
      if (item.search("Total") > 0) {
        mangTotal.push(item);
      }
    });

    var mangTotalresult = [];
    mangTotal.forEach((item, index) => {
      let stringsplit = item.search("Total");
      let result = item.substring(stringsplit + 5, stringsplit + 7);
      mangTotalresult.push(result.trim());
    });

    // console.log(mangTotalresult);
    // console.log(arraynameProduct);
    // console.log(mangTotalresult);

    var newarrayname_Product = [];

    // console.log(arraynameProduct);
    // console.log(mangTotalresult);
    // console.log(total_quantity);
    // console.log(mangTotalresult);


    var k = 0;
    for (let i = 0; i < total_quantity.length; i++) {
      for (let j = i; j < total_quantity.length; j++) {
        let sum_quantity_order = total_quantity[j];
        if (sum_quantity_order == total_quantity[k]) {
          newarrayname_Product.push(`1. ${arraynameProduct[k]}`);
          k++;
        } else {
          var stringoutput = "";
          for (let z = 1; z <= sum_quantity_order; z++) {
            let element = arraynameProduct[k++];
            stringoutput += `${z}. ${element}`;
          }
          newarrayname_Product.push(stringoutput);
        }
        break;
      }
    }





    // for (let i = 0; i <= arraynameProduct.length; i++) {
    //   for (let j = i; j <= mangTotalresult.length; j++) {
    //     let count = mangTotalresult[j];

    //     if (mangTotalresult[j - 1] == 2 && count == 1) {
    //       let z = j;
    //       z++;
    //       newarrayname_Product.push(`1. ${arraynameProduct[z]}`);
    //     } else {
    //       if (count == 1) {
    //         newarrayname_Product.push(`1. ${arraynameProduct[j]}`);
    //       } else if (count > 1 && count == total_quantity[j]) {
    //         newarrayname_Product.push(`1. ${arraynameProduct[j]}`);
    //       } else if (count > 1) {
    //         let stringIn = "";
    //         let stringconenct = "";
    //         let k = i;
    //         for (let z = 1; z <= count; z++) {
    //           let element = arraynameProduct[k++];
    //           stringIn = `${z}. ${element}`;
    //           stringconenct += stringIn;
    //         }
    //         newarrayname_Product.push(stringconenct);
    //       }
    //     }

    //     break;
    //   }
    // }

    var mangKQ = [];

    array_soID.forEach((item, index) => {
      let stringsplit = item.search("vận");

      let result = "";

      if (stringsplit != -1) {
        result = item.substring(stringsplit + 3, stringsplit + 18);
      }

      mangKQ.push(result.trim());
    });


    //quantity: arraynameProduct - 18
    //mangKQ: id_product
    //newarrayname_Product

    var result = [];


    for (let i = 0; i < mangKQ.length; i++) {
      for (let j = i; j < array_result.length; j++) {
        let Object_Product = {
          id_product: mangKQ[i],
          name_product: newarrayname_Product[j],
        };

        result.push(Object_Product);

        break;
      }
    }

    let resultJSON = JSON.stringify(result);

    res.render("./previewMDH", { result: resultJSON });
  });
});

// //Khi đã chấp nhận upload hết dữ liệu từ preview page
router.post("/addAllContent", adminControll.addAllMDH);

// //Thực hiện đăng xuất tài khoản
router.get("/logout", (req, res) => {
  var sess = req.session; //initialize session variable
  sess.daDangNhap = false;
  console.log(req.session.daDangNhap);
  // req.session.destroy();
  res.redirect("login");
});

module.exports = router;
