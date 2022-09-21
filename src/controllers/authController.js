const User = require("../models/user/User").model;
//
class authController {
    // [POST] /login
    login = async(req, res) => {
        const { email, password } = req.body;
        // check empty
        try {
            User.findOne({ email }, (err, data) => {
                res.send("Success");
            });
            if (!email || !password) {
                return res.status(400).send({
                    status: false,
                    data: [],
                    message: "Invalid Input",
                });
            }
            // Query
            res.send({
                email,
                password,
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({
                status: false,
                data: [],
                message: "User not found",
            });
        }
    };
    //[POST] /register
    register = async(req, res) => {
        const { email, gender, name, phone, password, address } = req.body;
        if (!email | !password) {
            res.status(400).send({
                status: false,
                data: [],
                message: "Missing email or password",
            });
        }
        try {
            let user = User.count({ email }, (err, num) => {
                if (err) {
                    console.log(`Cant get count user ${err.message}`);
                } else return num;
            });
            if (user > 0) {
                return res.status(400).send({
                    status: false,
                    data: [],
                    message: "Existing username",
                });
            } else {
                const newUser = User({
                    email,
                    password,
                    addresses: [address],
                    id: 1,
                    gender,
                    phone,
                    name,
                });
                newUser.save((err, book) => {
                    if (err) {
                        return console.log(`Cant save new user ${err.message}`);
                    } else {
                        res.status(200).send({
                            status: true,
                            data: book,
                        });
                    }
                });
            }
        } catch (e) {
            res.status(400).send({
                status: false,
                data: [],
                message: "Invalid data " + e.message,
            });
        }
    };
    // [POST] /verify-email
    verify(req, res) {}
}

module.exports = new authController();