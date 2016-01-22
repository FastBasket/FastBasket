Create Table Stores(
  Id serial PRIMARY KEY,
  Name varchar(250)
);

Create Table Products(
  Id bigserial PRIMARY KEY,
  Name Varchar(100),
  Price decimal(6,2),
  StoreId serial REFERENCES Stores (Id)
);