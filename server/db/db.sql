Create Table Stores(
  Id serial PRIMARY KEY,
  Name varchar(250)
);

Create Table Users(
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

Create Table Products(
  Id bigserial PRIMARY KEY,
  Name Varchar(100),
  Price decimal(6,2),
  StoreId serial REFERENCES Stores (Id)
);