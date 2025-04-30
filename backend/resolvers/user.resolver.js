import { users } from "../dummyData/data.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, email, password, gender } = input;
        if (!username || !email || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);

        return newUser;
      } catch (error) {
        console.log("Error in signUp:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error("All fields are required");
        }

        // const user = await User.findOne({ username });
        // if (!user) {
        //   throw new Error("User not found");
        // }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //   throw new Error("Invalid credentials");
        // }

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
        return user;
      } catch (error) {
        console.log("Error in login:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) {
            console.log("Error destroying session:", err);
            throw new Error("Failed to logout");
          }
          console.log("Session destroyed successfully");
        });
        res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (error) {
        console.log("Error in logout:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
  Query: {
    authUser: async (_, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error in authUser:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("Error in user:", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    //TODO add user trsansactions relationship
  },
};

export default userResolver;
