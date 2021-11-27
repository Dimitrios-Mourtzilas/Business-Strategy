

drop table user;


select *from user;

delete from user;


select *from files;

delete from files;

alter table user
add active_account boolean DEFAULT false;



create table user(
    user_id int primary key,
    first_name varchar(20) not null,
    last_name varchar(20) not null,
    user_name VARCHAR(20) not null,
    user_password VARCHAR(255) not null,
    phone_number varchar(15) not null,
    email_address varchar(25) DEFAULT ""
);

update  user
set active_account = false
where user_name = 'root';
