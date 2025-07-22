import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asycnHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const registerUser = asycnHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Checking if the each and every field that it's not empty
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    //if Any of the field is empty it will throw and exception
    throw new ApiError(400, "All the fields are required");
  }
  const isUserExists = await User.findOne({ $or: [{ username }, { email }] });
  if (isUserExists) {
    // Just a simple if else check if both the name and email have already been created and throws error based on the condition

    // if (isUserExists.username === username && isUserExists.email === email) {
    //   throw new ApiError(
    //     401,
    //     "User with the following username or email exists"
    //   );
    // } else if (
    //   isUserExists.username === username &&
    //   !isUserExists.email === email
    // ) {
    //   throw new ApiError(401, "User with the following username exists");
    // } else throw new ApiError(401, "User with the following email exists");

    // ***** More cleaner version ***** //

    let conflictField = [];

    if (isUserExists.username === username.toLowerCase()) conflictField.push("username");
    if (isUserExists.email === email) conflictField.push("email");

    const message = `User with this ${conflictField.join(
      " and "
    )} already exists`;
    throw new ApiError(401, message);
  }

  //If not already exists create a new user with their credentials
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
  });
  if (!user) {
    throw new ApiError(
      500,
      "Something went wrong while creating user in the database"
    );
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //Fallback checking if for any reason the user has been deleted

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while fetching user from the database"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
