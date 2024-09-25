export const createContributorValidationSchema = {
    FName: {
      type: String,
      required: [true, "Please provide the contributor's first name"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    LName: {
      type: String,
      required: [true, "Please provide the contributor's last name"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    Email: {
      type: String,
      required: [true, "Please provide the contributor's email address"],
      trim: true,
      unique: true, // Ensure unique email addresses
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    Password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    Role: {
      type: String,
      required: true,
      enum: {
        values: ["Admin", "Moderator", "Educator"],
        message: "Role must be either Admin, Moderator, or Educator",
      },
    },
    Credentials: {
      type: String,
      maxlength: [100, "Credentials cannot be more than 100 characters"],
      default: "", // Optional field, defaults to empty string
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  };
  