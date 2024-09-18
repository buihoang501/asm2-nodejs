//Transaction Model
const Transaction = require("../models/Transaction");

//User Model
const User = require("../models/User");

//get transactions of current user login
exports.getTransactions = async (req, res, next) => {
  try {
    //query transactions of current user by userId
    const userTransactions = await Transaction.find({
      user: req.userId,
    }).populate("hotel");

    //send response transactions
    return res.status(200).json({ transactions: userTransactions });
  } catch (error) {
    //config error
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get all transactions - admin page
exports.getAdminTransactions = async (req, res, next) => {
  try {
    //find all transactions
    const transactions = await Transaction.find({})
      .populate(["hotel", "user"])
      .sort({ createdAt: -1 });

    //send response transactions
    return res.status(200).json({ transactions: transactions });
  } catch (error) {
    //config error
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get 8 latest transactions
exports.getLatestTransactions = async (req, res, next) => {
  try {
    //get total users ,  get total orders ,get transactions
    const [totalUsers, totalOrders, transactions] = await Promise.all([
      User.find({ isAdmin: false }).countDocuments(),
      Transaction.find({}).countDocuments(),
      Transaction.find({}),
    ]);

    //Calcuting earnings
    const earnings = transactions.reduce((acc, curr) => {
      return acc + curr.price;
    }, 0);

    //current time
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    //total Revenue
    let totalRevenue = 0;
    //total months
    let totalMonths = 0;

    //looping through from  1st month to currentMonth
    for (let month = 1; month <= currentMonth; month++) {
      const startDate = new Date(currentYear, month - 1, 1); // the first date of the month
      const endDate = new Date(currentYear, month, 0); // the last date of the month

      //get all transactions in month
      const transactions = await Transaction.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      //Revenue in this month
      const totalMonthRevenue = transactions.reduce((total, current) => {
        return total + current.price;
      }, 0);

      //The sum of months' revenue
      totalRevenue += totalMonthRevenue;
      //The sume of months
      totalMonths++;
    }

    //Get the balance
    const balance = totalRevenue / totalMonths;
    //get 8 latest transactions
    const latestTransactions = await Transaction.find({})
      .populate({ path: "hotel", select: "name" })
      .populate({ path: "user", select: "fullName" })
      .sort({ createdAt: -1 })
      .limit(8);

    //sending response
    res
      .status(200)
      .json({ totalUsers, totalOrders, earnings, balance, latestTransactions });
  } catch (error) {
    //config error
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};
