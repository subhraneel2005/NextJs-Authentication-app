import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { error } from "console";
import { Postpone } from "next/dist/server/app-render/dynamic-rendering";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse} from "next/server";
import { sendEmail } from "../../../../helpers/mailer";

connect();

export async function POST(request: NextRequest){
    try {
        const reqData = await request.json()
        const{username, email, password} =  reqData;

        console.log(reqData);

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "Username already exists"}, {status: 400})
        }  

        const salt = await bcryptjs.genSaltSync(10);

        const hashedPass = await bcryptjs.hash(password,salt)

        const newUser = new User({
            username,
            email,
            password: hashedPass
        })

       const savedUser = await newUser.save();
       console.log(newUser);
       
       //email verification
       await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

       return NextResponse.json({
        message: "User registered successfully",
        success: true,
        savedUser
       })
        
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
} 