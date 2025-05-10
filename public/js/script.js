const productImg = document.querySelector(".productImg");
const images = document.querySelectorAll(".isCheck");



if (images) {
    images.forEach(image => {
        image.addEventListener("click", () => {
            productImg.src = image.src;
        });
    });
}

const shippingDate = document.querySelectorAll(".shippingDate");
if(shippingDate){
    function getRandomDateNext2Months() {
    const today = new Date();

    // Randomly add 0, 1, or 2 months
    const randomMonthOffset = Math.floor(Math.random() * 3); // 0, 1, 2
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() + randomMonthOffset);

    // Random day in that month (1-28 to keep it safe)
    const randomDay = Math.floor(Math.random() * 28) + 1;
    targetDate.setDate(randomDay);

    // Format date like "23 May"
    const day = targetDate.getDate();
    const monthName = targetDate.toLocaleString('default', { month: 'short' });

    return `${day} ${monthName}`;
}
 for(let shippingDateProduct of shippingDate){
    shippingDateProduct.innerText += `Get it by ${getRandomDateNext2Months()}`
 }
}

