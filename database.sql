create table MESSAGES (
    id int primary key,
    user_id int,
    content text,
    created_at timestamp default current_timestamp,
    username text
)
