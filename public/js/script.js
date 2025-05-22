const productImg = document.querySelector(".productImg");
const images = document.querySelectorAll(".isCheck");
const payButton = document.querySelector(".payNow")

if (images) {
    images.forEach(image => {
        image.addEventListener("click", () => {
            productImg.src = image.src;
        });
    });
}


const shippingDate = document.querySelectorAll(".shippingDate");
if (shippingDate) {
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
    for (let shippingDateProduct of shippingDate) {
        shippingDateProduct.innerText += `Get it by ${getRandomDateNext2Months()}`
    }
}
let categories = document.querySelectorAll(".category");

let getBackgroundImg = (text, category) => {
    let apiKey = "50273816-6b88d66ed6367fec560888dba";
    let URL = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(text)}&image_type=photo&orientation=horizontal&per_page=3`;

    fetch(URL)
        .then((res) => res.json())
        .then((data) => {
            if (data.hits && data.hits.length > 0) {
                console.log(data.hits)
                let imageUrl = data.hits[0].webformatURL;
                category.style.backgroundImage = `url(${imageUrl})`;
                category.style.backgroundSize = "cover";
                category.style.backgroundPosition = "center";
            } else {
                console.warn(`No image found for ${text}`);
            }
        })
        .catch((err) => console.error(err));
};

if (categories) {
    categories.forEach((category) => {
        let categoryName = category.innerText.trim();
        getBackgroundImg(categoryName, category);
    });

}