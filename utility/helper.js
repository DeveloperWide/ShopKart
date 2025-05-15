module.exports.OTP = () => {
    let otp = "";
    let arr = new Array(6);
    for(let i=0; i<arr.length; i++){
        arr[i] = Math.floor(Math.random() * 10);
    }
    for(let num in arr){
        if(arr[0] === 0){
            arr[0] = 1
        }
            otp += arr[num]
    };
    return parseInt(otp);
}