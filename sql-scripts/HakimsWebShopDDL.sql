-- ********************************** CREATE DATABASE **********************************
drop database if exists hakims_webshop_db;
create database hakims_webshop_db;
use hakims_webshop_db;
set sql_safe_updates = 0;
-- set autocommit = 0;

-- ********************************** CREATE TABLES ************************************
create table if not exists units
(id int not null auto_increment,
unit varchar(15) not null unique,
primary key (id));


create table if not exists categories
(id int not null auto_increment,
name varchar(30) unique,
primary key (id));


create table if not exists products
(id int not null auto_increment,
name varchar(30) not null unique,
description varchar(100),
price int not null,
measurement int not null,
unit varchar(15) not null,
supplier varchar(30),
img_path varchar(5000),
in_stock int not null,
primary key (id),
foreign key (unit) references units(unit)
	on update cascade);
    
    
create table if not exists belongs_to
(id int not null auto_increment,
product_id int not null, 
category_id int not null,
primary key (id),
foreign key (product_id) references products(id)
	on update cascade,
foreign key (category_id) references categories(id)
	on update cascade);

    
create table if not exists cities
(id int not null auto_increment,
zip_code int not null unique,
city varchar(30),
primary key (id));


create table if not exists users
(id int not null auto_increment,
email varchar(50) not null unique,
password varchar(50) not null,
primary key (id));


create table if not exists administrator
(id int not null auto_increment,
user_id int not null,
primary key (id),
foreign key (user_id) references users(id));


create table if not exists customers
(id int not null auto_increment,
user_id int not null,
firstname varchar(30) not null,
lastname varchar(30) not null,
street_address varchar(50) not null,
zip_code int not null,
phone_nr varchar(15), 
primary key (id),
foreign key (zip_code) references cities (zip_code)
	on delete cascade on update cascade,
foreign key (user_id) references users(id)
	on delete cascade on update cascade);


create table if not exists orders
(id int not null auto_increment,
customer_id int not null, 
order_date date not null,
primary key (id),
foreign key (customer_id) references customers(id)
	on delete cascade on update cascade);


create table if not exists order_row
(id int not null auto_increment,
order_id int not null, 
product_id int not null,
quantity int not null,
primary key (id),
foreign key (order_id) references orders(id)
	on delete cascade on update cascade,
foreign key (product_id) references products(id)
	on delete cascade on update cascade);


create table if not exists cart
(id int not null auto_increment,
customer_id int not null,
product_id int not null,
primary key (id),
foreign key (customer_id) references customers(id)
	on delete cascade on update cascade,
foreign key (product_id) references products(id)
	on delete cascade on update cascade);

-- ******************************** Creating Views ***********************
drop view if exists unavailable_products;
create view unavailable_products as
SELECT c.customer_id, c.product_id, count(c.product_id) as 'wanted_amount', p.in_stock, 'product amount exceeds amount in stock' as message
		FROM cart c
		join products p on p.id = c.product_id
		group by c.product_id, c.customer_id
		having count(c.product_id) > p.in_stock; 

-- ******************************** Creating Stored Proccedures **********
DROP PROCEDURE IF EXISTS convertCartToOrder;
Delimiter //
CREATE PROCEDURE convertCartToOrder(customerID int)
	MODIFIES SQL DATA
BEGIN
	declare lastOrderId int default 0;
    declare out_of_stock int default 0;
    declare missingCart_exception condition for sqlstate '45000';
    
	declare exit handler for sqlexception
    begin
		rollback;
        RESIGNAL SET MESSAGE_TEXT  = 'SQL Exception - Could not find and convert cart to an order for the selected user.';
    end;
    
	start transaction;
    
    if((select count(*) from cart where customer_id = customerID) = 0) then
		signal missingCart_exception;
	end if;

	select count(*)
    from unavailable_products
    where customer_id = customerID into out_of_stock;
    
    -- ************ Returns a table if products amount in stock is higher than the demanded quantity *********
    if(out_of_stock > 0) then   
		select *
		from unavailable_products
		where customer_id = customerID;
	
    -- ************* Convert the cart to and order ****************
    else 
		insert into orders(customer_id, order_date) values
		(customerID, date_format(now(),'%Y-%m-%d'));
		
		select last_insert_id() into lastOrderId;
		
		insert into order_row(`order_id`,`product_id`,`quantity`)
		select lastOrderId, `product_id`, count(*)
		from cart
		where customer_id = customerID
		group by product_id;
		
		delete 
		from cart
		where customer_id = customerID;
	end if;
    
	commit;
END //
Delimiter ;

DROP PROCEDURE IF EXISTS addToCart;
Delimiter //
CREATE PROCEDURE addToCart(customerID int, productID int)
	MODIFIES SQL DATA
BEGIN
	declare exit handler for sqlexception
    begin
		rollback;
        RESIGNAL SET MESSAGE_TEXT  = 'SQL Exception - Could not find and convert cart to an order for the selected user.';
    end;
    
	start transaction;
		insert into cart(customer_id, product_id) values(customerID,productID);
	commit;
END //
Delimiter ;

DROP PROCEDURE IF EXISTS getCustomerData;
Delimiter //
CREATE PROCEDURE getCustomerData(_email varchar(50), _password varchar(50))
	READS SQL DATA
BEGIN
	declare exit handler for sqlexception
    begin
		rollback;
        RESIGNAL SET MESSAGE_TEXT  = 'SQL Exception - Invalid input';
    end;
        select user_id, firstname, lastname, street_address, cu.zip_code, city, phone_nr, email, password
		from users u 
		join customers cu on cu.user_id = u.id
		join cities ci on ci.zip_code = cu.zip_code
		where _email = email and _password = password;
END //
Delimiter ;

-- ******************************** Creating Trigger *******************
DROP TRIGGER IF EXISTS after_insert_order_row;
Delimiter // 
create trigger after_insert_order_row
	after insert
    on order_row for each row
begin
	update products p
    set p.in_stock = (p.in_stock - new.quantity)
    where p.id = new.product_id;
end //
Delimiter ;

-- ******************************** Creating Functions *******************

DROP FUNCTION IF EXISTS isCredentialsCorrect;
Delimiter //
CREATE FUNCTION isCredentialsCorrect(_email varchar(50), _password varchar(50))
	RETURNS BOOL
    READS SQL DATA
Begin
	declare amount int default 0;
    
	SELECT count(*) 
    FROM users u 
    join administrator a on a.user_id = u.id
    WHERE _email = email AND _password = password into amount;
    
    IF amount = 1 Then return true;
    ELSE return false;
    END if;
END //
Delimiter ;

-- ******************************** Inserting data ***********************
insert into units(unit) values
('ml'),
('cl'),
('dl'),
('l'),
('g'),
('kg');

insert into categories(name) values
('Frukt och grönsaker'),
('Skafferi'),
('Godis och snacks');

-- ******************************** Inserting SQL TEST data ***********************

insert into cities(zip_code, city) values
(12345,'Stockholm'),
(12423,'Täby'),
(11424,'Stockholm'),
(14254,'Stockholm');


insert into users(email, password) values
('hassan.hakim@gmail.com','1111'),
('greger.artusson@gmail.com','2222'),
('stefan.borg@gmail.com','3333'),
('anders.svensson@gmail.com','4444');


insert into administrator(user_id) values
(1);

insert into customers(
user_id,
firstname, lastname, 
street_address, zip_code, 
phone_nr) values
(2,
'Greger','Artusson',
'Provvägen 55',12345,
'0707654321'),
(3,
'Anders','Svensson',
'Postvägen 44',11424,
'0705553311'),
(4,
'Stefan','Borg',
'Brevgatan 33',14254,
'0707772211');


insert into products(
name, description,
price, measurement, unit, supplier, img_path, in_stock) values
('Apelsin','Saftiga och solmogna apelsiner',
20,500,'g','Garant',
'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg'
,10),
('Granola','Fin musli',
50,450,'g','Pauluns',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl134-1oII6TekJzn7wn07jaLHBbhPYox40d8xL_m58qYXC9PYjsp2DzkTSA&usqp=CAc',10),
('Gott & blandat','God godismix',
30,100,'g','Malaco',
'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTi8AZqNX-qSj5T2psNSbA1RQpVflxLY3taKwH6MsstAfqlehNf4YkXmzQleY1LIAC5ruqS_d4QdH2u9eK9G1x_h7a3D0hbZYzaAvJPeR9B4AXkrP65iiHUzA&usqp=CAY',10);


insert into belongs_to(product_id, category_id) values
(1,1),
(2,2),
(2,3),
(3,3);


insert into cart(customer_id, product_id) values
(2,1),
(2,2),
(2,2),
(2,3),
(2,3),
(2,3),
(3,1),
(3,1),
(3,1),
(3,2),
(3,2),
(3,3);

