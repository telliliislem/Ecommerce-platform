
from typing import Optional
from urllib import request
from fastapi import FastAPI, Form, HTTPException, Query, Request
import mysql.connector 
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from pydantic import BaseModel
import bcrypt

app=FastAPI()

conn=mysql.connector.connect(
    host="localhost",
    user="username",
    passwd="password",
    database="ecommerc"
)
mycursor =conn.cursor()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"messaage":"Hello World"}


@app.get("/get_Categories")
def get_Categories():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("select * from Category")
    records=cursor.fetchall()
    return records 

@app.post("/add_Category")
def add_Category(CategoryName:str=Form(...)):
    print(CategoryName)
    cursor=conn.cursor()
    cursor.execute("insert into Category (CategoryName) values (%s)",(CategoryName,))
    conn.commit()
    return "Added Successfully"

@app.delete("/delete_Category")
def delete_Category(CategoryId:str):
    cursor=conn.cursor()
    cursor.execute("delete from Category where CategoryId=%s",(CategoryId,))
    conn.commit()
    return "Deleted Successfully"

@app.get("/search_Products")
def search_Products(search_term: str = Query(...)):
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM Product 
        WHERE productName LIKE %s OR productShortName LIKE %s
    """
    search_term = f"%{search_term}%"
    cursor.execute(query, (search_term, search_term))
    records = cursor.fetchall()
    return records


@app.get("/get_Products")
def get_Products():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("select * from product")
    records=cursor.fetchall()
    return records 

class Product(BaseModel):
    productSku: str
    productName: str
    productPrice: float
    productShortName: str
    fkCategory: int
    deliveryTimeSpan: str
    productImageUrl: str
    productDescription: Optional[str] = None

@app.post("/add_Product")
async def add_product(product: Product):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Product (productSku, productName, productPrice, productShortName, productDescription, deliveryTimeSpan, fkCategory, productImageUrl)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (product.productSku, product.productName, product.productPrice, product.productShortName, product.productDescription, product.deliveryTimeSpan, product.fkCategory, product.productImageUrl))
        conn.commit()
        return {"message": "Product added successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.delete("/delete_Product")
def delete_Product(productId:int):
    cursor=conn.cursor()
    cursor.execute("delete from Product where productId=%s",(productId,))
    conn.commit()
    return "Deleted Successfully"
@app.get("/get_Orders")
def get_Orders():
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT
        po.OrderId,
        po.PaymentNarration,
        po.DeliveryAddress,
        po.DeliveryCity,
        po.IsCanceled,
        po.DeliveryPinCode,
        po.SaleDate,
        c.fullName AS CustomerName,
        c.email AS CustomerEmail,
        p.productName,
        p.productPrice,
        oi.ProductQuantity
    FROM purchaseorder po
    JOIN customer c ON po.fkCustomer = c.UserId
    JOIN orderitems oi ON po.OrderId = oi.fkOrder
    JOIN product p ON oi.fkProduct = p.productId
    """
    cursor.execute(query)
    records = cursor.fetchall()
    return records


@app.post("/add_Order")
def add_Order(
    fkCustomer: int = Form(...),
    SaleDate: str = Form(...),
    TotalInvoiceAmount: float = Form(...),
    Discount: int = Form(...),
    PaymentNarration: str = Form(...),
    DeliveryAddress: str = Form(...),
    DeliveryCity: str = Form(...),
    IsCanceled: int = Form(...),
    DeliveryPinCode: int = Form(...)
):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO PurchaseOrder (fkCustomer, SaleDate, TotalInvoiceAmount, Discount, PaymentNarration,DeliveryAddress, DeliveryCity, IsCanceled, DeliveryPinCode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (
            fkCustomer, SaleDate, TotalInvoiceAmount, Discount, PaymentNarration,
            DeliveryAddress, DeliveryCity, IsCanceled, DeliveryPinCode
        )
    )
    conn.commit()
    return "Added Successfully"

@app.delete("/delete_Order/{OrderId}")
def delete_Order(OrderId: str):
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM orderitems WHERE fkOrder = %s", (OrderId,))
        cursor.execute("DELETE FROM purchaseorder WHERE OrderId = %s", (OrderId,))
        conn.commit()
        return {"message": "Deleted Successfully"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}


class OrderUpdateModel(BaseModel):
    PaymentNarration: Optional[str] = None
    DeliveryAddress: Optional[str] = None
    DeliveryCity: Optional[str] = None
    IsCanceled: Optional[int] = None
    DeliveryPinCode: Optional[int] = None
@app.put("/update_Order/{OrderId}")
def update_Order(OrderId: int, order_update: OrderUpdateModel):
    cursor = conn.cursor()

    update_query = "UPDATE purchaseorder SET"
    update_params = []
    
    if order_update.PaymentNarration is not None:
        update_query += " PaymentNarration = %s,"
        update_params.append(order_update.PaymentNarration)
    if order_update.DeliveryAddress is not None:
        update_query += " DeliveryAddress = %s,"
        update_params.append(order_update.DeliveryAddress)
    if order_update.DeliveryCity is not None:
        update_query += " DeliveryCity = %s,"
        update_params.append(order_update.DeliveryCity)
    if order_update.IsCanceled is not None:
        update_query += " IsCanceled = %s,"
        update_params.append(order_update.IsCanceled)
    if order_update.DeliveryPinCode is not None:
        update_query += " DeliveryPinCode = %s,"
        update_params.append(order_update.DeliveryPinCode)

    if len(update_params) > 0:
        update_query = update_query.rstrip(',')  # Remove trailing comma
        update_query += " WHERE OrderId = %s"
        update_params.append(OrderId)

        cursor.execute(update_query, tuple(update_params))
        conn.commit()
    else:
        return {"error": "No fields to update"}

    return {"message": "Updated Successfully"}

# Function to confirm order
@app.post("/confirm_order")
def confirm_order(
    fkCustomer: int = Form(...),
    SaleDate: str = Form(...),
    TotalInvoiceAmount: float = Form(...),
    Discount: int = Form(...),
    PaymentNarration: Optional[str] = Form('paid via cash'), # Default value
    DeliveryAddress: str = Form(...),
    DeliveryCity: str = Form(...),
    IsCanceled: int = Form(...),
    DeliveryPinCode: int = Form(...)
):
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("INSERT INTO PurchaseOrder (fkCustomer, SaleDate, TotalInvoiceAmount, Discount, PaymentNarration, DeliveryAddress, DeliveryCity, IsCanceled, DeliveryPinCode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (
            fkCustomer, SaleDate, TotalInvoiceAmount, Discount, PaymentNarration,
            DeliveryAddress, DeliveryCity, IsCanceled, DeliveryPinCode
        )
    )
    
    OrderId = cursor.lastrowid
    
    cursor.execute("SELECT * FROM cart WHERE fkCustomer = %s", (fkCustomer,))
    cart_items = cursor.fetchall()
    
    for item in cart_items:
        cursor.execute("INSERT INTO orderitems (fkOrder, fkProduct, ProductQuantity) VALUES (%s, %s, %s)", 
                       (OrderId, item['fkProduct'], item['ProductQuantity']))
    
    cursor.execute("DELETE FROM cart WHERE fkCustomer = %s", (fkCustomer,))
    
    conn.commit()
    return "Order confirmed successfully, cart cleared, and items added to orderitems."

# Add to Cart
class CartItem(BaseModel):
    fkCustomer: int
    fkProduct: int
    ProductQuantity: int

@app.post("/add_to_cart")
def add_to_cart(cart_item: CartItem):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO cart (fkCustomer, fkProduct, ProductQuantity) VALUES (%s, %s, %s)",
        (cart_item.fkCustomer, cart_item.fkProduct, cart_item.ProductQuantity)
    )
    conn.commit()
    return {"message": "Added to Cart Successfully"}

@app.get("/view_cart/{fkCustomer}")
def view_cart(fkCustomer: int):
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT c.CartId, c.fkProduct, c.ProductQuantity, p.productName, p.productPrice, p.productImageUrl
        FROM cart c
        JOIN product p ON c.fkProduct = p.productId
        WHERE c.fkCustomer = %s
    """
    cursor.execute(query, (fkCustomer,))
    records = cursor.fetchall()
    return records


# Update Cart
@app.put("/update_cart/{CartId}")
def update_cart(CartId: int, ProductQuantity: int):
    cursor = conn.cursor()
    cursor.execute("UPDATE cart SET ProductQuantity = %s WHERE CartId = %s", (ProductQuantity, CartId))
    conn.commit()
    return "Cart Updated Successfully"

# Delete from Cart
@app.delete("/delete_from_cart/{CartId}")
def delete_from_cart(CartId: int):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE CartId = %s", (CartId,))
    conn.commit()
    return "Deleted from Cart Successfully"


@app.get("/check_email/{email}")
def check_email(email: str):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customer WHERE email = %s", (email,))
    record = cursor.fetchone()
    cursor.close()
    if record:
        raise HTTPException(status_code=400, detail="Email already exists")
    return {"success": True, "message": "Email is available"}

@app.get("/check_username/{username}")
def check_username(username: str):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM useraccount WHERE Username = %s", (username,))
    record = cursor.fetchone()
    cursor.close()
    if record:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"success": True, "message": "Username is available"}


@app.post("/delete_Customer")
def delete_Customer(UserId:int=Form(...)):
    cursor=conn.cursor()
    cursor.execute("delete from customer where UserId=%s",(UserId,))
    conn.commit()
    return "Deleted Successfully"

@app.get("/get_Offers")
def get_Offers():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("select * from offer")
    records=cursor.fetchall()
    return records 

@app.get("/get_Customers")
def get_Customers():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("select * from customer")
    records=cursor.fetchall()
    return records 

class LoginData(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(data: LoginData):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.UserId, ua.AccountId, ua.Username, ua.Password, ua.Role
        FROM useraccount ua
        JOIN customer c ON ua.fkCustomer = c.UserId
        WHERE ua.Username = %s
    """, (data.username,))
    
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.checkpw(data.password.encode('utf-8'), user['Password'].encode('utf-8')):
        userId = user.get('UserId', None)
        if user['Username'] == 'admin':
            return {"success": True, "redirect": "/products", "userId": userId}
        else:
            return {"success": True, "redirect": "/shop", "userId": userId}
    else:
        return {"success": False, "message": "Invalid credentials"}

class CustomerData(BaseModel):
    fullName: str
    email: str
    phoneNumber: str
    username: str
    password: str

@app.post("/add_customer")
def add_customer(data: CustomerData):
    cursor = conn.cursor()
    try:
        # Hash the password before storing
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())

        # Insert into customer table
        cursor.execute("INSERT INTO customer (fullName, email, phoneNumber) VALUES (%s, %s, %s)",
                       (data.fullName, data.email, data.phoneNumber))
        conn.commit()

        # Get the last inserted customer ID
        customer_id = cursor.lastrowid

        # Insert into useraccount table
        cursor.execute("INSERT INTO useraccount (fkCustomer, Username, Password, Role) VALUES (%s, %s, %s, %s)",
                       (customer_id, data.username, hashed_password.decode('utf-8'), 'customer'))
        conn.commit()

        return {"success": True, "message": "Customer added successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
class CustomerData(BaseModel):
    fullName: str
    email: str
    phoneNumber: str
    address: str
    username: str
@app.get("/account/{userId}")
def get_account_details(userId: int):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.UserId, c.fullName, c.email, c.phoneNumber, c.address, ua.Username 
        FROM customer c
        JOIN useraccount ua ON c.UserId = ua.fkCustomer
        WHERE c.UserId = %s
    """, (userId,))
    account_details = cursor.fetchone()
    cursor.close()

    if not account_details:
        raise HTTPException(status_code=404, detail="Account not found")

    print(account_details)  # Log the details for debugging
    return account_details

class UpdateAccountData(BaseModel):
    fullName: str
    email: str
    phoneNumber: str
    address: str
    username: str

@app.put("/account/{user_id}")
def update_account(user_id: int, data: UpdateAccountData):
    cursor = conn.cursor()
    try:
        # Update the customer table
        cursor.execute("""
            UPDATE customer
            SET fullName = %s, email = %s, phoneNumber = %s, address = %s
            WHERE UserId = %s
        """, (data.fullName, data.email, data.phoneNumber, data.address, user_id))

        # Update the useraccount table
        cursor.execute("""
            UPDATE useraccount
            SET Username = %s
            WHERE fkCustomer = %s
        """, (data.username, user_id))

        conn.commit()
        return {"success": True, "message": "Account updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
