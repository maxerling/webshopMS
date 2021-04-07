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


create table if not exists products
(id int not null auto_increment,
product_name varchar(30) not null unique,
product_description varchar(100),
category varchar(30) not null unique,
price int not null,
measurement int not null,
unit varchar(15) not null,
supplier varchar(30),
img_path varchar(500),
primary key (id),
foreign key (unit) references units(unit)
	on delete cascade on update cascade);


create table if not exists users
(id int not null auto_increment,
firstname varchar(30) not null,
lastname varchar(30) not null,
street_address varchar(50) not null,
zip_code int not null,
city varchar(30) not null,
phone_nr varchar(15), 
email varchar(50) not null,
password varchar(50) not null, 
is_vip boolean,
primary key (id));


create table if not exists orders
(id int not null auto_increment,
user_id int not null, 
order_date date not null,
primary key (id),
foreign key (user_id) references users(id)
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
user_id int not null,
product_id int not null,
quantity int not null,
primary key (id),
foreign key (user_id) references users(id)
	on delete cascade on update cascade,
foreign key (product_id) references products(id)
	on delete cascade on update cascade);

-- ******************************** Creating Stored Proccedures **********
DROP PROCEDURE IF EXISTS convertCartToOrder;
Delimiter //
CREATE PROCEDURE convertCartToOrder(userID int)
	MODIFIES SQL DATA
BEGIN
	declare lastOrderId int default 0;
    
    declare missingCart_exception condition for sqlstate '45000';
    
	declare exit handler for sqlexception
    begin
		rollback;
        RESIGNAL SET MESSAGE_TEXT  = 'SQL Exception - Could not find and convert cart to an order for the selected user.';
    end;
    
	start transaction;
    
    if((select count(*) from cart where user_id = userID) = 0) then
		rollback;
		signal missingCart_exception;
	end if;
    
    insert into orders(user_id, order_date) values
    (userID, date_format(now(),'%Y-%m-%d'));
    
    select last_insert_id() into lastOrderId;
    
    insert into order_row(`order_id`,`product_id`,`quantity`)
    select lastOrderId, `product_id`, `quantity`
    from cart
    where user_id = userID;
    
    delete 
    from cart
    where user_id = userID;

	commit;
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

-- ******************************** Inserting SQL TEST data ***********************

insert into users(
firstname, lastname, 
street_address, zip_code, city, 
phone_nr, email, password) values
('Hassan','Hakim',
'Testgatan 66',14972,'Stockholm',
'0701234567','hassan.hakim@gmail.com','1111'),
('Greger','Artusson',
'Provvägen 55',12452,'Stockholm',
'0707654321','greger.artusson@gmail.com','2222'),
('Anders','Svensson',
'Postvägen 44',13781,'Täby',
'0705553311','anders.svensson@gmail.com','3333'),
('Stefan','Borg',
'Brevgatan 33',13781,'Täby',
'0707772211','stefan.borg@gmail.com','4444');


insert into products(
product_name, product_description, category,
price, measurement, unit, supplier, img_path) values
('Apelsin','Saftiga och solmogna apelsiner','Frukt och grönsaker',
20,500,'g','Garant',
'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg'),
('Granola','Fin musli','Skafferi',
50,450,'g','Pauluns',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl134-1oII6TekJzn7wn07jaLHBbhPYox40d8xL_m58qYXC9PYjsp2DzkTSA&usqp=CAc'),
('Gott & blandat','God godismix','Godis och snacks',
30,100,'g','Malaco',
'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTi8AZqNX-qSj5T2psNSbA1RQpVflxLY3taKwH6MsstAfqlehNf4YkXmzQleY1LIAC5ruqS_d4QdH2u9eK9G1x_h7a3D0hbZYzaAvJPeR9B4AXkrP65iiHUzA&usqp=CAY');


insert into cart(user_id, product_id, quantity) values
(2,1,1),
(2,2,2),
(2,3,3),
(3,1,3),
(3,2,2),
(3,3,1);