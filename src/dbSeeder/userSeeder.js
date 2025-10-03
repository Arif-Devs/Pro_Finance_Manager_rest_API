import bcrypt from "bcrypt";
import Account from "../model/account.js";
import Expanse from "../model/expanse.js";
import Income from "../model/income.js";
import Category from "../model/category.js";
import Role from "../model/role.js";
import User from "../model/user.js";
import accountSeed from "./accountSeeder.js";
import expanseSeed from "./expanseSeeder.js";
import incomeSeed from "./incomeSeeder.js";
import { DEFAULTPASS } from "../config/auth.js";
import { notFoundError } from "../utils/error.js";

const userSeed = async () => {
  try {
    await User.deleteMany();
    await Account.deleteMany();
    await Expanse.deleteMany();
    await Income.deleteMany();

    const userRole = await Role.findOne({ name: "user" }).exec();
    if (!userRole) {
      throw notFoundError("Please set a role first or add a role named user!");
    }
    const adminRole = await Role.findOne({ name: "admin" }).exec();
    if (!adminRole) {
      throw notFoundError("Please set a role or role named Admin");
    }

    const hashedPassword = await bcrypt.hash(DEFAULTPASS, 10);
  

    const user = new User({
      userName: "userOne",
      email: "user@gmail.com", 
      password: hashedPassword,
      roleId: userRole,
    });
    await user.save();
    
    const user1 = new User({
      userName: "user1",
      email: "user1@gmail.com", 
      password: hashedPassword,
      roleId: userRole,
    });
    await user1.save();
    
    const user2 = new User({
      userName: "user2",
      email: "user2@gmail.com", 
      password: hashedPassword,
      roleId: userRole,
    });
    await user2.save();

    const adminUser = new User({
      userName: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      roleId: adminRole,
    });
    await adminUser.save();

    const accounts = await accountSeed(user._doc._id, 5);

    const categories = await Category.find().distinct("_id").lean().exec();

    console.log("expanse and income are creating...");

    await Promise.all(
      accounts.map(async (account) => {
        await expanseSeed(user, categories, account);
        await incomeSeed(user, categories, account);
      })
    );
    console.log("expanse & incomes created successfully!");
    console.log('user seed created!');
    
  } catch (error) {
    console.error("Error during seeding:", error.message);
  }
};

export default userSeed