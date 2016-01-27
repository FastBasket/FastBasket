Create Table IF NOT EXISTS Stores(
  Id serial PRIMARY KEY,
  Name varchar(250)
);

Create Table IF NOT EXISTS Users(
  Id bigserial PRIMARY KEY,
  Name Varchar(200),
  Email Varchar(100),
  FacebookId Varchar(100),
  ZipCode Varchar(5),
  Address Varchar(200),
  Phone Varchar(10),
  Picture Varchar(200),
  Active boolean
);

CREATE TABLE IF NOT EXISTS categories(
  Id serial PRIMARY KEY, 
  Name Varchar(100), 
  Category INTEGER NULL REFERENCES categories(Id)
);

CREATE TABLE IF NOT EXISTS products (
  Id bigserial PRIMARY KEY, 
  Name Varchar(100),
  Size Varchar(20), 
  SizeUnit Varchar(20), 
  Price decimal(6,2), 
  PriceUnit varchar(100), 
  category INTEGER NOT NULL REFERENCES Categories(Id), 
  subcategory INTEGER NULL REFERENCES Categories(Id)
);

Create Table IF NOT EXISTS Orders (
  Id bigserial PRIMARY KEY,
  UserId serial REFERENCES Users (Id),
  ShippingAddress varchar(250),
  Total decimal(6,2),
  StoreId serial REFERENCES Stores (Id),
  Status Varchar(10)
);

Create Table IF NOT EXISTS OrderDetails (
  Id bigserial PRIMARY KEY,
  OrderId bigserial REFERENCES Orders (Id),
  ProductId bigserial REFERENCES Products (Id),
  Price decimal(6,2)
);

insert into Stores(name) Values ('test store')
