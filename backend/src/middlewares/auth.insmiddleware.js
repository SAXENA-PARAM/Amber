import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "express-oauth2-jwt-bearer";
import jwks from "jwks-rsa"
import axios from "axios"
import { amber } from "../db/index.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";

// export const jwtCheck = auth({
//   audience: process.env.AUTH_AUDIENCE,
//   issuerBaseURL: process.env.AUTH_PROVIDER,
//   tokenSigningAlg: 'RS256'
// });

// const jwtCheck = auth({
//   audience: 'https://amberedu/',
//   issuerBaseURL: 'https://dev-1ks4p3yob5fx8pxs.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

const verifyToken = async (token, type = 'access') => {
  try {
    const decoded = jwt.verify(
      token, 
      type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
    );
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, expired: true };
    }
    return { valid: false, expired: false };
  }
};

export const generateAccessAndRefreshTokens = async (user) => {
  try {
    console.log("Generating access and refresh tokens for user:", user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error);
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

export const firstJWTw = asyncHandler(async (req, res, next) => {
  // Check which authentication method is being used
  const isGoogleAuth = req.header("Authorization")?.split(' ')[1];
  const { name, email, password } = req.body;

  // Check for existing tokens in cookies
  const existingAccessToken = req.cookies?.accessToken;
  const existingRefreshToken = req.cookies?.refreshToken;

  // Validate request based on auth method
  if (isGoogleAuth) {
    return handleGoogleAuth_web(req, res, next);
  } else if (name && email && password) {
    return handleManualSignup(req, res, next,{existingAccessToken,existingRefreshToken});
  } else {
    return next(new ApiError(400, "Invalid request. Please either try Google SignIn or Manual Signup"));
  }
});

const handleGoogleAuth_web = async (req, res, next) => {
  const auth_token = req.header("Authorization")?.split(' ')[1];

  try {
    // Fetch user info from Google
    const response = await axios.get(process.env.AUTH_FETCH_WEB, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (!response.data?.email) {
      return next(new ApiError(400, "Invalid user data received from Google"));
    }

    const userinfo = response.data;
    console.log("Google user info:", userinfo);

    // Check if user exists
    const existingUser = await amber.instructor.findUnique({
      where: { email: userinfo.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilepicture: true,
        createdAt: true,
        updatedAt: true
      },
    });

    if (existingUser) {
      req.user = existingUser;
      req.isExistingUser = true;
      return next();
    }

    // Create new user from Google data
    const newUser = await amber.instructor.create({
      data: {
        name: userinfo.given_name || userinfo.name || '',
        username: userinfo.nickname || userinfo.email.split('@')[0],
        email: userinfo.email,
        profilepicture: userinfo.picture || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilepicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    req.user = newUser;
    return next();

  } catch (error) {
    console.error("Google auth error:", error);
    return next(new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Google authentication failed"
    ));
  }
};

const handleManualSignup = async (req, res, next, { existingAccessToken, existingRefreshToken }) => {
  const { name, email, password } = req.body;
  try {
    // Check if name exists in the database
    const existingName = await amber.instructor.findUnique({ 
      where:{username:name} });

    // Check if email exists in the database
    const existingEmail = await amber.instructor.findUnique({ 
      where:{email} });
    if (existingEmail && !existingName) {
      return next(new ApiError(400, "Email is already registred try using correct username"));
    }
    if (!existingEmail && existingName) {
      return next(new ApiError(400, "Username already exist"));
    }

    // If both name and email are unique, call the next middleware
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
  console.log(existingAccessToken)
  try {
    const existingUser = await amber.instructor.findUnique({ 
      where: { email }, 
    });
    console.log(existingUser)
    if (existingUser) {
      // Verify password
      if(!existingUser.password){
        return next(new ApiError(401, "Try Google Login and Set Password First"))
      }
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid credentials"));
      }

      // Check existing tokens if present
      let shouldGenerateNewTokens = true;

      if (existingAccessToken && existingRefreshToken) {
        // First verify if the refresh token matches the one in database
        if (existingUser.refreshToken === existingRefreshToken) {
          // Verify access token
          const accessTokenStatus = await verifyToken(existingAccessToken, 'access');
          console.log(accessTokenStatus.valid)
          
          if (accessTokenStatus.valid) {
            // Access token is still valid
            shouldGenerateNewTokens = false;
            req.user = {
              id: existingUser.id,
              name: existingUser.name,
              username: existingUser.username,
              email: existingUser.email,
              profilepicture: existingUser.profilepicture,
              createdAt: existingUser.createdAt,
              updatedAt: existingUser.updatedAt
            };
            req.accessToken = existingAccessToken;
            req.refreshToken = existingRefreshToken;
            req.isExistingUser = true;
          } else if (accessTokenStatus.expired) {
            // Try to use refresh token
            const refreshTokenStatus = await verifyToken(existingRefreshToken, 'refresh');
            console.log(refreshTokenStatus.expired)
            
            if (refreshTokenStatus.valid) {
              // Generate new access token only
              const newAccessToken = await generateAccessToken(existingUser);
              req.user = {
                id: existingUser.id,
                name: existingUser.name,
                username: existingUser.username,
                email: existingUser.email,
                profilepicture: existingUser.profilepicture,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt
              };
              req.accessToken = newAccessToken;
              req.refreshToken = existingRefreshToken; // Keep existing refresh token
              req.isExistingUser = true;
              shouldGenerateNewTokens = false;
            }
          }
        }
      }

      if (shouldGenerateNewTokens) {
        // Generate new tokens and update in database
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser);
        console.log(accessToken,refreshToken)
        
        // Update the refresh token in database
        await amber.instructor.update({
          where: { id: existingUser.id },
          data: {
            refresh_token: refreshToken,
            updatedAt: new Date()
          }
        });

        req.user = {
          id: existingUser.id,
          name: existingUser.name,
          username: existingUser.username,
          email: existingUser.email,
          profilepicture: existingUser.profilepicture,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt
        };
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        req.isExistingUser = true;
      }

      return next();
    }

    const result = await amber.$transaction(async (amber) => {
      let user;
      let tokens;
    
      try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // 2. Try generating tokens first with temporary data
        // This ensures token generation works before creating user
        // tokens = await generateAccessAndRefreshTokens({
        //   email,
        //   password: hashedPassword
        // });
        // console.log("tmeporary tokens" , tokens)
        // 3. Only create user if tokens were generated successfully
        user = await amber.instructor.create({
          data: {
            username: name,
            email,
            password: hashedPassword,
            // refresh_token: tokens.refreshToken, // Store the refresh token
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profilepicture: true,
            refresh_token: true,
            createdAt: true,
            updatedAt: true
          }
        });
    
        // 4. Generate final tokens with actual user ID
        tokens = await generateAccessAndRefreshTokens(user);
        console.log("final token" , tokens)
        // 5. Update user with final refresh token
        user = await amber.instructor.update({
          where: { id: user.id },
          data: {
            refresh_token: tokens.refreshToken,
            updatedAt: new Date()
          },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profilepicture: true,
            createdAt: true,
            updatedAt: true
          }
        });
        console.log(user)
        return { user, tokens };
      } catch (error) {
        // If any step fails, the entire transaction will be rolled back
        // This ensures no user is created without valid tokens
        throw new ApiError(
          500,
          error.message === "Error generating tokens" 
            ? "Failed to generate authentication tokens" 
            : "User creation failed"
        );
      }
    });
    console.log(result.user,result.tokens)
    // Only set these if we get here (no errors occurred)
    req.user = {
      id: result.user.id,
      name: result.user.name,
      username: result.user.username,
      email: result.user.email,
      profilepicture: result.user.profilepicture,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt
    };
    req.accessToken = result.tokens.accessToken;
    req.refreshToken = result.tokens.refreshToken;
    
    return next();
  } catch (error) {
    console.error("Manual signup error:", error);
    return next(new ApiError(
      500, 
      error.code === 'P2002' ? "Email already exists" : "User creation failed"
    ));
  }
};


export const firstJWTa = asyncHandler(async (req, res, next) => {
  // Check which authentication method is being used
  const isGoogleAuth = req.header("Authorization")?.split(' ')[1];
  const { name, email, password } = req.body;

  // Check for existing tokens in cookies
  const existingAccessToken = req.cookies?.accessToken;
  const existingRefreshToken = req.cookies?.refreshToken;

  // Validate request based on auth method
  if (isGoogleAuth) {
    return handleGoogleAuth_app(req, res, next);
  } else if (name && email && password) {
    return handleManualSignup(req, res, next,{existingAccessToken,existingRefreshToken});
  } else {
    return next(new ApiError(400, "Invalid request. Please provide either Google auth token or name, email, and password"));
  }
});

const handleGoogleAuth_app = async (req, res, next) => {
  const auth_token = req.header("Authorization")?.split(' ')[1];

  try {
    // Fetch user info from Google
    const response = await axios.get(process.env.AUTH_FETCH_APP, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (!response.data?.email) {
      return next(new ApiError(400, "Invalid user data received from Google"));
    }

    const userinfo = response.data;
    console.log("Google user info:", userinfo);

    // Check if user exists
    const existingUser = await amber.instructor.findUnique({
      where: { email: userinfo.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilepicture: true,
        createdAt: true,
        updatedAt: true
      },
    });

    if (existingUser) {
      req.user = existingUser;
      req.isExistingUser = true;
      return next();
    }

    // Create new user from Google data
    const newUser = await amber.instructor.create({
      data: {
        name: userinfo.given_name || userinfo.name || '',
        username: userinfo.nickname || userinfo.email.split('@')[0],
        email: userinfo.email,
        profilepicture: userinfo.picture || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilepicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    req.user = newUser;
    return next();

  } catch (error) {
    console.error("Google auth error:", error);
    return next(new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Google authentication failed"
    ));
  }
};



export const verifyJWTa= asyncHandler(async (req, res, next) => {
  const auth_token =  req.header("Authorization")?.split(' ')[1];
  const cookie_token=req.cookies?.accessToken;

  if (!(auth_token || cookie_token)){
    return next(new ApiError(401, "Unauthorized request: Signin is Required"));
  }
  console.log(auth_token)
  if(auth_token){
  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_APP, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      const user = await amber.instructor.findUnique({
        where: { email: userinfo.email },
        select: {
          id:true,
          name :true,       
          username  :true,     
          email : true,          
          profilepicture :true ,
          createdAt      :true,
          updatedAt      :true 
        },
      });

      if (!user) {
        console.log("User not found in database");
        // Throw custom error if user is not found
        throw new ApiError(401, "User doesn't exist");
      }

      console.log("User found in database:", user);
      req.user = user; // Attach user to request object
      next();
    } catch (innerError) {
      console.error("Database lookup error:", innerError);
      if (innerError instanceof ApiError) {
        return next(innerError); // Pass along the custom error without rethrowing
      }
      return next(new ApiError(500, "An error occurred while fetching the user"));
    }
  } catch (outerError) {
    console.error("Token validation or outer error:", outerError);
    if (outerError instanceof ApiError) {
      return next(outerError); // Pass along any custom error
    }
    return next(new ApiError(401, "Invalid access token"));
  }}
  else if(cookie_token){
    try {
      // Attempt to fetch user info based on the token
      const decodedToken = await verifyToken(cookie_token, 'access')
    
    
        if (!decodedToken.valid) {
            throw new ApiError(401, "UnAuthorised Access")
        }
  
      // Check if user exists in the database
      try {
        const user = await amber.instructor.findUnique({
          where: { email: decodedToken.decoded.email },
          select: {
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
          },
        });
  
        if (!user) {
          console.log("User not found in database");
          // Throw custom error if user is not found
          throw new ApiError(401, "User doesn't exist");
        }
  
        console.log("User found in database:", user);
        req.user = user; // Attach user to request object
        next();
      } catch (innerError) {
        console.error("Database lookup error:", innerError);
        if (innerError instanceof ApiError) {
          return next(innerError); // Pass along the custom error without rethrowing
        }
        return next(new ApiError(500, "An error occurred while fetching the user"));
      }
    } catch (outerError) {
      console.error("Token validation or outer error:", outerError);
      if (outerError instanceof ApiError) {
        return next(outerError); // Pass along any custom error
      }
      return next(new ApiError(401, "Invalid access token"));
    }
  }
});

export const verifyJWTw= asyncHandler(async (req, res, next) => {
  const auth_token =  req.header("Authorization")?.split(' ')[1];
  const cookie_token=req.cookies?.accessToken;

  if (!(auth_token || cookie_token)){
    return next(new ApiError(401, "Unauthorized request: Signin is Required"));
  }
  console.log(auth_token)
  if(auth_token){
  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_WEB, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      const user = await amber.instructor.findUnique({
        where: { email: userinfo.email },
        select: {
          id:true,
          name :true,       
          username  :true,     
          email : true,          
          profilepicture :true ,
          createdAt      :true,
          updatedAt      :true 
        },
      });

      if (!user) {
        console.log("User not found in database");
        // Throw custom error if user is not found
        throw new ApiError(401, "User doesn't exist");
      }

      console.log("User found in database:", user);
      req.user = user; // Attach user to request object
      next();
    } catch (innerError) {
      console.error("Database lookup error:", innerError);
      if (innerError instanceof ApiError) {
        return next(innerError); // Pass along the custom error without rethrowing
      }
      return next(new ApiError(500, "An error occurred while fetching the user"));
    }
  } catch (outerError) {
    console.error("Token validation or outer error:", outerError);
    if (outerError instanceof ApiError) {
      return next(outerError); // Pass along any custom error
    }
    return next(new ApiError(401, "Invalid access token"));
  }}
  else if(cookie_token){
    try {
      // Attempt to fetch user info based on the token
      const decodedToken = await verifyToken(cookie_token, 'access')
    
    
        if (!decodedToken.valid) {
            throw new ApiError(401, "UnAuthorised Access")
        }
  
      // Check if user exists in the database
      try {
        const user = await amber.instructor.findUnique({
          where: { email: decodedToken.decoded.email },
          select: {
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
          },
        });
  
        if (!user) {
          console.log("User not found in database");
          // Throw custom error if user is not found
          throw new ApiError(401, "User doesn't exist");
        }
  
        console.log("User found in database:", user);
        req.user = user; // Attach user to request object
        next();
      } catch (innerError) {
        console.error("Database lookup error:", innerError);
        if (innerError instanceof ApiError) {
          return next(innerError); // Pass along the custom error without rethrowing
        }
        return next(new ApiError(500, "An error occurred while fetching the user"));
      }
    } catch (outerError) {
      console.error("Token validation or outer error:", outerError);
      if (outerError instanceof ApiError) {
        return next(outerError); // Pass along any custom error
      }
      return next(new ApiError(401, "Invalid access token"));
    }
  }
});
