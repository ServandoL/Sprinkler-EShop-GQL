export interface IProduct {
    _id: String
    productName: String
    price: Number
    category: String
    brand: String
    stock: Number
    imageUrl?: String
    isDeleted?: Boolean
    deleted_by?: String
    deleted_date?: String
}

export interface IUser {
    _id: String
    fname: String
    lname: String
    email: String
    isAdmin: Boolean
}