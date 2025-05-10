let allProducts = [
    {
        "title": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones with noise cancellation and 20 hours battery life.",
        "price": 199.99,
        "stock": 50,
        "image": [
            { "filename": "ShopKart/abc123headphones1", "url": "https://www.boat-lifestyle.com/cdn/shop/products/main2_b66dce6b-710d-49cb-9d1c-2bc8c9c0ab15.png?v=1645698328" },
            { "filename": "ShopKart/abc123headphones2", "url": "https://www.boat-lifestyle.com/cdn/shop/files/R425-FI_Black03_700x.png?v=1686289119" }
        ],
        "category": "Electronics"
    },
    {
        "title": "Men's Running Shoes",
        "description": "Lightweight and durable running shoes perfect for daily workouts and marathons.",
        "price": 89.99,
        "stock": 120,
        "image": [
            { "filename": "ShopKart/runshoes_red1", "url": "https://www.asics.co.in/media/catalog/product/1/0/1011b891_401_sr_rt_glb-base.jpg?optimize=high&bg-color=255%2C255%2C255&fit=cover&height=375&width=500&auto=webp&format=pjpg" },
            { "filename": "ShopKart/runshoes_red2", "url": "https://www.asics.co.in/media/catalog/product/1/0/1011b891_401_sb_fl_glb-3.jpg?auto=webp&format=pjpg&width=160&height=200&fit=cover" },
            { "filename": "ShopKart/runshoes_red3", "url": "https://www.asics.co.in/media/catalog/product/1/0/1011b891_401_sb_bk_glb-5.jpg?auto=webp&format=pjpg&width=160&height=200&fit=cover" }
        ],
        "category": "Footwear"
    },
    {
        "title": "Leather Office Chair",
        "description": "Ergonomic leather chair with lumbar support, adjustable height, and 360° swivel.",
        "price": 249.5,
        "stock": 30,
        "image": [
            { "filename": "ShopKart/officechair_blk1", "url": "https://rukminim2.flixcart.com/image/850/1000/ktuewsw0/office-study-chair/d/p/y/60-stainless-steel-1-high-back-support-computer-chair-brown-original-imag72wubbbg5wyq.jpeg?q=90&crop=false" },
            { "filename": "ShopKart/officechair_blk2", "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVR6PMTj7lUwn0v3dqgSNqYBtmPTUPrpT1vw&s" }
        ],
        "category": "Furniture"
    },
    {
        "title": "Stainless Steel Water Bottle",
        "description": "Double-walled insulated water bottle keeps your drinks hot or cold for 12 hours.",
        "price": 29.99,
        "stock": 200,
        "image": [
            { "filename": "ShopKart/waterbottle_ss1", "url": "https://nanonine.in/cdn/shop/products/SS389_0MainImage_AF.jpg?v=1665492501" }
        ],
        "category": "Accessories"
    },
    {
        "title": "Non-Stick Cookware Set",
        "description": "Premium 10-piece cookware set with non-stick coating and heat-resistant handles.",
        "price": 159.99,
        "stock": 75,
        "image": [
            { "filename": "ShopKart/cookware_set1", "url": "https://m.media-amazon.com/images/I/51nNaXtqB2L._SX300_SY300_QL70_FMwebp_.jpg" },
            { "filename": "ShopKart/cookware_set2", "url": "https://m.media-amazon.com/images/I/816DctPpPAL._SL1500_.jpg" }
        ],
        "category": "Kitchen"
    },
    {
        "title": "Smart LED TV 55 Inch",
        "description": "Ultra HD 4K Smart TV with built-in apps and voice control support.",
        "price": 599.99,
        "stock": 25,
        "image": [
            { "filename": "ShopKart/smarttv_55inch1", "url": "https://hyundaice.in/pub/media/catalog/product/cache/d020d83fa943a7405be22f53a40f2d10/u/h/uhdhy55wsr4byi5_led_1a_copy_1_.jpeg" },
            { "filename": "ShopKart/smarttv_55inch2", "url": "https://hyundaice.in/pub/media/catalog/product/cache/d020d83fa943a7405be22f53a40f2d10/u/h/uhdhy55wsr4byi5_led_1b_copy_1_.jpeg" }
        ],
        "category": "Electronics"
    },
    {
        "title": "Women's Casual Handbag",
        "description": "Stylish leather handbag with spacious compartments and adjustable straps.",
        "price": 49.99,
        "stock": 80,
        "image": [
            { "filename": "ShopKart/handbag_women1", "url": "https://www.saugatonline.com/products_image/2bbd8530b87a6637b3947f339d32ae19.jpg" },
            { "filename": "ShopKart/handbag_women2", "url": "https://www.saugatonline.com/products_image/3d28373086a5e88f898776c1d3f96ac9.jpg" }
        ],
        "category": "Fashion"
    },
    {
        "title": "Children's Building Blocks Set",
        "description": "Colorful 150-piece educational building block set for kids aged 3 and above.",
        "price": 39.99,
        "stock": 150,
        "image": [
            { "filename": "ShopKart/blocks_set1", "url": "https://images.meesho.com/images/products/222360987/wxmkn_512.webp" },
            { "filename": "ShopKart/blocks_set2", "url": "https://images.meesho.com/images/products/222360987/bo3bt_512.webp" }
        ],
        "category": "Toys"
    },
    {
        "title": "Organic Green Tea Pack",
        "description": "Pack of 100 organic green tea bags rich in antioxidants and natural flavors.",
        "price": 19.99,
        "stock": 300,
        "image": [
            { "filename": "ShopKart/greentea_pack1", "url": "https://www.jiomart.com/images/product/original/490058565/organic-india-classic-tulsi-green-tea-bags-1-74-g-25-pcs-product-images-o490058565-p490058565-0-202307031247.jpg?im=Resize=(420,420)" }
        ],
        "category": "Grocery"
    },
    {
        "title": "Portable Camping Tent",
        "description": "Waterproof 4-person camping tent with easy setup and UV protection.",
        "price": 129.99,
        "stock": 40,
        "image": [
            { "filename": "ShopKart/campingtent1", "url": "https://www.hacer.in/media/catalog/product/1/_/1_49.jpg" },
            { "filename": "ShopKart/campingtent2", "url": "https://www.hacer.in/media/catalog/product/4/_/4_49.jpg" }
        ],
        "category": "Outdoor"
    }
]

module.exports = {products: allProducts}