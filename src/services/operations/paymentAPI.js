import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzp_logo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints;

function loadScript(src){
    return new Promise(resolve=>{
        const script=document.createElement("script");
        script.src=src;

        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false); 
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId=toast.loading("Loading..");
    try{
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("RazorPay SDK Failed TO load");
            return;
        }
        //Initaite the Order
        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,{courses},
            {
                Authorization:`Bearer ${token}`
            }
        )
        console.log("ORDER RESPONSE",orderResponse);
        if(!orderResponse.data.success)
            throw new Error(orderResponse.data.message);

        //Making OPTIONS
        const options={
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.message.currency,
            amount:`${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"eLearn",
            description:"Thank You For Purchasing the Course",
            image:rzp_logo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler:function(response) {
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token)
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }
    catch(err){
        console.log("PAYMENT API ERROR........",err);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);
}


async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId=toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try{
        const resp=await apiConnector("POST",COURSE_VERIFY_API,bodyData,
            {Authorization:`Bearer ${token}`});
        
        if(!resp?.data?.success)
            throw new Error(resp.data.message);

        toast.success("Payment Successful You are added to the Course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

    }
    catch(err){
        console.log("VERIFY PAYMENT API ERROR........",err);
        toast.error("Could not Verify payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}


async function sendPaymentSuccessEmail(response,amount,token){
    try{
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId:response.razorpay_order_id,
                paymentId:response.razorpay_payment_id,
                amount
            },
            {
                Authorization:`Bearer ${token}`
            }
        )
    }
    catch(err){
        console.log("PAYMENT SUCCESS EMAIL ERROR........",err);
    }
}
